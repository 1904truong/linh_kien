import { create } from 'zustand';
import api from '../lib/api';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/notifications');
      if (response.data.success) {
        const notis = response.data.notifications;
        set({ 
          notifications: notis, 
          unreadCount: notis.filter(n => !n.isRead).length,
          loading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      const updatedNotis = get().notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      );
      set({ 
        notifications: updatedNotis,
        unreadCount: updatedNotis.filter(n => !n.isRead).length
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.patch('/notifications/read-all');
      const updatedNotis = get().notifications.map(n => ({ ...n, isRead: true }));
      set({ 
        notifications: updatedNotis,
        unreadCount: 0
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }
}));

export default useNotificationStore;
