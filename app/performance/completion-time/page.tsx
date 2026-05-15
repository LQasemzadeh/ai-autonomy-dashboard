'use client';

import React from 'react';
import { 
  Clock, 
  TrendingDown, 
  Zap, 
  BarChart2, 
  AlertCircle, 
  Info, 
  ChevronRight,
  ArrowDownRight,
  TrendingUp,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { CompletionTimeLineChart } from '@/components/CompletionTimeLineChart';
import { CompletionTimeBoxPlot } from '@/components/CompletionTimeBoxPlot';
import { COLORS } from '@/lib/colors';

export default function CompletionTimeAnalysis() {
  const stats = [
    { condition: 'Manual', mean: 36.07, median: 27.42, min: 12.77, max: 100.97 },
    { condition: 'Assistance', mean: 26.08, median: 18.44, min: 6.99, max: 95.84 },
    { condition: 'Execution', mean: 17.84, median: 10.79, min: 5.34, max: 67.58, highlighted: true },
  ];

  const postHoc = [
    { comparison: 'Manual vs Assistance', p: '< .05', significant: true },
    { comparison: 'Manual vs Execution', p: '< .001', significant: true },
    { comparison: 'Assistance vs Execution', p: '< .01', significant: true },
  ];

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      {/* HEADER SECTION */}
      <div className="w-full bg-[#0F1238] pt-12 pb-24 px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight">Completion Time Analysis</h1>
          <p className="text-lg text-slate-300 mt-2 font-medium">Analysis of task execution duration across AI autonomy conditions.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fastest Median Time</p>
                <Zap size={14} className="text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white">10.79s</p>
              <p className="text-[11px] text-emerald-400 font-medium">Execution condition</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slowest Median Time</p>
                <Clock size={14} className="text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">27.42s</p>
              <p className="text-[11px] text-blue-400 font-medium">Manual condition</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statistical Significance</p>
                <TrendingDown size={14} className="text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">p &lt; .001</p>
              <p className="text-[11px] text-purple-400 font-medium">Kruskal–Wallis test</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Effect Size</p>
                <BarChart2 size={14} className="text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-white">ε² = .186</p>
              <p className="text-[11px] text-orange-400 font-medium">Relatively large effect</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 max-w-[1400px] mx-auto w-full -mt-12 space-y-6 pb-12">
        {/* SECTION 1 — COMPLETION TIME OVERVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <DashboardCard title="Median Completion Time Trend">
              <div className="h-[300px] py-4">
                <CompletionTimeLineChart />
              </div>
            </DashboardCard>
            
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-[13px] text-blue-800 font-medium">
                Completion time decreased progressively as AI execution autonomy increased.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <DashboardCard title="Descriptive Statistics (Seconds)">
              <div className="overflow-hidden mt-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition</th>
                      <th className="py-3 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mean</th>
                      <th className="py-3 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Median</th>
                      <th className="py-3 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Min</th>
                      <th className="py-3 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((row, i) => (
                      <tr key={row.condition} className={`border-b border-slate-50 last:border-0 ${row.highlighted ? 'bg-emerald-50/30' : i % 2 === 0 ? 'bg-slate-50/30' : ''}`}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[row.condition.toLowerCase() as keyof typeof COLORS] }} />
                            <span className="text-xs font-bold text-slate-700">{row.condition}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-xs text-slate-600 font-medium">{row.mean}</td>
                        <td className="py-3 px-2 text-xs font-bold text-slate-900">{row.median}</td>
                        <td className="py-3 px-2 text-xs text-slate-500">{row.min}</td>
                        <td className="py-3 px-2 text-xs text-slate-500">{row.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  Note: Highlighted row indicates the lowest median completion time observed in the study.
                </p>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* SECTION 2 — DISTRIBUTION ANALYSIS */}
        <DashboardCard title="Completion Time Distribution">
          <div className="px-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-slate-500 font-medium">Boxplot with jittered data points (N=160)</p>
            </div>
            <CompletionTimeBoxPlot />
          </div>
          <div className="mt-8 mb-2 mx-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center gap-3">
            <Info className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-[13px] text-emerald-800 font-medium leading-snug">
              Execution showed the lowest and most compact completion time distribution, suggesting more efficient task execution under higher autonomy.
            </p>
          </div>
        </DashboardCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SECTION 3 — OUTLIER INSPECTION */}
          <DashboardCard title="Outlier Detection Summary">
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total completed sessions</p>
                <p className="text-xl font-bold text-slate-800">109</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Sessions &gt; 300s</p>
                <p className="text-xl font-bold text-slate-800">1</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Sessions &gt; 600s</p>
                <p className="text-xl font-bold text-slate-800">1</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Max detected value</p>
                <p className="text-xl font-bold text-slate-800">2964.74s</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-0.5">Outlier Handling Note</h4>
                <p className="text-[12px] text-amber-700 leading-snug">
                  One extreme completion-time outlier was identified in the Execution condition and excluded prior to inferential analysis due to severe right-skew distortion.
                </p>
              </div>
            </div>
          </DashboardCard>

          {/* SECTION 4 — STATISTICAL RESULTS */}
          <div className="flex flex-col gap-6">
            <DashboardCard title="Kruskal–Wallis Result">
              <div className="flex items-center justify-between p-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Statistic</p>
                      <p className="text-lg font-bold text-slate-800">21.506</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">df</p>
                      <p className="text-lg font-bold text-slate-800">2</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">p-value</p>
                      <p className="text-lg font-bold text-slate-800">&lt; .001</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase tracking-wider">
                    Statistically Significant
                  </div>
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-emerald-100 flex items-center justify-center">
                  <TrendingUp className="text-emerald-500" size={32} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Effect Size">
              <div className="p-2">
                <div className="flex items-baseline justify-between mb-2">
                  <p className="text-2xl font-black text-slate-800">ε² = .186</p>
                  <p className="text-xs font-bold text-orange-600 uppercase">Relatively large effect</p>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '18.6%' }} />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Small (.01)</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Medium (.06)</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Large (.14)</span>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* SECTION 5 — POST-HOC COMPARISON */}
        <DashboardCard title="Post-hoc Pairwise Comparisons">
          <div className="overflow-hidden mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-1/2">Comparison</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">p-value</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {postHoc.map((row, i) => (
                  <tr key={row.comparison} className={`border-b border-slate-50 last:border-0 ${i % 2 === 0 ? 'bg-slate-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <span className="text-xs font-bold text-slate-700">{row.comparison}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-slate-600">{row.p}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${row.significant ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        {row.significant ? 'Significant' : 'Not Significant'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        {/* BOTTOM INSIGHT PANEL */}
        <div className="bg-[#0F1238] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10 flex items-start gap-6">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <FileText className="text-blue-300" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Research Interpretation</h3>
              <p className="text-slate-300 text-base leading-relaxed max-w-4xl font-medium">
                The findings indicate that higher levels of AI execution autonomy were associated with significantly faster task completion. 
                Completion time decreased consistently from Manual to Assistance to Execution conditions, with a comparatively large observed effect size.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
