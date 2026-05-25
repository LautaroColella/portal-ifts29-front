import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { mockUsers } from '../services/mockData';

export const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSection, setOpenSection] = useState(null);

  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [sectionLoading, setSectionLoading] = useState({});
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [newMessageAuthor, setNewMessageAuthor] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [commentError, setCommentError] = useState('');
  const [messageError, setMessageError] = useState('');

  const [showResponsiblePopup, setShowResponsiblePopup] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [selectedResponsible, setSelectedResponsible] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [responsibleSearch, setResponsibleSearch] = useState('');
  const [popupError, setPopupError] = useState('');

  const RESPONSIBLES = Object.values(mockUsers)
    .filter((u) => u.id !== 12 && u.id !== 1 && u.id !== 2 && u.id !== 3 && u.id !== 4 && u.id !== 5)
    .map((u) => u.name);

  const STATUSES = [
    'OPEN',
    'IN_PROGRESS',
    'WAITING_FOR_STUDENT',
    'WAITING_FOR_THIRD_PARTY',
    'RESOLVED',
    'CLOSED',
    'CANCELLED',
  ];

  const toggleSection = async (section) => {
    if (openSection === section) {
      setOpenSection(null);
      return;
    }

    try {
      setOpenSection(section);
      setSectionLoading((prev) => ({ ...prev, [section]: true }));

      let endpoint;
      if (section === 'comments') {
        endpoint = `/tickets/${id}/comments`;
      } else if (section === 'messages') {
        endpoint = `/tickets/${id}/messages`;
      } else if (section === 'history') {
        endpoint = `/tickets/${id}/history`;
      }

      if (!endpoint) {
        console.error(`Unknown section: ${section}`);
        return;
      }

      let response;
      try {
        response = await apiFetch(endpoint);
      } catch (fetchErr) {
        console.error(`Fetch error for ${section}:`, fetchErr);
        response = { data: [] };
      }

      const data = response?.data;

      if (section === 'comments') {
        setComments(Array.isArray(data) ? data : []);
      } else if (section === 'messages') {
        setMessages(Array.isArray(data) ? data : []);
      } else if (section === 'history') {
        setHistory(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(`Unexpected error in toggleSection ${section}:`, err);
      if (section === 'comments') {
        setComments([]);
      } else if (section === 'messages') {
        setMessages([]);
      } else if (section === 'history') {
        setHistory([]);
      }
    } finally {
      try {
        setSectionLoading((prev) => ({ ...prev, [section]: false }));
      } catch (e) {
        console.error('Error updating section loading:', e);
      }
    }
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

  const openResponsiblePopup = () => {
    try {
      setSelectedResponsible(ticket?.assignedTo?.name || '');
      setResponsibleSearch('');
      setPopupError('');
      setShowResponsiblePopup(true);
    } catch (err) {
      console.error('Error opening responsible popup:', err);
    }
  };

  const openStatusPopup = () => {
    try {
      setSelectedStatus(ticket?.status || '');
      setPopupError('');
      setShowStatusPopup(true);
    } catch (err) {
      console.error('Error opening status popup:', err);
    }
  };

  const handleUpdateResponsible = async () => {
    if (!selectedResponsible.trim()) {
      setPopupError('Debes seleccionar un responsable');
      return;
    }

    try {
      setPopupError('');
      const responsibleUser = Object.values(mockUsers).find((u) => u.name === selectedResponsible.trim());
      setTicket({ ...ticket, assignedTo: responsibleUser || null });
      setShowResponsiblePopup(false);
    } catch {
      setPopupError('Error al actualizar el responsable');
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      setPopupError('Debes seleccionar un estado');
      return;
    }

    try {
      setPopupError('');
      const response = await apiFetch(`/tickets/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: selectedStatus }),
      });

      setTicket(response.data || response);
      setShowStatusPopup(false);
    } catch (err) {
      const errorMessage = (() => {
        if (err.response?.data?.error) {
          return err.response.data.error;
        }
        return err.message || 'Error al actualizar el estado.';
      })();
      setPopupError(errorMessage);
    }
  };

  const filteredResponsibles = RESPONSIBLES.filter((r) =>
    r.toLowerCase().includes(responsibleSearch.toLowerCase())
  );

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
        <div className="border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
          {/* Header: Responsable | Ticket ID | Estado */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{ticket.assignedTo?.name || 'Sin asignar'}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openResponsiblePopup();
                }}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-500 hover:text-primary-600 transition-colors dark:bg-gray-700 dark:hover:bg-primary-900 dark:text-gray-400 dark:hover:text-primary-400"
                title="Editar responsable"
              >
                <i className="fas fa-pencil-alt text-xs"></i>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Ticket {ticket.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(ticket.status)}`}>
                {formatStatus(ticket.status)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openStatusPopup();
                }}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-500 hover:text-primary-600 transition-colors dark:bg-gray-700 dark:hover:bg-primary-900 dark:text-gray-400 dark:hover:text-primary-400"
                title="Editar estado"
              >
                <i className="fas fa-pencil-alt text-xs"></i>
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">{ticket.title}</h3>
          </div>

          {/* Description */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 min-h-[120px]">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
          </div>

          {/* Info Grid */}
          <div className="p-4 space-y-2">
            {/* Row 1: Creador | Fecha creación */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2.5">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Creador</p>
                <p className="text-sm text-gray-900 dark:text-white font-semibold">{ticket.createdBy?.name || 'Sin asignar'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2.5">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Fecha creación</p>
                <p className="text-sm text-gray-900 dark:text-white font-semibold">{formatDate(ticket.createdAt)}</p>
              </div>
            </div>

            {/* Row 2: Categoría | Subcategoría */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2.5">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Categoría</p>
                <p className="text-sm text-gray-900 dark:text-white font-semibold">{ticket.category || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2.5">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Subcategoría</p>
                <p className="text-sm text-gray-900 dark:text-white font-semibold">{ticket.subcategory || 'N/A'}</p>
              </div>
            </div>

            {/* Row 3: Materia | Comisión */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2.5">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Materia</p>
                <p className="text-sm text-gray-900 dark:text-white font-semibold">{ticket.subject || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2.5">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Comisión</p>
                <p className="text-sm text-gray-900 dark:text-white font-semibold">{ticket.commission || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            {/* Comments Section */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleSection('comments')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Comentarios</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                  <i className={`fas fa-chevron-${openSection === 'comments' ? 'up' : 'down'} text-xs`}></i>
                </span>
              </button>
              {openSection === 'comments' && (
                <div className="px-4 pb-4 space-y-3">
                  {sectionLoading.comments ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">Cargando comentarios...</p>
                  ) : (
                    <>
                      {/* Add Comment Form */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newCommentAuthor}
                            onChange={(e) => setNewCommentAuthor(e.target.value)}
                            placeholder="Nombre"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <button
                            onClick={handleAddComment}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                          >
                            Agregar <i className="fas fa-arrow-right text-xs"></i>
                          </button>
                        </div>
                        <textarea
                          value={newCommentContent}
                          onChange={(e) => setNewCommentContent(e.target.value)}
                          placeholder="Escribí tu comentario..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        {commentError && (
                          <p className="text-red-600 dark:text-red-400 text-xs font-medium">{commentError}</p>
                        )}
                      </div>

                      {/* Comments List */}
                      {comments.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">No hay comentarios aún.</p>
                      ) : (
                        <div className="space-y-2">
                          {comments.map((comment) => (
                            <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-900 dark:text-white">{comment.author?.name || 'Sin asignar'}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Messages Section */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleSection('messages')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Mensajes</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                  <i className={`fas fa-chevron-${openSection === 'messages' ? 'up' : 'down'} text-xs`}></i>
                </span>
              </button>
              {openSection === 'messages' && (
                <div className="px-4 pb-4 space-y-3">
                  {sectionLoading.messages ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">Cargando mensajes...</p>
                  ) : (
                    <>
                      {/* Add Message Form */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newMessageAuthor}
                            onChange={(e) => setNewMessageAuthor(e.target.value)}
                            placeholder="Nombre"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <button
                            onClick={handleAddMessage}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                          >
                            Agregar <i className="fas fa-arrow-right text-xs"></i>
                          </button>
                        </div>
                        <textarea
                          value={newMessageContent}
                          onChange={(e) => setNewMessageContent(e.target.value)}
                          placeholder="Escribí tu mensaje..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        {messageError && (
                          <p className="text-red-600 dark:text-red-400 text-xs font-medium">{messageError}</p>
                        )}
                      </div>

                      {/* Messages List */}
                      {messages.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">No hay mensajes aún.</p>
                      ) : (
                        <div className="space-y-2">
                          {messages.map((message) => (
                            <div key={message.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-900 dark:text-white">{message.author?.name || 'Sin asignar'}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(message.createdAt)}</span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{message.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* History Section */}
            <div>
              <button
                onClick={() => toggleSection('history')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Historial</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                  <i className={`fas fa-chevron-${openSection === 'history' ? 'up' : 'down'} text-xs`}></i>
                </span>
              </button>
              {openSection === 'history' && (
                <div className="px-4 pb-4 space-y-2">
                  {sectionLoading.history ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">Cargando historial...</p>
                  ) : history.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">No hay entradas en el historial.</p>
                  ) : (
                    history.map((entry) => (
                      <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(entry.createdAt)}</span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">{entry.performedBy?.name || 'Sistema'}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{entry.description}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Responsible Edit Popup */}
      {showResponsiblePopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Editar Responsable</h3>

              {/* Search Input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={responsibleSearch}
                  onChange={(e) => setResponsibleSearch(e.target.value)}
                  placeholder="Buscar nombre"
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
              </div>

              {/* Name List */}
              <div className="space-y-1.5 mb-4 max-h-48 overflow-y-auto pr-1">
                {filteredResponsibles.map((responsible) => (
                  <button
                    key={responsible}
                    onClick={() => setSelectedResponsible(responsible)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      selectedResponsible === responsible
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {responsible}
                      {selectedResponsible === responsible && (
                        <i className="fas fa-check text-sm"></i>
                      )}
                    </span>
                  </button>
                ))}
              </div>

              {popupError && (
                <p className="text-red-600 dark:text-red-400 text-xs mb-3 font-medium">{popupError}</p>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowResponsiblePopup(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateResponsible}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  Actualizar <i className="fas fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Edit Popup */}
      {showStatusPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Editar Estado</h3>

              {/* Status Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === status
                        ? 'bg-primary-500 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1">
                      {formatStatus(status)}
                      {selectedStatus === status && (
                        <i className="fas fa-check text-xs"></i>
                      )}
                    </span>
                  </button>
                ))}
              </div>

              {popupError && (
                <p className="text-red-600 dark:text-red-400 text-xs mb-3 font-medium">{popupError}</p>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowStatusPopup(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  Actualizar <i className="fas fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
