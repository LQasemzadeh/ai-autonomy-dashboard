'use client';

import React from 'react';
import { 
  Activity, 
  BarChart2, 
  Info,
  TrendingUp,
  FileText,
  AlertCircle
} from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { InterventionOccurrenceStackedBar } from '@/components/InterventionOccurrenceStackedBar';

export default function InterventionOccurrence() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      {/* HEADER SECTION */}
      <div className="w-full bg-[#0F1238] pt-12 pb-24 px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight">Intervention Occurrence</h1>
          <p className="text-lg text-slate-300 mt-2 font-medium">Occurrence of at least one intervention event across autonomy conditions.</p>
        </div>
      </div>
      
      <div className="px-8 max-w-[1400px] mx-auto w-full -mt-12 space-y-8 pb-12">
        {/* KPI CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            label="Intervention Rate" 
            value="92%" 
            subtitle="Average across conditions"
            icon={Activity}
            iconColor="#64748b"
            iconBg="#f1f5f9"
            gradient="none"
          />
          <KPICard 
            label="Highest Occurrence" 
            value="94%" 
            subtitle="Assistance condition"
            icon={TrendingUp}
            iconColor="#64748b"
            iconBg="#f1f5f9"
            gradient="none"
          />
          <KPICard 
            label="Statistical Test" 
            value="χ² = 0.58" 
            subtitle="p = .748"
            icon={FileText}
            iconColor="#64748b"
            iconBg="#f1f5f9"
            gradient="none"
          />
          <KPICard 
            label="Effect Size" 
            value="V = 0.06" 
            subtitle="Small effect"
            icon={BarChart2}
            iconColor="#64748b"
            iconBg="#f1f5f9"
            gradient="none"
          />
        </div>

        {/* MAIN VISUALIZATION */}
        <div className="grid grid-cols-1 gap-6">
          <DashboardCard 
            title="Intervention Occurrence Across Conditions"
          >
            <p className="text-sm text-slate-500 mb-6 font-medium">Presence of at least one intervention during task execution</p>
            <InterventionOccurrenceStackedBar />
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-[13px] text-slate-600 font-medium">
                Intervention occurrence remained consistently high across all autonomy conditions.
              </p>
            </div>
          </DashboardCard>
        </div>

        {/* STATISTICAL INTERPRETATION SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard title="Chi-square Test">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-semibold text-slate-600">Statistic (χ²)</span>
                <span className="text-sm font-bold text-slate-900">0.58</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-semibold text-slate-600">df</span>
                <span className="text-sm font-bold text-slate-900">2</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-semibold text-slate-600">p-value</span>
                <span className="text-sm font-bold text-slate-900">.748</span>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  Not significant
                </span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Effect Size">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-600">Cramér’s V</span>
                  <span className="text-sm font-bold text-slate-900">0.06</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: '6%' }} />
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interpretation</span>
                </div>
                <p className="text-sm text-slate-700 font-medium">Small effect size, indicating negligible difference between conditions.</p>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* INTERPRETATION PANEL */}
        <DashboardCard className="bg-white border-l-4 border-l-slate-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Research Interpretation</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Intervention occurrence did not differ significantly across autonomy conditions. 
                Intervention remained highly prevalent across Manual, Assistance, and Execution conditions, 
                indicating that participants continued to intervene regardless of system autonomy level.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </main>
  );
}
