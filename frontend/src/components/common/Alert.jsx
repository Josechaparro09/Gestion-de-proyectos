import clsx from 'clsx';

export const Alert = ({ 
  type = 'info',
  title,
  message,
  className = ''
}) => {
  const types = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  return (
    <div
      className={clsx(
        'rounded-md p-4 border',
        types[type],
        className
      )}
      role="alert"
    >
      {title && (
        <h3 className="text-sm font-medium mb-1">{title}</h3>
      )}
      {message && (
        <p className="text-sm">{message}</p>
      )}
    </div>
  );
};