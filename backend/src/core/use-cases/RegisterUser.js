const bcrypt = require('bcryptjs');
const User = require('../../infrastructure/database/models/User');

class RegisterUser {
  async execute(userData) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: userData.role || 'customer',
      shopName: userData.shopName || '',
      isApproved: userData.role === 'seller' ? true : false
    });

    await user.save();

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      shopName: user.shopName
    };
  }
}

module.exports = new RegisterUser();
