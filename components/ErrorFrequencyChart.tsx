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

interface ErrorFrequencyChartProps {
  data: DashboardData;
  selectedCondition: AutonomyCondition;
}

export const ErrorFrequencyChart: React.FC<ErrorFrequencyChartProps> = ({ data, selectedCondition }) => {
  const errorByMode = data.errors.by_mode;
  const conditions = ['Manual', 'Assistance', 'Execution'];
  
  const chartData = conditions.map(mode => {
    const modeData = errorByMode.find(e => e.mode === mode && e.error_status === 'At least one error');
    return {
      name: mode,
      errorRate: (modeData?.proportion || 0) * 100,
      count: modeData?.n || 0,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-xs">
          <p className="font-bold text-slate-800 mb-1">{label}</p>
          <p className="text-rose-600 font-medium">
            Error Rate: {payload[0].value.toFixed(1)}%
          </p>
          <p className="text-slate-500 font-medium mt-1">
            Count: {payload[0].payload.count} sessions
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
          <Bar 
            name="Error Rate" 
            dataKey="errorRate" 
            radius={[4, 4, 0, 0]} 
            barSize={40}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={selectedCondition === 'All' || selectedCondition === entry.name ? '#f43f5e' : '#fecdd3'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
