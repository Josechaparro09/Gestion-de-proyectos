// src/pages/projects/ProjectList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/axios';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, Search, Filter } from 'lucide-react';

const statusColors = {
  PLANIFICACION: 'bg-yellow-100 text-yellow-800',
  EN_PROGRESO: 'bg-blue-100 text-blue-800',
  EVALUACION: 'bg-purple-100 text-purple-800',
  COMPLETADO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800'
};

const ProjectList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    faculty: user.facultad || '',
    program: user.programa || ''
  });

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects', { params: filters });
      setProjects(response.data);
    } catch (err) {
      setError('Error al cargar los proyectos');
      // src/pages/projects/ProjectList.jsx (continuación)
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const calculateProgress = (project) => {
    const phases = project.fases || [];
    if (phases.length === 0) return 0;
    
    const completedPhases = phases.filter(phase => 
      phase.tareas.every(task => task.completada)
    ).length;
    
    return Math.round((completedPhases / phases.length) * 100);
  };

  const getTeamMembers = (project) => {
    const team = [];
    if (project.equipo) {
      const { director, lider, colaboradores = [], docente } = project.equipo;
      if (director) team.push('Director');
      if (lider) team.push('Líder');
      if (docente) team.push('Docente');
      if (colaboradores.length > 0) team.push(`${colaboradores.length} Colaboradores`);
    }
    return team.join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Proyectos</h1>
        {['DIRECTOR', 'LIDER'].includes(user.rol) && (
          <Button onClick={() => navigate('/projects/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar proyectos..."
                className="pl-8"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="PLANIFICACION">Planificación</SelectItem>
                <SelectItem value="EN_PROGRESO">En Progreso</SelectItem>
                <SelectItem value="EVALUACION">Evaluación</SelectItem>
                <SelectItem value="COMPLETADO">Completado</SelectItem>
                <SelectItem value="CANCELADO">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.faculty}
              onValueChange={(value) => handleFilterChange('faculty', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Facultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value={user.facultad}>{user.facultad}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.program}
              onValueChange={(value) => handleFilterChange('program', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Programa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value={user.programa}>{user.programa}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Proyectos */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proyecto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Última Actualización</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <div className="flex items-center justify-center py-4">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      <span className="ml-2">Cargando proyectos...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No se encontraron proyectos
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.projectId}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{project.titulo}</p>
                        <p className="text-sm text-gray-500">{project.programa}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[project.estado]}>
                        {project.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-full">
                        <div className="mb-1 flex justify-between text-xs">
                          <span>{calculateProgress(project)}%</span>
                        </div>
                        <Progress value={calculateProgress(project)} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{getTeamMembers(project)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {format(new Date(project.updatedAt), 'PP', { locale: es })}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/projects/${project.projectId}`)}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectList;