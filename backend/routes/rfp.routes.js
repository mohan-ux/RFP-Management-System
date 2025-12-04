import express from 'express';
import {
  // Home Page APIs
  getAllRFPs,
  createRFP,
  deleteRFP,
  getRFPById,
  updateRFP,
  
  // Describe Page APIs
  generateRFPWithLLM,
  updateRFPDescribe,
  
  // Review Page APIs
  updateRFPReview,
  
  // Select Vendors APIs
  sendRFPToVendors,
  getInboxEmails,
  processReceivedEmail,
  addVendorMailResponse,
  
  // Compare Quotes APIs
  getVendorResponses,
  compareQuotes,
  updateRFPStatus
} from '../controllers/rfp.controller.js';

const router = express.Router();

// =============================================
// HOME PAGE ROUTES
// =============================================
// GET /api/rfp - Get all RFPs
router.get('/', getAllRFPs);

// POST /api/rfp - Create new RFP (empty with status "New")
router.post('/', createRFP);

// =============================================
// DESCRIBE PAGE ROUTES (Step 1) - MUST be before /:id routes
// =============================================
// POST /api/rfp/generate-from-text - Call LLM to generate structured RFP
router.post('/generate-from-text', generateRFPWithLLM);

// =============================================
// SELECT VENDORS ROUTES - Email routes MUST be before /:id routes
// =============================================
// GET /api/rfp/:id/emails/inbox - Get received emails for specific RFP
router.get('/:id/emails/inbox', getInboxEmails);

// POST /api/rfp/emails/process - Process received email & identify RFP
router.post('/emails/process', processReceivedEmail);

// =============================================
// PARAMETERIZED ROUTES (/:id) - These must come AFTER specific routes
// =============================================
// GET /api/rfp/:id - Get single RFP by ID
router.get('/:id', getRFPById);

// DELETE /api/rfp/:id - Delete RFP
router.delete('/:id', deleteRFP);

// PUT /api/rfp/:id - General update (backward compatibility)
router.put('/:id', updateRFP);

// PUT /api/rfp/:id/describe - Save user_text & llm_response, update status to "Review RFP"
router.put('/:id/describe', updateRFPDescribe);

// =============================================
// REVIEW & CUSTOMIZE PAGE ROUTES (Step 2)
// =============================================
// PUT /api/rfp/:id/review - Update RFP with customized data
router.put('/:id/review', updateRFPReview);

// =============================================
// SELECT VENDORS ROUTES (Step 3)
// =============================================
// POST /api/rfp/:id/send-to-vendors - Send RFP email to selected vendors
router.post('/:id/send-to-vendors', sendRFPToVendors);

// PUT /api/rfp/:id/add-mail-response - Add vendor mail response to RFP
router.put('/:id/add-mail-response', addVendorMailResponse);

// =============================================
// COMPARE QUOTES ROUTES (Step 4)
// =============================================
// GET /api/rfp/:id/vendor-responses - Get all vendor responses for RFP
router.get('/:id/vendor-responses', getVendorResponses);

// POST /api/rfp/:id/compare-quotes - Compare vendor quotes using LLM
router.post('/:id/compare-quotes', compareQuotes);

// PUT /api/rfp/:id/status - Update RFP status
router.put('/:id/status', updateRFPStatus);

export default router;
