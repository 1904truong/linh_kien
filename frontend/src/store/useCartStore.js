import { create } from 'zustand';
import api from '@/lib/api';

const useCartStore = create((set, get) => ({
  items: [],
  hydrated: false,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/cart');
      if (response.data.success) {
        const backendItems = response.data.cart.items
          .filter(item => item.productId) // Skip items with null productId
          .map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.salePrice || item.productId.price,
            image: item.productId.image || '/images/placeholder.png',
            brand: item.productId.brand,
            quantity: item.quantity
          }));
        
        // Ensure uniqueness on frontend as a safeguard
        const uniqueItems = [];
        const seenIds = new Set();
        backendItems.forEach(item => {
          if (!seenIds.has(item.productId)) {
            uniqueItems.push(item);
            seenIds.add(item.productId);
          }
        });
        
        set({ items: uniqueItems, hydrated: true });
      }
    } catch (error) {
      console.error('Fetch Cart Error:', error);
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (product, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', { 
        productId: product._id || product.productId, 
        quantity 
      });
      if (response.data.success) {
        await get().fetchCart();
      }
    } catch (error) {
      console.error('Add to Cart Error:', error);
    }
  },

  removeFromCart: async (productId) => {
    try {
      const response = await api.delete('/cart/remove', { 
        data: { productId } 
      });
      if (response.data.success) {
        await get().fetchCart();
      }
    } catch (error) {
      console.error('Remove from Cart Error:', error);
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity < 1) return;
    const currentItem = get().items.find(i => i.productId === productId);
    if (!currentItem) return;
    
    const diff = quantity - currentItem.quantity;
    
    try {
      if (diff > 0) {
        await get().addToCart({ _id: productId }, diff);
      } else if (diff < 0) {
        await get().removeFromCart(productId, Math.abs(diff));
      }
    } catch (error) {
      console.error('Update Quantity Error:', error);
    }
  },

  createOrder: async (shippingAddress) => {
    try {
      const response = await api.post('/orders', { shippingAddress });
      if (response.data.success) {
        set({ items: [] }); // Clear local items
        return response.data;
      }
    } catch (error) {
      console.error('Create Order Error:', error);
      throw error;
    }
  },

  clearCart: () => set({ items: [] }), // Logic to clear on backend can be added if needed

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
  
  setHydrated: (val) => set({ hydrated: val })
}));

export default useCartStore;
