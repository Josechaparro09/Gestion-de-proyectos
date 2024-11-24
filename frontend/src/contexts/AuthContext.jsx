// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth.api';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axiosInstance from '../api/axios.config';

// Exportar el contexto
export const AuthContext = createContext({});

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('token', token);
          // Obtener datos del usuario de nuestro backend
          const { data } = await axiosInstance.get(`/users/${firebaseUser.uid}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(data);
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const login = async (email, password) => {
    try {
      const { user: userData, token } = await authApi.login(email, password);
      setUser(userData);
      localStorage.setItem('token', token);
      return userData;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { user: newUser, token } = await authApi.register(userData);
      setUser(newUser);
      localStorage.setItem('token', token);
      return newUser;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    // Puedes crear un componente de loading más elaborado
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}