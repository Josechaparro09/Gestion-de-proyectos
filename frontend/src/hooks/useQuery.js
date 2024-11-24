import { useCallback } from 'react';
import { useQuery as useReactQuery, useMutation } from '@tanstack/react-query';
import { useNotificationStore } from '../store/notificationStore';

export const useQuery = (key, fetcher, options = {}) => {
  const addNotification = useNotificationStore((state) => state.addNotification);

  const onError = useCallback((error) => {
    addNotification({
      type: 'error',
      title: 'Error',
      message: error.response?.data?.error || error.message,
    });
  }, [addNotification]);

  return useReactQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: fetcher,
    onError,
    ...options,
  });
};

export const useMutate = (mutationFn, options = {}) => {
  const addNotification = useNotificationStore((state) => state.addNotification);

  const onError = useCallback((error) => {
    addNotification({
      type: 'error',
      title: 'Error',
      message: error.response?.data?.error || error.message,
    });
  }, [addNotification]);

  const onSuccess = useCallback(() => {
    if (options.successMessage) {
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: options.successMessage,
      });
    }
  }, [addNotification, options.successMessage]);

  return useMutation(mutationFn, {
    onError,
    onSuccess,
    ...options,
  });
};