import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";
import { formatCategory, formatSubcategory } from "../utils/ticketLabels";

export const TicketsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [title, setTitle] = useState("");
  const [validationError, setValidationError] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [viewMode, setViewMode] = useState("cards");
  const { user: currentUser } = useAuth();

  const MAX_TITLE_LENGTH = 100;

  const isCurrentUserStaff = currentUser && currentUser.role !== "STUDENT";

  useEffect(() => {
    const fetchTicketsData = async () => {
      try {
        setLoading(true);
        setApiError("");

        const params = new URLSearchParams({
          page,
          limit,
          ...(title.trim() && { title: title.trim() }),
        });

        const response = await apiFetch(`/tickets?${params.toString()}`);
        setTickets(response.data || []);
        setTotalPages(response.totalPages || 1);
        setTotal(response.total || 0);
        setHasNextPage(page < (response.totalPages || 1));
      } catch (error) {
        const errorMessage = (() => {
          if (error.response?.data?.error) {
            return error.response.data.error;
          }
          if (error.message && error.message.includes("Failed to fetch")) {
            return "No se puede conectar al servidor. Mostrando datos simulados.";
          }
          return (
            error.message || "Error al cargar los tickets. Intenta nuevamente."
          );
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

    if (value.length > MAX_TITLE_LENGTH) {
      setValidationError(
        `El título no puede superar los ${MAX_TITLE_LENGTH} caracteres`,
      );
      return;
    }

    setValidationError("");
    setTitle(value);
    setPage(1);
  };

  const getStatusBadgeColor = (status) => {
    const statusLower = status?.toLowerCase() || "";

    if (statusLower === "open") {
      return "bg-state-resolved/20 text-state-resolved dark:bg-state-resolved/20 dark:text-state-resolved";
    } else if (statusLower === "in progress" || statusLower === "in_progress") {
      return "bg-state-process/20 text-state-process dark:bg-state-process/20 dark:text-state-process";
    } else if (
      statusLower === "waiting_for_student" ||
      statusLower === "waiting for student"
    ) {
      return "bg-state-pending/20 text-state-pending dark:bg-state-pending/20 dark:text-state-pending";
    } else if (
      statusLower === "waiting_for_third_party" ||
      statusLower === "waiting for third party"
    ) {
      return "bg-purple-500/20 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400";
    } else if (statusLower === "resolved") {
      return "bg-state-resolved/20 text-state-resolved dark:bg-state-resolved/20 dark:text-state-resolved";
    } else if (statusLower === "closed") {
      return "bg-text-secondary/10 text-text-secondary dark:bg-text-secondary/10 dark:text-text-secondary";
    } else if (statusLower === "cancelled") {
      return "bg-state-rejected/20 text-state-rejected dark:bg-state-rejected/20 dark:text-state-rejected";
    }

    return "bg-text-secondary/10 text-text-secondary dark:bg-text-secondary/10 dark:text-text-secondary";
  };

  const formatStatus = (status) => {
    const statusMap = {
      OPEN: "Abierto",
      IN_PROGRESS: "En Proceso",
      WAITING_FOR_STUDENT: "Esperando Estudiante",
      WAITING_FOR_THIRD_PARTY: "Esperando Terceros",
      RESOLVED: "Resuelto",
      CLOSED: "Cerrado",
      CANCELLED: "Cancelado",
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
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
        <h2 className="text-2xl font-bold text-text-main">
          Listado de Reclamos
        </h2>
        <div className="flex items-center gap-3">
          {!isCurrentUserStaff && (
            <button
              onClick={() => navigate("/reclamos/create")}
              className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <i className="fas fa-plus text-xs"></i>
              Crear nuevo
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "cards"
                  ? "bg-brand-blue text-white"
                  : "bg-background text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <i className="fas fa-th-large mr-2"></i>
              Tarjetas
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-brand-blue text-white"
                  : "bg-background text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <i className="fas fa-list mr-2"></i>
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={title}
            onChange={handleSearchChange}
            maxLength={MAX_TITLE_LENGTH}
            className={`w-full px-4 py-2 pr-10 border rounded-lg text-sm bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors ${
              validationError
                ? "border-state-rejected bg-state-rejected/10"
                : "border-border"
            }`}
          />
          <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"></i>
        </div>
        {validationError && (
          <p className="text-state-rejected text-sm mt-2">{validationError}</p>
        )}
      </div>

      {/* API Error Message */}
      {apiError && (
        <div className="mb-6 p-4 bg-state-rejected/10 border border-state-rejected/30 rounded-lg">
          <p className="text-state-rejected text-sm">{apiError}</p>
        </div>
      )}

      {/* Cards View */}
      {viewMode === "cards" && (
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="py-8 text-center text-text-secondary">
              Cargando reclamos...
            </div>
          ) : tickets.length === 0 ? (
            <div className="py-8 text-center text-text-secondary">
              No se encontraron reclamos.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => navigate(`/reclamos/${ticket.id}`)}
                  className="bg-surface border border-border rounded-xl p-4 hover:shadow-md transition-all text-left"
                >
                  {/* ID & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-text-secondary">
                      Ticket #{ticket.id}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(ticket.status)}`}
                    >
                      {formatStatus(ticket.status)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-text-main mb-3 truncate">
                    {ticket.title}
                  </h3>

                  {/* Responsable */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-text-secondary mb-1">
                      Responsable
                    </p>
                    <p className="text-sm text-text-main">
                      {ticket.assignedTo
                        ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                        : "Sin asignar"}
                    </p>
                  </div>

                  {/* Category & Subcategory */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary mb-1">
                        Categoría
                      </p>
                      <p className="text-xs text-text-main truncate">
                        {formatCategory(ticket.category) || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-secondary mb-1">
                        Subcategoría
                      </p>
                      <p className="text-xs text-text-main truncate">
                        {formatSubcategory(ticket.subcategory) || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Date & Comments */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary mb-1">
                        Fecha creación
                      </p>
                      <p className="text-xs text-text-main">
                        {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-secondary mb-1">
                        Comentarios
                      </p>
                      <p className="text-xs text-text-main">
                        {ticket.commentsCount || 0}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="flex-1 overflow-auto bg-surface border border-border rounded-xl">
          <table className="w-full border-collapse">
            <thead className="bg-background sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-main border-b border-border">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-main border-b border-border">
                  Título
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-main border-b border-border">
                  Responsable
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-main border-b border-border">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-main border-b border-border">
                  Subcategoría
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-main border-b border-border">
                  Fecha creación
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-main border-b border-border">
                  Comentarios
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-main border-b border-border">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-text-secondary"
                  >
                    Cargando reclamos...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-text-secondary"
                  >
                    No se encontraron reclamos.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/reclamos/${ticket.id}`)}
                    className="border-b border-border hover:bg-background transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-sm text-text-main">
                      {ticket.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-main font-medium max-w-xs truncate">
                      {ticket.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-main">
                      {ticket.assignedTo
                        ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                        : "Sin asignar"}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-main">
                      {formatCategory(ticket.category) || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-main">
                      {formatSubcategory(ticket.subcategory) || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-main">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-main">
                      {ticket.commentsCount || 0}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(ticket.status)}`}
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
          Página <span className="font-semibold">{page}</span>/
          <span className="font-semibold">{totalPages}</span> — Mostrando{" "}
          {tickets.length} de {total} resultado{total !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              page === 1
                ? "bg-background text-text-secondary cursor-not-allowed opacity-60"
                : "bg-brand-blue text-white hover:bg-brand-dark active:scale-95"
            }`}
          >
            Anterior
          </button>
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              hasNextPage
                ? "bg-brand-blue text-white hover:bg-brand-dark active:scale-95"
                : "bg-background text-text-secondary cursor-not-allowed opacity-60"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
