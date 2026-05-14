import React from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ElementType;
}

export const KPICard: React.FC<KPICardProps> = ({ label, value, subtitle, trend, icon: Icon }) => {
  const isPositiveMetric = label.toLowerCase().includes('success') || label.toLowerCase().includes('participants') || label.toLowerCase().includes('sessions');
  const isNegativeMetric = label.toLowerCase().includes('error') || label.toLowerCase().includes('abandonment');
  const isNeutralMetric = label.toLowerCase().includes('rejection') || label.toLowerCase().includes('override') || label.toLowerCase().includes('intervention') || label.toLowerCase().includes('time');

  const iconColorClass = isPositiveMetric 
    ? 'text-emerald-500 group-hover:text-emerald-600' 
    : isNegativeMetric 
      ? 'text-rose-500 group-hover:text-rose-600' 
      : isNeutralMetric
        ? 'text-sky-500 group-hover:text-sky-600'
        : 'text-slate-400 group-hover:text-slate-500';

  const iconBgClass = isPositiveMetric
    ? 'bg-emerald-50 group-hover:bg-emerald-100'
    : isNegativeMetric
      ? 'bg-rose-50 group-hover:bg-rose-100'
      : isNeutralMetric
        ? 'bg-sky-50 group-hover:bg-sky-100'
        : 'bg-slate-50 group-hover:bg-slate-100';

  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1.5">{value}</h3>
          {subtitle && (
            <p className="text-[9px] text-slate-400 mt-1 font-medium italic">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-1">
              <span className={`text-[9px] font-bold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
              <span className="text-[9px] text-slate-400 ml-1 font-medium italic">vs prev</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-1.5 rounded-md transition-colors ${iconBgClass}`}>
            <Icon size={14} className={iconColorClass} />
          </div>
        )}
      </div>
    </div>
  );
};
