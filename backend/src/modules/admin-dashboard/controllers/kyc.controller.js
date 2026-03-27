const User = require('../../../infrastructure/database/models/User');

/**
 * GET /api/admin/kyc/pending
 * List all users with pending KYC (isApproved: false)
 */
exports.getKYCRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    let query = { isApproved: false, role: { $ne: 'admin' } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    const requests = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin Fetch KYC Requests Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách KYC.' });
  }
};

/**
 * PATCH /api/admin/kyc/:id/approve
 * Approve KYC request
 */
exports.approveKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id, 
      { $set: { isApproved: true } }, 
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    res.status(200).json({
      success: true,
      message: 'Hồ sơ KYC đã được duyệt thành công.',
      data: user
    });
  } catch (error) {
    console.error('Admin Approve KYC Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi duyệt KYC.' });
  }
};

/**
 * PATCH /api/admin/kyc/:id/reject
 * Reject KYC request
 */
exports.rejectKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    // We don't have a specific rejection field, so we just keep isApproved: false
    // and potentially log the reason or send an email/notification (to be implemented)
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    // Save rejection reason
    user.kycDetails = user.kycDetails || {};
    user.kycDetails.rejectionReason = reason;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Hồ sơ KYC đã bị từ chối.',
      reason
    });
  } catch (error) {
    console.error('Admin Reject KYC Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi từ chối KYC.' });
  }
};

/**
 * GET /api/admin/reports/stats
 * Get basic statistics for reports
 */
exports.getReportStats = async (req, res) => {
  try {
    const Product = require('../../../infrastructure/database/models/Product');
    
    // User structure stats
    const userStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Product by category
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: userStats,
        categories: categoryStats
      }
    });
  } catch (error) {
    console.error('Admin Report Stats Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy báo cáo.' });
  }
};
