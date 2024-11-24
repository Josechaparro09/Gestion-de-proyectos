import { useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { useNotificationStore } from '../../store/notificationStore';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const icons = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  info: InformationCircleIcon,
};

const NotificationItem = ({ notification, onClose }) => {
  const Icon = icons[notification.type] || InformationCircleIcon;

  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        onClose(notification.id);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  return (
    <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon
              className={`h-6 w-6 ${
                {
                  success: 'text-green-400',
                  error: 'text-red-400',
                  info: 'text-blue-400',
                }[notification.type] || 'text-blue-400'
              }`}
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">
              {notification.title}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {notification.message}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => onClose(notification.id)}
            >
              <span className="sr-only">Cerrar</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationManager = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <Transition
            key={notification.id}
            show={true}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <NotificationItem
              notification={notification}
              onClose={removeNotification}
            />
          </Transition>
        ))}
      </div>
    </div>
  );
};
