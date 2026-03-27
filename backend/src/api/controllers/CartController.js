const getCartUseCase = require('../../core/use-cases/GetCart');
const addToCartUseCase = require('../../core/use-cases/AddToCart');
const removeFromCartUseCase = require('../../core/use-cases/RemoveFromCart');

// Temporary ID removed, using Auth Middleware

class CartController {
  async getCart(req, res) {
    try {
      const result = await getCartUseCase.execute(req.user.userId);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`CartController Error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async addItem(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;
      if (!productId) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
      }
      
      const result = await addToCartUseCase.execute(req.user.userId, productId, quantity);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`CartController Error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async removeItem(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;
      if (!productId) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
      }

      const result = await removeFromCartUseCase.execute(req.user.userId, productId, quantity);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`CartController Error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new CartController();
