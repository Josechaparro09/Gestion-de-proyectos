export const Card = ({ children, title, description, className = '', footer }) => {
    return (
      <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
        {(title || description) && (
          <div className="px-4 py-5 sm:px-6">
            {title && (
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="px-4 py-5 sm:p-6">{children}</div>
        {footer && (
          <div className="px-4 py-4 sm:px-6 bg-gray-50">{footer}</div>
        )}
      </div>
    );
  };