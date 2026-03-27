const Order = require('../../../infrastructure/database/models/Order');
const Notification = require('../../../infrastructure/database/models/Notification');
const mongoose = require('mongoose');

/**
 * GET /api/seller/orders
 * Get orders for the logged-in seller with search and status filtering
 */
exports.getOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const { status, search, page = 1, limit = 10 } = req.query;

    // 1. Build initial match for orders containing items from this seller OR orphaned items (for demo safety)
    let query = { 
      $or: [
        { 'items.sellerId': new mongoose.Types.ObjectId(sellerId) },
        { 'items.sellerId': null },
        { 'items.sellerId': { $exists: false } }
      ]
    };

    // 2. Filter by global order status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // 3. Search logic (Order ID or Buyer Name)
    // We will use aggregation to join with User and filter efficiently
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'buyerInfo'
        }
      },
      { $unwind: '$buyerInfo' }
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { _id: mongoose.isValidObjectId(search) ? new mongoose.Types.ObjectId(search) : null },
            { 'buyerInfo.name': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // 4. Count total for pagination
    const totalResult = await Order.aggregate([...pipeline, { $count: 'total' }]);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    // 5. Paginate and sort
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    );

    const orders = await Order.aggregate(pipeline);

    // 6. Post-process to only include relevant seller items in the response
    const formattedOrders = orders.map(order => {
      // Filter items to show: 
      // 1. Items belonging to this seller
      // 2. Items with no seller assigned (assuming they belong to this seller for demo purposes)
      const sellerItems = order.items.filter(item => 
        !item.sellerId || item.sellerId.toString() === sellerId.toString()
      );
      
      return {
        ...order,
        userId: {
          _id: order.buyerInfo._id,
          name: order.buyerInfo.name,
          email: order.buyerInfo.email
        },
        items: sellerItems,
        // We ensure totalPrice is relevant if needed, but usually we show the Order's total
        // or we could calculate a subtotal for the seller. For now, keeping original structure.
      };
    });

    res.status(200).json({
      success: true,
      orders: formattedOrders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách đơn hàng.' });
  }
};

/**
 * PATCH /api/seller/orders/:id/status
 * Update order status (or specific item status in a real-world complex scenario)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const sellerId = req.user.userId;

    // Verify order exists and belongs to seller (or is orphaned)
    const order = await Order.findOne({ 
      _id: id, 
      $or: [
        { 'items.sellerId': sellerId },
        { 'items.sellerId': null },
        { 'items.sellerId': { $exists: false } }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
    }

    // Update the global status for now as per current schema
    order.status = status;
    
    // Also update item statuses for this seller (and orphans)
    order.items.forEach(item => {
      if (!item.sellerId || item.sellerId.toString() === sellerId.toString()) {
        item.status = status;
      }
    });

    await order.save();

    // Create notification for buyer about status update
    try {
      const statusLabels = {
        'pending': 'Chờ xác nhận',
        'processing': 'Đang xử lý',
        'shipped': 'Đang giao',
        'delivered': 'Hoàn thành',
        'cancelled': 'Đã hủy'
      };
      
      await Notification.create({
        userId: order.userId,
        type: 'order',
        title: `Cập nhật đơn hàng #${order._id.toString().substring(0,8)}`,
        message: `Đơn hàng của bạn đã chuyển sang trạng thái: ${statusLabels[status] || status}`,
        orderId: order._id
      });
    } catch (notiErr) {
      console.error('Failed to create notification on status update:', notiErr);
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công.',
      data: order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật trạng thái.' });
  }
};

/**
 * DELETE /api/seller/orders/:id
 * Delete an order for the logged-in seller
 */
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.userId;

    // We search for the order and ensure it belongs to the seller (or is orphaned)
    const order = await Order.findOne({ 
      _id: id, 
      $or: [
        { 'items.sellerId': sellerId },
        { 'items.sellerId': null },
        { 'items.sellerId': { $exists: false } }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Xóa đơn hàng thành công.'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa đơn hàng.' });
  }
};
