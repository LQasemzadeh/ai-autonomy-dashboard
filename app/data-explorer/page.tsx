'use client';

import React, { useState, useMemo } from 'react';
import { generateMockSessions } from '@/lib/mock-data';
import { SessionData, SessionEvent } from '@/types/data-explorer';
import { AutonomyCondition } from '@/types/dashboard';
import { KPICard } from '@/components/KPICard';
import { DashboardCard } from '@/components/DashboardCard';
import { Header } from '@/components/Header';
import { 
  Search, 
  Download, 
  ChevronRight, 
  X, 
  AlertCircle, 
  Database,
  Layers,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function DataExplorerPage() {
  const [sessions] = useState<SessionData[]>(() => generateMockSessions(160));
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'sessions' | 'events'>('sessions');
  
  // Filters
  const [search, setSearch] = useState('');
  const [conditionFilter, setConditionFilter] = useState<string>('All');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('All');
  const [errorFilter, setErrorFilter] = useState<string>('All');
  const [interventionFilter, setInterventionFilter] = useState<string>('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchesSearch = s.session_id.toLowerCase().includes(search.toLowerCase()) || 
                            s.participant_id.toLowerCase().includes(search.toLowerCase());
      const matchesCondition = conditionFilter === 'All' || s.condition === conditionFilter;
      const matchesOutcome = outcomeFilter === 'All' || s.outcome === outcomeFilter;
      const matchesError = errorFilter === 'All' || 
                           (errorFilter === 'With error' ? s.has_error : !s.has_error);
      const matchesIntervention = interventionFilter === 'All' || 
                                  (interventionFilter === 'With intervention' ? s.has_intervention : !s.has_intervention);
      
      return matchesSearch && matchesCondition && matchesOutcome && matchesError && matchesIntervention;
    });
  }, [sessions, search, conditionFilter, outcomeFilter, errorFilter, interventionFilter]);

  const filteredEvents = useMemo(() => {
    const events: (SessionEvent & { sessionId: string; participantId: string; condition: string })[] = [];
    filteredSessions.forEach(s => {
      s.events.forEach(e => {
        events.push({
          ...e,
          sessionId: s.session_id,
          participantId: s.participant_id,
          condition: s.condition
        });
      });
    });
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [filteredSessions]);

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredSessions.slice(start, start + rowsPerPage);
  }, [filteredSessions, currentPage]);

  const allEventsPaginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredEvents.slice(start, start + rowsPerPage);
  }, [filteredEvents, currentPage]);

  const totalPages = Math.ceil(filteredSessions.length / rowsPerPage);

  const stats = useMemo(() => {
    const total = sessions.length;
    const completed = sessions.filter(s => s.outcome === 'Completed').length;
    const abandoned = sessions.filter(s => s.outcome === 'Abandoned').length;
    const totalEvents = sessions.reduce((acc, s) => acc + s.events.length, 0);
    
    return { total, completed, abandoned, totalEvents };
  }, [sessions]);

  const handleRowClick = (session: SessionData) => {
    setSelectedSession(session);
    setIsDrawerOpen(true);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).filter(k => k !== 'events').join(',');
    const rows = data.map(item => {
      return Object.entries(item)
        .filter(([k]) => k !== 'events')
        .map(([_, v]) => `"${v}"`)
        .join(',');
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEventIcon = (type: SessionEvent['type']) => {
    switch (type) {
      case 'TASK_STARTED': return <div className="w-2 h-2 rounded-full bg-blue-500" />;
      case 'TASK_COMPLETED': return <div className="w-2 h-2 rounded-full bg-green-500" />;
      case 'ERROR_SHOWN': return <div className="w-2 h-2 rounded-full bg-red-500" />;
      case 'FIELD_EDIT': return <div className="w-2 h-2 rounded-full bg-purple-500" />;
      case 'OVERRIDE': return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
      case 'AI_SUGGESTION_REJECTED': return <div className="w-2 h-2 rounded-full bg-pink-500" />;
      default: return <div className="w-2 h-2 rounded-full bg-slate-300" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50">
      <Header />
      
      <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Data Explorer</h1>
          <p className="text-slate-500 text-sm mt-1">Inspect session-level behavioral data and event logs used in the analysis.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard label="Total Sessions" value={stats.total} valueLabel="analyzed sessions" icon={Database} />
          <KPICard label="Completed Sessions" value={stats.completed} valueLabel="task completed" icon={CheckCircle2} />
          <KPICard label="Abandoned Sessions" value={stats.abandoned} valueLabel="no completion event" icon={XCircle} />
          <KPICard label="Events Logged" value={stats.totalEvents.toLocaleString()} valueLabel="behavioral events" icon={Layers} />
        </div>

        {/* Filter Panel */}
        <DashboardCard className="overflow-visible">
          <div className="p-4 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by session_id or participant_id..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <select 
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={conditionFilter}
                onChange={(e) => { setConditionFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">Condition: All</option>
                <option value="Manual">Manual</option>
                <option value="Assistance">Assistance</option>
                <option value="Execution">Execution</option>
              </select>

              <select 
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={outcomeFilter}
                onChange={(e) => { setOutcomeFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">Outcome: All</option>
                <option value="Completed">Completed</option>
                <option value="Abandoned">Abandoned</option>
              </select>

              <select 
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={errorFilter}
                onChange={(e) => { setErrorFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">Error Status: All</option>
                <option value="With error">With error</option>
                <option value="No error">No error</option>
              </select>

              <select 
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={interventionFilter}
                onChange={(e) => { setInterventionFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">Intervention: All</option>
                <option value="With intervention">With intervention</option>
                <option value="No intervention">No intervention</option>
              </select>

              <button 
                onClick={() => {
                  setSearch('');
                  setConditionFilter('All');
                  setOutcomeFilter('All');
                  setErrorFilter('All');
                  setInterventionFilter('All');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-2 transition-colors"
              >
                Reset Filters
              </button>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button 
                onClick={() => {
                  if (activeTab === 'sessions') {
                    exportToCSV(filteredSessions, 'sessions.csv');
                  } else {
                    exportToCSV(filteredEvents, 'events.csv');
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Download size={14} />
                Export CSV
              </button>
            </div>
          </div>
        </DashboardCard>

        {/* Sessions Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Session-Level Data</h2>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => { setActiveTab('sessions'); setCurrentPage(1); }}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeTab === 'sessions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sessions
                </button>
                <button 
                  onClick={() => { setActiveTab('events'); setCurrentPage(1); }}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeTab === 'events' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Event Log
                </button>
              </div>
            </div>
          </div>

          <DashboardCard className="overflow-hidden">
            <div className="p-6">
              {activeTab === 'sessions' ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-y border-slate-100">
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Session ID</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Participant</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outcome</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Time</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Errors</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Interventions</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Started</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedSessions.map((s) => (
                          <tr 
                            key={s.session_id} 
                            className="hover:bg-slate-50 cursor-pointer transition-colors group"
                            onClick={() => handleRowClick(s)}
                          >
                            <td className="px-6 py-4 text-sm font-bold text-slate-900">{s.session_id}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{s.participant_id}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                s.condition === 'Manual' ? 'bg-slate-100 text-slate-600' :
                                s.condition === 'Assistance' ? 'bg-blue-50 text-blue-600' :
                                'bg-indigo-50 text-indigo-600'
                              }`}>
                                {s.condition}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                s.outcome === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                              }`}>
                                {s.outcome}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 text-right">{s.completion_time}m</td>
                            <td className="px-6 py-4 text-sm text-slate-500 text-right">
                              {s.error_count > 0 ? (
                                <span className="text-rose-600 font-bold">{s.error_count}</span>
                              ) : '0'}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 text-right">
                              {s.intervention_count > 0 ? (
                                <span className="text-blue-600 font-bold">{s.intervention_count}</span>
                              ) : '0'}
                            </td>
                            <td className="px-6 py-4 text-[11px] text-slate-400">
                              {new Date(s.started_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      Showing <span className="font-bold text-slate-700">{Math.min(filteredSessions.length, (currentPage-1)*rowsPerPage + 1)}-{Math.min(filteredSessions.length, currentPage*rowsPerPage)}</span> of <span className="font-bold text-slate-700">{filteredSessions.length}</span> sessions
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight size={18} className="rotate-180" />
                      </button>
                      <div className="flex items-center gap-1 mx-2">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          let pageNum = i + 1;
                          if (totalPages > 5 && currentPage > 3) {
                            pageNum = currentPage - 3 + i + 1;
                            if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                          }
                          return (
                            <button 
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-7 h-7 text-xs font-bold rounded flex items-center justify-center transition-colors ${
                                currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-y border-slate-100">
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Session</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Participant</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Type</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {allEventsPaginated.map((e) => (
                          <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-3 text-[11px] text-slate-500">
                              {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </td>
                            <td className="px-6 py-3 text-xs font-bold text-slate-900">{e.sessionId}</td>
                            <td className="px-6 py-3 text-xs text-slate-500">{e.participantId}</td>
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-2">
                                {getEventIcon(e.type)}
                                <span className="text-[10px] font-bold text-slate-700">{e.type}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-xs text-slate-500 max-w-xs truncate">{e.details || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Event Pagination */}
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      Showing <span className="font-bold text-slate-700">{Math.min(filteredEvents.length, (currentPage-1)*rowsPerPage + 1)}-{Math.min(filteredEvents.length, currentPage*rowsPerPage)}</span> of <span className="font-bold text-slate-700">{filteredEvents.length}</span> events
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight size={18} className="rotate-180" />
                      </button>
                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredEvents.length / rowsPerPage), prev + 1))}
                        disabled={currentPage === Math.ceil(filteredEvents.length / rowsPerPage)}
                        className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DashboardCard>
        </div>

        {/* Research Note */}
        <div className="bg-slate-100 rounded-xl p-6 border border-slate-200">
          <div className="flex gap-3">
            <AlertCircle size={18} className="text-slate-400 mt-0.5" />
            <p className="text-xs text-slate-500 italic leading-relaxed">
              “Data Explorer is intended for inspection of the behavioral logs used in the analysis. 
              Statistical summaries are reported in the Performance and Intervention Behavior sections.”
            </p>
          </div>
        </div>
      </main>

      {/* Detail Drawer */}
      {isDrawerOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-xl bg-white h-screen shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Session Details</h2>
                <p className="text-xs text-slate-500">{selectedSession.session_id} • {selectedSession.participant_id}</p>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Summary Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Condition</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    selectedSession.condition === 'Manual' ? 'bg-slate-200 text-slate-600' :
                    selectedSession.condition === 'Assistance' ? 'bg-blue-100 text-blue-600' :
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                    {selectedSession.condition}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Outcome</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    selectedSession.outcome === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {selectedSession.outcome}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Completion Time</p>
                  <p className="text-sm font-bold text-slate-900">{selectedSession.completion_time} minutes</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Activity</p>
                  <p className="text-sm font-bold text-slate-900">{selectedSession.error_count} Errors • {selectedSession.intervention_count} Interventions</p>
                </div>
              </div>

              {/* Event Timeline */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Event Timeline</h3>
                <div className="space-y-0 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {selectedSession.events.map((event, idx) => (
                    <div key={event.id} className="relative pl-8 pb-8 last:pb-0">
                      <div className="absolute left-0 top-1.5 z-10 p-1 bg-white rounded-full border border-slate-100">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[11px] font-bold ${
                            event.type === 'TASK_COMPLETED' ? 'text-emerald-600' :
                            event.type === 'ERROR_SHOWN' ? 'text-rose-600' :
                            event.type === 'TASK_STARTED' ? 'text-blue-600' :
                            'text-slate-700'
                          }`}>
                            {event.type}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        {event.details && (
                          <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                            {event.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => exportToCSV(selectedSession.events, `session_${selectedSession.session_id}_events.csv`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-white hover:shadow-sm transition-all shadow-sm"
              >
                <Download size={16} />
                Export Session Events
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
