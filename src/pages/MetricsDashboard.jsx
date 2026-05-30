import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/metrics/StatCard';
import { StatusChart } from '../components/metrics/StatusChart';
import { CategoryChart } from '../components/metrics/CategoryChart';
import { TimeChart } from '../components/metrics/TimeChart';
import { Leaderboard } from '../components/metrics/Leaderboard';
import { ClipboardList, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import dbData from '../data/db.json';
import { calculateMetrics } from '../utils/metricsUtils';

export const MetricsDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular una petición asíncrona a la API 
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulamos 800ms de red
        // Utilizamos el json crudo y calculamos todo en frontend simulando el back
        const metrics = calculateMetrics(dbData.tickets);
        setData(metrics);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

    if (isLoading || !data) {
        return <div>Cargando...</div>;
    }

    const statsConfig = [
        { title: 'Total de Reclamos', value: data.total, icon: ClipboardList, colorClass: 'bg-brand-blue' },
        { title: 'Tasa de Resolución', value: `${data.resolutionRate}%`, icon: TrendingUp, colorClass: 'bg-brand-green' },
        { title: 'Tiempo Prom. Resolución', value: `${data.avgResolutionHours} hs`, icon: Clock, colorClass: 'bg-state-process' },
        { title: 'Críticos (>7 días)', value: data.pendingOld7, icon: AlertTriangle, colorClass: 'bg-state-rejected' }
    ];

    return (
        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
                <span className="text-brand-blue"><ClipboardList /></span>
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
                   
                </div>
            </div>

        </div>
    );
};
