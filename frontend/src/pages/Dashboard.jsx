import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const statusColors = {
  PLANIFICACION: 'bg-yellow-100 text-yellow-800',
  EN_PROGRESO: 'bg-blue-100 text-blue-800',
  EVALUACION: 'bg-purple-100 text-purple-800',
  COMPLETADO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800'
};

const KPICard = ({ title, value, description, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/metrics/dashboard', {
          params: {
            faculty: user.facultad,
            program: user.programa,
            timeRange
          }
        });
        setDashboardData(response.data);
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, timeRange]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-red-600">
          <AlertCircle className="mx-auto h-12 w-12" />
          <p className="mt-2">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const calculateCompletionRate = () => {
    const total = dashboardData?.projects_summary?.total || 0;
    const completed = dashboardData?.projects_summary?.by_status?.COMPLETADO || 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido, {user.nombreCompleto}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeRange('week')}
          >
            Semana
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeRange('month')}
          >
            Mes
          </Button>
          <Button
            variant={timeRange === 'year' ? 'default' : 'outline'}
            onClick={() => setTimeRange('year')}
          >
            Año
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Proyectos"
          value={dashboardData?.projects_summary?.total || 0}
          description="Proyectos activos"
          icon={Calendar}
        />
        <KPICard
          title="En Progreso"
          value={dashboardData?.projects_summary?.by_status?.EN_PROGRESO || 0}
          description="Proyectos en desarrollo"
          icon={Clock}
        />
        <KPICard
          title="Tasa de Completitud"
          value={`${calculateCompletionRate()}%`}
          description="Proyectos completados a tiempo"
        />
        <KPICard
          title="Tareas Pendientes"
          value={dashboardData?.tasks_summary?.pending || 0}
          description="Tareas por completar"
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Estado de Proyectos */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Proyectos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(dashboardData?.projects_summary?.by_status || {})
                      .filter(([_, value]) => value > 0)
                      .map(([key, value]) => ({
                        name: key,
                        value: value
                      }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {Object.entries(dashboardData?.projects_summary?.by_status || {})
                      .filter(([_, value]) => value > 0)
                      .map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progreso de Proyectos */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso de Proyectos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData?.timeline_data?.active_phases || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="project_name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#8884d8"
                    name="Progreso (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximas Entregas y Actividad Reciente */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Próximas Entregas */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Entregas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.timeline_data?.upcoming_deadlines?.map((deadline, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h3 className="font-medium">{deadline.task_name}</h3>
                    <p className="text-sm text-muted-foreground">{deadline.project_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {format(new Date(deadline.deadline), 'PP', { locale: es })}
                    </p>
                    <Badge variant={deadline.days_remaining <= 3 ? 'destructive' : 'default'}>
                      {deadline.days_remaining} días restantes
                    </Badge>
                  </div>
                </div>
              ))}
              {dashboardData?.timeline_data?.upcoming_deadlines?.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No hay entregas próximas
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.timeline_data?.recent_completions?.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-4 rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{activity.task_name}</h3>
                    <p className="text-sm text-muted-foreground">{activity.project_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {format(new Date(activity.completion_date), 'PP', { locale: es })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Completado en {activity.time_taken} días
                    </p>
                  </div>
                </div>
              ))}
              {dashboardData?.timeline_data?.recent_completions?.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No hay actividad reciente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;