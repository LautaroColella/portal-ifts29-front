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
    let resolvedCount = 0;
    let totalResolutionHours = 0;
    let resolvedTicketsWithTime = 0;
    let pendingOld7 = 0;
     
    tickets.forEach(ticket => {
        const createdAt = parseISO(ticket.createdAt);
        const isPending = statusGroups.open.includes(ticket.status) || statusGroups.process.includes(ticket.status);

        if (statusGroups.resolved.includes(ticket.status)) {
            resolvedCount++;
        
            // Tiempo de resolución
            const endTime = ticket.closedAt ? parseISO(ticket.closedAt) : (ticket.resolvedAt ? parseISO(ticket.resolvedAt) : null);
            if (endTime) {
                totalResolutionHours += differenceInHours(endTime, createdAt);
                resolvedTicketsWithTime++;
            }
        }

        // Tickets pendientes
        if (isPending) {
            const daysOld = differenceInDays(now, createdAt);
            if (daysOld > 7) pendingOld7++;        
        }

    });

    // Cálculo de promedios
    const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;
    const avgResolutionHours = resolvedTicketsWithTime > 0 ? (totalResolutionHours / resolvedTicketsWithTime) : 0;  
  
    return {  
        total,
        resolutionRate,
        avgResolutionHours: Math.round(avgResolutionHours),
        pendingOld7
    };

};
