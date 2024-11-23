import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Dashboard Pages
import { Dashboard } from './pages/dashboard/Dashboard';
import { Analytics } from './pages/dashboard/Analytics';

// Project Pages
import { ProjectList } from './pages/projects/ProjectList';
import { ProjectDetails } from './pages/projects/ProjectDetails';
import { ProjectForm } from './pages/projects/ProjectForm';

// User Pages
import { UserProfile } from './pages/users/UserProfile';
import { UserList } from './pages/users/UserList';

// Other Pages
import { NotFound } from './pages/NotFound';

export const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/analytics"
        element={
          user?.rol?.includes('ADMIN') || user?.rol?.includes('DIRECTOR') ? (
            <Analytics />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      {/* Rutas de proyectos */}
      <Route path="/projects" element={user ? <ProjectList /> : <Navigate to="/login" />} />
      <Route path="/projects/new" element={user ? <ProjectForm /> : <Navigate to="/login" />} />
      <Route path="/projects/:projectId" element={user ? <ProjectDetails /> : <Navigate to="/login" />} />
      <Route path="/projects/:projectId/edit" element={user ? <ProjectForm /> : <Navigate to="/login" />} />

      {/* Rutas de usuarios */}
      <Route
        path="/users"
        element={
          user?.rol?.includes('ADMIN') ? (
            <UserList />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route path="/profile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
      
      {/* Ruta por defecto */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};