import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const StatusChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-surface rounded-xl p-6 shadow-sm border border-border h-full flex flex-col">
      <h3 className="text-base font-semibold text-text-main mb-6">Reclamos por estado</h3>
      <div className="flex-1 flex items-center justify-center relative">
        <div className="w-full h-48 md:h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-main-color)', borderRadius: '0.5rem' }}
                itemStyle={{ color: 'var(--text-main-color)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-text-main">{total}</span>
            <span className="text-xs text-text-secondary">Total</span>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-sm text-text-secondary">{item.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-text-main">{item.value}</span>
              <span className="text-text-secondary text-xs">({((item.value / total) * 100).toFixed(0)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
