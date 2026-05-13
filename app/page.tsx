import React from 'react';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { SectionHeader } from '@/components/SectionHeader';
import { 
  BarChart3, 
  Clock, 
  AlertCircle, 
  Target 
} from 'lucide-react';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <Header />
      <FilterBar />
      
      <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6">
        {/* KPI Overview */}
        <section>
          <SectionHeader 
            title="Executive Summary" 
            subtitle="High-level performance metrics across all test conditions." 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard 
              label="Success Rate" 
              value="84.2%" 
              trend={{ value: 3.1, isPositive: true }}
              icon={Target}
            />
            <KPICard 
              label="Avg. Time to Task" 
              value="12.4m" 
              trend={{ value: 0.8, isPositive: true }}
              icon={Clock}
            />
            <KPICard 
              label="Error Rate" 
              value="12.5%" 
              trend={{ value: 1.2, isPositive: false }}
              icon={AlertCircle}
            />
            <KPICard 
              label="Autonomy Score" 
              value="68.9" 
              trend={{ value: 5.4, isPositive: true }}
              icon={BarChart3}
            />
          </div>
        </section>

        {/* Main Insight and Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard title="Primary Performance Trends" className="lg:col-span-2 min-h-[350px]">
            <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3 border border-dashed border-slate-200 rounded-lg bg-slate-50/30">
              <BarChart3 size={32} strokeWidth={1.5} className="opacity-50" />
              <p className="text-[11px] font-medium tracking-wide uppercase opacity-70">Awaiting visualization data</p>
            </div>
          </DashboardCard>

          <DashboardCard title="Condition Distribution" className="min-h-[350px]">
            <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3 border border-dashed border-slate-200 rounded-lg bg-slate-50/30">
              <div className="w-24 h-24 rounded-full border-[6px] border-slate-50 border-t-indigo-100 opacity-50"></div>
              <p className="text-[11px] font-medium tracking-wide uppercase opacity-70">Awaiting visualization data</p>
            </div>
          </DashboardCard>
        </div>

        {/* Chart Grid Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard title="Intervention Frequency by Stage">
            <div className="aspect-[21/9] bg-slate-50/50 rounded border border-dashed border-slate-200 flex items-center justify-center text-slate-300">
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Visualization Pending</span>
            </div>
          </DashboardCard>
          <DashboardCard title="Abandonment Rate Analysis">
            <div className="aspect-[21/9] bg-slate-50/50 rounded border border-dashed border-slate-200 flex items-center justify-center text-slate-300">
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Visualization Pending</span>
            </div>
          </DashboardCard>
        </div>

        {/* Data Table Placeholder */}
        <DashboardCard title="Recent Task Execution Logs">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full bg-slate-50/80 rounded h-8 animate-pulse flex items-center px-4">
                <div className="h-2 w-1/4 bg-slate-100 rounded"></div>
                <div className="ml-auto h-2 w-1/6 bg-slate-100 rounded"></div>
              </div>
            ))}
            <div className="flex justify-center mt-2">
              <p className="text-[11px] text-slate-400 italic font-medium">Data table implementation pending data source integration</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </main>
  );
}
