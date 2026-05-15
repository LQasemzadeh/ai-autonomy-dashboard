'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { COLORS } from '@/lib/colors';

const data = [
  { name: 'Manual', value: 27.42 },
  { name: 'Assistance', value: 18.44 },
  { name: 'Execution', value: 10.79 },
];

export const CompletionTimeLineChart = () => {
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
    <div ref={chartRef} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 30, right: 30, left: -20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
            dy={15}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
            domain={[0, 35]}
            label={{ value: 'Seconds (s)', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8', fontSize: 10 }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const color = getConditionColor(label);
                return (
                  <div className="bg-white p-2.5 rounded-lg shadow-lg border border-slate-100 text-[11px] font-bold">
                    <p style={{ color }} className="uppercase mb-1">{label}</p>
                    <p className="text-slate-600">Median: {payload[0].value}s</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            key={`line-animated-${isVisible}`}
            type="monotone"
            dataKey="value"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={(props) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill="white"
                  stroke={getConditionColor(payload.name)}
                  strokeWidth={3}
                />
              );
            }}
            activeDot={{ r: 8, strokeWidth: 0, fill: '#334155' }}
            isAnimationActive={isVisible}
            animationDuration={3500}
            animationEasing="cubic-bezier(0.1, 0.9, 0.2, 1)"
          >
            <LabelList 
              dataKey="value" 
              position="top" 
              offset={15}
              content={(props: any) => {
                const { x, y, value } = props;
                return (
                  <text 
                    x={x} 
                    y={y - 10} 
                    fill="#475569" 
                    fontSize={12} 
                    fontWeight={700} 
                    textAnchor="middle"
                  >
                    {value}s
                  </text>
                );
              }}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
