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

const menuItems = [
  { name: 'Overview', icon: LayoutDashboard, href: '/' },
  { name: 'Sample & Progression', icon: Users, href: '#' },
  { name: 'Performance', icon: BarChart3, href: '#' },
  { name: 'Errors & Abandonment', icon: AlertTriangle, href: '#' },
  { name: 'Intervention Behavior', icon: HandMetal, href: '#' },
  { name: 'Data Explorer', icon: Database, href: '#' },
  { name: 'Methodology', icon: BookOpen, href: '#' },
];

export const Sidebar = () => {
  return (
    <aside className="w-56 bg-slate-900 text-slate-300 h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800">
      <div className="p-5">
        <div className="flex items-center gap-2 text-white mb-6">
          <div className="w-7 h-7 bg-indigo-500 rounded flex items-center justify-center font-bold text-xs text-white">A</div>
          <span className="font-bold text-base tracking-tight">AI Autonomy</span>
        </div>
        
        <nav className="space-y-0.5">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors hover:bg-slate-800 hover:text-white ${
                item.name === 'Overview' ? 'bg-slate-800 text-white' : ''
              }`}
            >
              <item.icon size={16} />
              {item.name}
            </Link>
          ))}
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
