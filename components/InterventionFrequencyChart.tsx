'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Scatter,
} from 'recharts';
import { COLORS } from '@/lib/colors';

interface FrequencyData {
  name: string;
  count: number;
}

const data: FrequencyData[] = [
  { name: 'Manual', count: 7 },
  { name: 'Assistance', count: 3 },
  { name: 'Execution', count: 3 },
];

export const InterventionFrequencyChart: React.FC = () => {
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
    switch (name) {
      case 'Manual': return COLORS.manual;
      case 'Assistance': return COLORS.assistance;
      case 'Execution': return COLORS.execution;
      default: return COLORS.neutral;
    }
  };

  return (
    <div ref={chartRef} className="w-full h-[200px]">
      <div className="mb-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Median number of interventions per started session
        </p>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <ComposedChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 50, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis 
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
            domain={[0, 8]}
            hide
          />
          <YAxis 
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
            width={80}
          />
          <Tooltip
            cursor={{ stroke: '#f1f5f9', strokeWidth: 1 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white p-2 rounded-lg shadow-lg border border-slate-100 text-[11px] font-semibold">
                    <p style={{ color: getConditionColor(item.name) }}>{item.name.toUpperCase()}</p>
                    <p className="text-slate-600">Median Count: {item.count}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          {/* Baseline - Thin horizontal line */}
          <Bar 
            key={`bar-animated-${isVisible}`}
            dataKey="count" 
            barSize={2} 
            isAnimationActive={isVisible}
            animationDuration={2000}
            animationEasing="cubic-bezier(0.1, 0.9, 0.2, 1)"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-line-${index}`} fill={getConditionColor(entry.name)} fillOpacity={0.7} />
            ))}
          </Bar>
          {/* Dot - Larger colored circle at the value */}
          <Scatter 
            key={`scatter-animated-${isVisible}`}
            dataKey="count" 
            isAnimationActive={isVisible}
            animationDuration={2000}
            animationEasing="cubic-bezier(0.1, 0.9, 0.2, 1)"
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              const color = getConditionColor(payload.name);
              return (
                <g>
                  <circle cx={cx} cy={cy} r={6} fill={color} />
                  <text 
                    x={cx + 12} 
                    y={cy} 
                    dy={4} 
                    fill={color} 
                    fontSize={12} 
                    fontWeight={800}
                  >
                    {payload.count}
                  </text>
                </g>
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
