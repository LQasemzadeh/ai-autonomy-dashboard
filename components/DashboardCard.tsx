import React from 'react';

interface DashboardCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 ${className}`}>
      {title && (
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{title}</h3>
        </div>
      )}
      <div className="p-6 pt-2">
        {children}
      </div>
    </div>
  );
};
