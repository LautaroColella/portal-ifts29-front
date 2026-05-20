import { differenceInDays, differenceInHours, parseISO } from 'date-fns';

export const calculateMetrics = (tickets) => {
    if (!tickets || tickets.length === 0) return null;

    const now = new Date();

    const statusGroups = {
        open: ['OPEN'],
        process: ['IN_PROGRESS', 'WAITING_FOR_STUDENT', 'WAITING_FOR_THIRD_PARTY'],
        resolved: ['RESOLVED', 'CLOSED'],
        cancelled: ['CANCELLED']
    };

    let total = tickets.length;
    let openCount = 0;
    let processCount = 0;
    let resolvedCount = 0;
    let cancelledCount = 0;
    let totalResolutionHours = 0;
    let resolvedTicketsWithTime = 0;
    let pendingOld7 = 0;
     
    const categoryCount = { ACADEMIC: 0, INSTITUTIONAL: 0, TECHNICAL: 0, GENERAL: 0 };

    tickets.forEach(ticket => {
        const createdAt = parseISO(ticket.createdAt);
        const isPending = statusGroups.open.includes(ticket.status) || statusGroups.process.includes(ticket.status);

        if (statusGroups.open.includes(ticket.status)) openCount++;
        if (statusGroups.process.includes(ticket.status)) processCount++;
        if (statusGroups.resolved.includes(ticket.status)) {
            resolvedCount++;
        
            // Tiempo de resolución
            const endTime = ticket.closedAt ? parseISO(ticket.closedAt) : (ticket.resolvedAt ? parseISO(ticket.resolvedAt) : null);
            if (endTime) {
                totalResolutionHours += differenceInHours(endTime, createdAt);
                resolvedTicketsWithTime++;
            }
        }
        if (statusGroups.cancelled.includes(ticket.status)) cancelledCount++;


        // Tickets pendientes
        if (isPending) {
            const daysOld = differenceInDays(now, createdAt);
            if (daysOld > 7) pendingOld7++;        
        }

        // Tickets por categorías
        if (categoryCount[ticket.category] !== undefined) {
            categoryCount[ticket.category]++;
        }
    });

    // Cálculo de promedios
    const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;
    const avgResolutionHours = resolvedTicketsWithTime > 0 ? (totalResolutionHours / resolvedTicketsWithTime) : 0;  
  
    // Formato de gráficos
    const statusChartData = [
        { name: 'Pendientes', value: openCount, color: 'var(--color-state-pending)' },
        { name: 'En Proceso', value: processCount, color: 'var(--color-state-process)' },
        { name: 'Resueltos', value: resolvedCount, color: 'var(--color-state-resolved)' },
        { name: 'Rechazados', value: cancelledCount, color: 'var(--color-state-rejected)' }
    ].filter(i => i.value > 0);

    const categoryChartData = Object.keys(categoryCount).map(key => ({
        name: key === 'ACADEMIC' ? 'Académico' : key === 'INSTITUTIONAL' ? 'Institucional' : key === 'TECHNICAL' ? 'Técnico' : 'General',
        value: categoryCount[key],
        color: '#1E88E5'
    })).filter(i => i.value > 0);

    return {  
        total,
        resolutionRate,
        avgResolutionHours: Math.round(avgResolutionHours),
        pendingOld7,
        statusChartData,
        categoryChartData
    };

};
