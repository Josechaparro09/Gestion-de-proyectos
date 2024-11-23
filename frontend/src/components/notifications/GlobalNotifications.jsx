import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNotifications } from '../../hooks/useNotifications';

export const GlobalNotifications = () => {
  const { notifications } = useNotifications();
  
  useEffect(() => {
    // Mostrar notificaciones toast para nuevas notificaciones
    const showNotification = (notification) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.mensaje}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.descripcion}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none"
            >
              Cerrar
            </button>
          </div>
        </div>
      ));
    };

    // Mostrar notificaciones solo si son nuevas y no leídas
    notifications.forEach((notification) => {
      if (!notification.leido.includes(user.uid) && 
          new Date(notification.createdAt) > new Date(Date.now() - 5000)) {
        showNotification(notification);
      }
    });
  }, [notifications]);

  return null; // Este componente no renderiza nada visualmente
};
