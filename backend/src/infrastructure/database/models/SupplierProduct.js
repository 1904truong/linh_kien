const mongoose = require('mongoose');

const supplierProductSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  oemCode: {
    type: String,
    required: true
  },
  wholesalePrice: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  category: {
    type: String
  }
}, { timestamps: true });

const SupplierProduct = mongoose.model('SupplierProduct', supplierProductSchema);

module.exports = SupplierProduct;
