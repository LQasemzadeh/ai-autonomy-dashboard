'use client';

import React from 'react';
import { Timer, ShieldCheck, Activity, GitBranch } from 'lucide-react';
import { COLORS } from '@/lib/colors';

const findings = [
  {
    text: "Median completion time decreased with autonomy.",
    icon: Timer,
    color: COLORS.execution
  },
  {
    text: "Execution showed the lowest error and abandonment rates.",
    icon: ShieldCheck,
    color: COLORS.assistance
  },
  {
    text: "Intervention frequency decreased under higher autonomy.",
    icon: Activity,
    color: COLORS.manual
  },
  {
    text: "Intervention shifted toward suggestion-level control.",
    icon: GitBranch,
    color: COLORS.neutral
  }
];

export const KeyFindings: React.FC = () => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row items-stretch">
        {findings.map((finding, index) => (
          <div 
            key={index} 
            className={`flex-1 flex items-center gap-3 p-5 ${
              index !== findings.length - 1 ? 'md:border-r border-b md:border-b-0 border-slate-100' : ''
            }`}
          >
            <div 
              className="flex-shrink-0 p-2 rounded-lg"
              style={{ backgroundColor: `${finding.color}10` }}
            >
              <finding.icon size={18} style={{ color: finding.color }} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col max-w-[200px]">
              <p className="text-[11px] leading-snug font-bold text-slate-700">
                {finding.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
