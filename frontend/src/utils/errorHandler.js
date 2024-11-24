import { useNotificationStore } from '../store/notificationStore';

export const handleError = (error) => {
  const addNotification = useNotificationStore.getState().addNotification;
  
  console.error('Error:', error);

  const errorMessage = error.response?.data?.error || 
                      error.message || 
                      'Ha ocurrido un error inesperado';

  addNotification({
    type: 'error',
    title: 'Error',
    message: errorMessage,
  });

  // Si es un error de autenticación, redirigir al login
  if (error.response?.status === 401) {
    window.location.href = '/login';
  }

  throw error;
};