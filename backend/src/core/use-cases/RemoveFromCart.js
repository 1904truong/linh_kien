const cartRepository = require('../../infrastructure/repositories/CartRepository');

class RemoveFromCart {
  async execute(userId, productId, quantity = 1) {
    try {
      const cart = await cartRepository.findByUserIdOrCreate(userId);
      
      const itemIndex = cart.items.findIndex(item => {
        const itemPid = item.productId._id ? item.productId._id.toString() : item.productId.toString();
        return itemPid === productId;
      });
      
      if (itemIndex > -1) {
        if (cart.items[itemIndex].quantity > quantity) {
          cart.items[itemIndex].quantity -= quantity;
        } else {
          cart.items.splice(itemIndex, 1);
        }
        await cartRepository.update(cart);
      }
      
      return {
        success: true,
        cart: await cartRepository.findByUserId(userId)
      };
    } catch (error) {
      throw new Error(`RemoveFromCart Use-Case Error: ${error.message}`);
    }
  }
}

module.exports = new RemoveFromCart();
