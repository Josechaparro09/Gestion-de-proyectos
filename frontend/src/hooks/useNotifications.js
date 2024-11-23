import { useState, useCallback, useEffect } from 'react';
import api from '../utils/axios';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/notifications/user/${user.uid}`);
      setNotifications(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar las notificaciones');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      setLoading(true);
      setError(null);
      await api.post(`/notifications/${notificationId}/read`, {
        userId: user.uid
      });
      await fetchNotifications();
    } catch (err) {
      setError(err.message);
      toast.error('Error al marcar la notificación como leída');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, fetchNotifications]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  return {
    loading,
    error,
    notifications,
    fetchNotifications,
    markAsRead
  };
};