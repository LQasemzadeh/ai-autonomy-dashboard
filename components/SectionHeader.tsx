import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">{subtitle}</p>}
    </div>
  );
};
