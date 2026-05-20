export const calculateMetrics = (tickets) => {
  if (!tickets || tickets.length === 0) return null;

  let total = tickets.length;
     
  // Cálculo de tendencias simuladas
  const totalTrend = `+${Math.round(total * 0.1)}%`;

  return {  
    total,
    totalTrend
  };

};
