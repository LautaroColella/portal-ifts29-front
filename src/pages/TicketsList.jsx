import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

export const TicketsList = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const MAX_TITLE_LENGTH = 100;

  // Fetch tickets from API
  useEffect(() => {
    const fetchTicketsData = async () => {
      try {
        setLoading(true);
        setApiError('');

        // Build query parameters with trimmed title
        const params = new URLSearchParams({
          page,
          limit,
          title: title.trim(),
        });

        const response = await apiFetch(`/tickets?${params.toString()}`);
        setTickets(response.data || []);
      } catch (error) {
        // Extract error message from API response or use default
        const errorMessage =
          error.response?.data?.error || error.message || 'Error al cargar los tickets';
        setApiError(errorMessage);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketsData();
  }, [page, title, limit]);

  const handleSearchChange = (e) => {
    const value = e.target.value;

    // Check if length exceeds maximum
    if (value.length > MAX_TITLE_LENGTH) {
      setValidationError(`El título no puede superar los ${MAX_TITLE_LENGTH} caracteres`);
      return;
    }

    // Clear validation error if within limits
    setValidationError('');
    setTitle(value);
  };

  const getStatusBadgeColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower === 'open') {
      return 'bg-green-100 text-green-800';
    } else if (statusLower === 'in progress' || statusLower === 'in_progress') {
      return 'bg-blue-100 text-blue-800';
    } else if (statusLower === 'closed') {
      return 'bg-gray-100 text-gray-800';
    }
    
    return 'bg-gray-100 text-gray-800';
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

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
          value={title}
          onChange={handleSearchChange}
          maxLength={MAX_TITLE_LENGTH + 1}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
            validationError
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary-500'
          }`}
        />
        {validationError && (
          <p className="text-red-600 text-sm mt-2">{validationError}</p>
        )}
      </div>

      {/* API Error Message */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{apiError}</p>
        </div>
      )}

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
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-text-secondary">
                  Cargando tickets...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-text-secondary">
                  No se encontraron tickets.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-text-main">{ticket.id}</td>
                  <td className="px-6 py-4 text-sm text-text-main">{ticket.title}</td>
                  <td className="px-6 py-4 text-sm text-text-main">{ticket.category}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-text-secondary">Página {page}</p>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              page === 1
                ? 'bg-gray-300 text-white cursor-not-allowed opacity-50'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            Anterior
          </button>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
