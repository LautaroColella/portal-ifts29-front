import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

export const TicketsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [viewMode, setViewMode] = useState('cards');

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
        
        // Determine if there's a next page based on number of results
        setHasNextPage((response.data || []).length === limit);
      } catch (error) {
        // Extract error message from API response or use default
        const errorMessage = (() => {
          if (error.response?.data?.error) {
            return error.response.data.error;
          }
          if (error.message && error.message.includes('Failed to fetch')) {
            return 'No se puede conectar al servidor. Mostrando datos simulados.';
          }
          return error.message || 'Error al cargar los tickets. Intenta nuevamente.';
        })();
        setApiError(errorMessage);
        setTickets([]);
        setHasNextPage(false);
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
    
    // Reset to page 1 when search changes
    setPage(1);
  };

  const getStatusBadgeColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower === 'open') {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    } else if (statusLower === 'in progress' || statusLower === 'in_progress') {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    } else if (statusLower === 'waiting_for_student' || statusLower === 'waiting for student') {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    } else if (statusLower === 'waiting_for_third_party' || statusLower === 'waiting for third party') {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    } else if (statusLower === 'resolved') {
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
    } else if (statusLower === 'closed') {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    } else if (statusLower === 'cancelled') {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
    
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const formatStatus = (status) => {
    const statusMap = {
      'OPEN': 'Abierto',
      'IN_PROGRESS': 'En Proceso',
      'WAITING_FOR_STUDENT': 'Esperando Estudiante',
      'WAITING_FOR_THIRD_PARTY': 'Esperando Terceros',
      'RESOLVED': 'Resuelto',
      'CLOSED': 'Cerrado',
      'CANCELLED': 'Cancelado',
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-text-main">Listado de Reclamos</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-primary-500 text-white dark:bg-primary-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <i className="fas fa-th-large mr-2"></i>
            Tarjetas
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-primary-500 text-white dark:bg-primary-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <i className="fas fa-list mr-2"></i>
            Lista
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={title}
          onChange={handleSearchChange}
          maxLength={MAX_TITLE_LENGTH}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
            validationError
              ? 'border-red-500 bg-red-50 text-gray-900 placeholder-red-400 focus:ring-red-500 dark:bg-red-900 dark:border-red-700 dark:text-red-100 dark:placeholder-red-300'
              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400'
          }`}
        />
        {validationError && (
          <p className="text-red-600 text-sm mt-2">{validationError}</p>
        )}
      </div>

      {/* API Error Message */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg dark:bg-red-900 dark:border-red-700">
          <p className="text-red-800 text-sm dark:text-red-100">{apiError}</p>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Create New Card */}
            <button
              onClick={() => navigate('/reclamos/create')}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white hover:border-primary-500 hover:bg-primary-50 transition-all dark:bg-gray-800 dark:border-gray-700 dark:hover:border-primary-400 dark:hover:bg-gray-700 flex items-center justify-center min-h-[280px]"
            >
              <div className="text-center">
                <i className="fas fa-plus-circle text-4xl text-gray-400 dark:text-gray-500 mb-3"></i>
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">Crear nuevo</p>
              </div>
            </button>

            {/* Loading State */}
            {loading && (
              <div className="col-span-full py-8 text-center text-text-secondary">
                Cargando tickets...
              </div>
            )}

            {/* Empty State */}
            {!loading && tickets.length === 0 && (
              <div className="col-span-full py-8 text-center text-text-secondary">
                No se encontraron tickets.
              </div>
            )}

            {/* Ticket Cards */}
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => navigate(`/reclamos/${ticket.id}`)}
                className="border border-gray-300 rounded-lg p-4 bg-white hover:shadow-md transition-all text-left dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
              >
                {/* ID & Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-text-secondary">Ticket {ticket.id}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(ticket.status)}`}>
                    {formatStatus(ticket.status)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-text-main mb-3 truncate">{ticket.title}</h3>

                {/* Responsable */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-text-secondary mb-1">Responsable</p>
                  <p className="text-sm text-text-main">{ticket.responsible || 'Sin asignar'}</p>
                </div>

                {/* Category & Subcategory */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-xs font-semibold text-text-secondary mb-1">Categoría</p>
                    <p className="text-xs text-text-main truncate">{ticket.category || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-secondary mb-1">Subcategoría</p>
                    <p className="text-xs text-text-main truncate">{ticket.subcategory || 'N/A'}</p>
                  </div>
                </div>

                {/* Date & Comments */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs font-semibold text-text-secondary mb-1">Fecha creación</p>
                    <p className="text-xs text-text-main">{formatDate(ticket.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-secondary mb-1">Nro comentarios</p>
                    <p className="text-xs text-text-main">{ticket.commentsCount || 0}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="flex-1 overflow-auto border border-gray-300 rounded-lg dark:border-gray-700">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300 dark:text-white dark:border-gray-700">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300 dark:text-white dark:border-gray-700">
                  Título
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300 dark:text-white dark:border-gray-700">
                  Responsable
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300 dark:text-white dark:border-gray-700">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300 dark:text-white dark:border-gray-700">
                  Subcategoría
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300 dark:text-white dark:border-gray-700">
                  Fecha creación
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300 dark:text-white dark:border-gray-700">
                  Comentarios
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300 dark:text-white dark:border-gray-700">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-text-secondary">
                    Cargando tickets...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-text-secondary">
                    No se encontraron tickets.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/reclamos/${ticket.id}`)}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{ticket.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium max-w-xs truncate">{ticket.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{ticket.responsible || 'Sin asignar'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{ticket.category || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{ticket.subcategory || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{formatDate(ticket.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{ticket.commentsCount || 0}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                          ticket.status
                        )}`}
                      >
                        {formatStatus(ticket.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Página <span className="font-semibold">{page}</span> — Mostrando {tickets.length} resultado{tickets.length !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              page === 1
                ? 'bg-gray-400 text-white cursor-not-allowed opacity-60 dark:bg-gray-700'
                : 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95 dark:bg-primary-600 dark:hover:bg-primary-700'
            }`}
          >
            Anterior
          </button>
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              hasNextPage
                ? 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95 dark:bg-primary-600 dark:hover:bg-primary-700'
                : 'bg-gray-400 text-white cursor-not-allowed opacity-60 dark:bg-gray-700'
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
