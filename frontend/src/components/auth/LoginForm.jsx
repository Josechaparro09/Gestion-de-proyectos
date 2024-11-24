// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Cambiado el import
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Alert } from '../common/Alert';

export const LoginForm = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      setError('');
      await handleLogin(data);
    } catch (error) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta para gestionar tus proyectos
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <Alert type="error" message={error} />
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              id="email"
              type="email"
              label="Correo electrónico"
              placeholder="ejemplo@correo.com"
              {...register('email', { 
                required: 'El correo electrónico es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo electrónico inválido'
                }
              })}
              error={errors.email?.message}
            />

            <Input
              id="password"
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              {...register('password', { 
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              })}
              error={errors.password?.message}
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a 
                href="/forgot-password" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="text-sm">
              <a 
                href="/register" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Crear cuenta nueva
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};