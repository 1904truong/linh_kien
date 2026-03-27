const productRepository = require('../../infrastructure/repositories/ProductRepository');

class GetProductById {
  async execute(id) {
    if (!id) {
      throw new Error('Product ID is required');
    }

    try {
      const product = await productRepository.findById(id);
      
      if (!product) {
        throw new Error('Product not found');
      }

      return {
        success: true,
        product
      };
    } catch (error) {
      if (error.name === 'CastError') {
         throw new Error('Invalid Product ID format');
      }
      throw new Error(`GetProductById Use-Case Error: ${error.message}`);
    }
  }
}

module.exports = new GetProductById();
