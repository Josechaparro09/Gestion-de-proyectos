// src/hooks/useAuth.js
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useNotificationStore } from '../store/notificationStore';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const addNotification = useNotificationStore((state) => state.addNotification);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  const handleLogin = async (credentials) => {
    try {
      await context.login(credentials.email, credentials.password);
      addNotification({
        type: 'success',
        title: 'Bienvenido',
        message: 'Has iniciado sesión correctamente',
      });
      navigate('/dashboard');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error de autenticación',
        message: error.response?.data?.error || 'Credenciales inválidas',
      });
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      await context.register(userData);
      addNotification({
        type: 'success',
        title: 'Registro exitoso',
        message: 'Tu cuenta ha sido creada correctamente',
      });
      navigate('/dashboard');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error de registro',
        message: error.response?.data?.error || 'Error al crear la cuenta',
      });
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await context.logout();
      addNotification({
        type: 'info',
        title: 'Sesión cerrada',
        message: 'Has cerrado sesión correctamente',
      });
      navigate('/login');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al cerrar sesión',
      });
      throw error;
    }
  };

  return {
    ...context,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};