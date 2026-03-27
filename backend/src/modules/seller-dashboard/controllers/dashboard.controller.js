const Product = require('../../../infrastructure/database/models/Product');
const Order = require('../../../infrastructure/database/models/Order');
const mongoose = require('mongoose');

/**
 * GET /api/seller/dashboard
 * Returns aggregated statistics for the seller dashboard.
 * Filtered by sellerId from the authenticated token.
 */
const getDashboardData = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
    
    // Calculate the start of today for time-based metrics
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    /**
     * BUSINESS LOGIC 1 & 2: Today's performance
     */
    const ordersToday = await Order.countDocuments({
      'items.sellerId': sellerObjectId,
      createdAt: { $gte: startOfToday }
    });

    const revenueData = await Order.aggregate([
      { 
        $match: { 
          'items.sellerId': sellerObjectId, 
          createdAt: { $gte: startOfToday }, 
          status: 'delivered' 
        } 
      },
      { $unwind: '$items' },
      { $match: { 'items.sellerId': sellerObjectId } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
    ]);

    const revenueToday = revenueData.length > 0 ? revenueData[0].total : 0;

    /**
     * BUSINESS LOGIC 3: Low stock alerts
     */
    const lowStockQuery = {
      sellerId: sellerObjectId,
      $expr: { $lte: ["$inventory", "$safetyStock"] }
    };

    const [lowStockCount, lowStockProducts] = await Promise.all([
      Product.countDocuments(lowStockQuery),
      Product.find(lowStockQuery)
        .select('name oemCode inventory safetyStock status')
        .limit(10) // Showing only top 10 for the dashboard overview
    ]);

    /**
     * BUSINESS LOGIC 4: Inventory Management
     */
    const pendingProducts = await Product.countDocuments({
      sellerId: sellerObjectId,
      status: 'pending'
    });

    /**
     * BUSINESS LOGIC 4.1: Weekly Revenue Chart
     */
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyRevenue = await Order.aggregate([
      { 
        $match: { 
          'items.sellerId': sellerObjectId, 
          createdAt: { $gte: sevenDaysAgo },
          status: 'delivered'
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" } // Simplified total price for dashboard
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    /**
     * BUSINESS LOGIC 5: Recent Activity
     */
    const recentOrders = await Order.find({ 'items.sellerId': sellerObjectId })
      .select('_id totalPrice status createdAt userId')
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Format recentOrders for frontend
    const recentOrdersMapped = recentOrders.map(o => ({
      ...o.toObject(),
      orderCode: o._id.toString().substring(18, 24).toUpperCase(),
      buyerName: o.userId?.name || 'Khách vãng lai'
    }));

    // Final response object
    res.status(200).json({
      totalOrdersToday: ordersToday,
      revenueToday,
      lowStockProducts: lowStockCount, // frontend expects this for the card value
      pendingProducts,
      recentOrders: recentOrdersMapped,
      weeklyRevenue,
      lowStockDetails: lowStockProducts.map(p => ({
        ...p.toObject(),
        SKU: p.oemCode,
        stock: p.inventory,
        lowStockThreshold: p.safetyStock
      }))
    });

  } catch (error) {
    console.error('Dashboard Controller Error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve dashboard data. Please try again later.', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getDashboardData
};
