import { LoginForm } from '../../components/auth/LoginForm';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoginForm />
      <div className="text-center mt-4">
        <Link to="/register" className="text-blue-600 hover:text-blue-800">
          ¿No tienes una cuenta? Regístrate
        </Link>
      </div>
    </div>
  );
};