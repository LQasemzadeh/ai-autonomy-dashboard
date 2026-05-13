'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { SectionHeader } from '@/components/SectionHeader';
import { PerformanceChart } from '@/components/PerformanceChart';
import { fetchDashboardData, getKPIMetrics } from '@/lib/dashboard-data';
import { DashboardData, AutonomyCondition } from '@/types/dashboard';
import { 
  BarChart3, 
  Clock, 
  AlertCircle, 
  Target,
  Users,
  Loader2
} from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [condition, setCondition] = useState<AutonomyCondition>('All');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const kpis = useMemo(() => {
    if (!data) return null;
    return getKPIMetrics(data, condition);
  }, [data, condition]);

  if (error) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="mx-auto text-rose-500" />
          <h2 className="text-xl font-bold text-slate-900">Unable to load dashboard</h2>
          <p className="text-slate-500 max-w-md">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      <Header />
      <FilterBar 
        currentCondition={condition} 
        onConditionChange={setCondition} 
      />
      
      <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6">
        {/* KPI Overview */}
        <section>
          <SectionHeader 
            title="Executive Summary" 
            subtitle={data ? `Analyzing results from ${data.metadata.total_participants} participants across ${condition === 'All' ? 'all conditions' : condition + ' condition'}.` : "Loading metrics..."}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-white rounded-lg border border-slate-100 animate-pulse" />
              ))
            ) : kpis ? (
              <>
                <KPICard 
                  label="Success Rate" 
                  value={kpis.successRate} 
                  icon={Target}
                />
                <KPICard 
                  label="Avg. Completion Time" 
                  value={kpis.avgTime} 
                  icon={Clock}
                />
                <KPICard 
                  label="Error Rate" 
                  value={kpis.errorRate} 
                  icon={AlertCircle}
                />
                <KPICard 
                  label="Participants" 
                  value={kpis.nParticipants} 
                  icon={Users}
                />
              </>
            ) : null}
          </div>
        </section>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 size={40} className="text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-medium">Processing dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Main Insight and Secondary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <DashboardCard title="Primary Performance Trends" className="lg:col-span-2 min-h-[350px]">
                {data && (
                  <>
                    <PerformanceChart data={data} selectedCondition={condition} />
                    <div className="mt-4 pt-4 border-t border-slate-50">
                      <p className="text-xs text-slate-500 italic">
                        {condition === 'Execution' || condition === 'All' 
                          ? "Execution condition showed higher completion rates with lower abandonment behavior compared to Manual and Assistance modes."
                          : condition === 'Manual'
                          ? "Manual condition shows the highest abandonment rate, suggesting higher task difficulty or lower user engagement without AI assistance."
                          : "Assistance mode provides a middle ground with improved completion rates compared to Manual mode."}
                      </p>
                    </div>
                  </>
                )}
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
          </>
        )}
      </div>
    </main>
  );
}
