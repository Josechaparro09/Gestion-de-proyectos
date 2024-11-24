import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        id: Date.now(),
        duration: 5000,
        ...notification,
      },
    ],
  })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    })),
}));
