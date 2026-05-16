'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  Zap, 
  Info,
  ChevronRight,
  MousePointer2
} from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { InterventionFrequencyChart } from '@/components/InterventionFrequencyChart';
import { COLORS } from '@/lib/colors';

export default function InterventionCountAnalysis() {
  const stats = [
    { condition: 'Manual', mean: 11.2, median: 7, min: 0, max: 48 },
    { condition: 'Assistance', mean: 5.4, median: 3, min: 0, max: 35 },
    { condition: 'Execution', mean: 4.8, median: 3, min: 0, max: 28, highlighted: true },
  ];

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      {/* HEADER SECTION */}
      <div className="w-full bg-[#0F1238] pt-12 pb-24 px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight">Intervention Count</h1>
          <p className="text-lg text-slate-300 mt-2 font-medium">Quantitative analysis of user interventions per task session.</p>
        </div>
      </div>
      
      <div className="px-8 max-w-[1400px] mx-auto w-full -mt-12 space-y-8 pb-12">
        {/* SUMMARY CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            label="Lowest Median" 
            value="3" 
            subtitle="Execution/Assistance"
            icon={Zap}
            iconColor={COLORS.execution}
            iconBg={`${COLORS.execution}1F`}
            gradient="none"
          />
          <KPICard 
            label="Highest Median" 
            value="7" 
            subtitle="Manual condition"
            icon={MousePointer2}
            iconColor={COLORS.manual}
            iconBg={`${COLORS.manual}1F`}
            gradient="none"
          />
          <KPICard 
            label="Statistical Test" 
            value="H = 43.19" 
            subtitle="p < .001"
            icon={TrendingDown}
            iconColor={COLORS.assistance}
            iconBg={`${COLORS.assistance}1F`}
            gradient="none"
          />
          <KPICard 
            label="Effect Size" 
            value="ε² = .135" 
            subtitle="Medium effect"
            icon={BarChart3}
            iconColor="#F59E0B"
            iconBg="rgba(245, 158, 11, 0.12)"
            gradient="none"
          />
        </div>

        {/* MAIN ANALYSIS CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <DashboardCard title="Median Intervention Count Trend">
              <div className="h-[240px] py-4">
                <InterventionFrequencyChart />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-[13px] text-slate-600 font-medium">
                  Intervention frequency decreased significantly as AI autonomy level increased.
                </p>
              </div>
            </DashboardCard>
          </div>

          <div className="lg:col-span-5">
            <DashboardCard title="Descriptive Statistics">
              <div className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition</th>
                      <th className="py-3 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Mean</th>
                      <th className="py-3 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Median</th>
                      <th className="py-3 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((row) => (
                      <tr key={row.condition} className={`border-b border-slate-50 last:border-0 ${row.highlighted ? 'bg-green-50/30' : ''}`}>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.condition === 'Manual' ? COLORS.manual : row.condition === 'Assistance' ? COLORS.assistance : COLORS.execution }} />
                            <span className="text-xs font-bold text-slate-700">{row.condition}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-xs font-semibold text-slate-600 text-center">{row.mean}</td>
                        <td className="py-4 px-2 text-xs font-bold text-slate-900 text-center">{row.median}</td>
                        <td className="py-4 px-2 text-xs font-semibold text-slate-500 text-center">{row.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex gap-2">
                  <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-500 leading-relaxed italic">
                    Note: Manual condition required users to input all data points, leading to a much higher intervention count. 
                    Assistance and Execution provided AI-generated values, reducing the need for manual edits.
                  </p>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* POST-HOC COMPARISONS */}
        <DashboardCard title="Pairwise Comparisons (Dunn's Test)">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { comp: 'Manual vs Assistance', p: 'p < .001', sig: true },
                { comp: 'Manual vs Execution', p: 'p < .001', sig: true },
                { comp: 'Assistance vs Execution', p: 'p = 1.00', sig: false },
              ].map((item) => (
                <div key={item.comp} className="flex flex-col p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.comp}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-800">{item.p}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item.sig ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {item.sig ? 'Significant' : 'Non-sig'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>
    </main>
  );
}
