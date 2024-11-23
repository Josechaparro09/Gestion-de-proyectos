import { useAuth } from '../../hooks/authContext';
import {
  HomeIcon,
  FolderIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Proyectos', href: '/projects', icon: FolderIcon },
  { name: 'Usuarios', href: '/users', icon: UserGroupIcon },
  { name: 'Análisis', href: '/analytics', icon: ChartBarIcon },
  { name: 'Configuración', href: '/settings', icon: Cog6ToothIcon },
];

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white">
        <div className="flex flex-shrink-0 flex-col px-4 py-4">
          <div className="flex items-center">
            <img
              className="h-8 w-8 rounded-full"
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.nombreCompleto}`}
              alt=""
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.nombreCompleto}</p>
              <p className="text-xs text-gray-500">{user.rol?.join(', ')}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={classNames(
                    isActive ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};