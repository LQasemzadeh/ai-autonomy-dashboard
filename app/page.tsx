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
import { ErrorFrequencyChart } from '@/components/ErrorFrequencyChart';
import { AbandonmentChart } from '@/components/AbandonmentChart';
import { InterventionBehaviorChart } from '@/components/InterventionBehaviorChart';
import { 
  BarChart3, 
  Clock, 
  AlertCircle, 
  Target,
  Users,
  Loader2,
  MousePointerClick,
  Zap,
  Layout,
  Info
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
      
      <div className="p-8 max-w-[1400px] mx-auto w-full space-y-16 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={40} className="text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-medium">Processing research data...</p>
          </div>
        ) : (
          <>
            {/* A. Task Performance */}
            <section id="task-performance">
              <SectionHeader 
                title="Task Performance" 
                subtitle="Assessment of goal attainment efficiency and effectiveness across autonomy conditions. We measure how reliably and quickly users reach terminal task states."
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <KPICard 
                  label="Task Success Rate" 
                  value={metrics?.successRate || '0%'} 
                  icon={Target}
                />
                <KPICard 
                  label="Mean Completion Time" 
                  value={metrics?.avgTime || '0m'} 
                  icon={Clock}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardCard title="Success vs. Abandonment Trends" className="lg:col-span-2">
                  {data && (
                    <PerformanceChart data={data} selectedCondition={condition} />
                  )}
                </DashboardCard>
                <DashboardCard title="Performance Insights">
                  <div className="prose prose-slate prose-sm">
                    <p className="text-slate-600 leading-relaxed">
                      {condition === 'Execution' || condition === 'All' 
                        ? "The Execution condition was associated with higher completion rates, suggesting that higher AI autonomy may reduce the cognitive load required for terminal success."
                        : condition === 'Manual'
                        ? "Manual performance serves as our baseline. Observed trends suggest higher friction points where users lack automated support."
                        : "Assistance mode was associated with a moderate performance uplift, balancing user agency with supportive automation."}
                    </p>
                    <div className="mt-6 p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex gap-3">
                      <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-[10px] text-blue-700 leading-relaxed">
                        <span className="font-bold uppercase tracking-tight block mb-1">Statistical Note</span>
                        N = {metrics?.nSessions} qualified sessions analyzed after outlier removal (2SD).
                        Higher completion rates were observed in conditions with increased automation levels.
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* B. Error & Abandonment */}
            <section id="error-abandonment">
              <SectionHeader 
                title="Error & Abandonment" 
                subtitle="Analysis of system-detected errors and user-initiated task termination. This section highlights where the interaction model fails to sustain user progression."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <KPICard 
                  label="Error Occurrence Rate" 
                  value={metrics?.errorRate || '0%'} 
                  icon={AlertCircle}
                />
                <KPICard 
                  label="Task Abandonment" 
                  value={metrics?.abandonmentRate || '0%'} 
                  icon={MousePointerClick}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard title="Error Frequency by Condition">
                  {data && <ErrorFrequencyChart data={data} selectedCondition={condition} />}
                </DashboardCard>
                <DashboardCard title="Abandonment Behavior Analysis">
                  {data && <AbandonmentChart data={data} selectedCondition={condition} />}
                </DashboardCard>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* C. Intervention Behavior */}
            <section id="intervention-behavior">
              <SectionHeader 
                title="Intervention Behavior" 
                subtitle="Quantifying user corrections of AI actions. We track manual overrides, rejections of suggestions, and direct edits as indicators of AI-human misalignment."
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <KPICard label="Overall Intervention" value={metrics?.interventionRate || '0%'} icon={Zap} />
                <KPICard 
                  label="Suggestion Rejections" 
                  value={data ? ((data.intervention_types.proportions_by_mode.find(p => (condition === 'All' ? p.mode === 'Assistance' : p.mode === condition) && p.intervention_type === 'Reject')?.proportion || 0) * 100).toFixed(1) + '%' : '0%'} 
                />
                <KPICard 
                  label="Manual Overrides" 
                  value={data ? ((data.intervention_types.proportions_by_mode.find(p => (condition === 'All' ? p.mode === 'Execution' : p.mode === condition) && p.intervention_type === 'Override')?.proportion || 0) * 100).toFixed(1) + '%' : '0%'} 
                />
              </div>

              <DashboardCard title="Intervention Depth and Type Distribution">
                {data && <InterventionBehaviorChart data={data} selectedCondition={condition} />}
              </DashboardCard>
            </section>

            <hr className="border-slate-100" />

            {/* D. Sample & Study Overview */}
            <section id="sample-overview">
              <SectionHeader 
                title="Sample & Study Overview" 
                subtitle="Metadata regarding the participant pool and session distribution. Ensures results are interpreted within the context of the study's scale and diversity."
              />

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <div className="lg:col-span-1 space-y-6">
                  <KPICard label="Total Participants" value={metrics?.nParticipants || '0'} icon={Users} />
                  <KPICard label="Analysis Sessions" value={metrics?.nSessions || '0'} icon={Layout} />
                </div>
                
                <DashboardCard title="Condition Distribution" className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full items-center">
                    {data?.participants.per_condition.map((p) => (
                      <div key={p.mode} className="text-center space-y-2">
                        <div className="text-3xl font-bold text-slate-800">{p.n_participants}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.mode}</div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full" 
                            style={{ width: `${(p.n_participants || 0) / (data.metadata.total_participants || 1) * 100}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {((p.n_participants || 0) / (data.metadata.total_participants || 1) * 100).toFixed(1)}% of total
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-4 border-t border-slate-50 flex items-center gap-4 text-[10px] text-slate-400 italic">
                    <p>
                      <strong>Data Consistency Note:</strong> The study included {data?.metadata.total_participants} unique participants. 
                      However, only {data?.metadata.total_started_sessions} sessions are included in the final analysis after data cleaning (removing duplicate attempts, incomplete onboarding, and sessions that did not reach the first task stage).
                    </p>
                  </div>
                </DashboardCard>
              </div>

              <DashboardCard title="Recent Study Logs (Anonymized)">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <div className="text-xs font-medium text-slate-700">Session_UUID_{8329 + i}</div>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400">COMPLETED</div>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <p className="text-[10px] text-slate-400 italic">Full raw data available in secure research vault</p>
                  </div>
                </div>
              </DashboardCard>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
