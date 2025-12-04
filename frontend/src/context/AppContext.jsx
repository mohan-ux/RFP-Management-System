import { createContext, useContext, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import * as api from '../services/api'

const AppContext = createContext(null)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  // State
  const [rfps, setRfps] = useState([])
  const [vendors, setVendors] = useState([])
  const [currentRfp, setCurrentRfp] = useState(null)
  const [loading, setLoading] = useState({
    rfps: false,
    vendors: false,
    ai: false,
    email: false
  })

  // Set loading state helper
  const setLoadingState = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }))
  }

  // ===== RFP Actions =====
  const fetchRfps = useCallback(async () => {
    setLoadingState('rfps', true)
    try {
      const data = await api.fetchRFPs()
      setRfps(data || [])
      return data
    } catch (error) {
      console.error('Fetch RFPs Error:', error)
      return []
    } finally {
      setLoadingState('rfps', false)
    }
  }, [])

  const fetchRfpById = useCallback(async (id) => {
    setLoadingState('rfps', true)
    try {
      const data = await api.fetchRFPById(id)
      setCurrentRfp(data)
      return data
    } catch (error) {
      toast.error('Failed to fetch RFP details')
      console.error(error)
      return null
    } finally {
      setLoadingState('rfps', false)
    }
  }, [])

  const createRfp = useCallback(async (rfpData = {}) => {
    setLoadingState('rfps', true)
    try {
      const data = await api.createRFP(rfpData)
      setRfps(prev => [data, ...prev])
      toast.success('RFP created successfully!')
      return data
    } catch (error) {
      toast.error('Failed to create RFP')
      console.error(error)
      return null
    } finally {
      setLoadingState('rfps', false)
    }
  }, [])

  const updateRfp = useCallback(async (id, rfpData) => {
    setLoadingState('rfps', true)
    try {
      const data = await api.updateRFP(id, rfpData)
      setRfps(prev => prev.map(r => r._id === id ? data : r))
      if (currentRfp?._id === id) {
        setCurrentRfp(data)
      }
      toast.success('RFP updated successfully!')
      return data
    } catch (error) {
      toast.error('Failed to update RFP')
      console.error(error)
      return null
    } finally {
      setLoadingState('rfps', false)
    }
  }, [currentRfp])

  const deleteRfp = useCallback(async (id) => {
    try {
      await api.deleteRFP(id)
      setRfps(prev => prev.filter(r => r._id !== id))
      return true
    } catch (error) {
      toast.error('Failed to delete RFP')
      console.error(error)
      return false
    }
  }, [])

  // ===== Vendor Actions =====
  const fetchVendors = useCallback(async () => {
    setLoadingState('vendors', true)
    try {
      const data = await api.fetchVendors()
      setVendors(data || [])
      return data
    } catch (error) {
      console.error('Fetch Vendors Error:', error)
      return []
    } finally {
      setLoadingState('vendors', false)
    }
  }, [])

  const createVendor = useCallback(async (vendorData) => {
    setLoadingState('vendors', true)
    try {
      const data = await api.createVendor(vendorData)
      setVendors(prev => [data, ...prev])
      toast.success('Vendor created successfully!')
      return data
    } catch (error) {
      toast.error('Failed to create vendor')
      console.error(error)
      return null
    } finally {
      setLoadingState('vendors', false)
    }
  }, [])

  const deleteVendor = useCallback(async (id) => {
    try {
      await api.deleteVendor(id)
      setVendors(prev => prev.filter(v => v._id !== id))
      toast.success('Vendor deleted successfully!')
      return true
    } catch (error) {
      toast.error('Failed to delete vendor')
      console.error(error)
      return false
    }
  }, [])

  // ===== Email Actions =====
  const sendRfpToVendors = useCallback(async (rfpId, vendorIds) => {
    setLoadingState('email', true)
    try {
      const data = await api.sendRFPToVendors(rfpId, { vendor_ids: vendorIds })
      toast.success(`RFP sent to ${vendorIds.length} vendor(s)!`)
      await fetchRfpById(rfpId)
      return data
    } catch (error) {
      toast.error('Failed to send RFP')
      console.error(error)
      return null
    } finally {
      setLoadingState('email', false)
    }
  }, [fetchRfpById])

  const checkEmails = useCallback(async () => {
    setLoadingState('email', true)
    try {
      const data = await api.checkEmailInbox()
      if (data?.emails?.length > 0) {
        toast.success(`${data.emails.length} email(s) found in inbox!`)
      }
      return data
    } catch (error) {
      toast.error('Failed to check emails')
      console.error(error)
      return null
    } finally {
      setLoadingState('email', false)
    }
  }, [])

  // ===== AI Actions =====
  const generateRfpFromText = useCallback(async (text) => {
    setLoadingState('ai', true)
    try {
      const data = await api.generateRFPFromText(text)
      return data
    } catch (error) {
      toast.error('Failed to generate RFP')
      console.error(error)
      return null
    } finally {
      setLoadingState('ai', false)
    }
  }, [])

  const compareQuotes = useCallback(async (rfpId) => {
    setLoadingState('ai', true)
    try {
      const data = await api.compareQuotes(rfpId)
      return data
    } catch (error) {
      toast.error('Failed to compare quotes')
      console.error(error)
      return null
    } finally {
      setLoadingState('ai', false)
    }
  }, [])

  const value = {
    // State
    rfps,
    vendors,
    currentRfp,
    loading,
    // RFP Actions
    fetchRfps,
    fetchRFPs: fetchRfps,
    fetchRfpById,
    fetchRFPById: fetchRfpById,
    createRfp,
    createRfpFromText: generateRfpFromText,
    updateRfp,
    deleteRfp,
    deleteRFP: deleteRfp,
    addRFP: (rfp) => setRfps(prev => [rfp, ...prev]),
    setCurrentRfp,
    // Vendor Actions
    fetchVendors,
    createVendor,
    addVendor: (vendor) => setVendors(prev => [vendor, ...prev]),
    deleteVendor,
    // Email Actions
    sendRfpToVendors,
    checkEmails,
    // AI Actions
    generateRfpFromText,
    compareQuotes
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext