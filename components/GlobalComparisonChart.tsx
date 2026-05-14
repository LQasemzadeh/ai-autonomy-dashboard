'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { AutonomyCondition, DashboardData } from '@/types/dashboard';
import { COLORS, getConditionColor } from '@/lib/colors';

interface GlobalComparisonChartProps {
  data: DashboardData;
  selectedCondition: AutonomyCondition;
}

export const GlobalComparisonChart: React.FC<GlobalComparisonChartProps> = ({ data, selectedCondition }) => {
  const outcomes = data.task_outcomes_by_mode || [];
  const interventionStats = data.intervention_occurrence?.by_mode || [];
  
  const conditions = ['Manual', 'Assistance', 'Execution'];
  
  const chartData = conditions.map(condition => {
    const outcomeData = outcomes.filter(o => o.mode === condition);
    const completed = outcomeData.find(o => o.outcome === 'Completed')?.proportion || 0;
    const abandoned = outcomeData.find(o => o.outcome === 'Abandoned')?.proportion || 0;
    
    const interventionEntry = interventionStats.find(i => i.mode === condition && i.intervention_status === 'With intervention');
    const intervention = interventionEntry?.proportion || 0;
    
    return {
      name: condition,
      Completion: completed * 100,
      Abandonment: abandoned * 100,
      Intervention: intervention * 100,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-slate-200 shadow-lg rounded-md text-[10px]">
          <p className="font-bold text-slate-800 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-slate-500">{entry.name}:</span>
              <span className="font-bold" style={{ color: entry.color }}>
                {entry.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getBarOpacity = (name: string) => {
    if (selectedCondition === 'All') return 1;
    return selectedCondition === name ? 1 : 0.3;
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.gridLines} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: COLORS.neutral, fontSize: 10, fontWeight: 600 }}
            dy={5}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: COLORS.neutral, fontSize: 9 }}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: COLORS.background }} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            wrapperStyle={{ paddingBottom: '15px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' }}
            iconType="circle"
            iconSize={6}
          />
          <Bar name="Completion" dataKey="Completion" radius={[2, 2, 0, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-c-${index}`} fill={getConditionColor(entry.name)} fillOpacity={getBarOpacity(entry.name)} />
            ))}
          </Bar>
          <Bar name="Abandonment" dataKey="Abandonment" radius={[2, 2, 0, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-a-${index}`} fill={getConditionColor(entry.name)} fillOpacity={getBarOpacity(entry.name) * 0.7} />
            ))}
          </Bar>
          <Bar name="Intervention" dataKey="Intervention" radius={[2, 2, 0, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-i-${index}`} fill={getConditionColor(entry.name)} fillOpacity={getBarOpacity(entry.name) * 0.4} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
