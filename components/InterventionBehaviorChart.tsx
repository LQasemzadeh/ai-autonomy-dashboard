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
  ResponsiveContainer
} from 'recharts';
import { AutonomyCondition, DashboardData } from '@/types/dashboard';

interface InterventionBehaviorChartProps {
  data: DashboardData;
  selectedCondition: AutonomyCondition;
}

export const InterventionBehaviorChart: React.FC<InterventionBehaviorChartProps> = ({ data, selectedCondition }) => {
  // We'll show proportions of different intervention types for the selected condition(s)
  // If 'All' is selected, we'll show an average or grouped view.
  // Actually, the requirement asks for FIELD_EDIT, OVERRIDE, AI_SUGGESTION_REJECTED.
  
  const proportions = data.intervention_types.proportions_by_mode;
  
  const interventionTypes = ['Edit', 'Override', 'Reject'];
  const displayNames: Record<string, string> = {
    'Edit': 'Field Edit',
    'Override': 'Manual Override',
    'Reject': 'Suggestion Rejected'
  };

  const conditions = selectedCondition === 'All' ? ['Manual', 'Assistance', 'Execution'] : [selectedCondition];

  const chartData = interventionTypes.map(type => {
    const typeData: any = { name: displayNames[type] };
    conditions.forEach(mode => {
      const entry = proportions.find(p => p.mode === mode && p.intervention_type === type);
      typeData[mode] = (entry?.proportion || 0) * 100;
    });
    return typeData;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-xs">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
              <span className="text-slate-500">{entry.name}:</span>
              <span className="font-bold" style={{ color: entry.color }}>{entry.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const colors: Record<string, string> = {
    'Manual': '#64748b',
    'Assistance': '#6366f1',
    'Execution': '#10b981'
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10 }}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}
            iconType="circle"
          />
          {conditions.map(mode => (
            <Bar 
              key={mode}
              name={mode} 
              dataKey={mode} 
              fill={colors[mode]} 
              radius={[4, 4, 0, 0]}
              barSize={selectedCondition === 'All' ? 20 : 60}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
