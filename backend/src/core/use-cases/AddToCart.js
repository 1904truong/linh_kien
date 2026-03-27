const cartRepository = require('../../infrastructure/repositories/CartRepository');

class AddToCart {
  async execute(userId, productId, quantity) {
    try {
      const cart = await cartRepository.findByUserIdOrCreate(userId);
      
      const itemIndex = cart.items.findIndex(item => {
        const itemPid = item.productId._id ? item.productId._id.toString() : item.productId.toString();
        return itemPid === productId;
      });
      
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      
      await cartRepository.update(cart);
      
      // Return populated cart
      return {
        success: true,
        cart: await cartRepository.findByUserId(userId)
      };
    } catch (error) {
      throw new Error(`AddToCart Use-Case Error: ${error.message}`);
    }
  }
}

module.exports = new AddToCart();
