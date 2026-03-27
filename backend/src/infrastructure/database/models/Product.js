const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  oemCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  compatibility: [{
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true }
  }],
  inventory: {
    type: Number,
    default: 0
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected', 'hidden'],
    default: 'pending'
  },
  safetyStock: {
    type: Number,
    default: 5
  },
  supplierLinkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  images: [{
    type: String
  }],
  description: {
    type: String
  }
}, { timestamps: true });

// Index for better filtering performance
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'compatibility.brand': 1, 'compatibility.model': 1, 'compatibility.year': 1 });
productSchema.index({ oemCode: 'text', name: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
