'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Users, PlayCircle, CheckCircle, XCircle, FileText, ArrowRight, Info } from 'lucide-react';

interface StageProps {
  label: string;
  value: number;
  percentage: string;
  color: string;
  ringColor: string;
}

const Stage: React.FC<StageProps> = ({ label, value, percentage, color, ringColor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  
  const radius = 48;
  const stroke = 8;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Initially set offset to full circumference (empty)
  // When visible, it will animate to the calculated percentage
  const strokeDashoffset = isVisible 
    ? circumference - (parseFloat(percentage) / 100) * circumference
    : circumference;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (stageRef.current) {
      observer.observe(stageRef.current);
    }

    return () => {
      if (stageRef.current) {
        observer.unobserve(stageRef.current);
      }
    };
  }, []);

  return (
    <div ref={stageRef} className="flex flex-col items-center z-10">
      <div className="relative flex items-center justify-center mb-2">
        {/* Background Ring */}
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke={color}
            strokeOpacity={0.1}
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={ringColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ 
              strokeDashoffset,
              transition: 'stroke-dashoffset 3.5s cubic-bezier(0.1, 0.9, 0.2, 1)'
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute flex flex-col items-center text-center w-full px-2">
          <span className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">{value}</span>
          <span className="text-[8px] font-bold text-slate-600 tracking-tight leading-tight whitespace-pre-line">
            {label.replace(' ', '\n')}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-black tracking-tight" style={{ color: ringColor }}>{percentage}%</span>
    </div>
  );
};

export const ProgressionFlow: React.FC = () => {
  const data = {
    invited: 227,
    started: 160,
    completed: 143,
    abandoned: 17,
    analyzed: 160
  };

  const stages = [
    { label: 'Invited Participants', value: data.invited, percentage: '100', color: '#3B82F6', ringColor: '#2563EB' },
    { label: 'Started Sessions', value: data.started, percentage: '70.5', color: '#3B82F6', ringColor: '#3B82F6' },
    { label: 'Completed Sessions', value: data.completed, percentage: '89.4', color: '#10B981', ringColor: '#059669' },
    { label: 'Abandoned Sessions', value: data.abandoned, percentage: '10.6', color: '#F97316', ringColor: '#EA580C' },
    { label: 'Analyzed Sessions', value: data.analyzed, percentage: '100', color: '#8B5CF6', ringColor: '#7C3AED' },
  ];

  return (
    <div className="w-full bg-white px-8 py-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="mb-1 flex items-center gap-2">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Study Progression Flow</h3>
        <div className="bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold text-slate-400 cursor-help">i</div>
      </div>
      <div className="mb-8">
        <p className="text-[10px] text-slate-400 font-bold tracking-widest">
          Participant journey through the study
        </p>
      </div>

      <div className="relative max-w-[1200px] mx-auto px-4">
        <div className="flex items-start justify-between relative">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.label}>
              <Stage 
                label={stage.label} 
                value={stage.value} 
                percentage={stage.percentage}
                color={stage.color}
                ringColor={stage.ringColor}
              />
              {index < stages.length - 1 && (
                <div className="flex-1 flex items-center justify-center pt-10">
                  <ArrowRight size={16} className="text-slate-900" strokeWidth={3} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bracket Connector & Note */}
        <div className="mt-8 relative flex justify-center">
          <div className="absolute top-[-10px] left-[28%] right-[8%] h-6 border-x border-b border-slate-200 rounded-b-xl" />
          <div className="bg-white px-5 py-1.5 border border-slate-100 rounded-lg shadow-sm z-20">
             <span className="text-[9px] font-bold text-slate-500 italic">Only started sessions are eligible for analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};
