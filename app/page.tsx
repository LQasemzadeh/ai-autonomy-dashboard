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
      
      <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DashboardCard title="Primary Performance Trends" className="lg:col-span-2 min-h-[400px]">
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 border-2 border-dashed border-slate-100 rounded-lg">
              <BarChart3 size={48} strokeWidth={1} />
              <p className="text-sm font-medium">Performance chart placeholder</p>
            </div>
          </DashboardCard>

          <DashboardCard title="Condition Distribution" className="min-h-[400px]">
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 border-2 border-dashed border-slate-100 rounded-lg">
              <div className="w-32 h-32 rounded-full border-8 border-slate-50 border-t-indigo-200"></div>
              <p className="text-sm font-medium">Distribution chart placeholder</p>
            </div>
          </DashboardCard>
        </div>

        {/* Chart Grid Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DashboardCard title="Intervention Frequency by Stage">
            <div className="aspect-video bg-slate-50 rounded-md border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-400">
              <span className="text-xs uppercase tracking-widest font-bold">Chart Placeholder</span>
            </div>
          </DashboardCard>
          <DashboardCard title="Abandonment Rate Analysis">
            <div className="aspect-video bg-slate-50 rounded-md border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-400">
              <span className="text-xs uppercase tracking-widest font-bold">Chart Placeholder</span>
            </div>
          </DashboardCard>
        </div>

        {/* Data Table Placeholder */}
        <DashboardCard title="Recent Task Execution Logs">
          <div className="space-y-4">
            <div className="w-full bg-slate-50 rounded h-10 animate-pulse"></div>
            <div className="w-full bg-slate-50 rounded h-10 animate-pulse"></div>
            <div className="w-full bg-slate-50 rounded h-10 animate-pulse"></div>
            <div className="w-full bg-slate-50 rounded h-10 animate-pulse"></div>
            <div className="w-full bg-slate-50 rounded h-10 animate-pulse"></div>
            <div className="flex justify-center mt-4">
              <p className="text-sm text-slate-400 italic">Data table implementation pending data source integration</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </main>
  );
}
