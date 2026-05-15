'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { COLORS } from '@/lib/colors';

interface DataItem {
  name: string;
  value: number;
}

interface ConditionDistributionChartProps {
  title: string;
  subtitle: string;
  data: DataItem[];
}

export const ConditionDistributionChart: React.FC<ConditionDistributionChartProps> = ({ 
  title, 
  subtitle, 
  data 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, []);

  const getConditionColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'manual': return COLORS.manual;
      case 'assistance': return COLORS.assistance;
      case 'execution': return COLORS.execution;
      default: return COLORS.neutral;
    }
  };

  return (
    <div ref={chartRef} className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-4 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{title}</h3>
        <p className="text-[11px] text-slate-500 font-semibold mt-1 tracking-wider">
          {subtitle}
        </p>
      </div>

      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            barSize={45}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
              dy={12}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const color = getConditionColor(label);
                  return (
                    <div className="bg-white p-2.5 rounded-lg shadow-lg border border-slate-100 text-[11px] font-bold">
                      <p style={{ color }} className="uppercase mb-1">{label}</p>
                      <p className="text-slate-600">Count: {payload[0].value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              key={`bar-animated-${isVisible}`}
              dataKey="value" 
              radius={[6, 6, 0, 0]}
              isAnimationActive={isVisible}
              animationDuration={3500}
              animationEasing="cubic-bezier(0.1, 0.9, 0.2, 1)"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getConditionColor(entry.name)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
