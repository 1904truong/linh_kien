const Product = require('../../infrastructure/database/models/Product');
const getFilteredProducts = require('../../core/use-cases/GetFilteredProducts');
const getProductByIdUseCase = require('../../core/use-cases/GetProductById');

class ProductController {
  async getProducts(req, res) {
    try {
      const result = await getFilteredProducts.execute(req.query);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`Controller Error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error'
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const result = await getProductByIdUseCase.execute(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`Controller Error: ${error.message}`);
      const status = error.message.includes('not found') ? 404 : 
                     error.message.includes('Invalid') ? 400 : 500;
      return res.status(status).json({
        success: false,
        message: error.message || 'Internal Server Error'
      });
    }
  }

  // Admin Approval System
  async getPendingProducts(req, res) {
    try {
      const products = await Product.find({ status: 'pending' }).populate('sellerId', 'name email shopName');
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async approveProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndUpdate(
        id,
        { $set: { status: 'active' } },
        { new: true }
      );
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async rejectProduct(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const product = await Product.findByIdAndUpdate(
        id,
        { $set: { status: 'rejected', rejectionReason: reason } },
        { new: true }
      );
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();
