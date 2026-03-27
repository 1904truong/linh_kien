const User = require('../../../infrastructure/database/models/User');

/**
 * GET /api/admin/users
 * List all users with pagination, search, and role filtering
 */
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin Fetch Users Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách người dùng.' });
  }
};

/**
 * PATCH /api/admin/users/:id/status
 * Update user status (approve/suspend)
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, role } = req.body;

    const updateData = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (role) updateData.role = role;

    const user = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái người dùng thành công.',
      data: user
    });
  } catch (error) {
    console.error('Admin Update User Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật người dùng.' });
  }
};

/**
 * DELETE /api/admin/users/:id
 * Delete a user
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa người dùng thành công.'
    });
  } catch (error) {
    console.error('Admin Delete User Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa người dùng.' });
  }
};
