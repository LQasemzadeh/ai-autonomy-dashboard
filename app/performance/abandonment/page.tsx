'use client';

import React from 'react';
import { 
  TrendingDown, 
  TrendingUp,
  Activity,
  BarChart2,
  Info,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { AbandonmentRateBarChart } from '@/components/AbandonmentRateBarChart';
import { TaskOutcomeStackedBar } from '@/components/TaskOutcomeStackedBar';
import { COLORS } from '@/lib/colors';

export default function AbandonmentAnalysis() {
  const comparisons = [
    { pair: 'Assistance vs Manual', p: '.857', sig: false },
    { pair: 'Execution vs Manual', p: '.010', sig: true },
    { pair: 'Execution vs Assistance', p: '.254', sig: false },
  ];

  const oddsRatios = [
    { pair: 'Manual vs Assistance', or: '1.66', ci: '[0.76, 3.62]', highlight: false },
    { pair: 'Manual vs Execution', or: '4.05', ci: '[1.65, 9.93]', highlight: true },
    { pair: 'Assistance vs Execution', or: '2.44', ci: '[0.98, 6.09]', highlight: false },
  ];

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      {/* HEADER SECTION */}
      <div className="w-full bg-[#0F1238] pt-12 pb-24 px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight">Abandonment Analysis</h1>
          <p className="text-lg text-slate-300 mt-2 font-medium">Analysis of task completion and abandonment across AI autonomy conditions.</p>
        </div>
      </div>
      
      <div className="px-8 max-w-[1400px] mx-auto w-full -mt-12 space-y-8 pb-12">
        {/* KPI CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            label="Highest Abandonment Rate" 
            value="45.3%" 
            subtitle="Manual condition"
            icon={XCircle}
            iconColor={COLORS.manual}
            iconBg={`${COLORS.manual}1F`}
            gradient="none"
          />
          <KPICard 
            label="Lowest Abandonment Rate" 
            value="17.0%" 
            subtitle="Execution condition"
            icon={CheckCircle2}
            iconColor={COLORS.execution}
            iconBg={`${COLORS.execution}1F`}
            gradient="none"
          />
          <KPICard 
            label="Statistical Test" 
            value="χ² = 9.86" 
            subtitle="p = .007"
            icon={Activity}
            iconColor={COLORS.assistance}
            iconBg={`${COLORS.assistance}1F`}
            gradient="none"
          />
          <KPICard 
            label="Effect Size" 
            value="Cramér’s V = .248" 
            subtitle="Small effect"
            icon={BarChart2}
            iconColor="#F59E0B"
            iconBg="rgba(245, 158, 11, 0.12)"
            gradient="none"
          />
        </div>

        {/* SECTION 1 — ABANDONMENT RATE OVERVIEW */}
        <div className="grid grid-cols-1 gap-6">
          <DashboardCard title="Abandonment Rate by Condition">
            <p className="text-sm text-slate-500 mb-4 font-medium">Proportion of started sessions without task completion</p>
            <AbandonmentRateBarChart />
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-[13px] text-slate-600 font-medium">
                Abandonment was highest in Manual and lowest in Execution.
              </p>
            </div>
          </DashboardCard>
        </div>

        {/* SECTION 2 — TASK OUTCOME BREAKDOWN */}
        <div className="grid grid-cols-1 gap-6">
          <DashboardCard title="Task Outcome Breakdown">
            <div className="h-[250px] py-2">
              <TaskOutcomeStackedBar />
            </div>
          </DashboardCard>
        </div>

        {/* SECTION 3 — STATISTICAL RESULTS & PAIRWISE COMPARISON */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* STATISTICAL RESULTS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard title="Chi-square Test">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500 font-medium">Statistic</span>
                  <span className="text-sm font-bold text-slate-900">9.855</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500 font-medium">df</span>
                  <span className="text-sm font-bold text-slate-900">2</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500 font-medium">p-value</span>
                  <span className="text-sm font-bold text-slate-900">.007</span>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    Statistically significant
                  </span>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Effect Size">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500 font-medium">Cramér’s V</span>
                  <span className="text-sm font-bold text-slate-900">0.248</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500 font-medium">Interpretation</span>
                  <span className="text-sm font-bold text-slate-900">Small effect</span>
                </div>
                <div className="pt-4">
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-400 h-2 rounded-full" style={{ width: '24.8%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Small</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Medium</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Large</span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* PAIRWISE COMPARISON */}
          <DashboardCard title="Pairwise Comparison">
            <div className="overflow-hidden rounded-lg border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Comparison</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">p-value</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisons.map((comp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-bold text-slate-700">{comp.pair}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-600 text-right">{comp.p}</td>
                      <td className="px-4 py-3.5 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                          comp.sig ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {comp.sig ? 'Significant' : 'Not significant'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>

        {/* SECTION 4 — ODDS RATIO SECTION */}
        <div className="grid grid-cols-1 gap-6">
          <DashboardCard title="Odds Ratio Analysis">
            <div className="overflow-hidden rounded-lg border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Comparison</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Odds Ratio</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">95% CI</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Strength</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {oddsRatios.map((ratio, idx) => (
                    <tr key={idx} className={`hover:bg-slate-50/30 transition-colors ${ratio.highlight ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-4 py-3.5 text-sm font-bold text-slate-700">{ratio.pair}</td>
                      <td className="px-4 py-3.5 text-sm font-extrabold text-slate-900 text-center">{ratio.or}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-500 text-center font-mono">{ratio.ci}</td>
                      <td className="px-4 py-3.5 text-right">
                        {ratio.highlight ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                            Strongest Contrast <ArrowRight size={14} />
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-slate-400">Moderate</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>

        {/* SECTION 5 — RESEARCH INTERPRETATION */}
        <div className="grid grid-cols-1 gap-6">
          <DashboardCard title="Research Interpretation">
            <div className="flex gap-4 p-2">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-indigo-500" />
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                Task outcome differed significantly across autonomy conditions. Descriptively, abandonment decreased from Manual to Assistance to Execution. Pairwise tests indicated that Execution differed significantly from Manual, while the other pairwise differences were not statistically significant.
              </p>
            </div>
          </DashboardCard>
        </div>
      </div>
    </main>
  );
}
