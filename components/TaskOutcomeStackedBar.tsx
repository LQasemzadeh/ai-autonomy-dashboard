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
  Legend
} from 'recharts';
import { COLORS } from '@/lib/colors';

const data = [
  { name: 'Manual', abandoned: 45.3, completed: 54.7 },
  { name: 'Assistance', abandoned: 33.3, completed: 66.7 },
  { name: 'Execution', abandoned: 17.0, completed: 83.0 },
];

export const TaskOutcomeStackedBar: React.FC = () => {
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
    <div ref={chartRef} className="w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          barSize={32}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis 
            type="number"
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            dataKey="name" 
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
            width={80}
          />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{payload[0].payload.name}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.success }} />
                          <span className="text-xs text-slate-600 font-medium">Completed</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900">{payload[1].value}%</span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.abandonment }} />
                          <span className="text-xs text-slate-600 font-medium">Abandoned</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900">{payload[0].value}%</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 600, color: '#64748b' }}
            formatter={(value) => {
              if (value === 'completed') return 'Completed';
              if (value === 'abandoned') return 'Abandoned';
              return value;
            }}
          />
          <Bar 
            dataKey="abandoned" 
            name="abandoned"
            stackId="a" 
            fill={COLORS.abandonment} 
            radius={[0, 0, 0, 0]}
            isAnimationActive={isVisible}
            animationDuration={1500}
          />
          <Bar 
            dataKey="completed" 
            name="completed"
            stackId="a" 
            fill={COLORS.success} 
            radius={[0, 4, 4, 0]}
            isAnimationActive={isVisible}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
