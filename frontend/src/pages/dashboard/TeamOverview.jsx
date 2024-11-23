export const TeamOverview = ({ team }) => {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Equipo del Proyecto</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Director</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {team.director?.nombreCompleto || 'No asignado'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Líder</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {team.lider?.nombreCompleto || 'No asignado'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Docente Guía</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {team.docente?.nombreCompleto || 'No asignado'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Colaboradores</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
                  {team.colaboradores?.map((colaborador) => (
                    <li key={colaborador.uid} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                      <div className="flex items-center">
                        <img
                          className="h-8 w-8 rounded-full mr-3"
                          src={colaborador.photoURL || `https://ui-avatars.com/api/?name=${colaborador.nombreCompleto}`}
                          alt=""
                        />
                        <span className="ml-2 truncate">{colaborador.nombreCompleto}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  };