import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ClipboardList, RefreshCw, UserCheck, MessageSquare, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/notificationApi';
import { currentUser } from '../services/mockData';

const NOTIFICATION_TYPE_CONFIG = {
  TICKET_CREATED: { icon: ClipboardList, label: 'Ticket creado' },
  STATUS_CHANGED: { icon: RefreshCw, label: 'Estado cambiado' },
  ASSIGNED_CHANGED: { icon: UserCheck, label: 'Asignación cambiada' },
  COMMENT_ADDED: { icon: MessageSquare, label: 'Comentario agregado' },
  MESSAGE_ADDED: { icon: Mail, label: 'Mensaje agregado' },
};

const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return then.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const LIMIT = 10;

  const fetchNotificationsData = async () => {
    try {
      setLoading(true);
      setApiError('');
      const data = await fetchNotifications(currentUser.id, unreadOnly);
      const list = Array.isArray(data) ? data : [];
      setNotifications(list);
    } catch (err) {
      setApiError(err.response?.data?.error || 'Error al cargar las notificaciones.');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotificationsData();
  }, [unreadOnly]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      // silently fail
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }
    if (notification.ticket?.id) {
      navigate(`/reclamos/${notification.ticket.id}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading(true);
      await markAllNotificationsAsRead(currentUser.id);
      if (unreadOnly) {
        setNotifications([]);
      } else {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch {
      // silently fail
    } finally {
      setActionLoading(false);
    }
  };

  const paginatedNotifications = notifications.slice(
    (page - 1) * LIMIT,
    page * LIMIT
  );
  const totalPages = Math.ceil(notifications.length / LIMIT);
  const hasNextPage = page < totalPages;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-brand-blue" />
          <h2 className="text-2xl font-bold text-text-main">Notificaciones</h2>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          disabled={actionLoading || notifications.length === 0}
          className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {actionLoading ? 'Procesando...' : 'Marcar todas como leídas'}
        </button>
      </div>

      {/* Filter Toggle */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => { setUnreadOnly(false); setPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            !unreadOnly
              ? 'bg-brand-blue text-white'
              : 'bg-background text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => { setUnreadOnly(true); setPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            unreadOnly
              ? 'bg-brand-blue text-white'
              : 'bg-background text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Solo no leídas
        </button>
      </div>

      {/* Error Message */}
      {apiError && (
        <div className="mb-4 p-3 bg-state-rejected/10 border border-state-rejected/30 rounded-lg">
          <p className="text-state-rejected text-sm">{apiError}</p>
        </div>
      )}

      {/* Notifications List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <p className="text-sm text-text-secondary text-center py-8">Cargando notificaciones...</p>
        ) : paginatedNotifications.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-8">No hay notificaciones.</p>
        ) : (
          <div className="space-y-2">
            {paginatedNotifications.map((notification) => {
              const config = NOTIFICATION_TYPE_CONFIG[notification.type] || { icon: Bell, label: notification.type };
              const IconComponent = config.icon;
              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left px-4 py-4 rounded-xl border transition-all hover:shadow-sm ${
                    !notification.read
                      ? 'bg-surface border-brand-blue/30 hover:border-brand-blue/50'
                      : 'bg-surface border-border hover:border-border'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Read indicator */}
                    <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                      !notification.read ? 'bg-brand-blue' : 'bg-transparent'
                    }`} />

                    {/* Icon */}
                    <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4 text-text-secondary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-text-secondary">{config.label}</span>
                        {!notification.read && (
                          <span className="text-[10px] font-medium text-brand-blue bg-brand-blue/10 px-1.5 py-0.5 rounded-full">
                            Nueva
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-main leading-snug">{notification.message}</p>
                      {notification.ticket && (
                        <p className="text-xs text-brand-blue mt-1 hover:underline">
                          Ver ticket: {notification.ticket.title}
                        </p>
                      )}
                    </div>

                    {/* Time */}
                    <span className="text-xs text-text-secondary shrink-0 mt-1">
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-text-secondary">
            Página <span className="font-semibold">{page}</span> de {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`p-2 rounded-lg transition-all ${
                page === 1
                  ? 'bg-background text-text-secondary cursor-not-allowed opacity-60'
                  : 'bg-brand-blue text-white hover:bg-brand-dark'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!hasNextPage}
              className={`p-2 rounded-lg transition-all ${
                !hasNextPage
                  ? 'bg-background text-text-secondary cursor-not-allowed opacity-60'
                  : 'bg-brand-blue text-white hover:bg-brand-dark'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
