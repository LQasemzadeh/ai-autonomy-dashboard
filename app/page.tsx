'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchDashboardData, getKPIMetrics } from '@/lib/dashboard-data';
import { DashboardData, AutonomyCondition } from '@/types/dashboard';
import { COLORS } from '@/lib/colors';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { InterventionFrequencyChart } from '@/components/InterventionFrequencyChart';
import { InterventionType } from '@/components/InterventionType';
import { MedianTimeChart } from '@/components/MedianTimeChart';
import { ErrorAbandonmentChart } from '@/components/ErrorAbandonmentChart';
import { KeyFindings } from '@/components/KeyFindings';
import { 
  Users, 
  Activity, 
  Layers, 
  Settings,
  AlertCircle, 
  Loader2,
  Hand,
  Wand2,
  Rocket
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

  const performanceData = useMemo(() => {
    if (!data) return [];
    
    const conditions: AutonomyCondition[] = ['Manual', 'Assistance', 'Execution'];
    return conditions.map(c => {
      const outcomes = data.task_outcomes_by_mode.filter(o => o.mode === c);
      const total = outcomes.reduce((acc, curr) => acc + curr.n, 0);
      const abandoned = outcomes.find(o => o.outcome === 'Abandoned')?.n || 0;
      const abRate = total > 0 ? (abandoned / total) * 100 : 0;
      
      const time = data.completion_time.summary_after_outlier_removal.find(s => s.Condition === c)?.Median || 0;
      const errorRate = data.errors?.by_mode?.find(e => e.mode === c && e.error_status === 'At least one error')?.proportion || 0;
      
      return {
        name: c,
        completionTime: parseFloat(time.toFixed(2)),
        abandonmentRate: parseFloat(abRate.toFixed(1)),
        errorRate: parseFloat((errorRate * 100).toFixed(1))
      };
    });
  }, [data]);

  const interventionData = useMemo(() => {
    if (!data) return [];
    
    const conditions: AutonomyCondition[] = ['Manual', 'Assistance', 'Execution'];
    return conditions.map(c => {
      const occurrence = data.intervention_occurrence?.by_mode?.find(i => i.mode === c && i.intervention_status === 'With intervention')?.proportion || 0;
      const median = data.intervention_count?.summary?.find(i => i.Condition === c)?.Median || 0;
      
      return {
        name: c,
        occurrence: parseFloat((occurrence * 100).toFixed(1)),
        medianCount: median
      };
    });
  }, [data]);

  const sessionMetrics = useMemo(() => {
    if (!data) return { manual: 0, assistance: 0, execution: 0 };
    return {
      manual: data.participants?.sessions_per_condition?.find(p => p.mode === 'Manual')?.n_sessions || 0,
      assistance: data.participants?.sessions_per_condition?.find(p => p.mode === 'Assistance')?.n_sessions || 0,
      execution: data.participants?.sessions_per_condition?.find(p => p.mode === 'Execution')?.n_sessions || 0
    };
  }, [data]);

  if (error) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6" style={{ backgroundColor: COLORS.background }}>
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="mx-auto" style={{ color: COLORS.error }} />
          <h2 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>Unable to load dashboard</h2>
          <p className="text-slate-500 max-w-md">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-white rounded-md text-sm font-medium transition-colors"
            style={{ backgroundColor: COLORS.assistance }}
          >
            Retry Loading
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: COLORS.background }}>
      {/* Dark Hero Header */}
      <div className="w-full bg-[#0F1238] pt-12 pb-24 px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Execution Autonomy Dashboard</h1>
          <p className="text-lg text-slate-300 mt-2 font-medium">Task Performance & Intervention Behavior Analysis</p>
        </div>
      </div>
      
      <div className="px-8 max-w-[1400px] mx-auto w-full -mt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-white rounded-xl shadow-sm border border-slate-200">
            <Loader2 size={32} className="animate-spin" style={{ color: COLORS.assistance }} />
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Awaiting visualization data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard 
                label="Manual" 
                value={data.participants.per_condition.find(p => p.mode === 'Manual')?.n_participants.toString() || "0"} 
                subtitle={`${sessionMetrics.manual} analyzed sessions`}
                icon={Hand}
                gradient="blue"
              />
              <KPICard 
                label="Assistance" 
                value={data.participants.per_condition.find(p => p.mode === 'Assistance')?.n_participants.toString() || "0"} 
                subtitle={`${sessionMetrics.assistance} analyzed sessions`}
                icon={Wand2}
                gradient="purple"
              />
              <KPICard 
                label="Execution" 
                value={data.participants.per_condition.find(p => p.mode === 'Execution')?.n_participants.toString() || "0"} 
                subtitle={`${sessionMetrics.execution} analyzed sessions`}
                icon={Rocket}
                gradient="green"
              />
              <KPICard 
                label="Total Study Sample" 
                value={data.metadata.total_participants.toString()} 
                subtitle={`${data.metadata.total_started_sessions} analyzed sessions`}
                icon={Users}
              />
            </div>

            <div className="mt-12">
              <KeyFindings />
            </div>

            {/* Research Findings Overview Section */}
            <div className="mt-8 space-y-8 pb-12 relative z-0">
              {/* Task Performance Overview Section - Full Width */}
              <DashboardCard className="w-full">
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Task Performance Overview</h3>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1 uppercase tracking-wider">
                      Higher AI execution autonomy was associated with improved task performance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Sub-chart 1: Median Completion Time */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-tight">Median Completion Time</h4>
                        <span className="text-[10px] font-medium text-slate-400">Seconds (s)</span>
                      </div>
                      <MedianTimeChart data={performanceData.map(d => ({ name: d.name, completionTime: d.completionTime }))} />
                      <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-slate-300">
                        <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                          Execution condition showed the fastest median completion time (10.79s), a significant reduction compared to Manual mode.
                        </p>
                      </div>
                    </div>

                    {/* Sub-chart 2: Error & Abandonment Rates */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-tight">Error & Abandonment Rates</h4>
                        <span className="text-[10px] font-medium text-slate-400">Rates (%)</span>
                      </div>
                      <ErrorAbandonmentChart data={performanceData.map(d => ({ name: d.name, abandonment: d.abandonmentRate, errors: d.errorRate }))} />
                      <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-slate-300">
                        <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                          Abandonment and error rates were lowest in the Execution condition, suggesting higher autonomy minimizes task failure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>

              {/* Intervention Behavior Overview Section - Full Width */}
              <DashboardCard className="w-full">
                <div className="p-6">
                  <div className="mb-8">
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Intervention Behavior Overview</h3>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1 uppercase tracking-wider">
                      Autonomy did not remove intervention; it reduced intervention frequency and changed the form of intervention.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Block 1: Intervention Frequency */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-tight">Median Intervention Count</h4>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-medium text-slate-400">By Condition</span>
                           <div className="group relative">
                             <div className="cursor-help bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold text-slate-500">i</div>
                             <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                               Intervention Occurrence (Any intervention in session):
                               <br/>Manual: 92.5%, Assistance: 94.4%, Execution: 90.6%
                             </div>
                           </div>
                        </div>
                      </div>
                      <InterventionFrequencyChart />
                      <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-slate-300">
                        <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                          Intervention frequency decreased significantly under Assistance and Execution conditions compared to Manual mode.
                        </p>
                      </div>
                    </div>

                    {/* Block 2: Intervention Type */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-tight">Intervention Type</h4>
                        <span className="text-[10px] font-medium text-slate-400">Frequency (%)</span>
                      </div>
                      <InterventionType />
                      <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-slate-300">
                        <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                          Shift in behavior observed: from simple field edits toward override-based interventions as autonomy increased.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
