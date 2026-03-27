const productRepository = require('../../infrastructure/repositories/ProductRepository');

class GetInventoryStatus {
  async execute(queryParams) {
    const {
      searchTerm,
      filter, // 'all', 'low', 'out'
      category,
      page = 1,
      limit = 10
    } = queryParams;

    try {
      // 1. Fetch statistics
      const stats = await productRepository.getInventoryStats();
      
      // 2. Fetch products with inventory data
      const filters = {
        name: searchTerm,
        category: category && category !== 'all' ? category : undefined,
        inventoryType: filter !== 'all' ? filter : undefined
      };

      const result = await productRepository.findFiltered(filters, { page, limit }, { sortBy: 'inventory', sortOrder: 'asc' });

      return {
        success: true,
        stats,
        products: result.products,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages
        }
      };
    } catch (error) {
      throw new Error(`Business Logic Error: ${error.message}`);
    }
  }
}

module.exports = new GetInventoryStatus();
