import React from 'react';

interface DashboardCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${className}`}>
      {title && (
        <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
        </div>
      )}
      <div className="p-3">
        {children}
      </div>
    </div>
  );
};
