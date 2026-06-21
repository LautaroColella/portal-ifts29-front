import { motion } from "framer-motion";
import { Edit2, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { UserForm } from "../components/users/UserForm";
import { userService } from "../services/userService";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveError, setSaveError] = useState('');

  const roleLabels = {
    ADMIN: "Administrador",
    STAFF: "Staff",
    STUDENT: "Estudiante",
    MANAGEMENT: "Dirección",
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenForm = (user = null) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedUser(null);
    setIsFormOpen(false);
    setSaveError('');
  };

  const handleSaveUser = async (userData) => {
    try {
      setSaveError('');
      const payload = { ...userData };
      if (!payload.password) delete payload.password;
      if (payload.role !== "STAFF") {
        delete payload.staffType;
        delete payload.responsibleSubcategories;
      }

      if (selectedUser) {
        const profileData = {};
        if (payload.firstName !== selectedUser.firstName) profileData.firstName = payload.firstName;
        if (payload.lastName !== selectedUser.lastName) profileData.lastName = payload.lastName;
        if (payload.email !== selectedUser.email) profileData.email = payload.email;

        if (Object.keys(profileData).length > 0) {
          await userService.updateUser(selectedUser.id, profileData);
        }

        if (payload.role !== selectedUser.role) {
          await userService.updateUserRole(selectedUser.id, { role: payload.role });
        }

        if (payload.role === 'STAFF') {
          await userService.updateUserStaffSettings(selectedUser.id, {
            staffType: payload.staffType,
            responsibleSubcategories: payload.responsibleSubcategories || [],
          });
        }
      } else {
        await userService.createUser(payload);
      }
      fetchUsers();
      handleCloseForm();
    } catch (error) {
      const msg = error.response?.data?.error || error.message || 'Error al guardar usuario';
      setSaveError(msg);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setDeleteLoading(true);
      await userService.deleteUser(userToDelete.id);
      fetchUsers();
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.dni.includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">
            Gestión de Usuarios
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Administra los usuarios del sistema, sus roles y accesos.
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all font-medium text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-border p-4">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-text-secondary" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-text-main placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
            placeholder="Buscar por nombre, apellido, DNI o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-text-secondary">
                  <th className="py-3 px-4 font-medium">Nombre Completo</th>
                  <th className="py-3 px-4 font-medium">DNI</th>
                  <th className="py-3 px-4 font-medium">Rol</th>
                  <th className="py-3 px-4 font-medium">Fecha de alta</th>
                  <th className="py-3 px-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={user.id}
                      className="border-b border-border hover:bg-background/50 transition-colors group"
                    >
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-text-main">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-text-main">
                        {user.dni}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            user.role === "ADMIN"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : user.role === "STAFF"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : user.role === "MANAGEMENT"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {roleLabels[user.role] || user.role}{" "}
                          {user.role === "STAFF" && user.staffType ? `(${user.staffType})` : ""}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-text-main">
                        {new Date(user.createdAt).toLocaleString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2 transition-opacity">
                          <button
                            onClick={() => handleOpenForm(user)}
                            className="p-1.5 text-text-secondary hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-10 text-center text-text-secondary"
                    >
                      No se encontraron usuarios que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-sm border border-border">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-state-rejected/10 flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-state-rejected"></i>
                </div>
                <h3 className="text-lg font-bold text-text-main">
                  Eliminar Usuario
                </h3>
              </div>
              <p className="text-sm text-text-secondary mb-6">
                ¿Estás seguro de que deseas eliminar a{" "}
                <strong>
                  {userToDelete.firstName} {userToDelete.lastName}
                </strong>
                ? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);
                  }}
                  className="px-4 py-2 bg-background border border-border text-text-main rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={deleteLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-state-rejected text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>{" "}
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash-alt text-xs"></i> Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <UserForm
          user={selectedUser}
          onClose={handleCloseForm}
          onSave={handleSaveUser}
          error={saveError}
        />
      )}
    </div>
  );
};
