// src/routes/index.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import MainLayout from '../layouts/MainLayout';
import Unauthorized from '../components/auth/Unauthorized';

// Importar páginas protegidas
import Dashboard from '../pages/Dashboard';
import ProjectList from '../pages/projects/ProjectList';
import ProjectDetails from '../pages/projects/ProjectDetails';
import CreateProject from '../pages/projects/CreateProject';
import UserProfile from '../pages/profile/UserProfile';

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Rutas protegidas dentro del layout principal */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/:projectId" element={<ProjectDetails />} />
            <Route 
              path="projects/create" 
              element={
                <ProtectedRoute allowedRoles={['DIRECTOR', 'LIDER']}>
                  <CreateProject />
                </ProtectedRoute>
              } 
            />
            
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* Ruta para 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;