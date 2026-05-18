import React from 'react';
import { COLORS } from '@/lib/colors';

interface KPICardProps {
  label: string;
  value: string | number;
  valueLabel?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  gradient?: 'blue' | 'purple' | 'green' | 'none';
  valueSize?: 'normal' | 'small' | 'thin';
}

export const KPICard: React.FC<KPICardProps> = ({ 
  label, 
  value, 
  valueLabel,
  subtitle, 
  trend, 
  icon: Icon,
  iconColor,
  iconBg,
  gradient = 'none',
  valueSize = 'normal'
}) => {
  const isSuccessMetric = label.toLowerCase().includes('success');
  const isErrorMetric = label.toLowerCase().includes('error');
  const isAbandonmentMetric = label.toLowerCase().includes('abandonment');
  const isNotStartedMetric = label.toLowerCase().includes('not started');
  const isInterventionMetric = label.toLowerCase().includes('intervention') || label.toLowerCase().includes('rejection') || label.toLowerCase().includes('override');
  const isNeutralMetric = label.toLowerCase().includes('time') || label.toLowerCase().includes('participants') || label.toLowerCase().includes('sessions');

  const getIconColors = () => {
    if (iconColor && iconBg) return { color: iconColor, bg: iconBg };
    if (gradient !== 'none') return { color: '#FFFFFF', bg: 'rgba(255, 255, 255, 0.25)' };
    if (isSuccessMetric) return { color: COLORS.success, bg: 'rgba(16, 185, 129, 0.12)' };
    if (isErrorMetric) return { color: COLORS.error, bg: 'rgba(244, 63, 94, 0.12)' };
    if (isAbandonmentMetric || isNotStartedMetric) return { color: COLORS.abandonment, bg: 'rgba(249, 115, 22, 0.12)' };
    if (isInterventionMetric) return { color: COLORS.intervention, bg: 'rgba(59, 130, 246, 0.12)' };
    if (label.toLowerCase().includes('sessions')) return { color: '#2563EB', bg: 'rgba(37, 99, 235, 0.12)' };
    if (label.toLowerCase().includes('conditions')) return { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)' };
    if (label.toLowerCase().includes('participants')) return { color: '#1E293B', bg: 'rgba(30, 41, 59, 0.12)' };
    if (label.toLowerCase().includes('median time')) return { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)' };
    if (label.toLowerCase().includes('statistical')) return { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)' };
    if (label.toLowerCase().includes('effect size')) return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' };
    return { color: COLORS.neutral, bg: 'rgba(148, 163, 184, 0.12)' };
  };

  const getGradientClass = () => {
    switch (gradient) {
      case 'blue':
        return 'bg-gradient-to-b from-[#60A5FA] to-[#DBEAFE] border-blue-200';
      case 'purple':
        return 'bg-gradient-to-b from-[#8B5CF6] to-[#EDE9FE] border-indigo-200';
      case 'green':
        return 'bg-gradient-to-b from-[#34D399] to-[#D1FAE5] border-emerald-200';
      default:
        return 'bg-[#F8FAFC] border-[#E2E8F0]';
    }
  };

  const { color, bg } = getIconColors();
  const isDark = gradient !== 'none';

  return (
    <div className={`${getGradientClass()} p-[22px] rounded-xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group h-[120px] flex flex-col justify-center relative`}>
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-baseline gap-1.5 mb-1.5">
          <h3 className={`${valueSize === 'small' ? 'text-xl' : 'text-2xl'} ${valueSize === 'thin' ? 'font-medium' : 'font-bold'} text-slate-900 leading-none tracking-tight`}>
            {value}
          </h3>
          {valueLabel && (
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-700' : 'text-slate-500'} leading-none`}>
              {valueLabel}
            </span>
          )}
        </div>
        <p className={`text-[11px] font-bold ${isDark ? 'text-[#0F172A]' : 'text-[#475569]'} tracking-[0.01em] leading-none`}>{label}</p>
        {subtitle && (
          <p className="text-[11px] mt-2.5 leading-tight">
            {(() => {
              const match = subtitle.match(/^(\d+)(.*)$/);
              if (match) {
                return (
                  <>
                    <span className="font-bold text-[#0F172A]">{match[1]}</span>
                    <span className="font-medium text-[#334155]">{match[2]}</span>
                  </>
                );
              }
              return <span className="text-[#334155] font-medium">{subtitle}</span>;
            })()}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-1">
            <span className={`text-[9px] font-bold ${trend.isPositive ? (isDark ? 'text-emerald-100' : 'text-emerald-600') : (isDark ? 'text-rose-100' : 'text-rose-600')}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </span>
            <span className={`text-[9px] ${isDark ? 'text-white/60' : 'text-slate-400'} ml-1 font-medium italic`}>vs prev</span>
          </div>
        )}
      </div>
      {Icon && (
        <div className="absolute top-[18px] right-[18px] p-2 rounded-lg transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: bg }}>
          <Icon size={18} style={{ color: color }} strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
};
