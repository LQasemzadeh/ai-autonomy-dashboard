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
  Label,
} from 'recharts';
import { COLORS } from '@/lib/colors';

const data = [
  { name: 'Manual', completionTime: 27.42 },
  { name: 'Assistance', completionTime: 18.44 },
  { name: 'Execution', completionTime: 10.79 },
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
    <div ref={chartRef} className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: -15, bottom: 5 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={COLORS.manual} stopOpacity={1} />
              <stop offset="50%" stopColor={COLORS.assistance} stopOpacity={1} />
              <stop offset="100%" stopColor={COLORS.execution} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
            dy={10}
            padding={{ left: 30, right: 30 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }}
            unit="s"
          >
            <Label 
              value="Seconds (s)" 
              angle={-90} 
              position="insideLeft" 
              style={{ textAnchor: 'middle', fill: '#64748b', fontSize: 9, fontWeight: 700 }} 
            />
          </YAxis>
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const color = getConditionColor(label);
                return (
                  <div className="bg-white p-2 rounded-lg shadow-lg border-none text-[11px] font-semibold">
                    <p style={{ color }}>{label.toUpperCase()}</p>
                    {payload.map((entry: any, index: number) => (
                      <p key={index} className="text-slate-600">
                        Median: {entry.value}s
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            key={`line-animated-${isVisible}`}
            type="linear"
            dataKey="completionTime"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            strokeDasharray="5 5"
            isAnimationActive={isVisible}
            animationDuration={2000}
            animationEasing="cubic-bezier(0.1, 0.9, 0.2, 1)"
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              const color = getConditionColor(payload.name);
              return (
                <circle 
                  key={`dot-${payload.name}`}
                  cx={cx} 
                  cy={cy} 
                  r={4} 
                  fill={color} 
                  stroke="#fff" 
                  strokeWidth={2} 
                />
              );
            }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Median Time"
            label={(props: any) => {
              const { x, y, value, index } = props;
              const color = getConditionColor(data[index].name);
              return (
                <text 
                  x={x} 
                  y={y} 
                  dy={-10} 
                  fill={color} 
                  fontSize={10} 
                  fontWeight={800} 
                  textAnchor="middle"
                >
                  {value}s
                </text>
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
