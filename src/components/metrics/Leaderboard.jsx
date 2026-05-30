import React from 'react';
import { Trophy, CheckCircle2, Clock } from 'lucide-react';

export const Leaderboard = ({ data }) => {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-sm border border-border h-full">
      <h3 className="text-base font-semibold text-text-main mb-6 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Ranking de Resolución
      </h3>
      
      <div className="space-y-4">
        {data.map((staff, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-brand-blue/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-main">{staff.name}</p>
                <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {staff.active} act.</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-brand-green flex items-center gap-1">
                {staff.closed} <CheckCircle2 className="w-4 h-4" />
              </span>
              <span className="text-xs text-text-secondary">resueltos</span>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-sm text-text-secondary text-center py-4">No hay datos de responsables asignados.</p>
        )}
      </div>
    </div>
  );
};
