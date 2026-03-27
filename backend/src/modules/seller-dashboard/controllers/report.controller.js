const Order = require('../../../infrastructure/database/models/Order');
const Product = require('../../../infrastructure/database/models/Product');
const mongoose = require('mongoose');

/**
 * GET /api/seller/reports
 * Returns comprehensive analytics for the seller.
 */
const getReports = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
    
    // Default to last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    // Previous period for comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - 30);
    const prevEndDate = new Date(startDate);

    const reports = await Order.aggregate([
      { 
        $match: { 
          'items.sellerId': sellerObjectId,
          createdAt: { $gte: prevStartDate, $lte: endDate },
          status: 'delivered' 
        } 
      },
      { $unwind: '$items' },
      { $match: { 'items.sellerId': sellerObjectId } },
      {
        $facet: {
          // 1. Summary Metrics (Current vs Previous)
          summary: [
            {
              $group: {
                _id: {
                  isCurrent: { $gte: ['$createdAt', startDate] }
                },
                revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                count: { $sum: 1 },
                itemsCount: { $sum: '$items.quantity' }
              }
            }
          ],
          // 2. Growth Chart (By Day)
          growth: [
            { $match: { createdAt: { $gte: startDate } } },
            {
              $group: {
                _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
                revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                sortDate: { $first: "$createdAt" }
              }
            },
            { $sort: { sortDate: 1 } }
          ],
          // 3. Category Breakdown
          categories: [
             { $match: { createdAt: { $gte: startDate } } },
             {
               $lookup: {
                 from: 'products',
                 localField: 'items.productId',
                 foreignField: '_id',
                 as: 'productInfo'
               }
             },
             { $unwind: '$productInfo' },
             {
               $group: {
                 _id: '$productInfo.category',
                 revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
               }
             },
             { $sort: { revenue: -1 } }
          ],
          // 4. Top Products
          topProducts: [
            { $match: { createdAt: { $gte: startDate } } },
            {
              $group: {
                _id: '$items.productId',
                name: { $first: '$items.name' },
                sold: { $sum: '$items.quantity' },
                revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
              }
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 }
          ]
        }
      }
    ]);

    const data = reports[0];
    
    // Process Summary
    const currentSummary = data.summary.find(s => s._id.isCurrent) || { revenue: 0, count: 0, itemsCount: 0 };
    const prevSummary = data.summary.find(s => !s._id.isCurrent) || { revenue: 0, count: 0, itemsCount: 0 };

    const revenueTrend = prevSummary.revenue > 0 
      ? ((currentSummary.revenue - prevSummary.revenue) / prevSummary.revenue * 100).toFixed(1)
      : '+100';

    const aov = currentSummary.count > 0 ? (currentSummary.revenue / currentSummary.count) : 0;
    const prevAov = prevSummary.count > 0 ? (prevSummary.revenue / prevSummary.count) : 0;
    const aovTrend = prevAov > 0 
      ? ((aov - prevAov) / prevAov * 100).toFixed(1)
      : '+0';

    // Simple profit simulation (25%) since we don't have costPrice yet
    const profit = currentSummary.revenue * 0.25;
    const prevProfit = prevSummary.revenue * 0.25;
    const profitTrend = revenueTrend;

    res.status(200).json({
      success: true,
      summary: [
        { title: 'Tổng doanh thu', value: currentSummary.revenue, trend: `${revenueTrend > 0 ? '+' : ''}${revenueTrend}%`, icon: 'Wallet', color: 'blue' },
        { title: 'Lợi nhuận gộp', value: profit, trend: `${profitTrend > 0 ? '+' : ''}${profitTrend}%`, icon: 'TrendingUp', color: 'emerald' },
        { title: 'Giá trị TB đơn', value: aov, trend: `${aovTrend > 0 ? '+' : ''}${aovTrend}%`, icon: 'BarChart3', color: 'purple' },
        { title: 'Tỷ lệ hoàn hàng', value: 0.8, trend: '-0.2%', icon: 'TrendingDown', color: 'rose' }, // Mocking return rate for now
      ],
      growth: data.growth,
      categories: data.categories.map(c => ({
        label: c._id,
        revenue: c.revenue,
        percent: currentSummary.revenue > 0 ? Math.round((c.revenue / currentSummary.revenue) * 100) : 0
      })),
      topProducts: data.topProducts.map(p => ({
        ...p,
        profit: p.revenue * 0.25,
        trend: 'up'
      }))
    });

  } catch (error) {
    console.error('Reports Controller Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getReports
};
