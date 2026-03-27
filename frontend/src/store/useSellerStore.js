import { create } from 'zustand';
import api from '../lib/api';

const useSellerStore = create((set, get) => ({
  stats: {
    newOrders: 0,
    lowStockAlert: 0,
    pendingApprovals: 0,
    todayRevenue: 0
  },
  products: [],
  orders: [],
  pagination: {
    products: { total: 0, page: 1, pages: 1 },
    orders: { total: 0, page: 1, pages: 1 }
  },
  suppliers: [],
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/seller/dashboard');
      set({ stats: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchProducts: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await api.get('/seller/products', { params });
      set({ 
        products: response.data.products, 
        pagination: { 
          ...get().pagination, 
          products: response.data.pagination 
        }, 
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchOrders: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await api.get('/seller/orders', { params });
      set({ 
        orders: response.data.orders, 
        pagination: { 
          ...get().pagination, 
          orders: response.data.pagination 
        }, 
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchSuppliers: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await api.get('/seller/sourcing/suppliers', { params });
      set({ suppliers: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteOrder: async (orderId) => {
    set({ loading: true });
    try {
      await api.delete(`/seller/orders/${orderId}`);
      // Refresh orders after deletion
      const currentParams = {}; // You might want to preserve current search/filters
      await get().fetchOrders(currentParams);
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }
}));

export default useSellerStore;
