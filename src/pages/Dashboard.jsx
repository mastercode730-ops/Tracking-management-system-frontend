import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Calendar, 
  PlusCircle, 
  ArrowUpRight, 
  Clock, 
  ExternalLink,
  Search
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TASK_BADGES = {
  blog_content: { label: '📝 Blog Posted', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  backlink: { label: '🔗 Backlink', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  on_page: { label: '⚙️ On-Page SEO', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  gsc_indexing: { label: '🔍 GSC Indexing', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  whatsapp_cta: { label: '📱 WhatsApp Update', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  tech_fix: { label: '🛠️ Tech Fix', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  other: { label: '📌 Other', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
};

export default function Dashboard({ onOpenLogModal, onViewTimeline, onNavigateTab }) {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/dashboard');
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        Loading analytics dashboard...
      </div>
    );
  }

  const { metrics, stagnantSites, recentLogs } = data || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-slate-900/80 border border-indigo-500/20 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            Welcome back, <span className="text-indigo-400">{user?.name}</span> 👋
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tracking {metrics?.totalWebsites || 0} websites across all niches. Stay consistent with daily SEO updates!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('websites')}
            className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/5 transition-colors"
          >
            View Portfolio Directory
          </button>
          <button
            onClick={() => onOpenLogModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Work Log</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 glass-card space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Websites</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{metrics?.totalWebsites || 0}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <span>{metrics?.activeWebsites || 0} Active Portals</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 glass-card space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Sites Updated Today</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">{metrics?.sitesUpdatedToday || 0}</div>
          <div className="text-[11px] text-slate-400">
            {metrics?.logsToday || 0} total updates logged today
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 glass-card space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Stagnant Sites (&gt;3 Days)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400">{metrics?.stagnantCount || 0}</div>
          <div className="text-[11px] text-rose-400/80 font-medium">
            Needs immediate SEO action
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 glass-card space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Team Members</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{metrics?.totalUsers || 0}</div>
          <div className="text-[11px] text-slate-400">
            SEO specialists & writers
          </div>
        </div>
      </div>

      {/* Stagnant Radar Warning Box */}
      {stagnantSites && stagnantSites.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Stagnant Websites Radar (No SEO Updates in 3+ Days)</span>
            </div>
            <button
              onClick={() => onNavigateTab('stagnant')}
              className="text-xs text-rose-400 hover:underline font-medium"
            >
              View All ({stagnantSites.length}) →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stagnantSites.slice(0, 3).map((site) => (
              <div
                key={site.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/20 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{site.name}</h4>
                  <div className="text-[11px] text-slate-400">Niche: {site.niche}</div>
                </div>
                <button
                  onClick={() => onOpenLogModal(site.id)}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold transition-colors"
                >
                  Log Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Stream */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Live Daily Worklog Stream</h3>
            <p className="text-xs text-slate-400">Latest updates submitted by your SEO team</p>
          </div>
          <button
            onClick={() => onNavigateTab('worklogs')}
            className="text-xs text-indigo-400 hover:underline font-medium"
          >
            Full Log Archive →
          </button>
        </div>

        <div className="space-y-3">
          {!recentLogs || recentLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No recent logs submitted yet.
            </div>
          ) : (
            recentLogs.map((log) => {
              const badge = TASK_BADGES[log.taskType] || TASK_BADGES.other;
              return (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-white/5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-bold text-white">{log.website?.name}</span>
                      <span className="text-[11px] text-slate-400">({log.website?.niche})</span>
                    </div>
                    {log.title && (
                      <div className="text-xs font-medium text-slate-200">{log.title}</div>
                    )}
                    <p className="text-xs text-slate-400 line-clamp-1">{log.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-indigo-300 font-medium">{log.user?.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <button
                      onClick={() => onViewTimeline(log.website?.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="View Site History"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}