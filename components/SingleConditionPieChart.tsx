'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { COLORS } from '@/lib/colors';

interface SingleConditionPieChartProps {
  condition: 'Manual' | 'Assistance' | 'Execution';
  rate: number;
}

export const SingleConditionPieChart: React.FC<SingleConditionPieChartProps> = ({ condition, rate }) => {
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

  const data = [
    { name: 'With Intervention', value: rate },
    { name: 'Without Intervention', value: 100 - rate },
  ];

  const radius = 60;
  const stroke = 14;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = isVisible 
    ? circumference - (rate / 100) * circumference
    : circumference;

  const backgroundStrokeDashoffset = isVisible
    ? circumference - (100 / 100) * circumference
    : circumference;

  const getConditionColor = () => {
    switch (condition) {
      case 'Manual': return COLORS.manual;
      case 'Assistance': return COLORS.assistance;
      case 'Execution': return COLORS.execution;
      default: return COLORS.manual;
    }
  };

  const conditionColor = getConditionColor();

  return (
    <div 
      ref={chartRef} 
      className={`flex flex-col items-center transition-all duration-1000 transform ease-[cubic-bezier(0.1,0.9,0.2,1)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="relative flex items-center justify-center w-full h-[130px]">
        {/* SVG based circles matching ProgressionFlow style */}
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Background Ring (No Intervention part) */}
          <circle
            stroke="#64748B"
            strokeOpacity={0.25}
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Main Progress Ring (With Intervention) */}
          <circle
            stroke={conditionColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ 
              strokeDashoffset,
              transition: 'stroke-dashoffset 2s cubic-bezier(0.1, 0.9, 0.2, 1)'
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Legend/Info inside or near */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-black text-slate-800 tracking-tight leading-none">{rate}%</span>
        </div>

        {/* Overlay Recharts for Tooltip functionality only (Invisible Pie) */}
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                paddingAngle={0}
                dataKey="value"
                isAnimationActive={false}
                stroke="none"
              >
                <Cell key="cell-0" fill="transparent" />
                <Cell key="cell-1" fill="transparent" />
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 animate-in fade-in zoom-in duration-200 min-w-[150px]">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-50 pb-1">
                          {condition} Condition
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: conditionColor }} />
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">With Intervention</span>
                            </div>
                            <span className="text-[11px] font-bold text-slate-900">{rate}%</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#64748B' }} />
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">No Intervention</span>
                            </div>
                            <span className="text-[11px] font-bold text-slate-900">{100 - rate}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-sm font-bold text-slate-700">{condition}</span>
        <div className="text-[11px] text-slate-500 font-medium mt-0.5">{rate}% Intervention Rate</div>
      </div>
    </div>
  );
};
