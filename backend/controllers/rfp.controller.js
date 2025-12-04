import mongoose from 'mongoose';
import RFP from '../models/RFP.js';
import Vendor from '../models/Vendor.js';
import { ApiError } from '../middleware/errorHandler.js';
import { generateRFPFromText, identifyEmailRFP, compareVendorQuotes } from '../helpers/gemini.helper.js';
import { sendRFPToVendor, fetchInboxEmails } from '../helpers/email.helper.js';

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// =============================================
// HOME PAGE APIs
// =============================================

/**
 * @desc    Get all RFPs
 * @route   GET /api/rfp
 * @access  Public
 */
export const getAllRFPs = async (req, res, next) => {
  try {
    const rfps = await RFP.find()
      .populate('choosed_vendors', 'name email company')
      .populate('mail_content.vendor_id', 'name email company')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true,
      count: rfps.length,
      rfps 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new RFP (initial creation with status "New")
 * @route   POST /api/rfp
 * @access  Public
 */
export const createRFP = async (req, res, next) => {
  try {
    const rfp = await RFP.create({
      user_text: '',
      llm_response: {},
      choosed_vendors: [],
      mail_content: [],
      status: 'New'
    });
    
    res.status(201).json({ 
      success: true,
      message: 'RFP created successfully',
      rfp 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete RFP by ID
 * @route   DELETE /api/rfp/:id
 * @access  Public
 */
export const deleteRFP = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'Invalid RFP ID');
    }
    
    const rfp = await RFP.findByIdAndDelete(req.params.id);
    
    if (!rfp) {
      throw new ApiError(404, 'RFP not found');
    }
    
    res.json({ 
      success: true, 
      message: 'RFP deleted successfully',
      deletedId: req.params.id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single RFP by ID
 * @route   GET /api/rfp/:id
 * @access  Public
 */
export const getRFPById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'Invalid RFP ID');
    }
    
    const rfp = await RFP.findById(req.params.id)
      .populate('choosed_vendors', 'name email company category')
      .populate('mail_content.vendor_id', 'name email company');
    
    if (!rfp) {
      throw new ApiError(404, 'RFP not found');
    }
    
    res.json({ 
      success: true,
      rfp 
    });
  } catch (error) {
    next(error);
  }
};

// =============================================
// DESCRIBE PAGE APIs (Step 1)
// =============================================

/**
 * @desc    Call LLM to generate structured RFP from user text
 * @route   POST /api/rfp/generate-from-text
 * @access  Public
 * @body    { user_text: string }
 */
export const generateRFPWithLLM = async (req, res, next) => {
  try {
    const { user_text } = req.body;
    
    if (!user_text || user_text.trim() === '') {
      throw new ApiError(400, 'User text is required');
    }

    // Call Gemini API to generate structured RFP
    const llmResponse = await generateRFPFromText(user_text);
    
    res.json({ 
      success: true,
      message: 'RFP generated successfully',
      llm_response: llmResponse
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update RFP with user_text and llm_response, set status to "Review RFP"
 * @route   PUT /api/rfp/:id/describe
 * @access  Public
 * @body    { user_text: string, llm_response: object }
 */
export const updateRFPDescribe = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'Invalid RFP ID');
    }
    
    const { user_text, llm_response } = req.body;
    
    // Validate required fields
    if (!user_text || user_text.trim() === '') {
      throw new ApiError(400, 'User text is required');
    }
    
    if (!llm_response || typeof llm_response !== 'object') {
      throw new ApiError(400, 'LLM response is required and must be an object');
    }
    
    const rfp = await RFP.findByIdAndUpdate(
      req.params.id,
      {
        user_text,
        llm_response,
        status: 'Review RFP',
        // Also update legacy fields for backward compatibility
        title: llm_response?.title || '',
        description: llm_response?.description || '',
        deadline: llm_response?.deadline || '',
        budget: llm_response?.budget || { min: 0, max: 0, currency: 'USD' },
        items: llm_response?.items || [],
        evaluationCriteria: llm_response?.evaluation_criteria || [],
        terms: llm_response?.terms || ''
      },
      { new: true, runValidators: true }
    );
    
    if (!rfp) {
      throw new ApiError(404, 'RFP not found');
    }
    
    res.json({ 
      success: true,
      message: 'RFP updated successfully. Status: Review RFP',
      rfp 
    });
  } catch (error) {
    next(error);
  }
};

// =============================================
// REVIEW & CUSTOMIZE RFP APIs (Step 2)
// =============================================

/**
 * @desc    Update RFP with customized data (user edits the generated RFP)
 * @route   PUT /api/rfp/:id/review
 * @access  Public
 * @body    { llm_response: object (updated RFP fields) }
 */
export const updateRFPReview = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'Invalid RFP ID');
    }
    
    const { llm_response } = req.body;
    
    // Validate llm_response
    if (!llm_response || typeof llm_response !== 'object') {
      throw new ApiError(400, 'LLM response is required and must be an object');
    }
    
    const rfp = await RFP.findByIdAndUpdate(
      req.params.id,
      {
        llm_response,
        // Update legacy fields
        title: llm_response?.title || '',
        description: llm_response?.description || '',
        deadline: llm_response?.deadline || '',
        budget: llm_response?.budget || { min: 0, max: 0, currency: 'USD' },
        items: llm_response?.items || [],
        evaluationCriteria: llm_response?.evaluation_criteria || [],
        terms: llm_response?.terms || ''
      },
      { new: true, runValidators: true }
    );
    
    if (!rfp) {
      throw new ApiError(404, 'RFP not found');
    }
    
    res.json({ 
      success: true,
      message: 'RFP customization saved successfully',
      rfp 
    });
  } catch (error) {
    next(error);
  }
};

// =============================================
// SELECT VENDORS APIs (Step 3)
// =============================================

/**
 * @desc    Get all vendors
 * @route   GET /api/vendors
 * @access  Public
 * (Already exists in vendor.controller.js)
 */

/**
 * @desc    Send RFP email to selected vendors
 * @route   POST /api/rfp/:id/send-to-vendors
 * @access  Public
 * @body    { vendor_ids: string[] }
 */
export const sendRFPToVendors = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'Invalid RFP ID');
    }
    
    const { vendor_ids } = req.body;
    
    if (!vendor_ids || !Array.isArray(vendor_ids) || vendor_ids.length === 0) {
      throw new ApiError(400, 'At least one vendor must be selected');
    }
    
    // Get RFP
    const rfp = await RFP.findById(req.params.id);
    if (!rfp) {
      throw new ApiError(404, 'RFP not found');
    }
    
    // Get vendors
    const vendors = await Vendor.find({ _id: { $in: vendor_ids } });
    if (vendors.length === 0) {
      throw new ApiError(404, 'No vendors found with provided IDs');
    }
    
    // Send emails to each vendor
    const emailResults = [];
    const rfpData = rfp.llm_response
    
    for (const vendor of vendors) {
      const result = await sendRFPToVendor(
        vendor.email,
        vendor.name,
        rfpData,
        rfp._id.toString()
      );
      emailResults.push(result);
    }
    
    // Update RFP with chosen vendors and status
    await RFP.findByIdAndUpdate(req.params.id, {
      choosed_vendors: vendor_ids,
      vendors: vendor_ids, // Legacy field
      status: 'Vendors Choosed'
    });
    
    res.json({ 
      success: true,
      message: `RFP sent to ${emailResults.filter(r => r.success).length} vendors`,
      emailResults,
      status: 'Vendors Choosed'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all received emails from inbox for specific RFP
 * @route   GET /api/rfp/:id/emails/inbox
 * @access  Public
 */
export const getInboxEmails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      throw new ApiError(400, 'Invalid RFP ID');
    }
    
    // Get the RFP
    const rfp = await RFP.findById(id);
    if (!rfp) {
      throw new ApiError(404, 'RFP not found');
    }
    
    // Fetch emails only for this specific RFP
    const emails = await fetchInboxEmails(id);
    
    res.json({ 
      success: true,
      rfpId: id,
      count: emails.length,
      emails 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Process received email and identify which RFP it belongs to
 * @route   POST /api/rfp/emails/process
 * @access  Public
 * @body    { email_content: string, email_subject: string, from_email: string }
 */
export const processReceivedEmail = async (req, res, next) => {
  try {
    const { email_content, email_subject, from_email } = req.body;
    
    if (!email_content) {
      throw new ApiError(400, 'Email content is required');
    }
    
    // Get active RFPs (status = Vendors Choosed or Vendors Responded)
    const activeRFPs = await RFP.find({ 
      status: { $in: ['Vendors Choosed', 'Vendors Responded'] } 
    });
    
    // Find vendor by email
    let vendor = await Vendor.findOne({ 
      email: { $regex: from_email?.split('<')[1]?.replace('>', '') || from_email || '', $options: 'i' } 
    });
    
    if (activeRFPs.length === 0) {
      // No active RFPs, but still try to find vendor
      return res.json({ 
        success: true,
        message: 'No active RFPs waiting for vendor responses',
        identification: {
          rfp_id: null,
          confidence: 0,
          reasoning: 'No active RFPs found'
        },
        vendor: vendor ? { id: vendor._id, name: vendor.name, email: vendor.email } : null
      });
    }
    
    // Use LLM to identify which RFP the email belongs to
    let identification = null;
    try {
      identification = await identifyEmailRFP(
        `Subject: ${email_subject}\nFrom: ${from_email}\nContent: ${email_content}`,
        activeRFPs
      );
    } catch (llmError) {
      throw new ApiError(503, `Failed to identify RFP from email: ${llmError.message}`);
    }
    
    // Also check vendor from identification
    if (!vendor && identification?.vendor_email) {
      vendor = await Vendor.findOne({ email: { $regex: identification.vendor_email, $options: 'i' } });
    }
    
    res.json({ 
      success: true,
      identification,
      vendor: vendor ? { id: vendor._id, name: vendor.name, email: vendor.email } : null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update RFP with vendor mail content
 * @route   PUT /api/rfp/:id/add-mail-response
 * @access  Public
 * @body    { vendor_id: string, mail_body: object, mail_subject: string }
 */
export const addVendorMailResponse = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'Invalid RFP ID');
    }
    
    const { vendor_id, mail_body, mail_subject, from_email } = req.body;
    
    if (!mail_body) {
      throw new ApiError(400, 'Mail body is required');
    }
    
    // Validate vendor_id if provided, otherwise set to null
    let validVendorId = null;
    if (vendor_id && vendor_id !== 'unknown' && isValidObjectId(vendor_id)) {
      validVendorId = vendor_id;
    } else if (from_email) {
      // Try to find vendor by email
      const vendor = await Vendor.findOne({ email: { $regex: from_email.split('<')[1]?.replace('>', '') || from_email, $options: 'i' } });
      if (vendor) validVendorId = vendor._id;
    }
    
    const mailEntry = {
      vendor_id: validVendorId,
      time_mail_received: new Date(),
      mail_body,
      mail_subject: mail_subject || '',
      from_email: from_email || ''
    };
    
    const rfp = await RFP.findByIdAndUpdate(
      req.params.id,
      {
        $push: { mail_content: mailEntry },
        status: 'Vendors Responded'
      },
      { new: true }
    ).populate('mail_content.vendor_id', 'name email company');
    
    if (!rfp) {
      throw new ApiError(404, 'RFP not found');
    }
    
    res.json({ 
      success: true,
      message: 'Vendor response added successfully',
      rfp 
    });
  } catch (error) {
    next(error);
  }
};

// =============================================
// COMPARE VENDORS QUOTES APIs (Step 4)
// =============================================

/**
 * @desc    Get mail content of all vendors for an RFP
 * @route   GET /api/rfp/:id/vendor-responses
 * @access  Public
 */
export const getVendorResponses = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'Invalid RFP ID');
    }
    
    const rfp = await RFP.findById(req.params.id)
      .populate('mail_content.vendor_id', 'name email company category')
      .populate('choosed_vendors', 'name email company category');
    
    if (!rfp) {
      throw new ApiError(404, 'RFP not found');
    }
    
    res.json({ 
      success: true,
      rfp_id: rfp._id,
      mail_content: rfp.mail_content,
      choosed_vendors: rfp.choosed_vendors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Compare vendor quotes using LLM
 * @route   POST /api/rfp/:id/compare-quotes
 * @access  Public
 */
export const compareQuotes = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'Invalid RFP ID');
    }
    
    const rfp = await RFP.findById(req.params.id)
      .populate('mail_content.vendor_id', 'name email company');
    
    if (!rfp) {
      throw new ApiError(404, 'RFP not found');
    }
    
    if (!rfp.mail_content || rfp.mail_content.length === 0) {
      throw new ApiError(400, 'No vendor responses to compare');
    }
    
    if (rfp.mail_content.length < 2) {
      throw new ApiError(400, 'At least 2 vendor responses are required for comparison');
    }
    
    // Prepare data for comparison
    const vendorQuotes = rfp.mail_content.map(mc => ({
      vendor_id: mc.vendor_id?._id?.toString() || mc.vendor_id,
      vendor_name: mc.vendor_id?.name || 'Unknown Vendor',
      vendor_email: mc.vendor_id?.email || '',
      quote: mc.mail_body,
      received_at: mc.time_mail_received
    }));
    
    const rfpRequirements = rfp.llm_response || {
      title: rfp.title,
      description: rfp.description,
      budget: rfp.budget,
      items: rfp.items,
      evaluation_criteria: rfp.evaluationCriteria
    };
    
    // Use LLM to compare quotes
    const comparison = await compareVendorQuotes(vendorQuotes, rfpRequirements);
    
    // Find the actual vendor ObjectId from comparison result
    let bestVendorId = null;
    if (comparison.best_overall?.vendor_id) {
      // Check if it's already a valid ObjectId
      if (isValidObjectId(comparison.best_overall.vendor_id)) {
        bestVendorId = comparison.best_overall.vendor_id;
      } else {
        // Try to find by vendor name
        const bestVendor = vendorQuotes.find(v => 
          v.vendor_id === comparison.best_overall.vendor_id ||
          v.vendor_name?.toLowerCase().includes(comparison.best_overall.vendor_name?.toLowerCase() || '') ||
          comparison.best_overall.vendor_name?.toLowerCase().includes(v.vendor_name?.toLowerCase() || '')
        );
        if (bestVendor && isValidObjectId(bestVendor.vendor_id)) {
          bestVendorId = bestVendor.vendor_id;
        }
      }
    }
    
    // If still no vendor ID, use the first vendor from mail_content
    if (!bestVendorId && rfp.mail_content[0]?.vendor_id) {
      const firstVendorId = rfp.mail_content[0].vendor_id._id || rfp.mail_content[0].vendor_id;
      if (isValidObjectId(firstVendorId)) {
        bestVendorId = firstVendorId;
      }
    }
    
    // Update RFP with comparison result and status
    await RFP.findByIdAndUpdate(req.params.id, {
      comparison_result: {
        best_vendor_id: bestVendorId,
        best_price: JSON.stringify(comparison.best_price || {}),
        best_warranty: JSON.stringify(comparison.best_warranty || {}),
        best_overall: JSON.stringify(comparison.best_overall || {}),
        reasons: comparison
      },
      status: 'View Quotes'
    });
    
    res.json({ 
      success: true,
      message: 'Quote comparison completed',
      comparison,
      status: 'View Quotes'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update RFP status
 * @route   PUT /api/rfp/:id/status
 * @access  Public
 * @body    { status: string }
 */
export const updateRFPStatus = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'Invalid RFP ID');
    }
    
    const { status } = req.body;
    const validStatuses = ['New', 'Review RFP', 'Vendors Choosed', 'Vendors Responded', 'View Quotes', 'Completed'];
    
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    const rfp = await RFP.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!rfp) {
      throw new ApiError(404, 'RFP not found');
    }
    
    res.json({ 
      success: true,
      message: `Status updated to: ${status}`,
      rfp 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    General RFP update (for backward compatibility)
 * @route   PUT /api/rfp/:id
 * @access  Public
 */
export const updateRFP = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'Invalid RFP ID');
    }
    
    const rfp = await RFP.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!rfp) {
      throw new ApiError(404, 'RFP not found');
    }
    
    res.json({ 
      success: true,
      rfp 
    });
  } catch (error) {
    next(error);
  }
};

// Legacy exports for backward compatibility
export const createRFPFromText = generateRFPWithLLM;
