import { RegisterForm } from '../../components/auth/RegisterForm';
import { Link } from 'react-router-dom';

export const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <RegisterForm />
      <div className="text-center mt-4">
        <Link to="/login" className="text-blue-600 hover:text-blue-800">
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
      </div>
    </div>
  );
};