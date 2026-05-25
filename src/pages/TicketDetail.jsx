import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

export const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSection, setOpenSection] = useState(null);

  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [newMessageAuthor, setNewMessageAuthor] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [commentError, setCommentError] = useState('');
  const [messageError, setMessageError] = useState('');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

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

  useEffect(() => {
    if (id && openSection === 'comments') {
      fetchComments();
    }
  }, [id, openSection, fetchComments]);

  useEffect(() => {
    if (id && openSection === 'messages') {
      fetchMessages();
    }
  }, [id, openSection, fetchMessages]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await apiFetch(`/tickets/${id}/comments`);
      setComments(response.data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  }, [id]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await apiFetch(`/tickets/${id}/messages`);
      setMessages(response.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!newCommentContent.trim()) {
      setCommentError('El contenido del comentario es obligatorio');
      return;
    }

    try {
      setCommentError('');
      const response = await apiFetch(`/tickets/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          author: newCommentAuthor.trim() || 'Usuario Actual',
          content: newCommentContent.trim(),
        }),
      });

      setComments([...comments, response.data]);
      setNewCommentAuthor('');
      setNewCommentContent('');
    } catch (err) {
      const errorMessage = (() => {
        if (err.response?.data?.error) {
          return err.response.data.error;
        }
        return err.message || 'Error al agregar el comentario.';
      })();
      setCommentError(errorMessage);
    }
  };

  const handleAddMessage = async () => {
    if (!newMessageContent.trim()) {
      setMessageError('El contenido del mensaje es obligatorio');
      return;
    }

    try {
      setMessageError('');
      const response = await apiFetch(`/tickets/${id}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          author: newMessageAuthor.trim() || 'Usuario Actual',
          content: newMessageContent.trim(),
        }),
      });

      setMessages([...messages, response.data]);
      setNewMessageAuthor('');
      setNewMessageContent('');
    } catch (err) {
      const errorMessage = (() => {
        if (err.response?.data?.error) {
          return err.response.data.error;
        }
        return err.message || 'Error al agregar el mensaje.';
      })();
      setMessageError(errorMessage);
    }
  };

  const getStatusBadgeColor = (status) => {
    const statusLower = status?.toLowerCase() || '';

    if (statusLower === 'open') {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    } else if (statusLower === 'in_progress' || statusLower === 'in progress') {
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
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/reclamos')}
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium transition-colors"
        >
          ← Volver al listado
        </button>
      </div>

      {/* Main Ticket Card */}
      <div className="flex-1 overflow-auto pr-4 pb-4">
        <div className="border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
          {/* Header: Responsable | Ticket ID | Estado */}
          <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-main">Responsable</span>
              <button className="text-gray-400 hover:text-primary-500 transition-colors">
                <i className="fas fa-pencil-alt text-xs"></i>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-main">Ticket {ticket.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(ticket.status)}`}>
                {formatStatus(ticket.status)}
              </span>
              <button className="text-gray-400 hover:text-primary-500 transition-colors">
                <i className="fas fa-pencil-alt text-xs"></i>
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="p-6 border-b border-gray-300 dark:border-gray-700">
            <h3 className="text-xl font-bold text-text-main text-center">{ticket.title}</h3>
          </div>

          {/* Description */}
          <div className="p-6 border-b border-gray-300 dark:border-gray-700 min-h-[120px]">
            <p className="text-text-main whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Info Grid */}
          <div className="p-4 space-y-2">
            {/* Row 1: Creador | Fecha creación */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2">
                <p className="text-xs text-text-secondary">Creador</p>
                <p className="text-sm text-text-main font-medium">{ticket.createdBy || 'Sin asignar'}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2">
                <p className="text-xs text-text-secondary">Fecha creación</p>
                <p className="text-sm text-text-main font-medium">{formatDate(ticket.createdAt)}</p>
              </div>
            </div>

            {/* Row 2: Categoría | Subcategoría */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2">
                <p className="text-xs text-text-secondary">Categoría</p>
                <p className="text-sm text-text-main font-medium">{ticket.category || 'N/A'}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2">
                <p className="text-xs text-text-secondary">Subcategoría</p>
                <p className="text-sm text-text-main font-medium">{ticket.subcategory || 'N/A'}</p>
              </div>
            </div>

            {/* Row 3: Materia | Comisión */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2">
                <p className="text-xs text-text-secondary">Materia</p>
                <p className="text-sm text-text-main font-medium">{ticket.subject || 'N/A'}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2">
                <p className="text-xs text-text-secondary">Comisión</p>
                <p className="text-sm text-text-main font-medium">{ticket.commission || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="border-t border-gray-300 dark:border-gray-700">
            {/* Comments Section */}
            <div className="border-b border-gray-300 dark:border-gray-700">
              <button
                onClick={() => toggleSection('comments')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-sm font-medium text-text-main">Comentarios</span>
                <i className={`fas fa-chevron-${openSection === 'comments' ? 'up' : 'down'} text-text-secondary text-xs transition-transform`}></i>
              </button>
              {openSection === 'comments' && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Add Comment Form */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCommentAuthor}
                        onChange={(e) => setNewCommentAuthor(e.target.value)}
                        placeholder="Nombre"
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                      <button
                        onClick={handleAddComment}
                        className="px-3 py-1.5 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 transition-colors"
                      >
                        Agregar comentario <i className="fas fa-arrow-right ml-1"></i>
                      </button>
                    </div>
                    <textarea
                      value={newCommentContent}
                      onChange={(e) => setNewCommentContent(e.target.value)}
                      placeholder="Comentario"
                      rows={2}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
                    />
                    {commentError && (
                      <p className="text-red-600 text-xs">{commentError}</p>
                    )}
                  </div>

                  {/* Comments List */}
                  {comments.length === 0 ? (
                    <p className="text-sm text-text-secondary italic text-center py-2">No hay comentarios aún.</p>
                  ) : (
                    <div className="space-y-2">
                      {comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-text-main">{comment.author}</span>
                            <span className="text-xs text-text-secondary">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-text-main">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Messages Section */}
            <div className="border-b border-gray-300 dark:border-gray-700">
              <button
                onClick={() => toggleSection('messages')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-sm font-medium text-text-main">Mensajes</span>
                <i className={`fas fa-chevron-${openSection === 'messages' ? 'up' : 'down'} text-text-secondary text-xs transition-transform`}></i>
              </button>
              {openSection === 'messages' && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Add Message Form */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newMessageAuthor}
                        onChange={(e) => setNewMessageAuthor(e.target.value)}
                        placeholder="Nombre"
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                      <button
                        onClick={handleAddMessage}
                        className="px-3 py-1.5 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 transition-colors"
                      >
                        Agregar mensaje <i className="fas fa-arrow-right ml-1"></i>
                      </button>
                    </div>
                    <textarea
                      value={newMessageContent}
                      onChange={(e) => setNewMessageContent(e.target.value)}
                      placeholder="Mensaje"
                      rows={2}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
                    />
                    {messageError && (
                      <p className="text-red-600 text-xs">{messageError}</p>
                    )}
                  </div>

                  {/* Messages List */}
                  {messages.length === 0 ? (
                    <p className="text-sm text-text-secondary italic text-center py-2">No hay mensajes aún.</p>
                  ) : (
                    <div className="space-y-2">
                      {messages.map((message) => (
                        <div key={message.id} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-text-main">{message.author}</span>
                            <span className="text-xs text-text-secondary">{formatDate(message.createdAt)}</span>
                          </div>
                          <p className="text-sm text-text-main">{message.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* History Section */}
            <div>
              <button
                onClick={() => toggleSection('history')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-sm font-medium text-text-main">Historial</span>
                <i className={`fas fa-chevron-${openSection === 'history' ? 'up' : 'down'} text-text-secondary text-xs transition-transform`}></i>
              </button>
              {openSection === 'history' && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-text-secondary italic">Sección de historial - Próximamente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
