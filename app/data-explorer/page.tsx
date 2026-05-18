'use client';

import React from 'react';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Activity,
  Search,
  Filter,
  Download,
  RotateCcw,
  ChevronDown
} from 'lucide-react';

export default function DataExplorerPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <div className="w-full bg-[#0F1238] pt-12 pb-24 px-8 shrink-0">
        <div className="max-w-[1400px] mx-auto w-full">
          <h1 className="text-3xl font-bold text-white tracking-tight">Data Explorer</h1>
          <p className="text-lg text-slate-300 mt-2 font-medium">Inspect session-level behavioral data and event logs used in the analysis.</p>
        </div>
      </div>
      
      <main className="px-8 max-w-[1400px] mx-auto w-full -mt-12 space-y-8 pb-12 flex-1 min-w-0">
        {/* KPI SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-full">
          <KPICard 
            label="Total Sessions" 
            value="160" 
            subtitle="analyzed sessions"
            icon={Users}
            gradient="blue"
          />
          <KPICard 
            label="Completed Sessions" 
            value="143" 
            subtitle="task completed"
            icon={CheckCircle2}
            gradient="green"
          />
          <KPICard 
            label="Abandoned Sessions" 
            value="17" 
            subtitle="no completion event"
            icon={AlertCircle}
          />
          <KPICard 
            label="Events Logged" 
            value="932" 
            subtitle="behavioral events"
            icon={Activity}
            gradient="purple"
          />
        </div>

        {/* FILTERS & SEARCH CARD */}
        <DashboardCard className="w-full">
          <div className="flex flex-col gap-6">
            {/* Row 1: Search & Export */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by Session ID, Participant ID, or Task..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all shrink-0 w-full md:w-auto justify-center">
                <Download size={14} />
                Export CSV
              </button>
            </div>

            {/* Row 2: Filters & Reset */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Condition Filter */}
              <div className="relative flex-1 min-w-[140px] md:min-w-[160px]">
                <select className="w-full appearance-none pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-slate-300 cursor-pointer transition-all">
                  <option value="">Condition: All</option>
                  <option value="manual">Manual</option>
                  <option value="assistance">Assistance</option>
                  <option value="execution">Execution</option>
                </select>
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Filter size={14} className="text-slate-400" />
                </div>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>

              {/* Outcome Filter */}
              <div className="relative flex-1 min-w-[140px] md:min-w-[160px]">
                <select className="w-full appearance-none pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-slate-300 cursor-pointer transition-all">
                  <option value="">Outcome: All</option>
                  <option value="completed">Completed</option>
                  <option value="abandoned">Abandoned</option>
                </select>
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Activity size={14} className="text-slate-400" />
                </div>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>

              {/* Error Status Filter */}
              <div className="relative flex-1 min-w-[140px] md:min-w-[160px]">
                <select className="w-full appearance-none pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-slate-300 cursor-pointer transition-all">
                  <option value="">Error Status: All</option>
                  <option value="none">No Errors</option>
                  <option value="at-least-one">At Least One Error</option>
                </select>
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <AlertCircle size={14} className="text-slate-400" />
                </div>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>

              {/* Intervention Filter */}
              <div className="relative flex-1 min-w-[140px] md:min-w-[160px]">
                <select className="w-full appearance-none pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-slate-300 cursor-pointer transition-all">
                  <option value="">Intervention: All</option>
                  <option value="none">With Intervention</option>
                  <option value="without">Without Intervention</option>
                </select>
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Users size={14} className="text-slate-400" />
                </div>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>

              {/* Reset Button */}
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all shrink-0">
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </div>
        </DashboardCard>
        
      </main>
    </div>
  );
}
