const cartRepository = require('../../infrastructure/repositories/CartRepository');

class GetCart {
  async execute(userId) {
    try {
      const cart = await cartRepository.findByUserIdOrCreate(userId);
      return {
        success: true,
        cart
      };
    } catch (error) {
      throw new Error(`GetCart Use-Case Error: ${error.message}`);
    }
  }
}

module.exports = new GetCart();
