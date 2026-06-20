import { AlertTriangle, ClipboardList, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryChart } from "../components/metrics/CategoryChart";
import { Leaderboard } from "../components/metrics/Leaderboard";
import { RecentTickets } from "../components/metrics/RecentTickets";
import { StatCard } from "../components/metrics/StatCard";
import { StatusChart } from "../components/metrics/StatusChart";
import { TimeChart } from "../components/metrics/TimeChart";
import { apiFetch } from "../services/api";

const STATUS_LABELS = {
  OPEN: "Pendientes",
  IN_PROGRESS: "En Proceso",
  WAITING_FOR_STUDENT: "En Proceso",
  WAITING_FOR_THIRD_PARTY: "En Proceso",
  RESOLVED: "Resueltos",
  CLOSED: "Resueltos",
  CANCELLED: "Rechazados",
};

const STATUS_COLORS = {
  Pendientes: "var(--color-state-pending)",
  "En Proceso": "var(--color-state-process)",
  Resueltos: "var(--color-state-resolved)",
  Rechazados: "var(--color-state-rejected)",
};

const CATEGORY_LABELS = {
  ACADEMIC: "Académico",
  INSTITUTIONAL: "Institucional",
  TECHNICAL: "Técnico",
  GENERAL: "General",
};

const STATUS_DISPLAY = {
  OPEN: "Pendiente",
  IN_PROGRESS: "En proceso",
  WAITING_FOR_STUDENT: "En proceso",
  WAITING_FOR_THIRD_PARTY: "En proceso",
  RESOLVED: "Resuelto",
  CLOSED: "Resuelto",
  CANCELLED: "Rechazado",
};

const transformMetrics = (apiData, recentTicketsData) => {
  const grouped = {};
  (apiData.ticketsByStatus || []).forEach(({ status, count }) => {
    const label = STATUS_LABELS[status] || status;
    grouped[label] = (grouped[label] || 0) + count;
  });

  const statusChartData = Object.entries(grouped)
    .map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name] || "#999",
    }))
    .filter((i) => i.value > 0);

  const categoryChartData = (apiData.ticketsByCategory || [])
    .map(({ category, count }) => ({
      name: CATEGORY_LABELS[category] || category,
      value: count,
      color: "#1E88E5",
    }))
    .filter((i) => i.value > 0);

  const timeChartData = (apiData.ticketsCreatedByPeriod || []).map(
    ({ period, count }) => {
      const d = new Date(period);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      return { date: `${dd}/${mm}`, tickets: count };
    },
  );

  const leaderboardData = (apiData.topResolvers || []).map(
    ({ responsible, closedTickets }) => ({
      name: responsible,
      closed: closedTickets,
      active: 0,
    }),
  );

  const recentTickets = (recentTicketsData || []).slice(0, 5).map((t) => {
    const d = new Date(t.createdAt);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return {
      id: t.id,
      title: t.title,
      category: CATEGORY_LABELS[t.category] || t.category,
      status: STATUS_DISPLAY[t.status] || t.status,
      date: `${dd}/${mm}/${yyyy}`,
    };
  });

  return {
    total: apiData.totals?.totalTickets || 0,
    resolutionRate: apiData.resolutionRate?.percentage || 0,
    avgResolutionHours: Math.round(apiData.averageResolutionTime?.hours || 0),
    pendingOld7: apiData.oldPendingTickets?.olderThan7Days || 0,
    statusChartData,
    categoryChartData,
    timeChartData,
    leaderboardData,
    recentTickets,
  };
};

export const MetricsDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [metricsResponse, ticketsResponse] = await Promise.all([
          apiFetch("/dashboard/metrics"),
          apiFetch("/tickets?page=1&limit=5"),
        ]);

        const apiMetrics = metricsResponse.data || metricsResponse;
        const recentTickets = ticketsResponse.data || [];
        const metrics = transformMetrics(apiMetrics, recentTickets);
        setData(metrics);
      } catch (err) {
        setError(err.message || "Error al cargar las métricas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="text-text-secondary text-center py-8">
        Cargando métricas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-state-rejected/10 border border-state-rejected/30 rounded-lg">
        <p className="text-state-rejected text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-text-secondary text-center py-8">
        No hay datos disponibles.
      </div>
    );
  }

  const statsConfig = [
    {
      title: "Total de Reclamos",
      value: data.total,
      icon: ClipboardList,
      colorClass: "bg-brand-blue",
    },
    {
      title: "Tasa de Resolución",
      value: `${data.resolutionRate}%`,
      icon: TrendingUp,
      colorClass: "bg-brand-green",
    },
    {
      title: "Tiempo Prom. Resolución",
      value: `${data.avgResolutionHours} hs`,
      icon: Clock,
      colorClass: "bg-state-process",
    },
    {
      title: "Críticos (>7 días)",
      value: data.pendingOld7,
      icon: AlertTriangle,
      colorClass: "bg-state-rejected",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
          <span className="text-brand-blue">
            <ClipboardList />
          </span>
          Dashboard Analítico
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsConfig.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 min-h-[300px]">
          <StatusChart data={data.statusChartData} />
        </div>
        <div className="lg:col-span-1 min-h-[300px]">
          <CategoryChart data={data.categoryChartData} />
        </div>
        <div className="lg:col-span-1 min-h-[300px]">
          <TimeChart data={data.timeChartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 min-h-[300px]">
          <Leaderboard data={data.leaderboardData} />
        </div>
        <div className="lg:col-span-2 min-h-[300px]">
          <RecentTickets tickets={data.recentTickets} />
        </div>
      </div>
    </div>
  );
};
