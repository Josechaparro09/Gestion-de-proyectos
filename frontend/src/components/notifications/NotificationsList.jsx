import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNotifications } from '../../hooks/useNotifications';
import { Link } from 'react-router-dom';

const priorityColors = {
  ALTA: 'text-red-600 bg-red-100',
  MEDIA: 'text-yellow-600 bg-yellow-100',
  BAJA: 'text-blue-600 bg-blue-100'
};

export const NotificationsList = () => {
  const { notifications, loading, error, markAsRead } = useNotifications();

  const unreadCount = notifications.filter(n => !n.leido.includes(user.uid)).length;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="relative inline-flex items-center p-2 text-gray-400 hover:text-gray-500">
          <BellIcon className="h-6 w-6" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Menu.Button>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Notificaciones</h2>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-4 text-center">
                <Loading size="small" />
              </div>
            ) : error ? (
              <div className="py-4 text-center text-red-600">
                Error al cargar notificaciones
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                No hay notificaciones
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                  key={notification.notificationId}
                  className={`p-4 rounded-lg ${
                    !notification.leido.includes(user.uid)
                      ? 'bg-gray-50'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.mensaje}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            priorityColors[notification.prioridad]
                          }`}
                        >
                          {notification.prioridad}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {format(new Date(notification.createdAt), "d 'de' MMMM 'a las' HH:mm", {
                          locale: es,
                        })}
                      </p>
                      {notification.projectId && (
                        <Link
                          to={`/projects/${notification.projectId}`}
                          className="mt-2 inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-500"
                        >
                          Ver proyecto
                          <span className="ml-2">→</span>
                        </Link>
                      )}
                    </div>
                    {!notification.leido.includes(user.uid) && (
                      <button
                        onClick={() => markAsRead(notification.notificationId)}
                        className="ml-4 text-xs text-gray-400 hover:text-gray-500"
                      >
                        Marcar como leída
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Menu.Items>
    </Transition>
  </Menu>
);
};