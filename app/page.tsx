'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchDashboardData, getKPIMetrics } from '@/lib/dashboard-data';
import { DashboardData, AutonomyCondition } from '@/types/dashboard';
import { COLORS } from '@/lib/colors';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { CompactInterventionChart } from '@/components/CompactInterventionChart';
import { MedianTimeChart } from '@/components/MedianTimeChart';
import { ErrorAbandonmentChart } from '@/components/ErrorAbandonmentChart';
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
                valueLabel="participants"
                subtitle={`${sessionMetrics.manual} analyzed sessions`}
                icon={Hand}
                gradient="blue"
              />
              <KPICard 
                label="Assistance" 
                value={data.participants.per_condition.find(p => p.mode === 'Assistance')?.n_participants.toString() || "0"} 
                valueLabel="participants"
                subtitle={`${sessionMetrics.assistance} analyzed sessions`}
                icon={Wand2}
                gradient="purple"
              />
              <KPICard 
                label="Execution" 
                value={data.participants.per_condition.find(p => p.mode === 'Execution')?.n_participants.toString() || "0"} 
                valueLabel="participants"
                subtitle={`${sessionMetrics.execution} analyzed sessions`}
                icon={Rocket}
                gradient="green"
              />
              <KPICard 
                label="Total Study Sample" 
                value={data.metadata.total_participants.toString()} 
                valueLabel="total participants"
                subtitle={`${data.metadata.total_started_sessions} analyzed sessions`}
                icon={Users}
              />
            </div>

            {/* Research Findings Overview Section */}
            <div className="mt-8 space-y-8 pb-12">
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
                  <div className="mb-6">
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Intervention Behavior Overview</h3>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1 uppercase tracking-wider">
                      Autonomy changed intervention behavior rather than removing it.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-2">
                      <div className="h-[200px]">
                        <CompactInterventionChart data={interventionData} />
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">Occurrence</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
                              <p className="text-[10px] font-bold text-slate-900">{interventionData[0]?.occurrence}%</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#6366F1]"></span>
                              <p className="text-[10px] font-bold text-slate-900">{interventionData[1]?.occurrence}%</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                              <p className="text-[10px] font-bold text-slate-900">{interventionData[2]?.occurrence}%</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">Median Count</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
                              <p className="text-[10px] font-bold text-slate-900">{interventionData[0]?.medianCount}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#6366F1]"></span>
                              <p className="text-[10px] font-bold text-slate-900">{interventionData[1]?.medianCount}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                              <p className="text-[10px] font-bold text-slate-900">{interventionData[2]?.medianCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">Interaction Type</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">Edits</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">Hybrid</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">Override</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-r-lg border-l-4 border-[#6366F1]">
                        <p className="text-[10px] text-slate-700 font-semibold italic leading-relaxed">
                          “Intervention occurrence remained high across all conditions, but intervention frequency was significantly lower in Assistance and Execution.”
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
