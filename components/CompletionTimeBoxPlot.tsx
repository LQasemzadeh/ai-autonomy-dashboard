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
    points: [15, 22, 28, 35, 42, 55, 68, 85, 98], // Sample points for jitter
  },
  {
    condition: 'Assistance',
    min: 6.99,
    q1: 14.2,
    median: 18.44,
    q3: 32.5,
    max: 95.84,
    color: COLORS.assistance,
    points: [8, 12, 16, 20, 25, 38, 45, 62, 88],
  },
  {
    condition: 'Execution',
    min: 5.34,
    q1: 8.5,
    median: 10.79,
    q3: 16.4,
    max: 67.58,
    color: COLORS.execution,
    points: [6, 9, 11, 13, 15, 18, 22, 35, 58],
  },
];

export const CompletionTimeBoxPlot = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxVal = 110; // Slightly above max value for scaling

  useEffect(() => {
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
  }, []);

  const getY = (value: number) => 100 - (value / maxVal) * 100;

  return (
    <div ref={containerRef} className="w-full h-[300px] mt-4 relative">
      {/* Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {[0, 25, 50, 75, 100].map((tick) => (
          <div key={tick} className="w-full border-t border-slate-100 flex items-center h-0 relative">
            <span className="absolute -left-8 text-[10px] text-slate-400 font-medium">{tick}s</span>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex justify-around items-end pb-8 pt-4 px-4">
        {data.map((item, idx) => {
          const jitterValues = generateJitter(item.points.length);
          
          return (
            <div key={item.condition} className="flex-1 flex flex-col items-center relative h-full">
              {/* Box and Whisker */}
              <div className="relative w-12 h-full flex flex-col items-center">
                {/* Vertical Line (Whisker) */}
                <div 
                  className="absolute w-px bg-slate-300 transition-all duration-1000 delay-300"
                  style={{ 
                    top: `${getY(item.max)}%`, 
                    bottom: `${100 - getY(item.min)}%`,
                    opacity: isVisible ? 1 : 0 
                  }}
                />

                {/* Top Whisker Cap */}
                <div 
                  className="absolute w-4 h-px bg-slate-400"
                  style={{ top: `${getY(item.max)}%`, opacity: isVisible ? 1 : 0 }}
                />
                
                {/* Bottom Whisker Cap */}
                <div 
                  className="absolute w-4 h-px bg-slate-400"
                  style={{ bottom: `${100 - getY(item.min)}%`, opacity: isVisible ? 1 : 0 }}
                />

                {/* Main Box */}
                <div 
                  className="absolute w-full rounded-sm shadow-sm transition-all duration-[2000ms] cubic-bezier(0.1, 0.9, 0.2, 1)"
                  style={{ 
                    top: `${getY(isVisible ? item.q3 : item.median)}%`, 
                    height: isVisible ? `${(item.q3 - item.q1) / maxVal * 100}%` : '0%',
                    backgroundColor: `${item.color}20`,
                    border: `2px solid ${item.color}`,
                    opacity: isVisible ? 1 : 0
                  }}
                />

                {/* Median Line */}
                <div 
                  className="absolute w-full h-[3px] bg-slate-700 rounded-full z-10 transition-all duration-[2500ms]"
                  style={{ 
                    top: `${getY(item.median)}%`,
                    opacity: isVisible ? 1 : 0,
                    transform: `translateY(-50%) scaleX(${isVisible ? 1.1 : 0})`
                  }}
                />

                {/* Jitter Points */}
                {item.points.map((pt, pIdx) => (
                  <div 
                    key={pIdx}
                    className="absolute w-1.5 h-1.5 rounded-full transition-all duration-[1500ms]"
                    style={{ 
                      top: `${getY(pt)}%`,
                      left: `${50 + jitterValues[pIdx] * 100}%`,
                      backgroundColor: item.color,
                      opacity: isVisible ? 0.4 : 0,
                      transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0})`,
                      transitionDelay: `${pIdx * 50}ms`
                    }}
                  />
                ))}
              </div>

              {/* X Axis Label */}
              <div className="absolute -bottom-6 text-xs font-bold text-slate-600">
                {item.condition}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
