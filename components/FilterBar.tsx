import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { AutonomyCondition } from '@/types/dashboard';

interface FilterBarProps {
  currentCondition: AutonomyCondition;
  onConditionChange: (condition: AutonomyCondition) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ currentCondition, onConditionChange }) => {
  const handleReset = () => {
    onConditionChange('All');
  };

  return (
    <div className="bg-white border-b border-slate-200 px-8 py-2.5 flex flex-wrap items-center gap-6 sticky top-0 z-10 shadow-sm shadow-slate-900/5">
      <div className="flex items-center gap-2 text-slate-400 mr-2 border-r border-slate-100 pr-6">
        <Filter size={14} />
        <span className="text-[10px] font-bold uppercase tracking-wider">Filters</span>
      </div>

      <div className="flex items-center gap-2.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Condition</label>
        <select 
          value={currentCondition === 'All' ? 'All Conditions' : currentCondition}
          onChange={(e) => {
            const val = e.target.value;
            onConditionChange(val === 'All Conditions' ? 'All' : val as AutonomyCondition);
          }}
          className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/30 font-medium text-slate-600"
        >
          <option>All Conditions</option>
          <option>Manual</option>
          <option>Assistance</option>
          <option>Execution</option>
        </select>
      </div>

      <div className="flex items-center gap-2.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Metric</label>
        <select className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/30 font-medium text-slate-600">
          <option>All Metrics</option>
          <option>Performance</option>
          <option>Errors</option>
          <option>Abandonment</option>
          <option>Intervention</option>
        </select>
      </div>

      <button 
        onClick={handleReset}
        className="flex items-center gap-1.5 ml-auto text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-tight"
      >
        <RotateCcw size={12} />
        Reset Filters
      </button>
    </div>
  );
};
