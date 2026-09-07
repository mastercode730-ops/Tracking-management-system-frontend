import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  GitBranch, 
  ExternalLink, 
  Clock, 
  History, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Users
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Websites({ onOpenLogModal, onViewTimeline, onEditWebsite, onAddWebsite, onlyStagnant = false }) {
  const { isAdmin } = useAuth();
  const [websites, setWebsites] = useState([]);
  const [niches, setNiches] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNiches();
    fetchWebsites();
  }, [selectedNiche, selectedStatus, onlyStagnant]);

  const fetchNiches = async () => {
    try {
      const res = await api.get('/niches');
      setNiches(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWebsites = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedNiche !== 'all') params.niche = selectedNiche;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (onlyStagnant) params.isStagnant = 'true';
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/websites', { params });
      setWebsites(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchWebsites();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete website "${name}"? This will also remove its work logs.`)) {
      try {
        await api.delete(`/websites/${id}`);
        fetchWebsites();
      } catch (e) {
        alert('Failed to delete website');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {onlyStagnant ? '⚠️ Stagnant Websites Radar' : '🌐 Websites Directory & Inventory'}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
              {websites.length} Sites
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            {onlyStagnant 
              ? 'Websites with no SEO activity in the last 3+ days requiring urgent attention' 
              : 'Track domains, GitHub repositories, WhatsApp numbers, and assigned SEO members'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onAddWebsite}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Website</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by site name, live URL, repo, WhatsApp number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
            />
          </form>

          {/* Niche Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Niches</option>
              {niches.map((n) => (
                <option key={n.id} value={n.name}>{n.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="in_development">In Dev</option>
              <option value="needs_attention">Needs Attention</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Website Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">Loading websites...</div>
      ) : websites.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-white/5 space-y-3">
          <p className="text-slate-400 text-sm">No websites found matching your search or filters.</p>
          {isAdmin && (
            <button
              onClick={onAddWebsite}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Add First Website
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {websites.map((site) => {
            const isStagnant = site.isStagnant;
            return (
              <div
                key={site.id}
                className={`p-5 rounded-2xl bg-slate-900/80 border transition-all glass-card space-y-4 flex flex-col justify-between ${
                  isStagnant
                    ? 'border-rose-500/40 shadow-lg shadow-rose-950/20'
                    : 'border-white/5 hover:border-indigo-500/30'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                      {site.niche}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isStagnant && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Stagnant ({site.daysSinceUpdate}d)
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        site.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        site.status === 'in_development' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                        site.status === 'needs_attention' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {site.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Title & Live URL */}
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{site.name}</h3>
                    {site.liveUrl ? (
                      <a
                        href={site.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-400 hover:underline flex items-center gap-1 mt-0.5 truncate"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{site.liveUrl}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500">No live URL set</span>
                    )}
                  </div>

                  {/* WhatsApp Number with Quick Click-to-Chat */}
                  {site.whatsappNumber && (
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-green-400 font-medium">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{site.whatsappNumber}</span>
                      </div>
                      <a
                        href={`https://wa.me/${site.whatsappNumber.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-300 font-semibold border border-green-500/20 transition-colors"
                      >
                        Test Chat
                      </a>
                    </div>
                  )}

                  {/* Quick Action Links (Repo, GSC) */}
                  <div className="flex items-center gap-2 pt-1">
                    {site.repoUrl && (
                      <a
                        href={site.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <GitBranch className="w-3 h-3" />
                        <span>Repo</span>
                      </a>
                    )}
                    {site.gscUrl && (
                      <a
                        href={site.gscUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-[11px] font-medium border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>GSC Console</span>
                      </a>
                    )}
                  </div>

                  {/* Assigned Members */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[11px]">
                        {site.assignedMembers && site.assignedMembers.length > 0
                          ? site.assignedMembers.map(m => m.name).join(', ')
                          : 'Unassigned'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {site._count?.workLogs || 0} logs
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewTimeline(site.id)}
                      title="View Changelog & Audit Timeline"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-white/5 transition-colors flex items-center gap-1"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Timeline</span>
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onEditWebsite(site)}
                          title="Edit Website"
                          className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(site.id, site.name)}
                          title="Delete Website"
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenLogModal(site.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
                  >
                    + Log Work
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}