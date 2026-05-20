import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const TimeChart = ({ data }) => {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-sm border border-border h-full flex flex-col">
      <h3 className="text-base font-semibold text-text-main mb-6">Volumen de Tickets (Últimos 14 días)</h3>
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand-blue)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-brand-blue)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-sec-color)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-sec-color)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-main-color)', borderRadius: '0.5rem' }}
            />
            <Area type="monotone" dataKey="tickets" stroke="var(--color-brand-blue)" fillOpacity={1} fill="url(#colorTickets)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
