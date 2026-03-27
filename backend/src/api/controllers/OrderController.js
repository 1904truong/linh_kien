const createOrderUseCase = require('../../core/use-cases/CreateOrder');
const getOrderHistoryUseCase = require('../../core/use-cases/GetOrderHistory');

// Using Auth Middleware for userId

class OrderController {
  async createOrder(req, res) {
    try {
      const { shippingAddress } = req.body;
      const result = await createOrderUseCase.execute(req.user.userId, shippingAddress);
      return res.status(201).json(result);
    } catch (error) {
      console.error(`OrderController Error:`, error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getOrders(req, res) {
    try {
      const result = await getOrderHistoryUseCase.execute(req.user.userId);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`OrderController Error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new OrderController();
