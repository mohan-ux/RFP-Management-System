import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 60 seconds for AI operations
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    console.error('API Error:', message)
    return Promise.reject(new Error(message))
  }
)

// =============================================
// RFP APIs - Matching backend/routes/rfp.routes.new.js
// =============================================

// HOME PAGE APIs
export const fetchRFPs = async () => {
  const response = await api.get('/rfp')
  return response.data.rfps || response.data || []
}

export const fetchRFPById = async (id) => {
  const response = await api.get(`/rfp/${id}`)
  return response.data.rfp || response.data
}

export const createRFP = async (rfpData = {}) => {
  const response = await api.post('/rfp', rfpData)
  return response.data.rfp || response.data
}

export const deleteRFP = async (id) => {
  const response = await api.delete(`/rfp/${id}`)
  return response.data
}

// DESCRIBE PAGE APIs (Step 1)
export const generateRFPFromText = async (user_text) => {
  const response = await api.post('/rfp/generate-from-text', { user_text })
  return response.data
}

export const updateRFPDescribe = async (id, data) => {
  // data should contain: user_text, llm_response
  const response = await api.put(`/rfp/${id}/describe`, data)
  return response.data.rfp || response.data
}

// REVIEW PAGE APIs (Step 2)
export const updateRFPReview = async (id, data) => {
  // data can contain any RFP fields to update
  const response = await api.put(`/rfp/${id}/review`, data)
  return response.data.rfp || response.data
}

// General update (backward compatibility)
export const updateRFP = async (id, rfpData) => {
  const response = await api.put(`/rfp/${id}`, rfpData)
  return response.data.rfp || response.data
}

// SELECT VENDORS APIs (Step 3)
export const sendRFPToVendors = async (rfpId, data) => {
  // data should contain: vendor_ids, email_subject (optional), email_body (optional)
  const response = await api.post(`/rfp/${rfpId}/send-to-vendors`, data)
  return response.data
}

export const getInboxEmails = async (rfpId) => {
  const response = await api.get(`/rfp/${rfpId}/emails/inbox`)
  return response.data
}

export const processReceivedEmail = async (emailData) => {
  // emailData should contain: from, subject, body
  const response = await api.post('/rfp/emails/process', emailData)
  return response.data
}

export const addVendorMailResponse = async (rfpId, data) => {
  // data should contain: vendor_id, mail_body, mail_subject (optional)
  const response = await api.put(`/rfp/${rfpId}/add-mail-response`, data)
  return response.data.rfp || response.data
}

// COMPARE QUOTES APIs (Step 4)
export const getVendorResponses = async (rfpId) => {
  const response = await api.get(`/rfp/${rfpId}/vendor-responses`)
  return response.data
}

export const compareQuotes = async (rfpId) => {
  const response = await api.post(`/rfp/${rfpId}/compare-quotes`)
  return response.data
}

export const updateRFPStatus = async (id, status) => {
  const response = await api.put(`/rfp/${id}/status`, { status })
  return response.data.rfp || response.data
}

// =============================================
// VENDOR APIs
// =============================================
export const fetchVendors = async () => {
  const response = await api.get('/vendors')
  return response.data.vendors || response.data || []
}

export const fetchVendorById = async (id) => {
  const response = await api.get(`/vendors/${id}`)
  return response.data.vendor || response.data
}

export const createVendor = async (vendorData) => {
  const response = await api.post('/vendors', vendorData)
  return response.data.vendor || response.data
}

export const updateVendor = async (id, vendorData) => {
  const response = await api.put(`/vendors/${id}`, vendorData)
  return response.data.vendor || response.data
}

export const deleteVendor = async (id) => {
  await api.delete(`/vendors/${id}`)
  return true
}

// =============================================
// AI APIs (using new RFP routes)
// =============================================
export const parseRFP = async (text) => {
  const response = await api.post('/rfp/generate-from-text', { user_text: text })
  return response.data
}

export const analyzeProposals = async (rfpId) => {
  const response = await api.post(`/rfp/${rfpId}/compare-quotes`)
  return response.data
}

// =============================================
// EMAIL APIs (using new RFP routes)
// =============================================
export const checkEmailInbox = async () => {
  const response = await api.get('/rfp/emails/inbox')
  return response.data
}

// =============================================
// API Objects for Components
// =============================================
export const rfpAPI = {
  getAll: fetchRFPs,
  getById: fetchRFPById,
  create: createRFP,
  update: updateRFP,
  delete: deleteRFP,
  generateFromText: generateRFPFromText,
  updateDescribe: updateRFPDescribe,
  updateReview: updateRFPReview,
  sendToVendors: sendRFPToVendors,
  updateStatus: updateRFPStatus,
  getVendorResponses: getVendorResponses,
  compareQuotes: compareQuotes,
  addVendorResponse: addVendorMailResponse,
  getInboxEmails: getInboxEmails
}

export const vendorAPI = {
  getAll: fetchVendors,
  getById: fetchVendorById,
  create: createVendor,
  update: updateVendor,
  delete: deleteVendor
}

export const emailAPI = {
  getInbox: getInboxEmails,
  processEmail: processReceivedEmail,
  checkInbox: checkEmailInbox
}

export const aiAPI = {
  generateRFP: generateRFPFromText,
  parseRFP: parseRFP,
  analyzeProposals: analyzeProposals,
  compareQuotes: compareQuotes
}

export default api