import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { rfpAPI, vendorAPI } from '../services/api'
import DynamicForm from '../components/common/DynamicForm'
import VendorSelector from '../components/vendor/VendorSelector'
import ComparisonPreview from '../components/rfp/ComparisonPreview'
import LoadingSpinner from '../components/common/LoadingSpinner'

const examplePrompts = [
  {
    text: "I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty.",
    title: 'IT Equipment'
  }
]

const CreateRFP = ({ setShowCreate, editingRFP = null, resumeStep = null, onClose = () => {} }) => {
  const { addRFP, vendors: contextVendors, fetchVendors, fetchRfps } = useApp()

  const [activeStep, setActiveStep] = useState(resumeStep || 1)
  const [loadingSteps, setLoadingSteps] = useState({ 1: false, 2: false, 3: false, 4: false })
  const [completedSteps, setCompletedSteps] = useState([])

  const [nlText, setNlText] = useState(editingRFP?.user_text || editingRFP?.description || '')
  const [generatedRFP, setGeneratedRFP] = useState(editingRFP?.llm_response || editingRFP)
  const [editedRFP, setEditedRFP] = useState(editingRFP?.llm_response || editingRFP)
  const [currentRFPId, setCurrentRFPId] = useState(editingRFP?._id || null)
  const [selectedVendors, setSelectedVendors] = useState(editingRFP?.choosed_vendors || [])
  const [comparisonData, setComparisonData] = useState(null)
  const [availableVendors, setAvailableVendors] = useState([])

  // Fetch vendors from database
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const vendors = await vendorAPI.getAll()
        setAvailableVendors(vendors || [])
      } catch (err) {
        console.error('Failed to fetch vendors:', err)
        // Use context vendors as fallback
        if (contextVendors?.length > 0) {
          setAvailableVendors(contextVendors)
        }
      }
    }
    loadVendors()
    fetchVendors?.()
  }, [])

  useEffect(() => {
    if (editingRFP && resumeStep) {
      setActiveStep(resumeStep)
      setGeneratedRFP(editingRFP.llm_response || editingRFP)
      setEditedRFP(editingRFP.llm_response || editingRFP)
      setNlText(editingRFP.user_text || editingRFP.description || '')
      setCurrentRFPId(editingRFP._id)
      setSelectedVendors(editingRFP.choosed_vendors || [])
      
      // Mark previous steps as completed
      const completed = []
      for (let i = 1; i < resumeStep; i++) {
        completed.push(i)
      }
      setCompletedSteps(completed)
      
      // If coming to step 4, also load existing mail_content
      if (resumeStep === 4 && editingRFP.mail_content) {
        setVendorResponses(editingRFP.mail_content || [])
        setEmailsFetched(true)
      }
    }
  }, [editingRFP, resumeStep])

  // Step 1: Analyze text with AI and create RFP
  const handleAnalyze = async () => {
    if (!nlText.trim()) return toast.error('Please enter requirements')
    setLoadingSteps(prev => ({ ...prev, 1: true }))
    try {
      // First create an empty RFP if we don't have one
      let rfpId = currentRFPId
      if (!rfpId) {
        const newRFP = await rfpAPI.create({ title: 'New RFP', description: nlText.substring(0, 100) })
        rfpId = newRFP._id
        setCurrentRFPId(rfpId)
      }

      // Call AI to generate structured RFP
      const result = await rfpAPI.generateFromText(nlText)
      const parsedRFP = result.rfp || result.llm_response || result
      
      setGeneratedRFP(parsedRFP)
      setEditedRFP(parsedRFP)

      // Save to database
      await rfpAPI.updateDescribe(rfpId, {
        user_text: nlText,
        llm_response: parsedRFP
      })

      setCompletedSteps(prev => [...new Set([...prev, 1])])
      setActiveStep(2)
      toast.success('RFP generated successfully!')
      fetchRfps?.()
    } catch (err) {
      console.error('Generate RFP Error:', err)
      toast.error(err.message || 'Failed to generate RFP')
    } finally {
      setLoadingSteps(prev => ({ ...prev, 1: false }))
    }
  }

  // Step 2: Save customized RFP
  const handleSaveRFP = async () => {
    if (!editedRFP) return
    setLoadingSteps(prev => ({ ...prev, 2: true }))
    try {
      let rfpId = currentRFPId
      
      // Create RFP if we don't have one
      if (!rfpId) {
        const newRFP = await rfpAPI.create({ 
          title: editedRFP.title || 'New RFP',
          description: editedRFP.description || ''
        })
        rfpId = newRFP._id
        setCurrentRFPId(rfpId)
      }

      // Update with review data
      await rfpAPI.updateReview(rfpId, {
        llm_response: editedRFP,
        title: editedRFP.title,
        description: editedRFP.description
      })

      addRFP?.({ _id: rfpId, ...editedRFP, status: 'Review RFP' })
      setCompletedSteps(prev => [...new Set([...prev, 2])])
      setActiveStep(3)
      toast.success('RFP saved successfully!')
      fetchRfps?.()
    } catch (err) {
      console.error('Save RFP Error:', err)
      toast.error(err.message || 'Failed to save RFP')
    } finally {
      setLoadingSteps(prev => ({ ...prev, 2: false }))
    }
  }

  // Step 3: Send RFP to vendors
  const handleSendToVendors = async () => {
    if (selectedVendors.length < 2) {
      return toast.error('Please select at least 2 vendors to compare quotes')
    }
    if (!currentRFPId) return toast.error('No RFP to send')
    
    setLoadingSteps(prev => ({ ...prev, 3: true }))
    try {
      const vendorIds = selectedVendors.map(v => v._id || v)
      
      // Send to vendors via email
      await rfpAPI.sendToVendors(currentRFPId, {
        vendor_ids: vendorIds,
        email_subject: `RFP: ${editedRFP?.title || 'Request for Proposal'}`,
        email_body: `Please review the attached RFP and submit your proposal.\n\n${editedRFP?.description || ''}`
      })

      setCompletedSteps(prev => [...new Set([...prev, 3])])
      setActiveStep(4)
      toast.success(`RFP sent to ${selectedVendors.length} vendor(s)! Now check inbox for responses.`)
      fetchRfps?.()
    } catch (err) {
      console.error('Send to vendors error:', err)
      toast.error(err.message || 'Failed to send RFP')
    } finally {
      setLoadingSteps(prev => ({ ...prev, 3: false }))
    }
  }

  // Step 4: Check inbox for vendor responses
  const [vendorResponses, setVendorResponses] = useState([])
  const [fetchingEmails, setFetchingEmails] = useState(false)
  const [emailsFetched, setEmailsFetched] = useState(false)

  // Auto-fetch emails when entering step 4
  useEffect(() => {
    if (activeStep === 4 && currentRFPId && !emailsFetched) {
      fetchVendorEmails()
    }
  }, [activeStep, currentRFPId])

  const fetchVendorEmails = async () => {
    if (!currentRFPId) return
    
    setFetchingEmails(true)
    try {
      // Get already stored vendor responses
      const responsesResult = await rfpAPI.getVendorResponses(currentRFPId)
      const storedResponses = responsesResult.mail_content || []
      
      // Set the stored responses
      setVendorResponses(storedResponses)
      setEmailsFetched(true)
      
      if (storedResponses.length > 0) {
        toast.success(`${storedResponses.length} vendor response(s) loaded`)
      }
    } catch (err) {
      console.error('Fetch emails error:', err)
      setEmailsFetched(true)
    } finally {
      setFetchingEmails(false)
    }
  }

  const handleRefreshEmails = async () => {
    if (!currentRFPId) return
    
    setFetchingEmails(true)
    try {
      // Get stored responses first
      const responsesResult = await rfpAPI.getVendorResponses(currentRFPId)
      const storedResponses = responsesResult.mail_content || []
      
      // Fetch new emails from inbox
      let inboxEmails = []
      try {
        const inboxResult = await rfpAPI.getInboxEmails(currentRFPId)
        inboxEmails = inboxResult.emails || []
        console.log(`Found ${inboxEmails.length} emails in inbox for this RFP`)
      } catch (inboxErr) {
        console.log('Inbox fetch error:', inboxErr.message)
        toast.error('Could not fetch inbox: ' + inboxErr.message)
        setFetchingEmails(false)
        return
      }
      
      // Process only truly new emails - dedupe inbox emails first
      const uniqueInboxEmails = []
      const seenEmailKeys = new Set()
      
      for (const email of inboxEmails) {
        const fromEmail = email.from || ''
        const senderMatch = fromEmail.match(/<(.+?)>/) || [null, fromEmail]
        const senderEmail = (senderMatch[1] || fromEmail).toLowerCase().trim()
        const emailDate = email.date || email.receivedDate || ''
        
        // Create unique key: sender + date (to allow same vendor's multiple emails on different dates)
        const emailKey = `${senderEmail}|${emailDate}`
        
        if (!seenEmailKeys.has(emailKey)) {
          seenEmailKeys.add(emailKey)
          uniqueInboxEmails.push(email)
        } else {
          console.log('Skipping inbox duplicate:', senderEmail, emailDate)
        }
      }
      
      console.log(`Unique emails after dedup: ${uniqueInboxEmails.length} of ${inboxEmails.length}`)
      
      let newEmailsAdded = 0
      for (const email of uniqueInboxEmails) {
        const emailContent = email.body || email.text || email.html || email.content || ''
        if (!emailContent) {
          console.log('Skipping email with no content')
          continue
        }
        
        const emailSubject = email.subject || ''
        const fromEmail = email.from || ''
        const emailDate = email.date || email.receivedDate || ''
        
        // Extract sender identifier (email or name) for comparison
        const senderMatch = fromEmail.match(/<(.+?)>/) || [null, fromEmail]
        const senderEmail = (senderMatch[1] || fromEmail).toLowerCase().trim()
        
        // Check if this exact email already exists in stored responses
        const isDuplicate = storedResponses.some(stored => {
          const storedFrom = (stored.from_email || '').toLowerCase()
          const storedSenderMatch = storedFrom.match(/<(.+?)>/) || [null, storedFrom]
          const storedSender = (storedSenderMatch[1] || storedFrom).trim()
          
          // Check if same sender
          const sameSender = storedSender && senderEmail && 
            (storedSender.includes(senderEmail) || senderEmail.includes(storedSender))
          
          if (!sameSender) return false
          
          // Same sender - check content similarity (first 200 chars normalized)
          const storedHash = (stored.mail_body || '').replace(/\s+/g, '').substring(0, 200)
          const emailHash = emailContent.replace(/\s+/g, '').substring(0, 200)
          if (storedHash && emailHash && storedHash === emailHash) {
            console.log('Duplicate found - same sender & content:', senderEmail.substring(0, 20))
            return true
          }
          
          return false
        })
        
        if (isDuplicate) {
          continue
        }
        
        // Find vendor by email address
        const vendorId = availableVendors.find(v => {
          const vendorEmail = (v.email || '').toLowerCase()
          return senderEmail.includes(vendorEmail) || vendorEmail.includes(senderEmail)
        })?._id

        try {
          console.log('Adding new email from:', fromEmail)
          await rfpAPI.addVendorResponse(currentRFPId, {
            vendor_id: vendorId || null,
            mail_body: emailContent,
            mail_subject: emailSubject,
            from_email: fromEmail
          })
          newEmailsAdded++
        } catch (err) {
          console.error('Failed to add email:', err)
        }
      }
      
      // Refresh responses
      const updatedResponses = await rfpAPI.getVendorResponses(currentRFPId)
      setVendorResponses(updatedResponses.mail_content || [])
      
      if (newEmailsAdded > 0) {
        toast.success(`Added ${newEmailsAdded} new response(s)!`)
      } else if (inboxEmails.length === 0) {
        toast(`No emails found for this RFP yet`, { icon: '📭' })
      } else {
        toast(`${updatedResponses.mail_content?.length || 0} response(s) - all emails already processed`, { icon: 'ℹ️' })
      }
    } catch (err) {
      console.error('Refresh error:', err)
      toast.error('Failed to refresh: ' + (err.message || 'Unknown error'))
    } finally {
      setFetchingEmails(false)
    }
  }

  // Step 4: Compare vendor quotes
  const handleCompareQuotes = async () => {
    if (!currentRFPId) return toast.error('No RFP to compare')
    
    if (vendorResponses.length < 2) {
      toast.error('Need at least 2 vendor responses to compare')
      return
    }
    
    setLoadingSteps(prev => ({ ...prev, 4: true }))
    try {
      // Compare quotes using AI
      const comparison = await rfpAPI.compareQuotes(currentRFPId)
      
      setComparisonData({
        vendors: vendorResponses,
        comparison: comparison.comparison || comparison,
        recommendation: comparison.recommendation || comparison.best_vendor
      })

      toast.success('Quotes compared successfully!')
    } catch (err) {
      console.error('Compare quotes error:', err)
      toast.error(err.message || 'Failed to compare quotes.')
    } finally {
      setLoadingSteps(prev => ({ ...prev, 4: false }))
    }
  }

  const steps = [
    { num: 1, label: 'Describe', desc: 'Requirements' },
    { num: 2, label: 'Review', desc: 'Edit RFP' },
    { num: 3, label: 'Vendors', desc: 'Select & Send' },
    { num: 4, label: 'Compare', desc: 'Quotes' }
  ]

  const canNavigateToStep = (stepNum) => {
    if (stepNum === 1) return true
    if (stepNum === 2) return completedSteps.includes(1) || currentRFPId
    if (stepNum === 3) return completedSteps.includes(2) || currentRFPId
    if (stepNum === 4) return completedSteps.includes(3) || currentRFPId
    return false
  }

  return (
    <div className="min-h-[60vh]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create RFP</h1>
          <p className="text-sm text-gray-500 mb-8">AI-assisted RFP builder</p>
          
          {/* Progress Bar */}
          <div className="relative mb-10">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <React.Fragment key={step.num}>
                  {/* Step Circle */}
                  <div className="flex flex-col items-center relative z-10">
                    <button
                      onClick={() => canNavigateToStep(step.num) && setActiveStep(step.num)}
                      disabled={!canNavigateToStep(step.num)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                        activeStep === step.num
                          ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                          : completedSteps.includes(step.num)
                          ? 'bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600'
                          : canNavigateToStep(step.num)
                          ? 'bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200 border border-gray-200'
                          : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100'
                      }`}
                    >
                      {completedSteps.includes(step.num) ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.num
                      )}
                    </button>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium text-gray-800">{step.label}</div>
                      <div className="text-xs text-gray-400">{step.desc}</div>
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-3 mb-10">
                      <div className={`h-full rounded-full transition-all ${
                        completedSteps.includes(step.num) ? 'bg-emerald-500' : 'bg-gray-200'
                      }`} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {activeStep === 1 && (
          <div className="max-w-4xl mx-auto content-card">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Describe Your Requirements</h3>
              <p className="text-gray-500">Tell us what you need in natural language. Our AI will structure it into a professional RFP.</p>
            </div>
            <textarea 
              value={nlText} 
              onChange={e => setNlText(e.target.value)} 
              rows={6} 
              className="form-textarea mb-6" 
              placeholder={examplePrompts[0].text} 
            />
            <div className="flex gap-4">
              <Button variant="primary" onClick={handleAnalyze} loading={loadingSteps[1]}>
                ✨ Analyze & Generate
              </Button>
              <Button variant="ghost" onClick={() => setNlText(examplePrompts[0].text)}>
                Use Example
              </Button>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="max-w-4xl mx-auto content-card">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Customize RFP</h3>
              <p className="text-gray-500">Fine-tune the generated RFP details before saving.</p>
            </div>
            {editedRFP ? (
              <div className="max-h-[55vh] overflow-y-auto overflow-x-hidden pr-3" style={{ scrollbarWidth: 'thin' }}>
                <DynamicForm data={editedRFP} onChange={next => setEditedRFP(next)} />
              </div>
            ) : (
              <LoadingSpinner text="Preparing form..." />
            )}
            <div className="divider"></div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setActiveStep(1)}>
                ← Back
              </Button>
              <Button variant="primary" onClick={handleSaveRFP} loading={loadingSteps[2]}>
                Save & Continue →
              </Button>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="max-w-6xl mx-auto content-card">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Vendors</h3>
              <p className="text-gray-500">
                Choose at least 2 vendors to send this RFP to 
                <span className="badge-primary ml-2">{selectedVendors.length} selected</span>
                {selectedVendors.length === 1 && (
                  <span className="badge-warning ml-2">Select 1 more</span>
                )}
              </p>
            </div>
            <VendorSelector vendors={availableVendors} selectedVendors={selectedVendors} onSelectionChange={setSelectedVendors} maxSelection={10} />
            
            {/* Warning message when only 1 vendor selected */}
            {selectedVendors.length === 1 && (
              <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-amber-700 font-medium">Minimum 2 vendors required to enable quote comparison. Please select at least one more vendor.</p>
              </div>
            )}
            
            <div className="divider"></div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setActiveStep(2)}>
                ← Back
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSendToVendors} 
                loading={loadingSteps[3]} 
                disabled={selectedVendors.length < 2}
              >
                {selectedVendors.length < 2 
                  ? `Select ${2 - selectedVendors.length} more vendor${2 - selectedVendors.length !== 1 ? 's' : ''}`
                  : `📧 Send to ${selectedVendors.length} Vendors →`
                }
              </Button>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Vendor Responses Section */}
            <div className="content-card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-3xl">📬</span> Vendor Responses
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {fetchingEmails ? 'Fetching responses...' : (
                      <span className="flex items-center gap-2">
                        <span className="badge-success">{vendorResponses.length} response(s)</span> received
                      </span>
                    )}
                  </p>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={handleRefreshEmails} 
                  loading={fetchingEmails}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
              </div>

              {/* Loading State */}
              {fetchingEmails && (
                <div className="text-center py-10">
                  <LoadingSpinner text="Fetching vendor responses..." />
                </div>
              )}

              {/* No Responses Yet */}
              {!fetchingEmails && vendorResponses.length === 0 && (
                <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-700 font-semibold text-lg mb-2">No vendor responses yet</p>
                  <p className="text-gray-500 mb-4">Waiting for vendors to reply to your RFP email. Click Refresh to check for new responses.</p>
                </div>
              )}

              {/* Responses List */}
              {!fetchingEmails && vendorResponses.length > 0 && (
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {vendorResponses.map((response, i) => (
                    <div key={response._id || i} className="response-card">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                              {(response.vendor_id?.name || `V${i + 1}`).charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {response.vendor_id?.name || response.vendor_id?.company || `Vendor ${i + 1}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {response.mail_subject || 'Vendor Response'}
                              </p>
                            </div>
                            <span className="badge-success">✓ Received</span>
                          </div>
                          <p className="text-xs text-gray-400 ml-13">
                            {response.time_mail_received ? new Date(response.time_mail_received).toLocaleString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Compare Section */}
            <div className="content-card">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-3xl">📊</span> Compare Vendor Quotes
              </h3>
              <p className="text-gray-500 mb-5">
                {vendorResponses.length >= 2 
                  ? 'Compare vendor responses using AI to find the best option'
                  : vendorResponses.length === 1
                  ? 'Need at least 2 vendor responses to compare'
                  : 'Add vendor responses first to enable comparison'
                }
              </p>
              
              {/* Not enough responses message */}
              {!comparisonData && !loadingSteps[4] && vendorResponses.length < 2 && (
                <div className="text-center py-10 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  {vendorResponses.length === 1 ? (
                    <>
                      <p className="text-gray-700 font-semibold text-lg mb-2">Only 1 vendor response received</p>
                      <p className="text-gray-500">Please wait for at least one more vendor to respond to enable comparison.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700 font-semibold text-lg mb-2">No vendor responses yet</p>
                      <p className="text-gray-500">Click Refresh to check for vendor responses.</p>
                    </>
                  )}
                </div>
              )}

              {/* Compare button - only show when we have 2+ responses */}
              {!comparisonData && !loadingSteps[4] && vendorResponses.length >= 2 && (
                <div className="text-center py-10 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-semibold text-lg mb-4">Ready to compare {vendorResponses.length} vendor quotes</p>
                  <Button variant="primary" onClick={handleCompareQuotes} loading={loadingSteps[4]}>
                    ✨ Compare Quotes with AI
                  </Button>
                </div>
              )}

              {loadingSteps[4] && <LoadingSpinner text="Analyzing vendor proposals with AI..." />}
              
              {comparisonData && (
                <ComparisonPreview 
                  data={comparisonData.vendors || comparisonData} 
                  comparison={comparisonData.comparison}
                  recommendation={comparisonData.recommendation}
                />
              )}
            </div>

            <div className="divider"></div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setActiveStep(3)}>
                ← Back
              </Button>
              <Button 
                variant="primary" 
                onClick={() => { 
                  rfpAPI.updateStatus(currentRFPId, 'Completed').catch(() => {})
                  toast.success('RFP Workflow Complete! 🎉')
                  fetchRfps?.()
                  setShowCreate(false)
                }}
              >
                🎉 Complete & Return to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateRFP
