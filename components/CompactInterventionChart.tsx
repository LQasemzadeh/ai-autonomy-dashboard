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
import { COLORS, getConditionColor } from '@/lib/colors';

interface CompactInterventionChartProps {
  data: {
    name: string;
    occurrence: number;
    medianCount: number;
  }[];
}

export const CompactInterventionChart: React.FC<CompactInterventionChartProps> = ({ data }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: -15, bottom: 5 }}
          barGap={6}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.gridLines} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: COLORS.textSecondary, fontSize: 10, fontWeight: 600 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: COLORS.textSecondary, fontSize: 10 }}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const color = getConditionColor(label);
                return (
                  <div className="bg-white p-2 rounded-lg shadow-lg border border-[#E2E8F0] text-[10px] font-semibold">
                    <p style={{ color }}>{label.toUpperCase()}</p>
                    {payload.map((entry: any, index: number) => (
                      <p key={index} className="text-slate-600">
                        {entry.name}: {entry.value}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{
              paddingBottom: '10px',
              fontSize: '10px',
              fontWeight: 500,
              color: COLORS.textSecondary
            }}
          />
          <Bar 
            dataKey="occurrence" 
            name="Occurrence"
            radius={[4, 4, 0, 0]} 
            barSize={16}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-occ-${index}`} fill={getConditionColor(entry.name)} />
            ))}
          </Bar>
          <Bar 
            dataKey="medianCount" 
            name="Median Count"
            radius={[4, 4, 0, 0]} 
            barSize={16}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-med-${index}`} fill={getConditionColor(entry.name)} fillOpacity={0.5} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
