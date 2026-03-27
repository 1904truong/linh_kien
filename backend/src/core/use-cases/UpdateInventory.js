const productRepository = require('../../infrastructure/repositories/ProductRepository');

class UpdateInventory {
  async execute(productId, updateData) {
    const { inventory, safetyStock } = updateData;

    try {
      const product = await productRepository.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (inventory !== undefined) product.inventory = inventory;
      if (safetyStock !== undefined) product.safetyStock = safetyStock;

      await product.save();

      return {
        success: true,
        message: 'Inventory updated successfully',
        product
      };
    } catch (error) {
      throw new Error(`Business Logic Error: ${error.message}`);
    }
  }
}

module.exports = new UpdateInventory();
