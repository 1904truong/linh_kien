const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop'
  },
  rating: {
    type: Number,
    default: 5.0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  deliveryTime: {
    type: String,
    default: '1-3 ngày'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  categories: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
