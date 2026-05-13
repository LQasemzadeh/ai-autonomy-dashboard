import React from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ElementType;
}

export const KPICard: React.FC<KPICardProps> = ({ label, value, trend, icon: Icon }) => {
  return (
    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">{value}</h3>
          {trend && (
            <div className="flex items-center mt-1">
              <span className={`text-[10px] font-bold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
              <span className="text-[10px] text-slate-400 ml-1 font-medium">vs prev</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-1.5 bg-slate-50 rounded group-hover:bg-slate-100 transition-colors">
            <Icon size={16} className="text-slate-400 group-hover:text-slate-500" />
          </div>
        )}
      </div>
    </div>
  );
};
