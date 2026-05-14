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
            <div key={index} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
              <span className="text-slate-500">{entry.name}:</span>
              <span className="font-bold" style={{ color: entry.color }}>
                {entry.value.toFixed(1)}%
              </span>
            </div>
          ))}
          <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-50 pt-1 italic">
            Relative distribution of primary task outcomes per condition.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px] transition-all duration-300 hover:scale-[1.01]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.gridLines} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: COLORS.neutral, fontSize: 10, fontWeight: 600 }}
            dy={8}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: COLORS.neutral, fontSize: 10 }}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: COLORS.background }} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            wrapperStyle={{ paddingBottom: '10px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            iconType="circle"
            iconSize={6}
          />
          <Bar 
            name="Completion Rate" 
            dataKey="completionRate" 
            radius={[2, 2, 0, 0]} 
            animationDuration={1500}
            barSize={24}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-comp-${index}`} 
                fill={getConditionColor(entry.name)} 
                fillOpacity={selectedCondition === 'All' || selectedCondition === entry.name ? 1 : 0.3}
              />
            ))}
          </Bar>
          <Bar 
            name="Abandonment Rate" 
            dataKey="abandonmentRate" 
            radius={[2, 2, 0, 0]}
            animationDuration={1500}
            barSize={24}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-aban-${index}`} 
                fill={getConditionColor(entry.name)} 
                fillOpacity={selectedCondition === 'All' || selectedCondition === entry.name ? 0.6 : 0.2}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
