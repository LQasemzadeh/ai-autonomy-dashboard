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

interface PerformanceChartProps {
  data: DashboardData;
  selectedCondition: AutonomyCondition;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, selectedCondition }) => {
  // Process data for the chart
  const outcomes = data.task_outcomes_by_mode || [];
  
  const conditions = ['Manual', 'Assistance', 'Execution'];
  
  const chartData = conditions.map(condition => {
    const conditionOutcomes = outcomes.filter(o => o.mode === condition);
    const completed = conditionOutcomes.find(o => o.outcome === 'Completed')?.proportion || 0;
    const abandoned = conditionOutcomes.find(o => o.outcome === 'Abandoned')?.proportion || 0;
    
    return {
      name: condition,
      completionRate: completed * 100,
      abandonmentRate: abandoned * 100,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-xs">
          <p className="font-bold text-slate-800 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px]">
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
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 11 }}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            iconType="circle"
            iconSize={8}
          />
          <Bar 
            name="Completion Rate" 
            dataKey="completionRate" 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-comp-${index}`} 
                fill={selectedCondition === 'All' || selectedCondition === entry.name ? '#4f46e5' : '#c7d2fe'} 
              />
            ))}
          </Bar>
          <Bar 
            name="Abandonment Rate" 
            dataKey="abandonmentRate" 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-aban-${index}`} 
                fill={selectedCondition === 'All' || selectedCondition === entry.name ? '#f43f5e' : '#fecdd3'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
