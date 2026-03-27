const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer'
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  },
  shopName: {
    type: String,
    trim: true
  },
  shopLogo: {
    type: String
  },
  shopDescription: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  returnPolicy: {
    type: String
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  kycDetails: {
    idCardNumber: String,
    idCardFront: String,
    idCardBack: String,
    businessLicense: String,
    taxCode: String,
    bankInfo: {
      bankName: String,
      accountNumber: String,
      accountName: String
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    rejectionReason: String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
