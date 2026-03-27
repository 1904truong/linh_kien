const SellerCustomer = require('../../../infrastructure/database/models/SellerCustomer');
const mongoose = require('mongoose');

/**
 * GET /api/seller/customers/stats
 * Get dashboard statistics for CRM customers
 */
exports.getCustomerStats = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const sellerObjId = new mongoose.Types.ObjectId(sellerId);

    // Total Customers
    const totalCustomers = await SellerCustomer.countDocuments({ sellerId: sellerObjId });

    // New Customers in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCustomers = await SellerCustomer.countDocuments({
      sellerId: sellerObjId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Strategy Partners (e.g. Garage + Workshop types)
    const strategicPartners = await SellerCustomer.countDocuments({
      sellerId: sellerObjId,
      type: { $in: ['Garage', 'Workshop'] }
    });

    // Returning Customers (totalOrders > 1)
    const returningCustomers = await SellerCustomer.countDocuments({
      sellerId: sellerObjId,
      totalOrders: { $gt: 1 }
    });

    const returnRate = totalCustomers > 0 
      ? Math.round((returningCustomers / totalCustomers) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        newCustomers,
        returnRate: `${returnRate}%`,
        strategicPartners
      }
    });

  } catch (error) {
    console.error('Error getting customer stats:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * GET /api/seller/customers
 * Get customer list with pagination, search, filter
 */
exports.getCustomers = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const { page = 1, limit = 10, search, type } = req.query;

    let query = { sellerId: new mongoose.Types.ObjectId(sellerId) };

    if (search) {
      // RegEx search across name, phone, email
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (type && type !== 'Tất cả' && type !== 'all') {
      // Mapping logic could be here, assuming type directly matches ENUM for now
      query.type = type;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [customers, total] = await Promise.all([
      SellerCustomer.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      SellerCustomer.countDocuments(query)
    ]);

    // Format UI-friendly values directly in backend to save frontend work
    const formattedCustomers = customers.map(c => {
      const doc = c.toObject();
      let lastOrderText = 'Chưa có ĐH';
      if (doc.lastOrderDate) {
        // Very basic relative time
        const diffMs = new Date() - new Date(doc.lastOrderDate);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffDays === 0) lastOrderText = 'Hôm nay';
        else if (diffDays === 1) lastOrderText = 'Hôm qua';
        else lastOrderText = `${diffDays} ngày trước`;
      }

      return {
        id: doc._id,
        name: doc.name,
        type: doc.type,
        phone: doc.phone,
        email: doc.email || 'Chưa cập nhật',
        address: doc.address || 'Chưa cập nhật',
        totalOrders: doc.totalOrders,
        totalSpent: formatCurrency(doc.totalSpent),
        lastOrder: lastOrderText,
        status: doc.status
      };
    });

    res.status(200).json({
      success: true,
      data: {
        customers: formattedCustomers,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * POST /api/seller/customers
 * Add a new customer to CRM
 */
exports.createCustomer = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const { name, phone, email, address, type } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Tên và Số điện thoại là bắt buộc' });
    }

    const newCustomer = new SellerCustomer({
      sellerId,
      name,
      phone,
      email,
      address,
      type: type || 'Individual' // fallback
    });

    await newCustomer.save();

    res.status(201).json({
      success: true,
      message: 'Đã thêm khách hàng',
      data: newCustomer
    });

  } catch (error) {
    console.error('Error creating customer:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Số điện thoại này đã tồn tại trong danh bạ của bạn' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Helper function
function formatCurrency(amount) {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + 'K';
  }
  return amount + 'đ';
}
