'use client';

import React, { useState, useEffect, useRef } from 'react';
import { COLORS } from '@/lib/colors';

const conditions = ['Manual', 'Assistance', 'Execution'] as const;
const types = ['Field Edit', 'Override', 'Suggestion Rejection'] as const;

const data: Record<string, Record<string, string | number>> = {
  'Field Edit': { Manual: 92, Assistance: 94, Execution: 'NA' },
  'Override': { Manual: 0, Assistance: 81, Execution: 0 },
  'Suggestion Rejection': { Manual: 0, Assistance: 35, Execution: 91 },
};

export const InterventionType: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<{ type: string; condition: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const getConditionColor = (condition: typeof conditions[number]) => {
    switch (condition) {
      case 'Manual': return COLORS.manual;
      case 'Assistance': return COLORS.assistance;
      case 'Execution': return COLORS.execution;
      default: return COLORS.neutral;
    }
  };

  const getInterpretation = (type: string, value: string | number) => {
    if (value === 'NA' || value === 0) return 'Not available in this condition.';
    if (type === 'Field Edit') return 'Direct manipulation of editable form fields.';
    if (type === 'Override') return 'User manually changed or bypassed AI-generated decisions.';
    if (type === 'Suggestion Rejection') return 'User rejected or regenerated an AI suggestion.';
    return '';
  };

  return (
    <div ref={containerRef} className="w-full">
      {/* Matrix Header */}
      <div className="grid grid-cols-[110px_1fr_1fr_1fr] border-b border-slate-300 pb-2 mb-0">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-end pb-1">Type \ Mode</div>
        {conditions.map((c) => (
          <div key={c} className="text-center text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
            {c}
          </div>
        ))}
      </div>
      
      {/* Matrix Body */}
      <div className="border border-slate-300 rounded-sm bg-slate-50">
        {types.map((type, typeIdx) => (
          <div key={type} className={`grid grid-cols-[110px_1fr_1fr_1fr] ${typeIdx !== types.length - 1 ? 'border-b border-slate-300' : ''}`}>
            <div className="bg-white px-3 py-2 text-[10px] font-bold text-slate-700 uppercase leading-tight flex items-center border-r border-slate-300">
              {type}
            </div>
            {conditions.map((condition, condIdx) => {
              const value = data[type][condition];
              const isUnavailable = value === 'NA' || value === 0;
              const numericValue = typeof value === 'number' ? value : 0;
              const color = getConditionColor(condition);
              
              // Gradient calculation: high value = more saturated/stronger
              const intensity = numericValue / 100;
              const baseOpacity = isUnavailable ? 1 : 1;
              
              // Animation logic
              const opacity = isVisible ? baseOpacity : 0;
              const scale = isVisible ? 1 : 0.95;
              
              const isHovered = hoveredCell?.type === type && hoveredCell?.condition === condition;
              const isLastColumn = condIdx === conditions.length - 1;

              return (
                <div 
                  key={`${type}-${condition}`}
                  className={`relative h-14 flex items-center justify-center transition-all cursor-default border-r border-slate-300 last:border-r-0 ${isHovered ? 'z-[100]' : 'z-0'}`}
                  onMouseEnter={() => setHoveredCell({ type, condition })}
                  onMouseLeave={() => setHoveredCell(null)}
                  style={{ 
                    backgroundColor: isUnavailable ? '#e2e8f0' : color,
                    opacity: isHovered ? 1 : opacity,
                    transform: isHovered ? 'scale(1.02)' : `scale(${scale})`,
                    boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
                    transitionDuration: isHovered ? '200ms' : '3500ms',
                    transitionTimingFunction: 'cubic-bezier(0.1, 0.9, 0.2, 1)'
                  }}
                >
                  {/* Darker Gradient Overlay on Hover */}
                  {isHovered && !isUnavailable && (
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none rounded-sm" />
                  )}

                  <div className={`flex flex-col items-center justify-center transition-all`}
                       style={{ 
                         opacity: isVisible ? 1 : 0,
                         transform: isVisible ? 'scale(1)' : 'scale(0.5)',
                         transitionDuration: '3500ms',
                         transitionTimingFunction: 'cubic-bezier(0.1, 0.9, 0.2, 1)'
                       }}>
                    <span className={`text-[12px] font-black ${isUnavailable ? 'text-slate-500' : 'text-white drop-shadow-md'} ${isHovered ? 'scale-110' : ''}`}>
                      {isUnavailable ? 'NA' : `${value}%`}
                    </span>
                  </div>

                  {/* Floating Tooltip - Redesigned as Compact Analytical Insight Card */}
                  {isHovered && (
                    <div className={`absolute z-[110] pointer-events-none bg-white rounded-lg shadow-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-1 duration-150 ${isUnavailable ? 'p-2 w-auto whitespace-nowrap' : 'w-56 overflow-hidden'}`}
                         style={{ 
                           left: isLastColumn ? 'auto' : '50%',
                           right: isLastColumn ? '0%' : 'auto',
                           bottom: '125%', 
                           transform: isLastColumn ? 'none' : 'translateX(-50%)',
                         }}>
                      {!isUnavailable ? (
                        <>
                          {/* Top Accent Bar */}
                          <div className="h-1 w-full" style={{ backgroundColor: color }} />
                          
                          <div className="p-3 space-y-2">
                            {/* Header Row */}
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color }}>
                                {condition}
                              </span>
                              <span className="text-sm font-black text-slate-900">
                                {value}%
                              </span>
                            </div>

                            {/* Title */}
                            <div className="text-[11px] font-bold text-slate-800 leading-none">
                              {type}
                            </div>

                            {/* Description */}
                            <div className="text-[10px] text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-2">
                              {getInterpretation(type, value)}
                            </div>
                          </div>

                          {/* Tooltip Arrow */}
                          <div className={`absolute top-full -mt-0.5 border-[6px] border-transparent border-t-white ${isLastColumn ? 'right-6' : 'left-1/2 -translate-x-1/2'}`} />
                        </>
                      ) : (
                        <div className="text-slate-500 text-[10px] font-bold flex items-center gap-2 px-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          Not available in this interaction condition
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Legend Area */}
    </div>
  );
};
