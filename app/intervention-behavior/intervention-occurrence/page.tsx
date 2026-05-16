'use client';

import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronRight
} from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { COLORS } from '@/lib/colors';

export default function InterventionOccurrenceAnalysis() {
  const data = [
    { condition: 'Manual', rate: 92.5, sessions: 107 },
    { condition: 'Assistance', rate: 94.4, sessions: 108 },
    { condition: 'Execution', rate: 90.6, sessions: 106, highlighted: true },
  ];

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      {/* HEADER SECTION */}
      <div className="w-full bg-[#0F1238] pt-12 pb-24 px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight">Intervention Occurrence</h1>
          <p className="text-lg text-slate-300 mt-2 font-medium">Proportion of sessions where at least one user intervention occurred.</p>
        </div>
      </div>
      
      <div className="px-8 max-w-[1400px] mx-auto w-full -mt-12 space-y-8 pb-12">
        {/* SUMMARY CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            label="Highest Occurrence" 
            value="94.4%" 
            subtitle="Assistance condition"
            icon={Activity}
            iconColor={COLORS.assistance}
            iconBg={`${COLORS.assistance}1F`}
            gradient="none"
          />
          <KPICard 
            label="Lowest Occurrence" 
            value="90.6%" 
            subtitle="Execution condition"
            icon={CheckCircle2}
            iconColor={COLORS.execution}
            iconBg={`${COLORS.execution}1F`}
            gradient="none"
          />
          <KPICard 
            label="Statistical Test" 
            value="χ² = 1.12" 
            subtitle="p = .570"
            icon={Info}
            iconColor="#64748b"
            iconBg="rgba(100, 116, 139, 0.12)"
            gradient="none"
          />
          <KPICard 
            label="Significance" 
            value="Non-sig." 
            subtitle="No significant difference"
            icon={AlertCircle}
            iconColor="#94a3b8"
            iconBg="rgba(148, 163, 184, 0.12)"
            gradient="none"
          />
        </div>

        {/* MAIN ANALYSIS CARD */}
        <DashboardCard title="Intervention Rate by Condition">
          <div className="p-6">
            <div className="flex flex-col space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.map((item) => (
                  <div key={item.condition} className="relative flex flex-col items-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{item.condition}</div>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="58"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-slate-50"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="58"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={364.4}
                          strokeDashoffset={364.4 - (364.4 * item.rate) / 100}
                          strokeLinecap="round"
                          style={{ color: item.condition === 'Manual' ? COLORS.manual : item.condition === 'Assistance' ? COLORS.assistance : COLORS.execution }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-900">{item.rate}%</span>
                      </div>
                    </div>
                    <div className="mt-4 text-[11px] text-slate-500 font-medium">{item.sessions} sessions analyzed</div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border-l-4 border-slate-300 p-4 rounded-r-xl">
                <div className="flex gap-3">
                  <div className="mt-1 bg-white p-1 rounded-full shadow-sm">
                    <Info className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                    Intervention occurrence remained consistently high (above 90%) across all conditions. 
                    A Chi-square test indicated no significant difference in the proportion of sessions with at least one intervention 
                    between Manual, Assistance, and Execution modes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* INSIGHT CARD */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 mb-4">Research Interpretation</h3>
          <p className="text-slate-600 leading-relaxed max-w-4xl">
            Despite significant reductions in intervention <span className="font-bold">frequency</span> (count) as autonomy increases, 
            the <span className="font-bold">occurrence</span> of at least one intervention remains nearly universal. This suggests 
            that users still find reason to interact with the system or verify outputs even in high-autonomy modes, although they do so 
            less often.
          </p>
        </div>
      </div>
    </main>
  );
}
