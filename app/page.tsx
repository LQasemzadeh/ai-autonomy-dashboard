'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { fetchDashboardData, getKPIMetrics } from '@/lib/dashboard-data';
import { DashboardData, AutonomyCondition } from '@/types/dashboard';
import { ConditionDistributionList } from '@/components/ConditionDistributionList';
import { GlobalComparisonChart } from '@/components/GlobalComparisonChart';
import { 
  Clock, 
  AlertCircle, 
  Users,
  Loader2,
  MousePointerClick,
  Layout,
  CheckCircle2,
  Activity
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
        console.log("Dashboard data loaded:", dashboardData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const metrics = useMemo(() => {
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
    <main className="flex-1 flex flex-col bg-slate-50/30">
      <Header />
      <FilterBar 
        currentCondition={condition} 
        onConditionChange={setCondition} 
      />
      
      <div className="p-6 max-w-[1400px] mx-auto w-full space-y-8 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={32} className="text-indigo-600 animate-spin" />
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Awaiting visualization data...</p>
          </div>
        ) : (
          <>
            {/* 1. Sample & Study Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 space-y-4">
                <KPICard 
                  label="Total Participants" 
                  value={metrics?.nParticipants || '0'} 
                  icon={Users}
                />
                <KPICard 
                  label="Analyzed Sessions" 
                  value={metrics?.nSessions || '0'} 
                  icon={Layout}
                />
              </div>
              <DashboardCard title="Condition Distribution" className="md:col-span-3">
                {data && <ConditionDistributionList data={data} />}
              </DashboardCard>
            </div>

            {/* 2. Compact global KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <KPICard 
                label="Success Rate" 
                value={metrics?.successRate || '0%'} 
                icon={CheckCircle2}
                subtitle={condition !== 'All' ? `Condition: ${condition}` : undefined}
              />
              <KPICard 
                label="Mean Time" 
                value={metrics?.avgTime || '0m'} 
                icon={Clock}
                subtitle={condition !== 'All' ? `Condition: ${condition}` : undefined}
              />
              <KPICard 
                label="Error Rate" 
                value={metrics?.errorRate || '0%'} 
                icon={AlertCircle}
                subtitle={condition !== 'All' ? `Condition: ${condition}` : undefined}
              />
              <KPICard 
                label="Abandonment" 
                value={metrics?.abandonmentRate || '0%'} 
                icon={Activity}
                subtitle={condition !== 'All' ? `Condition: ${condition}` : undefined}
              />
              <KPICard 
                label="Intervention" 
                value={metrics?.interventionRate || '0%'} 
                icon={MousePointerClick}
                subtitle={condition !== 'All' ? `Condition: ${condition}` : undefined}
              />
            </div>

            {/* 3. Compact comparison visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <DashboardCard title="Global Performance & Interaction Comparison">
                  {data && <GlobalComparisonChart data={data} selectedCondition={condition} />}
                </DashboardCard>
              </div>
              <div className="lg:col-span-1 space-y-4">
                {/* 4. Short system insight panel */}
                <DashboardCard title="System Insights">
                  <div className="space-y-4">
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Execution showed higher completion with lower abandonment across all tested workflows.
                      </p>
                    </div>
                    <div className="p-3 bg-sky-50 border border-sky-100 rounded-lg">
                      <p className="text-[11px] text-sky-800 leading-relaxed">
                        Intervention behavior changed significantly across autonomy levels, shifting from micro-edits to high-level overrides.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 italic">
                        Detailed analyses are available in Performance, Errors & Abandonment, and Intervention Behavior sections.
                      </p>
                    </div>
                  </div>
                </DashboardCard>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
