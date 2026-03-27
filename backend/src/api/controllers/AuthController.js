const RegisterUser = require('../../core/use-cases/RegisterUser');
const LoginUser = require('../../core/use-cases/LoginUser');
const ForgotPassword = require('../../core/use-cases/ForgotPassword');
const ResetPassword = require('../../core/use-cases/ResetPassword');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, role, shopName } = req.body;
      const user = await RegisterUser.execute({ name, email, password, role, shopName });
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await LoginUser.execute({ email, password });
      res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const token = await ForgotPassword.execute(email);
      // In a real app, send an email here. For now, we return the token (or just success).
      res.status(200).json({ message: 'Link đặt lại mật khẩu đã được tạo.', token });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      const result = await ResetPassword.execute(token, password);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async submitKYC(req, res) {
    try {
      const User = require('../../infrastructure/database/models/User');
      const { idCardNumber, idCardFront, idCardBack, businessLicense, taxCode, bankInfo } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            isApproved: false, // Reset to pending
            kycDetails: {
              idCardNumber,
              idCardFront,
              idCardBack,
              businessLicense,
              taxCode,
              bankInfo,
              submittedAt: new Date()
            }
          }
        },
        { new: true }
      ).select('-password');

      if (!user) throw new Error('Không tìm thấy người dùng.');

      res.status(200).json({ success: true, message: 'Hồ sơ KYC đã được gửi thành công.', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();
