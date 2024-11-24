import { useQuery } from '../../hooks/useQuery';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';
import { queryKeys } from '../../services/queryKeys';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { 
  ChartBarIcon, 
  ClipboardDocumentListIcon,
  UserGroupIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

export const DashboardPage = () => {
  const { user } = useAuth();
  
  const { data: dashboardData, isLoading } = useQuery(
    queryKeys.dashboardMetrics({ faculty: user?.facultad }),
    () => apiService.metrics.getDashboardData({ faculty: user?.facultad })
  );

  const { data: userMetrics } = useQuery(
    queryKeys.userMetrics(user?.uid),
    () => apiService.metrics.getUserMetrics(user?.uid)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Bienvenido, ${user?.nombreCompleto}`}
        description="Panel de control y métricas principales"
      />

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClipboardDocumentListIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Proyectos Activos</h3>
              <p className="text-2xl font-bold">
                {dashboardData?.projects_summary?.by_status?.EN_PROGRESO || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Tasa de Completitud</h3>
              <p className="text-2xl font-bold">
                {(dashboardData?.performance_metrics?.on_time_completion_rate || 0).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Miembros de Equipo</h3>
              <p className="text-2xl font-bold">
                {dashboardData?.team_overview?.total_members || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Tareas Pendientes</h3>
              <p className="text-2xl font-bold">
                {dashboardData?.tasks_summary?.pending || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sección de actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Próximas Fechas Límite"
          description="Tareas que requieren tu atención"
        >
          <div className="space-y-4">
            {dashboardData?.timeline_data?.upcoming_deadlines?.map((deadline) => (
              <div
                key={deadline.task_id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <h4 className="font-medium text-gray-900">
                    {deadline.task_name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {deadline.project_name}
                  </p>
                  </div>
                <div className="text-sm text-gray-500">
                  {new Date(deadline.deadline).toLocaleDateString()}
                </div>
              </div>
            ))}
            
            {dashboardData?.timeline_data?.upcoming_deadlines?.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No hay fechas límite próximas
              </p>
            )}
          </div>
        </Card>

        <Card
          title="Actividades Recientes"
          description="Últimas actualizaciones de los proyectos"
        >
          <div className="space-y-4">
            {dashboardData?.timeline_data?.recent_completions?.map((activity) => (
              <div
                key={activity.task_id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <h4 className="font-medium text-gray-900">
                    {activity.task_name}
                  </h4>
                  <p className="text-sm text-green-600">
                    Completada
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(activity.completion_date).toLocaleDateString()}
                </div>
              </div>
            ))}
            
            {dashboardData?.timeline_data?.recent_completions?.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No hay actividades recientes
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Métricas de rendimiento personal */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rendimiento Personal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">
                Tasa de Completitud
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {(userMetrics?.performance?.completion_rate || 0).toFixed(1)}%
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">
                Tareas a Tiempo
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {(userMetrics?.performance?.on_time_rate || 0).toFixed(1)}%
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">
                Eficiencia
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {(userMetrics?.performance?.efficiency_score || 0).toFixed(1)}%
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Fases Activas */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Fases Activas
        </h3>
        <div className="grid grid-cols-1 gap-6">
          {dashboardData?.timeline_data?.active_phases?.map((phase) => (
            <Card key={`${phase.project_id}-${phase.phase_name}`}>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-medium text-gray-900">
                    {phase.project_name}
                  </h4>
                  <span className="text-sm text-gray-500">
                    Fase: {phase.phase_name}
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                    <div
                      style={{ width: `${phase.progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{phase.progress}% completado</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {dashboardData?.timeline_data?.active_phases?.length === 0 && (
            <Card>
              <p className="text-gray-500 text-center py-4">
                No hay fases activas
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};