import React from 'react';

export const StatCard = ({ title, value, trend, icon: Icon, colorClass, borderClass }) => {
  return (
    <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClass} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
     
      </div>
      <div>
        <h3 className="text-3xl font-bold text-text-main mb-1">{value}</h3>
        <p className="text-sm text-text-secondary">{title}</p>
      </div>
    </div>
  );
};
