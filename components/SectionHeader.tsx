import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`${className}`}>
      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">{title}</h2>
      {subtitle && <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">{subtitle}</p>}
    </div>
  );
};
