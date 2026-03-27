const orderRepository = require('../../infrastructure/repositories/OrderRepository');

class GetOrderHistory {
  async execute(userId) {
    try {
      const orders = await orderRepository.findByUserId(userId);
      return {
        success: true,
        orders
      };
    } catch (error) {
      throw new Error(`GetOrderHistory Use-Case Error: ${error.message}`);
    }
  }
}

module.exports = new GetOrderHistory();
