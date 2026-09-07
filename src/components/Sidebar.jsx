import React from 'react';
import { LayoutDashboard, Globe, FileText, CalendarDays, Users, AlertTriangle, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, stagnantCount = 0 }) {
  const { isAdmin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'websites', label: 'Websites Directory', icon: Globe },
    { id: 'worklogs', label: 'Daily Work Logs', icon: FileText },
    { id: 'team-matrix', label: 'Team Activity Matrix', icon: CalendarDays },
    { 
      id: 'stagnant', 
      label: 'Stagnant Sites Alert', 
      icon: AlertTriangle, 
      badge: stagnantCount > 0 ? stagnantCount : null,
      badgeColor: 'bg-rose-500 text-white'
    }
  ];

  if (isAdmin) {
    navItems.push({ id: 'users', label: 'SEO Team & Users', icon: Users });
  }

  return (
    <aside className="w-64 bg-[#111827]/40 border-r border-white/5 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Operations Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 bg-gradient-to-br from-indigo-950/40 to-slate-900/60 rounded-2xl border border-indigo-500/10 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold">
          <Download className="w-3.5 h-3.5" />
          <span>Need Reports?</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Export full daily logs in CSV format for executive review.
        </p>
        <button
          onClick={async () => {
            try {
              const res = await fetch('/api/analytics/export', {
                headers: { Authorization: `Bearer ${localStorage.getItem('tracker_token')}` }
              });
              const data = await res.json();
              const headers = Object.keys(data[0] || {}).join(',');
              const rows = data.map(obj => Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
              const csv = [headers, ...rows].join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `seo_tracking_export_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } catch (e) {
              alert('Export error');
            }
          }}
          className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-[11px] border border-white/5 text-center transition-colors"
        >
          Download CSV
        </button>
      </div>
    </aside>
  );
}