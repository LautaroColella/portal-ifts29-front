import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const roles = ['STUDENT', 'STAFF', 'MANAGEMENT', 'ADMIN'];
const staffTypes = ['TUTOR', 'BEDEL', 'TECH_SUPPORT', 'COORDINATOR'];

export const UserForm = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    password: '',
    role: 'STUDENT',
    staffType: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dni: user.dni || '',
        email: user.email || '',
        password: '', 
        role: user.role || 'STUDENT',
        staffType: user.staffType || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'role' && value !== 'STAFF' ? { staffType: '' } : {})
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-border"
        >
          <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-[var(--sidebar-active-bg)] to-transparent">
            <h2 className="text-xl font-bold text-text-main">
              {user ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-background text-text-secondary hover:text-text-main transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-main">Nombre</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-text-main transition-all"
                  placeholder="Ej. Juan"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-main">Apellido</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-text-main transition-all"
                  placeholder="Ej. Pérez"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-main">DNI</label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-text-main transition-all"
                  placeholder="Ej. 12345678"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-main">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-text-main transition-all"
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-main">Rol</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-text-main transition-all appearance-none"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {formData.role === 'STAFF' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main">Tipo de Staff</label>
                  <select
                    name="staffType"
                    value={formData.staffType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-text-main transition-all appearance-none"
                  >
                    <option value="">Selecciona tipo...</option>
                    {staffTypes.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Contraseña solo si es nuevo o si se quiere cambiar */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-main">
                  Contraseña {user && <span className="text-text-secondary text-xs font-normal">(Dejar en blanco para no cambiar)</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!user}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-text-main transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-background transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {user ? 'Guardar Cambios' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
