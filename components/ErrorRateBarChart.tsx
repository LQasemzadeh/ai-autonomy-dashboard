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
  LabelList
} from 'recharts';
import { COLORS } from '@/lib/colors';

const data = [
  { name: 'Manual', rate: 56.6, color: COLORS.manual },
  { name: 'Assistance', rate: 20.4, color: COLORS.assistance },
  { name: 'Execution', rate: 15.1, color: COLORS.execution },
];

export const ErrorRateBarChart: React.FC = () => {
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

  return (
    <div ref={chartRef} className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 30, right: 30, left: 0, bottom: 5 }}
          barSize={60}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            domain={[0, 70]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.name}</p>
                    <p className="text-lg font-extrabold" style={{ color: item.color }}>{item.rate}%</p>
                    <p className="text-[10px] text-slate-500 font-medium">Error Rate</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="rate" 
            isAnimationActive={isVisible}
            animationDuration={1500}
            radius={[6, 6, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList 
              dataKey="rate" 
              position="top" 
              formatter={(val: number) => `${val}%`}
              style={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
              offset={10}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
