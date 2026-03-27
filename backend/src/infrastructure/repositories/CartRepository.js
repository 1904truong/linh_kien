const Cart = require('../database/models/Cart');

class CartRepository {
  async findByUserId(userId) {
    return await Cart.findOne({ userId }).populate('items.productId');
  }

  async create(userId) {
    const cart = new Cart({ userId, items: [] });
    return await cart.save();
  }

  async update(cart) {
    return await cart.save();
  }

  async findByUserIdOrCreate(userId) {
    let cart = await this.findByUserId(userId);
    if (!cart) {
      cart = await this.create(userId);
    }
    return cart;
  }
}

module.exports = new CartRepository();
