'use client';

import React from 'react';
import { DashboardData } from '@/types/dashboard';
import { COLORS, getConditionColor } from '@/lib/colors';

interface ConditionMetricListProps {
  data: DashboardData;
  type: 'participants' | 'sessions';
}

export const ConditionMetricList: React.FC<ConditionMetricListProps> = ({ data, type }) => {
  const participants = data.participants.per_condition;
  const sessions = data.participants.sessions_per_condition;
  
  // Calculate totals for progress bars
  const totalParticipants = participants.reduce((acc, curr) => acc + (curr.n_participants || 0), 0);
  const totalSessions = sessions.reduce((acc, curr) => acc + (curr.n_sessions || 0), 0);

  // Sorting to ensure consistent order: Manual, Assistance, Execution
  const sortedModes = ['Manual', 'Assistance', 'Execution'];

  return (
    <div className="flex items-center justify-between gap-6 h-[48px] px-1">
      {sortedModes.map((mode) => {
        let count = 0;
        let percentage = 0;

        if (type === 'participants') {
          const item = participants.find(p => p.mode === mode);
          count = item?.n_participants || 0;
          percentage = totalParticipants > 0 ? (count / totalParticipants) * 100 : 0;
        } else {
          const item = sessions.find(s => s.mode === mode);
          count = item?.n_sessions || 0;
          percentage = totalSessions > 0 ? (count / totalSessions) * 100 : 0;
        }
        
        return (
          <div key={mode} className="flex-1 space-y-1.5">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{mode}</span>
              <span className="text-xs font-bold text-slate-900">{count}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%`, backgroundColor: getConditionColor(mode) }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
