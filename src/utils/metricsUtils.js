export const calculateMetrics = (tickets) => {
    if (!tickets || tickets.length === 0) return null;

    const statusGroups = {
        open: ['OPEN'],
        process: ['IN_PROGRESS', 'WAITING_FOR_STUDENT', 'WAITING_FOR_THIRD_PARTY'],
        resolved: ['RESOLVED', 'CLOSED'],
        cancelled: ['CANCELLED']
    };

    let total = tickets.length;
    let resolvedCount = 0;
     
    tickets.forEach(ticket => {
        if (statusGroups.resolved.includes(ticket.status)) {
            resolvedCount++;
        }
    });

    // Cálculo de promedios
    const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;
  
    return {  
        total,
        resolutionRate    
    };

};
