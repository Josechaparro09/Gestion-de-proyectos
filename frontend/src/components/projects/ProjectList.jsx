import { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { Loading } from '../../components/common/Loading';
import { Error } from '../../components/common/Error';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  FunnelIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

export const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    estado: '',
    facultad: '',
    programa: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, error, getProjects } = useProjects();
  const { user } = useEffect(() => {
    loadProjects();
  }, [filters]);

  const loadProjects = async () => {
    try {
      const data = await getProjects(filters);
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const filteredProjects = projects.filter(project => 
    project.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Proyectos</h1>
            <Link
              to="/projects/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nuevo Proyecto
            </Link>
          </div>

          {/* Filtros y búsqueda */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="Buscar proyectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filters.estado}
                onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
                className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
              >
                <option value="">Todos los estados</option>
                <option value="PLANIFICACION">Planificación</option>
                <option value="EN_PROGRESO">En Progreso</option>
                <option value="EVALUACION">Evaluación</option>
                <option value="COMPLETADO">Completado</option>
              </select>
              
              {user?.rol?.includes('ADMIN') && (
                <>
                  <select
                    value={filters.facultad}
                    onChange={(e) => setFilters(prev => ({ ...prev, facultad: e.target.value }))}
                    className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Todas las facultades</option>
                    <option value="Ingeniería">Ingeniería</option>
                    <option value="Ciencias">Ciencias</option>
                    {/* Agregar más facultades según sea necesario */}
                  </select>
                  
                  <select
                    value={filters.programa}
                    onChange={(e) => setFilters(prev => ({ ...prev, programa: e.target.value }))}
                    className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Todos los programas</option>
                    <option value="Sistemas">Sistemas</option>
                    <option value="Industrial">Industrial</option>
                    {/* Agregar más programas según sea necesario */}
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Lista de proyectos */}
          {loading ? (
            <div className="mt-6">
              <Loading />
            </div>
          ) : error ? (
            <div className="mt-6">
              <Error message={error} retry={loadProjects} />
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.projectId} project={project} />
              ))}
              {filteredProjects.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No se encontraron proyectos con los filtros aplicados.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};