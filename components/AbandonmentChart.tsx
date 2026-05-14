'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { AutonomyCondition, DashboardData } from '@/types/dashboard';
import { COLORS, getConditionColor } from '@/lib/colors';

interface AbandonmentChartProps {
  data: DashboardData;
  selectedCondition: AutonomyCondition;
}

export const AbandonmentChart: React.FC<AbandonmentChartProps> = ({ data, selectedCondition }) => {
  const abandonmentByMode = data.abandonment.by_mode;
  const conditions = ['Manual', 'Assistance', 'Execution'];
  
  const chartData = conditions.map(mode => {
    const abandonedData = abandonmentByMode.find(a => a.mode === mode && a.outcome === 'Abandoned');
    return {
      name: mode,
      abandonmentRate: (abandonedData?.proportion || 0) * 100,
      count: abandonedData?.n || 0,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-xs">
          <p className="font-bold text-slate-800 mb-1">{label}</p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Abandonment Rate:</span>
            <span className="font-bold" style={{ color: getConditionColor(label) }}>{payload[0].value.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between gap-4 mt-1 border-t border-slate-50 pt-1">
            <span className="text-slate-500">Count:</span>
            <span className="text-slate-700 font-medium">{payload[0].payload.count} sessions</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 italic">
            Targeting sessions where participants opted to terminate task before completion.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px] transition-all duration-300 hover:scale-[1.01]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.gridLines} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: COLORS.neutral, fontSize: 10, fontWeight: 600 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: COLORS.neutral, fontSize: 9 }}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: COLORS.background }} />
          <Bar 
            name="Abandonment Rate" 
            dataKey="abandonmentRate" 
            radius={[2, 2, 0, 0]} 
            barSize={32}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getConditionColor(entry.name)} 
                fillOpacity={selectedCondition === 'All' || selectedCondition === entry.name ? 1 : 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
