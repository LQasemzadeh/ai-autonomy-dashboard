'use client';

import React from 'react';
import { DashboardData } from '@/types/dashboard';

interface ConditionDistributionListProps {
  data: DashboardData;
}

export const ConditionDistributionList: React.FC<ConditionDistributionListProps> = ({ data }) => {
  const participants = data.participants.per_condition;
  const total = participants.reduce((acc, curr) => acc + (curr.n_participants || 0), 0);

  // Sorting to ensure consistent order: Assistance, Execution, Manual
  const order = ['Assistance', 'Execution', 'Manual'];
  const sortedParticipants = [...participants].sort((a, b) => 
    order.indexOf(a.mode) - order.indexOf(b.mode)
  );

  const colors: Record<string, string> = {
    'Assistance': 'bg-indigo-500',
    'Execution': 'bg-emerald-500',
    'Manual': 'bg-slate-500'
  };

  return (
    <div className="flex items-center justify-between gap-8 h-full py-1">
      {sortedParticipants.map((item) => {
        const count = item.n_participants || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;
        
        return (
          <div key={item.mode} className="flex-1 space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.mode}</span>
              <span className="text-xs font-bold text-slate-900">{count}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${colors[item.mode] || 'bg-slate-400'} transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[9px] text-slate-400 font-medium">{percentage.toFixed(1)}% of total sample</p>
          </div>
        );
      })}
    </div>
  );
};
