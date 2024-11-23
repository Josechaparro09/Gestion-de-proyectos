import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const ActivityTimeline = ({ activities }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
      <div className="mt-6 flow-root">
        <ul className="-mb-8">
          {activities.map((activity, index) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {index !== activities.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div>
                    <div className="relative px-1">
                      <div className="h-8 w-8 bg-primary-100 rounded-full ring-8 ring-white flex items-center justify-center">
                        {activity.icon}
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">
                          {activity.user}
                        </span>
                        {' '}
                        <span className="text-gray-500">
                          {activity.description}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {format(new Date(activity.date), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};