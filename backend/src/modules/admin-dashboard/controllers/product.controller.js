const Product = require('../../../infrastructure/database/models/Product');

/**
 * GET /api/admin/products/pending
 * List all products waiting for approval
 */
exports.getPendingProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    let query = { status: 'pending' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { oemCode: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('sellerId', 'name shopName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin Fetch Pending Products Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách sản phẩm.' });
  }
};

/**
 * PATCH /api/admin/products/:id/approve
 * Approve a product for sale
 */
exports.approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id, 
      { $set: { status: 'active' } }, 
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }

    res.status(200).json({
      success: true,
      message: 'Sản phẩm đã được duyệt thành công.',
      data: product
    });
  } catch (error) {
    console.error('Admin Approve Product Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi duyệt sản phẩm.' });
  }
};

/**
 * PATCH /api/admin/products/:id/reject
 * Reject a product
 */
exports.rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      id, 
      { $set: { status: 'rejected', rejectionReason: reason } }, 
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }

    res.status(200).json({
      success: true,
      message: 'Sản phẩm đã bị từ chối.',
      data: product
    });
  } catch (error) {
    console.error('Admin Reject Product Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi từ chối sản phẩm.' });
  }
};
