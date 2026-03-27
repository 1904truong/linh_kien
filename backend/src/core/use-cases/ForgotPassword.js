const crypto = require('crypto');
const User = require('../../infrastructure/database/models/User');

class ForgotPassword {
  async execute(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Không tìm thấy người dùng với email này.');
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set token and expiry (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    return resetToken;
  }
}

module.exports = new ForgotPassword();
