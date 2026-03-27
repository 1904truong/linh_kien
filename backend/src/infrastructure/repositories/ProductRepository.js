const Product = require('../database/models/Product');

class ProductRepository {
  async findFiltered(filters, pagination, sorting) {
    const { 
      brand, 
      model, 
      year, 
      oemCode, 
      category, 
      minPrice, 
      maxPrice 
    } = filters;

    const { page = 1, limit = 10 } = pagination;
    const { sortBy = 'createdAt', sortOrder = 'desc' } = sorting;

    const query = {};

    // Filtering by compatibility
    if (brand || model || year) {
      const compatibilityQuery = {};
      if (brand) compatibilityQuery['compatibility.brand'] = new RegExp(brand, 'i');
      if (model) compatibilityQuery['compatibility.model'] = new RegExp(model, 'i');
      if (year) compatibilityQuery['compatibility.year'] = Number(year);
      
      query['compatibility'] = { $elemMatch: compatibilityQuery };
    }

    // Filtering by OEM code
    if (oemCode) {
      query.oemCode = new RegExp(oemCode, 'i');
    }

    // Filtering by category
    if (category) {
      query.category = new RegExp(category, 'i');
    }

    // Filtering by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filtering by inventory status
    if (filters.inventoryType) {
      if (filters.inventoryType === 'low') {
        // Find products where inventory <= safetyStock
        query.$expr = { $lte: ['$inventory', '$safetyStock'] };
        query.inventory = { $gt: 0 }; // Still has stock but low
      } else if (filters.inventoryType === 'out') {
        query.inventory = { $lte: 0 };
      }
    }

    if (filters.name) {
      query.name = new RegExp(filters.name, 'i');
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    try {
      const [products, total] = await Promise.all([
        Product.find(query)
          .sort(sort)
          .skip(skip)
          .limit(Number(limit)),
        Product.countDocuments(query)
      ]);

      return {
        products,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / (limit || 1))
      };
    } catch (error) {
      throw new Error(`Error in ProductRepository: ${error.message}`);
    }
  }

  async getInventoryStats() {
    try {
      const [total, lowStock, outOfStock] = await Promise.all([
        Product.countDocuments({}),
        Product.countDocuments({ $expr: { $lte: ['$inventory', '$safetyStock'] }, inventory: { $gt: 0 } }),
        Product.countDocuments({ inventory: { $lte: 0 } })
      ]);

      return {
        totalProducts: total,
        lowStock,
        outOfStock
      };
    } catch (error) {
      throw new Error(`Error fetching inventory stats: ${error.message}`);
    }
  }

  async create(productData) {
    return await Product.create(productData);
  }

  async findByOemCode(oemCode) {
    return await Product.findOne({ oemCode });
  }

  async findById(id) {
    return await Product.findById(id);
  }
}

module.exports = new ProductRepository();
