import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../../components/common/Loading';
import { Error } from '../../components/common/Error';

export const ProjectForm = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createProject, updateProject, getProjectById } = useProjects();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    facultad: user.facultad || '',
    programa: user.programa || '',
    estado: 'PLANIFICACION',
    fases: [
      {
        nombre: 'Planificación',
        descripcion: 'Fase inicial del proyecto',
        progreso: 0,
        tareas: []
      },
      {
        nombre: 'Desarrollo',
        descripcion: 'Fase de ejecución del proyecto',
        progreso: 0,
        tareas: []
      },
      {
        nombre: 'Evaluación',
        descripcion: 'Fase final y evaluación',
        progreso: 0,
        tareas: []
      }
    ],
    equipo: {
      director: '',
      lider: user.uid,
      colaboradores: [],
      docente: ''
    }
  });

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await getProjectById(projectId);
      setFormData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (projectId) {
        await updateProject(projectId, formData);
      } else {
        await createProject(formData);
      }
      navigate('/projects');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <MainLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información básica */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Información del Proyecto
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Ingrese la información básica del proyecto.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6">
                      <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                        Título
                      </label>
                      <input
                        type="text"
                        name="titulo"
                        id="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                        Descripción
                      </label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        rows={3}
                        value={formData.descripcion}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="facultad" className="block text-sm font-medium text-gray-700">
                        Facultad
                      </label>
                      <select
                        id="facultad"
                        name="facultad"
                        value={formData.facultad}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="">Seleccione una facultad</option>
                        <option value="Ingeniería">Ingeniería</option>
                        <option value="Ciencias">Ciencias</option>
                        {/* Agregar más facultades según sea necesario */}
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="programa" className="block text-sm font-medium text-gray-700">
                        Programa
                      </label>
                      <select
                        id="programa"
                        name="programa"
                        value={formData.programa}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="">Seleccione un programa</option>
                        <option value="Sistemas">Sistemas</option>
                        <option value="Industrial">Industrial</option>
                        {/* Agregar más programas según sea necesario */}
                      </select>
                    </div>

                    {projectId && (
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                          Estado
                        </label>
                        <select
                          id="estado"
                          name="estado"
                          value={formData.estado}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="PLANIFICACION">Planificación</option>
                          <option value="EN_PROGRESO">En Progreso</option>
                          <option value="EVALUACION">Evaluación</option>
                          <option value="COMPLETADO">Completado</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Equipo del proyecto */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Equipo del Proyecto
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Asigne los roles principales del proyecto.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="director" className="block text-sm font-medium text-gray-700">
                        Director de Programa
                      </label>
                      <select
                        id="director"
                        name="equipo.director"
                        value={formData.equipo.director}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="">Seleccione un director</option>
                        {/* Aquí deberías cargar los usuarios con rol de director */}
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="docente" className="block text-sm font-medium text-gray-700">
                        Docente Guía
                      </label>
                      <select
                        id="docente"
                        name="equipo.docente"
                        value={formData.equipo.docente}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="">Seleccione un docente</option>
                        {/* Aquí deberías cargar los usuarios con rol de docente */}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                {projectId ? 'Guardar cambios' : 'Crear proyecto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};