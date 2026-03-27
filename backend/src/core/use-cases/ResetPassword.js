const bcrypt = require('bcryptjs');
const User = require('../../infrastructure/database/models/User');

class ResetPassword {
  async execute(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user and clear token info
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return { message: 'Mật khẩu đã được đặt lại thành công.' };
  }
}

module.exports = new ResetPassword();
