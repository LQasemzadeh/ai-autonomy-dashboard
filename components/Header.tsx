import React from 'react';

export const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Execution Autonomy Dashboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Interactive research dashboard for task performance and intervention behavior across autonomy conditions.
        </p>
      </div>
    </header>
  );
};
