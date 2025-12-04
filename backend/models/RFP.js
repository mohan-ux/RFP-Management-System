import mongoose from 'mongoose';

// Mail content schema for vendor responses
const mailContentSchema = new mongoose.Schema({
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  time_mail_received: {
    type: Date,
    default: null
  },
  mail_body: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  mail_subject: {
    type: String,
    default: ''
  },
  from_email: {
    type: String,
    default: ''
  }
}, { _id: false });

const rfpSchema = new mongoose.Schema({
  // User's original text input
  user_text: {
    type: String,
    default: ''
  },
  // LLM generated response (structured RFP) - flexible schema to accept any LLM output
  llm_response: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Selected vendors for this RFP
  choosed_vendors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  }],
  // Mail content received from vendors
  mail_content: [mailContentSchema],
  // RFP Status
  status: {
    type: String,
    enum: ['New', 'Review RFP', 'Vendors Choosed', 'Vendors Responded', 'View Quotes', 'Completed'],
    default: 'New'
  },
  // LLM comparison analysis
  comparison_result: {
    best_vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor'
    },
    best_price: { type: String, default: '' },
    best_warranty: { type: String, default: '' },
    best_overall: { type: String, default: '' },
    reasons: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  // Legacy fields (keeping for backward compatibility)
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  deadline: { type: String, default: '' },
  budget: {
    type: mongoose.Schema.Types.Mixed,
    default: { min: 0, max: 0, currency: 'USD' }
  },
  items: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  evaluationCriteria: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  terms: { type: String, default: '' },
  vendors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  }],
  awardedVendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  }
}, {
  timestamps: true
});

const RFP = mongoose.model('RFP', rfpSchema);

export default RFP;
