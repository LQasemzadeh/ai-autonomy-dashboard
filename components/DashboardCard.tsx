import React from 'react';

interface DashboardCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/30">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};
