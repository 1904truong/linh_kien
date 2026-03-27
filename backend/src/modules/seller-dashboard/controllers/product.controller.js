const Product = require('../../../infrastructure/database/models/Product');
const mongoose = require('mongoose');

/**
 * GET /api/seller/products
 * Get product list with pagination, search (name, SKU), and status filter
 */
exports.getProducts = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const { page = 1, limit = 10, search, status } = req.query;

    const query = { sellerId: new mongoose.Types.ObjectId(sellerId) };

    // 1. Search Logic
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { oemCode: { $regex: search, $options: 'i' } } // using oemCode for SKU searching
      ];
    }

    // 2. Filter Logic
    if (status && status !== 'Tất cả' && status !== 'all') {
      // old statuses: active, pending, rejected, hidden
      // frontend mapped statuses: Hiển thị (Công khai) -> active, Ẩn (Chờ duyệt) -> pending, etc.
      // Assuming frontend sends the exact backend ENUM or something mappable. We use it directly.
      query.status = status;
    }

    // 3. Pagination Logic
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute queries concurrently
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    // Frontend expects { products: [...], pagination: { total, page, pages } }
    res.status(200).json({
      products,
      pagination: {
        total,
        page: pageNum,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/seller/products
 * Create a new product. Default status is 'pending', or derived from stock.
 */
exports.createProduct = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const payload = req.body;

    // Map payload from our specialized frontend to the global Product model
    const productData = {
      name: payload.name,
      oemCode: payload.SKU, // Map SKU to oemCode
      price: payload.price,
      inventory: payload.stock, // Map stock to inventory
      safetyStock: payload.lowStockThreshold, // Map lowStockThreshold to safetyStock
      description: payload.description,
      category: payload.category || 'Dụng cụ sửa chữa',
      brand: payload.brand || 'Khác',
      sellerId: sellerId,
      images: payload.images || []
    };
    
    // Status Logic
    if (productData.inventory === 0) {
      productData.status = 'hidden'; 
    } else {
      productData.status = 'pending'; // Default for new products requiring approval
    }

    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mã OEM / SKU này đã tồn tại trên một sản phẩm khác. Vui lòng kiểm tra lại.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * PUT /api/seller/products/:id
 * Update an existing product.
 */
exports.updateProduct = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const { id } = req.params;
    const updateData = req.body;

    // Prevent sellerId modification
    delete updateData.sellerId;
    delete updateData.shopId;

    // Handle mapping if frontend sends SKU/stock
    if (updateData.SKU !== undefined) { updateData.oemCode = updateData.SKU; delete updateData.SKU; }
    if (updateData.stock !== undefined) { updateData.inventory = updateData.stock; delete updateData.stock; }
    if (updateData.lowStockThreshold !== undefined) { updateData.safetyStock = updateData.lowStockThreshold; delete updateData.lowStockThreshold; }

    // Business Logic: If inventory is updated to 0, status must be hidden
    if (updateData.inventory !== undefined) {
      if (updateData.inventory === 0) {
        updateData.status = 'hidden';
      } else if (updateData.status === 'hidden' && updateData.inventory > 0) {
        updateData.status = 'active'; 
      }
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, sellerId: sellerId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mã OEM / SKU đã tồn tại.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * DELETE /api/seller/products/:id
 * Delete a product.
 */
exports.deleteProduct = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const { id } = req.params;

    const deletedProduct = await Product.findOneAndDelete({ _id: id, sellerId: sellerId });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PATCH /api/seller/products/:id/stock
 * Quick update stock quantity.
 */
exports.updateStock = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const { id } = req.params;
    const { stock, inventory } = req.body;
    
    const newStock = stock !== undefined ? stock : inventory;

    if (newStock === undefined || newStock < 0) {
      return res.status(400).json({ message: 'Invalid stock value' });
    }

    let targetStatus = undefined;
    if (newStock === 0) {
      targetStatus = 'hidden';
    } else {
      const currentProduct = await Product.findOne({ _id: id, sellerId });
      if (currentProduct && currentProduct.status === 'hidden') {
        targetStatus = 'active'; 
      }
    }

    const updateObj = { inventory: newStock };
    if (targetStatus) {
      updateObj.status = targetStatus;
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, sellerId: sellerId },
      { $set: updateObj },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
