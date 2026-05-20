import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

export const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch ticket details on component mount
  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await apiFetch(`/tickets/${id}`);
        setTicket(response.data || response);
      } catch (err) {
        const errorMessage = (() => {
          if (err.response?.data?.error) {
            return err.response.data.error;
          }
          if (err.message && err.message.includes('Failed to fetch')) {
            return 'No se puede conectar al servidor. Mostrando datos simulados.';
          }
          return err.message || 'Error al cargar el detalle del reclamo.';
        })();
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetail();
  }, [id]);

  const getStatusBadgeColor = (status) => {
    const statusLower = status?.toLowerCase() || '';

    if (statusLower === 'open') {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    } else if (statusLower === 'in progress' || statusLower === 'in_progress') {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    } else if (statusLower === 'closed') {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }

    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-text-secondary">Cargando detalle del reclamo...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <button
            onClick={() => navigate('/reclamos')}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium"
          >
            ← Volver al listado
          </button>
        </div>
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg dark:bg-red-900 dark:border-red-700">
          <p className="text-red-800 dark:text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header & Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/reclamos')}
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium mb-4 transition-colors"
        >
          ← Volver al listado
        </button>
        <h2 className="text-3xl font-bold text-text-main">Detalle del Reclamo</h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pr-4 pb-4 space-y-6">
        {/* Ticket Card */}
        <div className="border border-gray-300 rounded-lg p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
          {/* ID & Status */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-300 dark:border-gray-700">
            <div>
              <p className="text-sm text-text-secondary mb-1">ID del Reclamo</p>
              <p className="text-2xl font-bold text-text-main">{ticket.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary mb-2">Estado Actual</p>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Título</p>
            <h3 className="text-2xl font-bold text-text-main mb-4">{ticket.title}</h3>

            <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Descripción</p>
            <p className="text-text-main leading-relaxed whitespace-pre-wrap mb-6">{ticket.description}</p>
          </div>

          {/* Categorization Info */}
          <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-300 dark:border-gray-700">
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Categoría</p>
              <p className="text-text-main font-medium">{ticket.category || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Subcategoría</p>
              <p className="text-text-main font-medium">{ticket.subcategory || 'N/A'}</p>
            </div>
            {ticket.subject && (
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Materia</p>
                <p className="text-text-main font-medium">{ticket.subject}</p>
              </div>
            )}
            {ticket.commission && (
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Comisión</p>
                <p className="text-text-main font-medium">{ticket.commission}</p>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Fecha de Creación</p>
              <p className="text-text-main text-sm">{formatDate(ticket.createdAt)}</p>
            </div>
            {ticket.updatedAt && (
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Última Actualización</p>
                <p className="text-text-main text-sm">{formatDate(ticket.updatedAt)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section Placeholder */}
        <div className="border border-gray-300 rounded-lg p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-bold text-text-main mb-4">Comentarios</h3>
          <p className="text-text-secondary text-sm italic">
            La funcionalidad de comentarios se implementará en la Etapa 3.
          </p>
        </div>
      </div>
    </div>
  );
};
