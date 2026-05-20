import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const CategoryChart = ({ data }) => {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-sm border border-border h-full flex flex-col">
        <h3 className="text-base font-semibold text-text-main mb-6">Tickets por Categoría</h3>
        <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="name" tick={{ fill: 'var(--text-sec-color)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text-sec-color)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                        cursor={{ fill: 'var(--border-color)', opacity: 0.4 }}
                        contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-main-color)', borderRadius: '0.5rem' }}
                    />
                    <Bar dataKey="value" fill="var(--color-brand-blue)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};
