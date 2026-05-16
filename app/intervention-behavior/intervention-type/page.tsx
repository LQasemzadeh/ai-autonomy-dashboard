'use client';

import React from 'react';
import { 
  Layers, 
  ArrowRightLeft, 
  ShieldAlert, 
  Info,
  ChevronRight,
  Settings
} from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { InterventionType } from '@/components/InterventionType';
import { COLORS } from '@/lib/colors';

export default function InterventionTypeAnalysis() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      {/* HEADER SECTION */}
      <div className="w-full bg-[#0F1238] pt-12 pb-24 px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight">Type of Intervention</h1>
          <p className="text-lg text-slate-300 mt-2 font-medium">Qualitative shift in user interaction patterns across autonomy conditions.</p>
        </div>
      </div>
      
      <div className="px-8 max-w-[1400px] mx-auto w-full -mt-12 space-y-8 pb-12">
        {/* SUMMARY CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            label="Dominant Type: Manual" 
            value="Field Edit" 
            subtitle="92% of sessions"
            icon={Settings}
            iconColor={COLORS.manual}
            iconBg={`${COLORS.manual}1F`}
            gradient="none"
          />
          <KPICard 
            label="Dominant Type: Assist" 
            value="Field Edit" 
            subtitle="94% of sessions"
            icon={ArrowRightLeft}
            iconColor={COLORS.assistance}
            iconBg={`${COLORS.assistance}1F`}
            gradient="none"
          />
          <KPICard 
            label="Dominant Type: Exec" 
            value="Rejection" 
            subtitle="91% of sessions"
            icon={ShieldAlert}
            iconColor={COLORS.execution}
            iconBg={`${COLORS.execution}1F`}
            gradient="none"
          />
          <KPICard 
            label="Key Shift" 
            value="Override" 
            subtitle="Peak in Assistance"
            icon={Layers}
            iconColor="#F59E0B"
            iconBg="rgba(245, 158, 11, 0.12)"
            gradient="none"
          />
        </div>

        {/* MAIN ANALYSIS CARD */}
        <DashboardCard title="Intervention Type Matrix">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <InterventionType />
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                <h4 className="text-[11px] font-bold text-blue-900 uppercase tracking-widest mb-3">Manual Focus</h4>
                <p className="text-[12px] text-blue-800/80 leading-relaxed">
                  Users primarily engaged in <span className="font-bold">Field Edits</span>, as they were responsible for entering all data manually.
                </p>
              </div>
              
              <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100">
                <h4 className="text-[11px] font-bold text-purple-900 uppercase tracking-widest mb-3">Assistance Complexity</h4>
                <p className="text-[12px] text-purple-800/80 leading-relaxed">
                  Introduced <span className="font-bold">Overrides</span> (81%) and <span className="font-bold">Rejections</span> (35%), showing a more critical evaluation of AI suggestions.
                </p>
              </div>
              
              <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <h4 className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest mb-3">Execution Transition</h4>
                <p className="text-[12px] text-emerald-800/80 leading-relaxed">
                  Shifted almost entirely away from edits toward <span className="font-bold">Suggestion Rejection</span> (91%), treating the AI as a primary actor.
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* DEFINITIONS SECTION */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 mb-6">Type Definitions</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                <Settings className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Field Edit</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  User manually changes the value of an input field. In Manual mode, this is the default action. In higher autonomy, this represents correcting specific AI-filled values.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 border-t border-slate-50 pt-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                <ArrowRightLeft className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Override</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  User actively bypasses an AI-suggested decision or automated step, replacing it with their own judgment. Peak occurrence in Assistance mode.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 border-t border-slate-50 pt-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                <ShieldAlert className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Suggestion Rejection</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  User explicitly clicks to reject an AI suggestion or requests a regeneration. Most common in Execution mode where AI leads the interaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
