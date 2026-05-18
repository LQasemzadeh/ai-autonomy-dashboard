'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  HandMetal, 
  Database, 
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  Skull,
  XCircle,
  Activity,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Overview', icon: LayoutDashboard, href: '/' },
  { name: 'Sample & Progression', icon: Users, href: '/sample-progression' },
  { 
    name: 'Performance', 
    icon: BarChart3, 
    href: '#',
    subItems: [
      { name: 'Completion Time', icon: Clock, href: '/performance/completion-time' },
      { name: 'Detected Error', icon: Skull, href: '/performance/detected-error' },
      { name: 'Abandonment', icon: XCircle, href: '/performance/abandonment' },
    ]
  },
  { 
    name: 'Intervention Behavior', 
    icon: HandMetal, 
    href: '#',
    subItems: [
      { name: 'Intervention Occurrence', icon: Activity, href: '/intervention-behavior/intervention-occurrence' },
      { name: 'Intervention Count', icon: BarChart3, href: '/intervention-behavior/intervention-count' },
      { name: 'Type of Intervention', icon: Layers, href: '/intervention-behavior/intervention-type' },
    ]
  },
  { name: 'Data Explorer', icon: Database, href: '/data-explorer' },
  { name: 'Methodology', icon: BookOpen, href: '#' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  const toggleMenu = (name: string) => {
    setOpenMenu(prev => prev === name ? null : name);
  };

  return (
    <aside className="w-56 bg-slate-900 text-slate-300 h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800">
      <div className="p-5">
        <div className="flex items-center gap-2 text-white mb-6">
          <div className="w-7 h-7 bg-indigo-500 rounded flex items-center justify-center font-semibold text-xs text-white">AI</div>
          <span className="font-semibold text-base tracking-tight">AI Autonomy</span>
        </div>
        
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isOpen = openMenu === item.name;
            const isActive = pathname === item.href || (hasSubItems && item.subItems?.some(sub => pathname === sub.href));
            
            return (
              <div key={item.name} className="space-y-1">
                {hasSubItems ? (
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-300 ease-in-out ${
                      isActive 
                        ? 'bg-blue-500/10 text-blue-400 font-normal' 
                        : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-300 font-light'
                    }`}
                  >
                    <item.icon 
                      size={18} 
                      strokeWidth={2} 
                      className={`flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} 
                    />
                    <span className="flex-1 text-left">{item.name}</span>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpenMenu(null)}
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
                )}

                {hasSubItems && isOpen && (
                  <div className="ml-4 pl-3 border-l border-slate-800 space-y-1 mt-1">
                    {item.subItems?.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] transition-all duration-200 ${
                            isSubActive
                              ? 'text-blue-400 font-normal'
                              : 'text-slate-500 hover:text-slate-300 font-light'
                          }`}
                        >
                          <subItem.icon size={14} className={isSubActive ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'} />
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
