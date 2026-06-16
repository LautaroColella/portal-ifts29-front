import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Moon, Sun, Menu, Bell, ClipboardList, RefreshCw, UserCheck, MessageSquare, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notificationApi';
import { currentUser } from '../../services/mockData';

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
  return `Hace ${diffDays}d`;
};

export const Topbar = ({ toggleDarkMode, isDarkMode, toggleSidebar }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotificationsData = async () => {
    try {
      const data = await fetchNotifications(currentUser.id);
      const list = Array.isArray(data) ? data : [];
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.read).length);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotificationsData();
    const interval = setInterval(fetchNotificationsData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // silently fail
      }
    }
    setShowDropdown(false);
    if (notification.ticket?.id) {
      navigate(`/reclamos/${notification.ticket.id}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setDropdownLoading(true);
      await markAllNotificationsAsRead(currentUser.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // silently fail
    } finally {
      setDropdownLoading(false);
    }
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <header className="h-16 bg-brand-blue text-white flex items-center justify-between px-4 md:px-6 transition-colors duration-300 shrink-0">
      <div className="flex-1 flex items-center gap-2 md:gap-4 max-w-2xl">
        <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Menu className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <div className="relative w-full flex items-center text-text-main hidden sm:flex">
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={toggleDarkMode} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-state-rejected text-white text-[10px] font-bold rounded-full px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-text-main">Notificaciones</h3>
                {unreadCount > 0 && (
                  <span className="text-xs text-brand-blue font-medium">{unreadCount} sin leer</span>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {recentNotifications.length === 0 ? (
                  <p className="text-sm text-text-secondary text-center py-6">No hay notificaciones.</p>
                ) : (
                  recentNotifications.map((notification) => {
                    const config = NOTIFICATION_TYPE_CONFIG[notification.type] || { icon: Bell, label: notification.type };
                    const IconComponent = config.icon;
                    return (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full text-left px-4 py-3 border-b border-border last:border-b-0 hover:bg-background transition-colors ${
                          !notification.read ? 'bg-brand-blue/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!notification.read ? 'bg-brand-blue' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <IconComponent className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                              <span className="text-xs font-medium text-text-secondary">{config.label}</span>
                            </div>
                            <p className="text-sm text-text-main truncate">{notification.message}</p>
                            <span className="text-xs text-text-secondary mt-1 block">
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border bg-background">
                <button
                  onClick={() => navigate('/notificaciones')}
                  className="w-full text-center text-xs text-brand-blue font-medium hover:underline mb-2"
                >
                  Ver todas
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={dropdownLoading}
                    className="w-full text-center text-xs text-text-secondary hover:text-text-main transition-colors disabled:opacity-50"
                  >
                    {dropdownLoading ? 'Marcando...' : 'Marcar todas como leídas'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
            JP
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold leading-none">Juan Pérez</p>
            <p className="text-xs text-white/70 mt-1">Administrador</p>
          </div>
          <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
        </div>
      </div>
    </header>
  );
};
