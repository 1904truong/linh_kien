const Order = require('../database/models/Order');

class OrderRepository {
  async create(orderData) {
    const order = new Order(orderData);
    return await order.save();
  }

  async findByUserId(userId) {
    return await Order.find({ userId }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Order.findById(id).populate('items.productId');
  }
}

module.exports = new OrderRepository();
