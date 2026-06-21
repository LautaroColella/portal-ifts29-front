import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCategory } from '../../utils/ticketLabels';

export const RecentTickets = ({ tickets }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "Pendiente":
        return "bg-state-pending/10 text-state-pending border-state-pending/20";
      case "En proceso":
        return "bg-state-process/10 text-state-process border-state-process/20";
      case "Resuelto":
        return "bg-state-resolved/10 text-state-resolved border-state-resolved/20";
      case "Rechazado":
        return "bg-state-rejected/10 text-state-rejected border-state-rejected/20";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-sm border border-border flex flex-col h-full">
      <h3 className="text-base font-semibold text-text-main mb-4">
        Reclamos recientes
      </h3>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/reclamos/${ticket.id}`)}
              className="flex items-center justify-between p-3 hover:bg-background rounded-lg transition-colors border border-transparent hover:border-border cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-main line-clamp-1">
                    {ticket.title}
                  </h4>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {formatCategory(ticket.category)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(ticket.status)}`}
                >
                  {ticket.status}
                </span>
                <span className="text-xs text-text-secondary hidden sm:block">
                  {ticket.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
