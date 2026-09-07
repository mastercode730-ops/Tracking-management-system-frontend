import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  Globe, 
  ExternalLink, 
  Trash2,
  Download
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TASK_BADGES = {
  blog_content: { label: '📝 Blog / Content', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  backlink: { label: '🔗 Backlink', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  on_page: { label: '⚙️ On-Page SEO', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  gsc_indexing: { label: '🔍 GSC / Indexing', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  whatsapp_cta: { label: '📱 WhatsApp Update', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  tech_fix: { label: '🛠️ Tech Fix', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  other: { label: '📌 Other', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
};

export default function WorkLogs({ onOpenLogModal }) {
  const { user, isAdmin } = useAuth();
  const [logs, setLogs] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedTaskType, setSelectedTaskType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilters();
    fetchLogs();
  }, [selectedWebsite, selectedUser, selectedTaskType, startDate, endDate]);

  const fetchFilters = async () => {
    try {
      const [webRes, userRes] = await Promise.all([
        api.get('/websites'),
        api.get('/users')
      ]);
      setWebsites(webRes.data);
      setUsers(userRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedWebsite !== 'all') params.websiteId = selectedWebsite;
      if (selectedUser !== 'all') params.userId = selectedUser;
      if (selectedTaskType !== 'all') params.taskType = selectedTaskType;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get('/worklogs', { params });
      setLogs(res.data.logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLog = async (id) => {
    if (window.confirm('Delete this work log entry?')) {
      try {
        await api.delete(`/worklogs/${id}`);
        fetchLogs();
      } catch (e) {
        alert('Failed to delete log');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Daily SEO Work Logs
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
              {logs.length} Entries
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Comprehensive audit log of every SEO action, blog post, backlink, and technical update
          </p>
        </div>

        <button
          onClick={() => onOpenLogModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 transition-all self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>+ Log Today's Work</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Website Select */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Website</label>
          <select
            value={selectedWebsite}
            onChange={(e) => setSelectedWebsite(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Websites</option>
            {websites.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>

        {/* Member Select */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Team Member</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Members</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        {/* Task Type */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Task Category</label>
          <select
            value={selectedTaskType}
            onChange={(e) => setSelectedTaskType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {Object.entries(TASK_BADGES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1 block">From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1 block">To Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Logs Table / Cards */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">Loading work logs...</div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-white/5 space-y-3">
          <p className="text-slate-400 text-sm">No work logs found for the selected criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const badge = TASK_BADGES[log.taskType] || TASK_BADGES.other;
            const urls = log.proofUrls ? log.proofUrls.split('\n').map(u => u.trim()).filter(Boolean) : [];
            const canDelete = isAdmin || log.user.id === user.id;

            return (
              <div
                key={log.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-sm font-bold text-white flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-indigo-400" />
                      {log.website?.name}
                    </span>
                    <span className="text-xs text-slate-400">({log.website?.niche})</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-indigo-300 font-medium">
                      <User className="w-3.5 h-3.5" />
                      {log.user.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(log.logDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    {log.timeSpentMinutes > 0 && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {log.timeSpentMinutes}m
                      </span>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {log.title && (
                  <h4 className="text-sm font-semibold text-slate-200">{log.title}</h4>
                )}

                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {log.description}
                </p>

                {urls.length > 0 && (
                  <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] font-semibold text-slate-400">Proof Links:</span>
                    {urls.map((url, i) => (
                      <a
                        key={i}
                        href={url.startsWith('http') ? url : `https://${url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] font-mono border border-white/5 max-w-sm truncate"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate">{url}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}