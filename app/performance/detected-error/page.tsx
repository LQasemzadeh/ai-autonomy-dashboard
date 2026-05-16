'use client';

import React from 'react';
import { 
  Skull, 
  TrendingDown, 
  Zap, 
  BarChart2, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  TrendingUp,
  FileText,
  Activity
} from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { ErrorRateBarChart } from '@/components/ErrorRateBarChart';
import { ErrorPresenceStackedBar } from '@/components/ErrorPresenceStackedBar';
import { COLORS } from '@/lib/colors';

export default function DetectedErrorAnalysis() {
  const comparisons = [
    { pair: 'Assistance vs Manual', p: '< .001', sig: true },
    { pair: 'Execution vs Manual', p: '< .001', sig: true },
    { pair: 'Execution vs Assistance', p: '1.000', sig: false },
  ];

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      {/* HEADER SECTION */}
      <div className="w-full bg-[#0F1238] pt-12 pb-24 px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight">Detected Error Analysis</h1>
          <p className="text-lg text-slate-300 mt-2 font-medium">Analysis of validation-error occurrence across AI autonomy conditions.</p>
        </div>
      </div>
      
      <div className="px-8 max-w-[1400px] mx-auto w-full -mt-12 space-y-8 pb-12">
        {/* KPI CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            label="Highest Error Rate" 
            value="56.6%" 
            secondaryValue="Manual condition"
            icon={XCircle}
            iconColor={COLORS.manual}
            iconBg={`${COLORS.manual}1F`}
            gradient="none"
          />
          <KPICard 
            label="Lowest Error Rate" 
            value="15.1%" 
            secondaryValue="Execution condition"
            icon={CheckCircle2}
            iconColor={COLORS.execution}
            iconBg={`${COLORS.execution}1F`}
            gradient="none"
          />
          <KPICard 
            label="Statistical Test" 
            value="χ² = 25.53" 
            secondaryValue="p < .001"
            icon={Activity}
            iconColor={COLORS.assistance}
            iconBg={`${COLORS.assistance}1F`}
            gradient="none"
          />
          <KPICard 
            label="Effect Size" 
            value="Cramér’s V = .399" 
            secondaryValue="Medium effect"
            icon={BarChart2}
            iconColor="#F59E0B"
            iconBg="rgba(245, 158, 11, 0.12)"
            gradient="none"
          />
        </div>

        {/* SECTION 1 — ERROR RATE OVERVIEW */}
        <div className="grid grid-cols-1 gap-6">
          <DashboardCard 
            title="Detected Error Rate by Condition"
          >
            <p className="text-sm text-slate-500 mb-6 font-medium">Proportion of started sessions with at least one validation error</p>
            <ErrorRateBarChart />
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-[13px] text-slate-600 font-medium">
                Detected errors were most frequent in Manual and lowest under Execution.
              </p>
            </div>
          </DashboardCard>
        </div>

        {/* SECTION 2 — ERROR PRESENCE BREAKDOWN */}
        <div className="grid grid-cols-1 gap-6">
          <DashboardCard 
            title="Error Presence Breakdown"
          >
            <div className="h-[350px] py-4">
              <ErrorPresenceStackedBar />
            </div>
          </DashboardCard>
        </div>

        {/* SECTION 3 — STATISTICAL RESULTS & PAIRWISE COMPARISON */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* STATISTICAL RESULTS */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard title="Chi-square Test">
              <div className="space-y-4 py-2">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Statistic</span>
                  <span className="text-sm font-bold text-slate-800">25.525</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">df</span>
                  <span className="text-sm font-bold text-slate-800">2</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">p-value</span>
                  <span className="text-sm font-bold text-slate-800">{"< .001"}</span>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                    Statistically significant
                  </span>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Effect Size">
              <div className="space-y-6 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Cramér’s V</span>
                  <span className="text-sm font-bold text-slate-800">0.399</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>Interpretation</span>
                    <span className="text-amber-600">Medium effect</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* PAIRWISE COMPARISON */}
          <div className="lg:col-span-4">
            <DashboardCard title="Pairwise Comparison">
              <div className="space-y-3 mt-2">
                {comparisons.map((c, i) => (
                  <div key={i} className="flex flex-col p-3 rounded-xl border border-slate-50 bg-slate-50/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-slate-500">{c.pair}</span>
                      {c.sig ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700">SIGNIFICANT</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 text-slate-500">NOT SIGNIFICANT</span>
                      )}
                    </div>
                    <span className="text-sm font-extrabold text-slate-800">p = {c.p}</span>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* SECTION 4 — RESEARCH INTERPRETATION */}
        <DashboardCard>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Research Interpretation</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Detected-error occurrence differed significantly across autonomy conditions. Manual sessions showed substantially higher error occurrence than Assistance and Execution, while Assistance and Execution did not differ significantly from each other.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </main>
  );
}
