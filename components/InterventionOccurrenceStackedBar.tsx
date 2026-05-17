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

const data = [
  { name: 'Manual', intervention: 92, noIntervention: 8 },
  { name: 'Assistance', intervention: 94, noIntervention: 6 },
  { name: 'Execution', intervention: 91, noIntervention: 9 },
];

export const InterventionOccurrenceStackedBar: React.FC = () => {
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
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{item.name}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                          <span className="text-xs text-slate-600 font-medium">Intervention</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900">{item.intervention}%</span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#94A3B8]" />
                          <span className="text-xs text-slate-600 font-medium">No intervention</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900">{item.noIntervention}%</span>
                      </div>
                    </div>
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
            wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 600, color: '#64748b' }}
          />
          <Bar 
            dataKey="intervention" 
            name="Intervention"
            stackId="a" 
            fill="#10B981" 
            radius={[0, 0, 0, 0]}
            isAnimationActive={isVisible}
            animationDuration={1500}
          />
          <Bar 
            dataKey="noIntervention" 
            name="No intervention"
            stackId="a" 
            fill="#E2E8F0" 
            radius={[4, 4, 0, 0]}
            isAnimationActive={isVisible}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
