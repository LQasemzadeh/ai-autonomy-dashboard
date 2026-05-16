'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  Cell,
} from 'recharts';
import { COLORS } from '@/lib/colors';

interface FailureData {
  name: string;
  abandonment: number;
  errors: number;
}

interface ErrorAbandonmentChartProps {
  data: FailureData[];
}


export const ErrorAbandonmentChart: React.FC<ErrorAbandonmentChartProps> = ({ data }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
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

  const getBaseColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'manual': return COLORS.manual;
      case 'assistance': return COLORS.assistance;
      case 'execution': return COLORS.execution;
      default: return COLORS.neutral;
    }
  };

  const getHoverColor = () => {
    if (!hoveredCategory) return '#475569';
    return getBaseColor(hoveredCategory);
  };

  return (
    <div ref={chartRef} className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: -15, bottom: 5 }}
          barGap={4}
          onMouseMove={(state) => {
            if (state && state.activeLabel) {
              setHoveredCategory(state.activeLabel);
            } else {
              setHoveredCategory(null);
            }
          }}
          onMouseLeave={() => setHoveredCategory(null)}
        >
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
            tick={{ fill: '#64748b', fontSize: 9 }}
            unit="%"
            domain={[0, 100]}
          >
            <Label 
              value="Rates (%)" 
              angle={-90} 
              position="insideLeft" 
              style={{ textAnchor: 'middle', fill: '#64748b', fontSize: 9, fontWeight: 700 }} 
            />
          </YAxis>
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const color = getBaseColor(label);
                return (
                  <div className="bg-white p-2 rounded-lg shadow-lg border-none text-[11px] font-semibold">
                    <p style={{ color }}>{label.toUpperCase()}</p>
                    {payload.map((entry: any, index: number) => {
                      const isSolid = entry.name === 'Detected Errors';
                      const labelText = isSolid ? 'Detected Errors (' : 'Abandonment (';
                      const suffix = isSolid ? 'Solid)' : 'Muted)';
                      const suffixStyle = isSolid ? { color } : { color, opacity: 0.8 };
                      return (
                        <p key={index} className="text-slate-600">
                          {labelText}
                          <span style={suffixStyle}>{suffix}</span>
                          : {entry.value}%
                        </p>
                      );
                    })}
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
            wrapperStyle={{ paddingTop: '0px', paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}
            formatter={(value) => {
              const isSolid = value === 'Detected Errors';
              const labelText = isSolid ? 'Detected Errors (' : 'Abandonment (';
              const suffix = isSolid ? 'Solid)' : 'Muted)';
              const hoverColor = getHoverColor();
              const suffixStyle = isSolid ? { color: hoverColor } : { color: hoverColor, opacity: 0.8 };
              return (
                <span style={{ color: '#475569', marginLeft: '4px' }}>
                  {labelText}
                  <span style={suffixStyle}>{suffix}</span>
                </span>
              );
            }}
          />
          <Bar 
            key={`bar-errors-animated-${isVisible}`}
            dataKey="errors" 
            name="Detected Errors" 
            radius={[4, 4, 0, 0]} 
            barSize={25}
            isAnimationActive={isVisible}
            animationDuration={2000}
            animationEasing="cubic-bezier(0.1, 0.9, 0.2, 1)"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-error-${index}`} fill={getBaseColor(entry.name)} />
            ))}
          </Bar>
          <Bar 
            key={`bar-abandonment-animated-${isVisible}`}
            dataKey="abandonment" 
            name="Abandonment" 
            radius={[4, 4, 0, 0]} 
            barSize={25}
            isAnimationActive={isVisible}
            animationDuration={2000}
            animationEasing="cubic-bezier(0.1, 0.9, 0.2, 1)"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-abandonment-${index}`} 
                fill={getBaseColor(entry.name)} 
                fillOpacity={0.5} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
