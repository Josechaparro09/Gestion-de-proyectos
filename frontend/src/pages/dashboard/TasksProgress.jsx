export const ProjectsOverview = ({ data }) => {
    const chartData = [
      { name: 'En Progreso', value: data.by_status.EN_PROGRESO },
      { name: 'Completados', value: data.by_status.COMPLETADO },
      { name: 'Planificación', value: data.by_status.PLANIFICACION },
      { name: 'Evaluación', value: data.by_status.EVALUACION },
      { name: 'Cancelados', value: data.by_status.CANCELADO }
    ];
  
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900">Resumen de Proyectos</h3>
        <div className="mt-6" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {chartData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <span
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {item.name}
                </dt>
                <dd className="text-sm font-semibold text-gray-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    );
  };
  