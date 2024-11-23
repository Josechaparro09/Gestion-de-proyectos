import {
    UserGroupIcon,
    FolderOpenIcon,
    CheckCircleIcon,
    ClockIcon,
  } from '@heroicons/react/24/outline';
  
  const stats = [
    { id: 1, name: 'Total Usuarios', icon: UserGroupIcon },
    { id: 2, name: 'Proyectos Activos', icon: FolderOpenIcon },
    { id: 3, name: 'Tareas Completadas', icon: CheckCircleIcon },
    { id: 4, name: 'Tiempo Promedio', icon: ClockIcon },
  ];
  
  export const MetricsCards = ({ data }) => {
    const getStatValue = (statName) => {
      switch (statName) {
        case 'Total Usuarios':
          return data.team_overview.total_members;
        case 'Proyectos Activos':
          return data.projects_summary.by_status.EN_PROGRESO;
        case 'Tareas Completadas':
          return data.tasks_summary.completed;
        case 'Tiempo Promedio':
          return `${Math.round(data.performance_metrics.average_completion_time)} días`;
        default:
          return 0;
      }
    };
  
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {getStatValue(stat.name)}
              </p>
            </dd>
          </div>
        ))}
      </div>
    );
  };