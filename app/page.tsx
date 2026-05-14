'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchDashboardData, getKPIMetrics } from '@/lib/dashboard-data';
import { DashboardData, AutonomyCondition } from '@/types/dashboard';
import { COLORS } from '@/lib/colors';
import { KPICard } from '@/components/KPICard';
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard 
              label="Manual" 
              value="76" 
              valueLabel="participants"
              subtitle="53 analyzed sessions"
              icon={Hand}
              gradient="blue"
            />
            <KPICard 
              label="Assistance" 
              value="75" 
              valueLabel="participants"
              subtitle="54 analyzed sessions"
              icon={Wand2}
              gradient="purple"
            />
            <KPICard 
              label="Execution" 
              value="76" 
              valueLabel="participants"
              subtitle="53 analyzed sessions"
              icon={Rocket}
              gradient="green"
            />
            <KPICard 
              label="Total Study Sample" 
              value="227" 
              valueLabel="total participants"
              subtitle="160 analyzed sessions"
              icon={Users}
            />
          </div>
        )}
      </div>
    </main>
  );
}
