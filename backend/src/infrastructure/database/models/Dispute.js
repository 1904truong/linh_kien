const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: ['item_not_received', 'damaged_item', 'wrong_item', 'not_as_described', 'other']
  },
  description: {
    type: String,
    required: true
  },
  evidence: [String], // Array of image URLs
  status: {
    type: String,
    enum: ['pending', 'in_review', 'resolved', 'rejected'],
    default: 'pending'
  },
  resolution: {
    action: {
      type: String,
      enum: ['none', 'full_refund', 'partial_refund', 'replacement', 'rejected']
    },
    notes: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, { timestamps: true });

const Dispute = mongoose.model('Dispute', disputeSchema);

module.exports = Dispute;
