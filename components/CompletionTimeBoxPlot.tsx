'use client';

import React, { useState, useEffect, useRef } from 'react';
import { COLORS } from '@/lib/colors';

// Helper to generate jitter points
const generateJitter = (count: number) => {
  return Array.from({ length: count }, () => Math.random() * 0.4 - 0.2);
};

const data = [
  {
    condition: 'Manual',
    min: 12.77,
    q1: 21.5,
    median: 27.42,
    q3: 45.8,
    max: 100.97,
    color: COLORS.manual,
    points: [15.2, 17.5, 18.1, 19.3, 21.4, 23.2, 24.5, 25.1, 26.8, 27.4, 28.2, 29.5, 30.1, 31.5, 33.8, 35.2, 36.5, 41.2, 43.5, 45.8, 48.2, 51.5, 52.8, 54.1, 85.2, 88.5, 91.2, 94.5, 98.1, 100.2], 
  },
  {
    condition: 'Assistance',
    min: 6.99,
    q1: 14.2,
    median: 18.44,
    q3: 32.5,
    max: 95.84,
    color: COLORS.assistance,
    points: [7.2, 8.5, 9.1, 10.3, 11.4, 12.2, 13.5, 14.1, 15.8, 16.4, 17.2, 18.5, 19.1, 20.5, 21.8, 22.2, 23.5, 24.2, 26.5, 28.1, 31.5, 35.2, 38.5, 40.2, 48.2, 53.5, 65.2, 68.5, 85.2, 92.5],
  },
  {
    condition: 'Execution',
    min: 5.34,
    q1: 8.5,
    median: 10.79,
    q3: 16.4,
    max: 67.58,
    color: COLORS.execution,
    points: [5.5, 6.2, 6.8, 7.1, 7.5, 8.2, 8.5, 8.9, 9.2, 10.1, 10.8, 11.5, 12.2, 13.1, 14.5, 15.2, 16.4, 17.8, 18.5, 19.2, 21.5, 24.2, 26.5, 31.2, 35.5, 38.2, 45.1, 48.2, 50.5, 67.1],
  },
];

export const CompletionTimeBoxPlot = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxVal = 102; // Tightened scale to maximize box height

  // Stable jitter values to prevent jumping on re-renders
  const jitterValues = React.useMemo(() => 
    data.map(item => generateJitter(item.points.length))
  , []);

  useEffect(() => {
    // Small delay to ensure the browser has painted the initial state
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const getY = (value: number) => 100 - (value / maxVal) * 100;

  return (
    <div ref={containerRef} className="w-full h-[320px] mt-4 relative flex flex-col">
      <div className="flex-1 relative">
        {/* Y Axis Label */}
        <div className="absolute -left-16 top-1/2 -rotate-90 origin-center text-[12px] font-medium text-slate-800 whitespace-nowrap">
          Completion time (seconds)
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col-reverse justify-between pointer-events-none">
          {[0, 25, 50, 75, 100].map((tick) => (
            <div key={tick} className="w-full border-t border-slate-100 flex items-center h-0 relative">
              <span className="absolute -left-10 text-[11px] text-slate-400 font-medium">{tick}</span>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex justify-around items-end pb-4 pt-2 px-8">
          {data.map((item, idx) => {
            return (
              <div key={item.condition} className="flex-1 flex flex-col items-center relative h-full">
                {/* Box and Whisker */}
                <div className="relative w-28 h-full flex flex-col items-center">
                  {/* Top Whisker (Q3 to Max) */}
                  <div 
                    className="absolute w-[1.5px] bg-slate-900 transition-all duration-700 delay-700"
                    style={{ 
                      top: `${getY(isVisible ? item.max : item.q3)}%`, 
                      height: isVisible ? `${(item.max - item.q3) / maxVal * 100}%` : '0%',
                      opacity: isVisible ? 1 : 0 
                    }}
                  />
                  {/* Top Cap */}
                  <div 
                    className="absolute w-8 h-[1.5px] bg-slate-900 transition-all duration-500 delay-[1400ms]"
                    style={{ 
                      top: `${getY(isVisible ? item.max : item.q3)}%`,
                      opacity: isVisible ? 1 : 0,
                      transform: `scaleX(${isVisible ? 1 : 0})`
                    }}
                  />

                  {/* Bottom Whisker (Q1 to Min) */}
                  <div 
                    className="absolute w-[1.5px] bg-slate-900 transition-all duration-700 delay-700"
                    style={{ 
                      top: `${getY(item.q1)}%`, 
                      height: isVisible ? `${(item.q1 - item.min) / maxVal * 100}%` : '0%',
                      opacity: isVisible ? 1 : 0 
                    }}
                  />
                  {/* Bottom Cap */}
                  <div 
                    className="absolute w-8 h-[1.5px] bg-slate-900 transition-all duration-500 delay-[1400ms]"
                    style={{ 
                      top: `${getY(isVisible ? item.min : item.q1)}%`,
                      opacity: isVisible ? 1 : 0,
                      transform: `scaleX(${isVisible ? 1 : 0})`
                    }}
                  />

                  {/* Main Box */}
                  <div 
                    className="absolute w-full rounded-[2px] transition-all duration-[2000ms]"
                    style={{ 
                      top: `${getY(isVisible ? item.q3 : item.median)}%`, 
                      height: isVisible ? `${(item.q3 - item.q1) / maxVal * 100}%` : '0%',
                      backgroundColor: item.color,
                      border: `1.5px solid #1a1a1a`,
                      opacity: isVisible ? 1 : 0,
                      transitionTimingFunction: 'cubic-bezier(0.1, 0.9, 0.2, 1)'
                    }}
                  />

                  {/* Median Line */}
                  <div 
                    className="absolute w-full h-[3px] bg-slate-900 z-10 transition-all duration-[2500ms]"
                    style={{ 
                      top: `${getY(item.median)}%`,
                      opacity: isVisible ? 1 : 0,
                      transform: `translateY(-50%) scaleX(${isVisible ? 1 : 0})`
                    }}
                  />

                  {/* Jitter Points */}
                  {item.points.map((pt, pIdx) => (
                    <div 
                      key={pIdx}
                      className="absolute w-[5px] h-[5px] rounded-full border border-black transition-all duration-[1200ms]"
                      style={{ 
                        top: `${getY(isVisible ? pt : item.median)}%`,
                        left: `${50 + (isVisible ? jitterValues[idx][pIdx] : 0) * 100}%`,
                        backgroundColor: '#1a1a1a',
                        opacity: isVisible ? 0.7 : 0,
                        transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0})`,
                        transitionDelay: `${pIdx * 8}ms`,
                        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                    />
                  ))}
                </div>

                {/* X Axis Label */}
                <div className="absolute -bottom-6 text-[13px] font-medium text-slate-600">
                  {item.condition}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Autonomy condition label at bottom */}
      <div className="mt-6 text-center text-[15px] font-medium text-slate-900">
        Autonomy condition
      </div>
    </div>
  );
};
