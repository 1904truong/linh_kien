const Product = require('../../infrastructure/database/models/Product');
const Order = require('../../infrastructure/database/models/Order');
const mongoose = require('mongoose');

class SellerController {
  async getDashboardStats(req, res) {
    try {
      const sellerId = req.user.userId;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. Total Orders Today
      const totalOrdersToday = await Order.countDocuments({
        'items.sellerId': sellerId,
        createdAt: { $gte: today }
      });

      // 2. Revenue Today (Aggregating delivered items)
      const revenueData = await Order.aggregate([
        { $match: { 'items.sellerId': new mongoose.Types.ObjectId(sellerId), createdAt: { $gte: today }, status: 'delivered' } },
        { $unwind: '$items' },
        { $match: { 'items.sellerId': new mongoose.Types.ObjectId(sellerId) } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
      ]);
      const revenueToday = revenueData.length > 0 ? revenueData[0].total : 0;

      // 3. Low Stock Products (inventory < 5)
      const lowStockProducts = await Product.countDocuments({
        sellerId: sellerId,
        inventory: { $lt: 5 }
      });

      // 4. Pending Products
      const pendingProducts = await Product.countDocuments({
        sellerId: sellerId,
        status: 'pending'
      });

      // 5. Weekly Revenue (Last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const weeklyRevenue = await Order.aggregate([
        { 
          $match: { 
            'items.sellerId': new mongoose.Types.ObjectId(sellerId), 
            createdAt: { $gte: sevenDaysAgo },
            status: 'delivered'
          } 
        },
        { $unwind: '$items' },
        { $match: { 'items.sellerId': new mongoose.Types.ObjectId(sellerId) } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        { $sort: { '_id': 1 } }
      ]);

      res.json({
        totalOrdersToday,
        revenueToday,
        lowStockProducts,
        pendingProducts,
        weeklyRevenue
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // OLD getStats kept for backward compatibility if needed, but updated to use new logic
  async getStats(req, res) {
    return this.getDashboardStats(req, res);
  }

  async getProducts(req, res) {
    try {
      const sellerId = req.user.userId;
      const { search, status, page = 1, limit = 10 } = req.query;
      let query = { sellerId };
      
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }
      if (status) {
        query.status = status;
      }

      const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
        
      const total = await Product.countDocuments(query);

      res.json({
        products,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const sellerId = req.user.userId;
      const product = new Product({
        ...req.body,
        sellerId,
        status: 'pending' // Force pending status for approval system
      });
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const sellerId = req.user.userId;
      const product = await Product.findOneAndUpdate(
        { _id: id, sellerId },
        { $set: req.body },
        { new: true }
      );
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const sellerId = req.user.userId;
      const product = await Product.findOneAndDelete({ _id: id, sellerId });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrders(req, res) {
    try {
      const sellerId = req.user.userId;
      const { status, page = 1, limit = 10 } = req.query;
      
      let query = { 'items.sellerId': sellerId };
      if (status) {
        query.status = status;
      }

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      
      const total = await Order.countDocuments(query);

      const sellerOrders = orders.map(order => {
        const items = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
        return {
          ...order.toObject(),
          items
        };
      });

      res.json({
        orders: sellerOrders,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const sellerId = req.user.userId;

      // In a real system, you might update individual items if needed, 
      // but here we update the whole order status if the seller owns items in it.
      const order = await Order.findOneAndUpdate(
        { _id: id, 'items.sellerId': sellerId },
        { $set: { status } },
        { new: true }
      );

      if (!order) return res.status(404).json({ message: 'Order not found or access denied' });
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrderDetails(req, res) {
    try {
      const { id } = req.params;
      const sellerId = req.user.userId;
      const order = await Order.findOne({ _id: id, 'items.sellerId': sellerId });
      if (!order) return res.status(404).json({ message: 'Order not found' });
      
      const result = order.toObject();
      result.items = result.items.filter(item => item.sellerId.toString() === sellerId.toString());
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getLowStockProducts(req, res) {
    try {
      const sellerId = req.user.userId;
      const products = await Product.find({
        sellerId,
        inventory: { $lt: 5 }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getPendingProducts(req, res) {
    try {
      // Typically for Admin, but if Seller wants to see their own pending products:
      const sellerId = req.user.userId;
      const products = await Product.find({ sellerId, status: 'pending' });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSuppliers(req, res) {
    try {
      const Supplier = require('../../infrastructure/database/models/Supplier');
      const suppliers = await Supplier.find({ status: 'approved' });
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const sellerId = req.user.userId;
      const User = require('../../infrastructure/database/models/User');
      const updatedUser = await User.findByIdAndUpdate(
        sellerId,
        { $set: req.body },
        { new: true }
      ).select('-password');
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new SellerController();
