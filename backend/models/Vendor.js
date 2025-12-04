import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'General'
  },
  address: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
