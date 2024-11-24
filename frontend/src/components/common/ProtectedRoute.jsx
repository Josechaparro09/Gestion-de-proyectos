import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // Puedes crear un componente de loading más elaborado
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};