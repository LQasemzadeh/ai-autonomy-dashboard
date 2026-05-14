import React from 'react';

export const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-3">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">AI Execution Autonomy Dashboard</h1>
        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
          Task Performance & Intervention Behavior Analysis
        </p>
      </div>
    </header>
  );
};
