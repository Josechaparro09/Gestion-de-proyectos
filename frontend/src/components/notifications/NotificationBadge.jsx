import { memo } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

export const NotificationBadge = memo(({ count = 0 }) => {
  if (count === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-5 w-5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-5 w-5 bg-primary-500 text-xs text-white items-center justify-center">
        {count > 9 ? '9+' : count}
      </span>
    </span>
  );
});

