'use client';

import React from 'react';
import { Users, FileText, Layers, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { ConditionDistributionChart } from '@/components/ConditionDistributionChart';
import { ProgressionFlow } from '@/components/ProgressionFlow';
import { DashboardCard } from '@/components/DashboardCard';

export default function SampleProgression() {
  const participantsData = [
    { name: 'Manual', value: 76 },
    { name: 'Assistance', value: 75 },
    { name: 'Execution', value: 76 },
  ];

  const sessionsData = [
    { name: 'Manual', value: 53 },
    { name: 'Assistance', value: 54 },
    { name: 'Execution', value: 53 },
  ];

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      {/* HERO SECTION */}
      <div className="w-full bg-[#0F1238] pt-12 pb-24 px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight">Sample & Progression</h1>
          <p className="text-lg text-slate-300 mt-2 font-medium">Detailed breakdown of participant distribution and study flow</p>
        </div>
      </div>
      
      <div className="px-8 max-w-[1400px] mx-auto w-full -mt-12">
        <div className="space-y-8 pb-12">
          {/* SUMMARY CARDS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard 
              label="Total Participants" 
              value="227" 
              icon={Users}
              gradient="none"
            />
            <KPICard 
              label="Analyzed Sessions" 
              value="160" 
              icon={FileText}
              gradient="none"
            />
            <KPICard 
              label="Study Conditions" 
              value="3" 
              icon={Layers}
              gradient="none"
            />
            <KPICard 
              label="Not Started" 
              value="64" 
              icon={Clock}
              gradient="none"
            />
          </div>

          {/* CONDITION DISTRIBUTION CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConditionDistributionChart 
              title="Participants by Condition"
              subtitle="Number of participants allocated to each condition"
              data={participantsData}
            />
            <ConditionDistributionChart 
              title="Sessions by Condition"
              subtitle="Analyzed sessions per condition"
              data={sessionsData}
            />
          </div>

          {/* STUDY PROGRESSION FLOW */}
          <ProgressionFlow />

          {/* BOTTOM INFORMATION CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard>
              <div className="p-3 flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-purple-700 mb-0.5 tracking-tight">Data & Exclusion Note</h3>
                  <p className="text-[13px] text-slate-600 leading-snug">
                    Only started sessions were included in behavioral analyses. Completion time analyses excluded one extreme outlier.
                  </p>
                </div>
              </div>
            </DashboardCard>
            <DashboardCard>
              <div className="p-3 flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-700 mb-0.5 tracking-tight">Sample Interpretation</h3>
                  <p className="text-[13px] text-slate-600 leading-snug">
                    The final analyzed sample was balanced across autonomy conditions, supporting fair descriptive comparison between Manual, Assistance, and Execution.
                  </p>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </main>
  );
}
