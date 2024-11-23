export const Error = ({ message = 'Ha ocurrido un error', retry = null }) => {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{message}</p>
            </div>
            {retry && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                >
                  Reintentar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };