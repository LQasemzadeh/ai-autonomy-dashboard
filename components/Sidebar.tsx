'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  AlertTriangle, 
  HandMetal, 
  Database, 
  BookOpen 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Overview', icon: LayoutDashboard, href: '/' },
  { name: 'Sample & Progression', icon: Users, href: '/sample-progression' },
  { name: 'Performance', icon: BarChart3, href: '#' },
  { name: 'Errors & Abandonment', icon: AlertTriangle, href: '#' },
  { name: 'Intervention Behavior', icon: HandMetal, href: '#' },
  { name: 'Data Explorer', icon: Database, href: '#' },
  { name: 'Methodology', icon: BookOpen, href: '#' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-slate-900 text-slate-300 h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800">
      <div className="p-5">
        <div className="flex items-center gap-2 text-white mb-6">
          <div className="w-7 h-7 bg-indigo-500 rounded flex items-center justify-center font-semibold text-xs text-white">A</div>
          <span className="font-semibold text-base tracking-tight">AI Autonomy</span>
        </div>
        
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-300 ease-in-out ${
                  isActive 
                    ? 'bg-blue-500/10 text-blue-400 font-normal shadow-sm shadow-blue-500/5' 
                    : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-300 font-light'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-blue-500 rounded-full" />
                )}
                <item.icon 
                  size={18} 
                  strokeWidth={2} 
                  className={`flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-5 border-t border-slate-800">
        <div className="text-[10px] text-slate-500 leading-tight">
          <p>© 2026 AI Research Lab</p>
          <p>Autonomy Study v1.2</p>
        </div>
      </div>
    </aside>
  );
};
