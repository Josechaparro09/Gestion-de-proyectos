// src/components/auth/RegisterForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('Contraseña es requerida'),
  nombreCompleto: yup.string().required('Nombre completo es requerido'),
  facultad: yup.string().required('Facultad es requerida'),
  programa: yup.string().required('Programa es requerido'),
  rol: yup.string().required('Rol es requerido')
});

export const RegisterForm = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await registerUser({
        ...data,
        rol: [data.rol], // Convertir a array como espera el backend
        estado: {
          aprobado: false,
          activo: true
        },
        configuraciones: {
          notificacionesEmail: true,
          temaOscuro: false,
          idiomaPreferido: 'es'
        }
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Error al registrar usuario. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registro de Usuario
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Nombre Completo */}
            <div className="mb-4">
              <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700">
                Nombre Completo
              </label>
              <input
                id="nombreCompleto"
                type="text"
                {...register('nombreCompleto')}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.nombreCompleto && (
                <p className="mt-1 text-sm text-red-600">{errors.nombreCompleto.message}</p>
              )}
            </div>

            {/* Facultad */}
            <div className="mb-4">
              <label htmlFor="facultad" className="block text-sm font-medium text-gray-700">
                Facultad
              </label>
              <select
                id="facultad"
                {...register('facultad')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Seleccione una facultad</option>
                <option value="Ingeniería">Ingeniería</option>
                <option value="Ciencias">Ciencias</option>
                <option value="Artes">Artes</option>
                {/* Añadir más facultades según sea necesario */}
              </select>
              {errors.facultad && (
                <p className="mt-1 text-sm text-red-600">{errors.facultad.message}</p>
              )}
            </div>

            {/* Programa */}
            <div className="mb-4">
              <label htmlFor="programa" className="block text-sm font-medium text-gray-700">
                Programa
              </label>
              <input
                id="programa"
                type="text"
                {...register('programa')}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.programa && (
                <p className="mt-1 text-sm text-red-600">{errors.programa.message}</p>
              )}
            </div>

            {/* Rol */}
            <div className="mb-4">
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
                Rol
              </label>
              <select
                id="rol"
                {...register('rol')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Seleccione un rol</option>
                <option value="DIRECTOR">Director de Programa</option>
                <option value="LIDER">Líder de Proyecto</option>
                <option value="COLABORADOR">Colaborador</option>
                <option value="DOCENTE">Docente Guía</option>
              </select>
              {errors.rol && (
                <p className="mt-1 text-sm text-red-600">{errors.rol.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};