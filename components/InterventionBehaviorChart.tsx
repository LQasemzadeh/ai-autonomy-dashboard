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
      const value = (entry?.proportion || 0) * 100;
      
      // Handle "Not Applicable" cases
      // Suggestion Rejected (Reject) is only for Assistance
      // Manual Override (Override) is not for Manual
      const isNotApplicable = (type === 'Reject' && (mode === 'Manual' || mode === 'Execution')) || 
                             (type === 'Override' && mode === 'Manual');
      
      typeData[mode] = isNotApplicable ? null : value;
      typeData[`${mode}_na`] = isNotApplicable;
    });
    return typeData;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-xs">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => {
            const isNA = entry.payload[`${entry.dataKey}_na`];
            const entryColor = entry.color || getConditionColor(entry.dataKey);
            return (
              <div key={index} className="flex flex-col mb-2 last:mb-0">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 font-medium">{entry.name}:</span>
                  <span className="font-bold" style={{ color: isNA ? COLORS.neutral : entryColor }}>
                    {isNA ? 'Not Applicable' : `${entry.value.toFixed(1)}%`}
                  </span>
                </div>
                {!isNA && (
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    Proportion of sessions associated with this intervention.
                  </div>
                )}
              </div>
            );
          })}
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
          {conditions.map(mode => (
            <Bar 
              key={mode}
              name={mode} 
              dataKey={mode} 
              fill={getConditionColor(mode)} 
              radius={[2, 2, 0, 0]}
              barSize={selectedCondition === 'All' ? 16 : 48}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${mode}-${index}`}
                  fill={entry[`${mode}_na`] ? COLORS.background : getConditionColor(mode)}
                  stroke={entry[`${mode}_na`] ? COLORS.gridLines : 'none'}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
