const orderRepository = require('../../infrastructure/repositories/OrderRepository');
const cartRepository = require('../../infrastructure/repositories/CartRepository');
const User = require('../../infrastructure/database/models/User');
const SellerCustomer = require('../../infrastructure/database/models/SellerCustomer');
const Notification = require('../../infrastructure/database/models/Notification');
const fs = require('fs');
const path = require('path');

class CreateOrder {
  async execute(userId, shippingAddress) {
    try {
      const cart = await cartRepository.findByUserId(userId);
      
      if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }
      
      const buyer = await User.findById(userId);
      if (!buyer) throw new Error('User not found');

      let totalPrice = 0;
      const sellerTotals = {}; // Tracks spent amount per seller for CRM sync

      const orderItems = [];
      for (const item of cart.items) {
        if (!item.productId) continue;

        const itemPrice = item.productId.price || 0;
        const qty = item.quantity || 0;
        // Fallback for sellerId if missing from legacy product
        const sId = item.productId.sellerId || null;
        
        totalPrice += itemPrice * qty;
        
        if (sId) {
          const sIdStr = sId.toString();
          sellerTotals[sIdStr] = (sellerTotals[sIdStr] || 0) + (itemPrice * qty);
        }

        orderItems.push({
          productId: item.productId._id,
          name: item.productId.name,
          price: itemPrice,
          quantity: qty,
          sellerId: sId
        });
      }

      if (orderItems.length === 0) {
        throw new Error('Giỏ hàng không có sản phẩm hợp lệ.');
      }
      
      const orderData = {
        userId,
        items: orderItems,
        totalPrice,
        shippingAddress
      };
      
      const order = await orderRepository.create(orderData);
      
      // Create notification for buyer
      await Notification.create({
        userId,
        type: 'order',
        title: 'Đặt hàng thành công',
        message: `Đơn hàng #${order._id.toString().substring(0,8)} đã được tạo thành công và đang chờ xác nhận.`,
        orderId: order._id
      });
      
      // CRM Synchronization Hook
      const phoneToUse = buyer.phoneNumber || '0000000000';
      const nameToUse = buyer.name || 'Khách Mua Online';
      const emailToUse = buyer.email || '';
      
      let crmAddress = '';
      if (shippingAddress && shippingAddress.street) {
        crmAddress = `${shippingAddress.street}, ${shippingAddress.city || ''}`.trim();
      } else if (buyer.address) {
        if (typeof buyer.address === 'string') {
          crmAddress = buyer.address;
        } else if (buyer.address.street) {
          crmAddress = `${buyer.address.street}, ${buyer.address.city || ''}`.trim();
        }
      }

      for (const [sId, amountSpent] of Object.entries(sellerTotals)) {
        try {
          await SellerCustomer.findOneAndUpdate(
            { sellerId: sId, phone: phoneToUse },
            {
              $set: {
                name: nameToUse,
                email: emailToUse,
                address: crmAddress,
                type: buyer.role === 'customer' ? 'Individual' : 'Garage',
                systemUserId: buyer._id,
                status: 'Active'
              },
              $inc: {
                totalOrders: 1,
                totalSpent: amountSpent
              },
              $max: {
                lastOrderDate: new Date()
              }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        } catch (err) {
          console.error(`CRM Sync Error:`, err);
        }
      }

      // Clear cart
      cart.items = [];
      await cartRepository.update(cart);
      
      return {
        success: true,
        order
      };
    } catch (error) {
      console.error('CreateOrder Error:', error);
      throw new Error(error.message);
    }
  }
}

module.exports = new CreateOrder();

