import { useState } from 'react';
import { User, Mail, Lock, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = {
  ADMIN: 'Administrador',
  MANAGEMENT: 'Dirección',
  STAFF: 'Personal',
  STUDENT: 'Estudiante',
};

const STAFF_TYPE_LABELS = {
  TUTOR: 'Tutor',
  BEDEL: 'Bedel',
  TECH_SUPPORT: 'Soporte Técnico',
  COORDINATOR: 'Coordinador',
};

export const Profile = () => {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);

      await apiFetch(`/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }),
      });

      if (refreshUser) await refreshUser();
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
    } catch (err) {
      const errorText = err.response?.data?.error || 'Error al actualizar el perfil.';
      setMessage({ type: 'error', text: errorText });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    try {
      setSavingPassword(true);
      setPasswordMessage(null);

      await apiFetch('/auth/change-password', {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' });
    } catch (err) {
      const errorText = err.response?.data?.error || 'Error al cambiar la contraseña.';
      setPasswordMessage({ type: 'error', text: errorText });
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) return null;

  const userInitials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-main">Mi Perfil</h1>
        <p className="text-sm text-text-secondary mt-1">Actualizá tu información personal y contraseña.</p>
      </div>

      <div className="flex-1 overflow-auto pr-4 pb-4 space-y-6">
        {/* User Info Card */}
        <div className="bg-surface rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {userInitials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-main">{user.firstName} {user.lastName}</h2>
              <p className="text-sm text-text-secondary">
                {ROLE_LABELS[user.role] || user.role}
                {user.staffType ? ` — ${STAFF_TYPE_LABELS[user.staffType] || user.staffType}` : ''}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">DNI: {user.dni}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-surface rounded-xl shadow-sm border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-base font-semibold text-text-main flex items-center gap-2">
              <User className="w-4 h-4 text-brand-blue" />
              Información Personal
            </h3>
          </div>
          <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-main">Nombre</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-text-main transition-all text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-main">Apellido</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-text-main transition-all text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-main flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-text-secondary" />
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-text-main transition-all text-sm"
              />
            </div>

            {message && (
              <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-surface rounded-xl shadow-sm border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-base font-semibold text-text-main flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-blue" />
              Cambiar Contraseña
            </h3>
          </div>
          <form onSubmit={handleSavePassword} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-main">Contraseña Actual</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-text-main transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-main">Nueva Contraseña</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-text-main transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-main">Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-text-main transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {passwordMessage && (
              <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                passwordMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {passwordMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {passwordMessage.text}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                {savingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
