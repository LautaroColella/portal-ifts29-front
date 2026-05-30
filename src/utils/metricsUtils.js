import { differenceInDays, differenceInHours, parseISO, format, subDays } from 'date-fns';

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
    const ticketsByDate = {}; // Format: YYYY-MM-DD
    const responsibleStats = {}; // { [name]: { closed: 0, active: 0 } }

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

        // Tickets por período
        const dateKey = format(createdAt, 'yyyy-MM-dd');
        ticketsByDate[dateKey] = (ticketsByDate[dateKey] || 0) + 1;

        // Tickets según asignados
        if (ticket.assignedTo?.name) {
            const staffName = ticket.assignedTo.name;
            if (!responsibleStats[staffName]) responsibleStats[staffName] = { closed: 0, active: 0 };
            
            if (statusGroups.resolved.includes(ticket.status)) {
                responsibleStats[staffName].closed++;
            } else if (isPending) {
                responsibleStats[staffName].active++;
            }
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

    const timeChartData = [];
    for (let i = 13; i >= 0; i--) {
        const d = subDays(now, i);
        const dateKey = format(d, 'yyyy-MM-dd');
        timeChartData.push({
        date: format(d, 'dd/MM'),
        tickets: ticketsByDate[dateKey] || 0
        });
    }

    const leaderboardData = Object.keys(responsibleStats).map(name => ({
        name,
        ...responsibleStats[name]
    })).sort((a, b) => b.closed - a.closed);

    // Tickets recientes (toma los primeros 5, asumiendo que están ordenados de forma descendente)
    const recentTickets = tickets.slice(0, 5).map(t => ({
        id: t.id,
        title: t.title,
        category: t.category === 'ACADEMIC' ? 'Académico' : t.category === 'INSTITUTIONAL' ? 'Institucional' : t.category === 'TECHNICAL' ? 'Técnico' : 'General',
        status: t.status === 'OPEN' ? 'Pendiente' : (t.status === 'IN_PROGRESS' || t.status.startsWith('WAITING')) ? 'En proceso' : (t.status === 'RESOLVED' || t.status === 'CLOSED') ? 'Resuelto' : 'Rechazado',
        date: format(parseISO(t.createdAt), 'dd/MM/yyyy')
    }));
    
    return {  
        total,
        resolutionRate,
        avgResolutionHours: Math.round(avgResolutionHours),
        pendingOld7,
        statusChartData,
        categoryChartData,
        timeChartData,
        leaderboardData,
        recentTickets
    };

};
