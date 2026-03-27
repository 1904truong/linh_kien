const productRepository = require('../../infrastructure/repositories/ProductRepository');

class GetFilteredProducts {
  async execute(queryParams) {
    const {
      brand,
      model,
      year,
      oemCode,
      category,
      minPrice,
      maxPrice,
      page,
      limit,
      sortBy,
      sortOrder
    } = queryParams;

    // Prepare filters
    const filters = {
      brand,
      model,
      year,
      oemCode,
      category,
      minPrice,
      maxPrice
    };

    // Prepare pagination
    const pagination = {
      page: page || 1,
      limit: limit || 10
    };

    // Prepare sorting
    const sorting = {
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc'
    };

    try {
      // Logic requirement: If brand + model + year provided, filter by compatibility.
      // This is already handled in the repository layer using $elemMatch.
      
      const result = await productRepository.findFiltered(filters, pagination, sorting);
      
      return {
        success: true,
        ...result
      };
    } catch (error) {
      throw new Error(`Business Logic Error: ${error.message}`);
    }
  }
}

module.exports = new GetFilteredProducts();
