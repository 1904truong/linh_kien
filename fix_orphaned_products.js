const mongoose = require('mongoose');
const path = require('path');

// Models
const User = require('./backend/src/infrastructure/database/models/User');
const Product = require('./backend/src/infrastructure/database/models/Product');
const Order = require('./backend/src/infrastructure/database/models/Order');

async function fix() {
  try {
    // Manually specify URI or read from .env if possible
    await mongoose.connect('mongodb://localhost:27017/project_lk');
    
    // 1. Find the seller
    const seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log('No seller found in database.');
      return;
    }

    console.log(`Using Seller ID: ${seller._id} (${seller.name})`);

    // 2. Fix Products
    const pResult = await Product.updateMany(
      { sellerId: { $exists: false } },
      { $set: { sellerId: seller._id } }
    );
    console.log(`Updated ${pResult.modifiedCount} products with missing sellerId.`);

    // 3. Fix Orders (Items with null sellerId)
    // Note: Items is an array. We need to update elements.
    const orders = await Order.find({ 'items.sellerId': { $in: [null, undefined] } });
    let ordersFixed = 0;
    for (const order of orders) {
      let changed = false;
      order.items.forEach(item => {
        if (!item.sellerId) {
          item.sellerId = seller._id;
          changed = true;
        }
      });
      if (changed) {
        await order.save();
        ordersFixed++;
      }
    }
    console.log(`Updated ${ordersFixed} orders with missing sellerId in items.`);

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

fix();
