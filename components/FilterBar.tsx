import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export const FilterBar = () => {
  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4 flex flex-wrap items-center gap-6 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-slate-500 mr-2">
        <Filter size={18} />
        <span className="text-sm font-semibold uppercase tracking-wider">Filters</span>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Condition</label>
        <select className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <option>All Conditions</option>
          <option>Manual</option>
          <option>Assistance</option>
          <option>Execution</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Metric</label>
        <select className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <option>All Metrics</option>
          <option>Performance</option>
          <option>Errors</option>
          <option>Abandonment</option>
          <option>Intervention</option>
        </select>
      </div>

      <button className="flex items-center gap-2 ml-auto text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
        <RotateCcw size={16} />
        Reset Filters
      </button>
    </div>
  );
};
