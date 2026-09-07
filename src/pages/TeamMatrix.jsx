import React, { useState, useEffect } from 'react';
import { CalendarDays, Users, CheckCircle2, AlertCircle, Clock, Globe } from 'lucide-react';
import api from '../services/api';

export default function TeamMatrix({ onViewTimeline }) {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    fetchMatrix();
  }, [days]);

  const fetchMatrix = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/matrix?days=${days}`);
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const { dates = [], matrix = [] } = data || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-400" />
            SEO Team Activity & Attendance Matrix
          </h2>
          <p className="text-xs text-slate-400">
            Track daily work frequency, website coverage, and consistency across your team
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Timeline:</span>
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                days === d
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Last {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Grid Table */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">Loading team matrix...</div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">SEO Team Member</th>
                {dates.map((dateStr) => {
                  const d = new Date(dateStr);
                  const isToday = dateStr === new Date().toISOString().split('T')[0];
                  return (
                    <th
                      key={dateStr}
                      className={`py-3 px-3 text-center ${isToday ? 'text-indigo-400 font-bold bg-indigo-500/5 rounded-t-lg' : ''}`}
                    >
                      <div>{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                      <div className="text-[10px] text-slate-500">{d.getDate()} {d.toLocaleDateString(undefined, { month: 'short' })}</div>
                    </th>
                  );
                })}
                <th className="py-3 px-4 text-center">Total Updates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {matrix.map(({ user, totalLogs, days: dayLogs }) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{user.name}</div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                  </td>

                  {dates.map((dateStr) => {
                    const dayData = dayLogs[dateStr] || { logCount: 0, uniqueSites: 0, sites: [] };
                    const hasLogged = dayData.logCount > 0;
                    const isToday = dateStr === new Date().toISOString().split('T')[0];

                    return (
                      <td
                        key={dateStr}
                        className={`py-3 px-3 text-center ${isToday ? 'bg-indigo-500/5' : ''}`}
                      >
                        {hasLogged ? (
                          <button
                            onClick={() => setSelectedCell({ user, date: dateStr, dayData })}
                            className="inline-flex flex-col items-center justify-center p-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:scale-105 hover:bg-emerald-500/25 transition-all w-12"
                          >
                            <span className="font-bold text-xs">{dayData.logCount}</span>
                            <span className="text-[9px] opacity-80">{dayData.uniqueSites} {dayData.uniqueSites === 1 ? 'site' : 'sites'}</span>
                          </button>
                        ) : (
                          <span className="inline-block w-8 h-8 rounded-lg bg-slate-800/30 border border-slate-800/60 text-slate-600 text-xs leading-8">
                            -
                          </span>
                        )}
                      </td>
                    );
                  })}

                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                      {totalLogs} logs
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Cell Activity Detail Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedCell.user.name}'s Activity</h4>
                <p className="text-xs text-slate-400">Date: {selectedCell.date}</p>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedCell.dayData.sites.map((site, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-semibold text-slate-200">{site.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-medium">
                    {site.taskType.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}