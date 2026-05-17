export const TicketsList = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-text-main mb-4">Listado de Reclamos</h2>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por título..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto border border-gray-200 rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-main border-b border-gray-200">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-main border-b border-gray-200">
                Título
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-main border-b border-gray-200">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-main border-b border-gray-200">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Row - Placeholder for dynamic content */}
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-text-main">1</td>
              <td className="px-6 py-4 text-sm text-text-main">Ejemplo de Ticket</td>
              <td className="px-6 py-4 text-sm text-text-main">General</td>
              <td className="px-6 py-4 text-sm">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Open
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-text-secondary">Página 1</p>
        <div className="flex gap-2">
          <button
            disabled
            className="px-4 py-2 bg-gray-300 text-white rounded-lg cursor-not-allowed opacity-50 font-medium"
          >
            Anterior
          </button>
          <button
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
