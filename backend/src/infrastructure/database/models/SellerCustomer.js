const mongoose = require('mongoose');

const sellerCustomerSchema = new mongoose.Schema({
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  phone: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String,
    trim: true,
    lowercase: true
  },
  address: { 
    type: String,
    trim: true
  },
  type: { 
    type: String, 
    // Matches the frontend categories
    enum: ['Garage', 'Mechanic', 'Workshop', 'Individual', 'Other'],
    default: 'Individual'
  },
  totalOrders: { 
    type: Number, 
    default: 0 
  },
  totalSpent: { 
    type: Number, 
    default: 0 
  },
  lastOrderDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active' 
  }
}, { timestamps: true });

// Prevent a seller from adding the exact same phone number twice in their own CRM
sellerCustomerSchema.index({ sellerId: 1, phone: 1 }, { unique: true });
// Index for fast text search
sellerCustomerSchema.index({ name: 'text', phone: 'text', email: 'text' });

const SellerCustomer = mongoose.model('SellerCustomer', sellerCustomerSchema);
module.exports = SellerCustomer;
