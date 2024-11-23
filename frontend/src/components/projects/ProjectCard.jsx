import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusColors = {
  PLANIFICACION: 'bg-blue-100 text-blue-800',
  EN_PROGRESO: 'bg-yellow-100 text-yellow-800',
  EVALUACION: 'bg-purple-100 text-purple-800',
  COMPLETADO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800'
};

export const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            <Link to={`/projects/${project.projectId}`} className="hover:text-primary-600">
              {project.titulo}
            </Link>
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusColors[project.estado]
            }`}
          >
            {project.estado}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {project.descripcion}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-5 w-5 mr-1.5 text-gray-400" />
              {format(new Date(project.createdAt), 'd MMM yyyy', { locale: es })}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <UserGroupIcon className="h-5 w-5 mr-1.5 text-gray-400" />
              {project.equipo?.colaboradores?.length || 0} miembros
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="h-5 w-5 mr-1.5 text-gray-400" />
              {project.faseActual + 1} de {project.fases?.length} fases
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {/* Avatares de los miembros del equipo */}
            {Object.values(project.equipo || {})
              .filter(Boolean)
              .slice(0, 3)
              .map((userId, index) => (
                <img
                  key={userId}
                  className="h-8 w-8 rounded-full ring-2 ring-white"
                  src={`https://ui-avatars.com/api/?name=${userId}`}
                  alt=""
                />
              ))}
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/projects/${project.projectId}`}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Ver detalles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};