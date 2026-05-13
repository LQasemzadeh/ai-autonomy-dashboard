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
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-slate-400 ml-1">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-2 bg-slate-50 rounded-md">
            <Icon size={20} className="text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );
};
