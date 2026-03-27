const User = require('../../../infrastructure/database/models/User');
const Product = require('../../../infrastructure/database/models/Product');
const Order = require('../../../infrastructure/database/models/Order');
const mongoose = require('mongoose');

/**
 * GET /api/admin/dashboard/stats
 * Get global platform statistics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingKYC = await User.countDocuments({ role: 'seller', isApproved: false });
    const newProducts = await Product.countDocuments({ status: 'pending' });
    
    const revenueData = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Format revenue for display (e.g. 1.2B)
    const formatRevenue = (val) => {
      if (val >= 1000000000) return (val / 1000000000).toFixed(1) + 'B';
      if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
      return val.toLocaleString() + '₫';
    };

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        pendingKYC,
        newProducts,
        totalRevenue: formatRevenue(totalRevenue),
        rawRevenue: totalRevenue
      }
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thống kê.' });
  }
};

/**
 * GET /api/admin/dashboard/recent-kyc
 * Get latest pending KYC requests
 */
exports.getRecentKYC = async (req, res) => {
  try {
    const users = await User.find({ role: 'seller', isApproved: false })
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedKYC = users.map(u => ({
      id: `#KYC-${u._id.toString().substring(18, 24).toUpperCase()}`,
      name: u.shopName || u.name,
      type: u.role === 'seller' ? 'Seller' : 'Supplier',
      date: new Date(u.createdAt).toLocaleDateString('vi-VN'),
      status: 'Pending',
      _id: u._id
    }));

    res.status(200).json({
      success: true,
      data: formattedKYC
    });
  } catch (error) {
    console.error('Admin Recent KYC Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy yêu cầu KYC.' });
  }
};
