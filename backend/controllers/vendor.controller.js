import mongoose from 'mongoose';
import Vendor from '../models/Vendor.js';
import { ApiError } from '../middleware/errorHandler.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all vendors
// @route   GET /api/vendors
export const getAllVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json({ success: true, vendors });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vendor by ID
// @route   GET /api/vendors/:id
export const getVendorById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'Invalid Vendor ID');
    }
    
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      throw new ApiError(404, 'Vendor not found');
    }
    
    res.json({ vendor });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new vendor
// @route   POST /api/vendors
export const createVendor = async (req, res, next) => {
  try {
    const { name, email, company, phone, category, address } = req.body;
    
    // Validate required fields
    if (!name || name.trim() === '') {
      throw new ApiError(400, 'Vendor name is required');
    }
    
    if (!email || email.trim() === '') {
      throw new ApiError(400, 'Vendor email is required');
    }
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, 'Invalid email format');
    }
    
    const vendor = await Vendor.create({ name, email, company, phone, category, address });
    res.status(201).json({ success: true, vendor });
  } catch (error) {
    if (error.code === 11000) {
      next(new ApiError(400, 'Vendor with this email already exists'));
    } else {
      next(error);
    }
  }
};

// @desc    Update vendor
// @route   PUT /api/vendors/:id
export const updateVendor = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'Invalid Vendor ID');
    }
    
    const { name, email } = req.body;
    
    // If name is being updated, validate it
    if (name !== undefined && (!name || name.trim() === '')) {
      throw new ApiError(400, 'Vendor name cannot be empty');
    }
    
    // If email is being updated, validate it
    if (email !== undefined) {
      if (!email || email.trim() === '') {
        throw new ApiError(400, 'Vendor email cannot be empty');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new ApiError(400, 'Invalid email format');
      }
    }
    
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!vendor) {
      throw new ApiError(404, 'Vendor not found');
    }
    
    res.json({ success: true, vendor });
  } catch (error) {
    if (error.code === 11000) {
      next(new ApiError(400, 'Vendor with this email already exists'));
    } else {
      next(error);
    }
  }
};

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
export const deleteVendor = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'Invalid Vendor ID');
    }
    
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    
    if (!vendor) {
      throw new ApiError(404, 'Vendor not found');
    }
    
    res.json({ success: true, message: 'Vendor deleted successfully' });
  } catch (error) {
    next(error);
  }
};
