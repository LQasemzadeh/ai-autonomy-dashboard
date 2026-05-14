'use client';

import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { DashboardData } from '@/types/dashboard';

interface ConditionDistributionChartProps {
  data: DashboardData;
}

export const ConditionDistributionChart: React.FC<ConditionDistributionChartProps> = ({ data }) => {
  const chartData = data.participants.per_condition.map(item => ({
    name: item.mode,
    value: item.n_participants || 0
  }));

  const COLORS = ['#6366f1', '#10b981', '#64748b']; // Assistance, Execution, Manual (matching other charts)
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-slate-200 shadow-lg rounded-md text-[10px]">
          <p className="font-bold text-slate-800">{payload[0].name}</p>
          <p className="text-slate-600">Participants: <span className="font-bold">{payload[0].value}</span></p>
          <p className="text-slate-400 italic">{(payload[0].percent * 100).toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="middle" 
            align="right" 
            layout="vertical"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '10px', fontWeight: 600, paddingLeft: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
