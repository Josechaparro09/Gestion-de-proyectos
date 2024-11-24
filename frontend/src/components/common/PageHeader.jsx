export const PageHeader = ({ 
    title, 
    description, 
    actions,
    breadcrumbs = [] 
  }) => {
    return (
      <div className="mb-8">
        {breadcrumbs.length > 0 && (
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2">
              {breadcrumbs.map((item, index) => (
                <li key={item.name}>
                  <div className="flex items-center">
                    {index !== 0 && (
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    )}
                    <a
                      href={item.href}
                      className={`ml-2 text-sm font-medium ${
                        index === breadcrumbs.length - 1
                          ? 'text-gray-500'
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                      aria-current={
                        index === breadcrumbs.length - 1 ? 'page' : undefined
                      }
                    >
                      {item.name}
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        )}
        
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="mt-4 flex md:ml-4 md:mt-0">{actions}</div>}
        </div>
      </div>
    );
  };