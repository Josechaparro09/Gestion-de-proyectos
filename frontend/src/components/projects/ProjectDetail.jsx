import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { PhaseTimeline } from '../../components/projects/PhaseTimeline';
import { TaskList } from '../../components/projects/TaskList';
import { TeamOverview } from '../../components/dashboard/TeamOverview';
import { Loading } from '../../components/common/Loading';
import { Error } from '../../components/common/Error';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../hooks/useAuth';
import {
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, error, getProjectById, updateProject } = useProjects();
  const [project, setProject] = useState(null);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const data = await getProjectById(projectId);
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} retry={loadProject} />;
  if (!project) return null;

  const canEdit = user?.rol?.includes('ADMIN') || 
                 project.equipo?.lider === user.uid || 
                 project.equipo?.director === user.uid;

  return (
    <MainLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Volver
            </button>
            
            {canEdit && (
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/projects/${projectId}/edit`)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    // Implementar lógica de eliminación
                  }}
                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  <TrashIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Eliminar
                </button>
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">{project.titulo}</h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.estado === 'COMPLETADO'
                      ? 'bg-green-100 text-green-800'
                      : project.estado === 'EN_PROGRESO'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {project.estado}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{project.descripcion}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Facultad</dt>
                  <dd className="mt-1 text-sm text-gray-900">{project.facultad}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Programa</dt>
                  <dd className="mt-1 text-sm text-gray-900">{project.programa}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fecha de inicio</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(new Date(project.createdAt), 'd MMM yyyy', { locale: es })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Última actualización</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(new Date(project.updatedAt), 'd MMM yyyy', { locale: es })}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline and Tasks */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Fases del Proyecto</h2>
                <PhaseTimeline phases={project.fases} currentPhase={project.faseActual} />
              </div>
              
              <TaskList
                projectId={projectId}
                phaseId={project.fases[project.faseActual]?.faseId}
                tasks={project.fases[project.faseActual]?.tareas || []}
                onTaskUpdate={loadProject}
              />
            </div>
            
            <div className="space-y-6">
              <TeamOverview team={project.equipo} />
              
              {/* Métricas del proyecto */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Métricas</h2>
                <dl className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Progreso general</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                      {Math.round(project.metricas?.tasasCompletitud || 0)}%
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Retrasos acumulados</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                      {project.metricas?.retrasosAcumulados || 0} días
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Tiempo por fase</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                      {Math.round(project.metricas?.tiempoPromedioPorFase || 0)} días
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};