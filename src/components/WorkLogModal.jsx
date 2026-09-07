import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, Link as LinkIcon, FileText, Globe, Tag } from 'lucide-react';
import api from '../services/api';

const TASK_CATEGORIES = [
  { id: 'blog_content', label: '📝 Blog & Content Posted', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'backlink', label: '🔗 Backlinks & Off-Page', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  { id: 'on_page', label: '⚙️ On-Page & Meta Tags', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { id: 'gsc_indexing', label: '🔍 GSC & Indexing Action', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'whatsapp_cta', label: '📱 WhatsApp & CTA Update', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  { id: 'tech_fix', label: '🛠️ Tech Fix & Performance', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { id: 'other', label: '📌 Other SEO Task', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' }
];

export default function WorkLogModal({ isOpen, onClose, onSuccess, initialWebsiteId = null }) {
  const [websites, setWebsites] = useState([]);
  const [websiteId, setWebsiteId] = useState(initialWebsiteId || '');
  const [taskType, setTaskType] = useState('blog_content');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proofUrls, setProofUrls] = useState('');
  const [timeSpentMinutes, setTimeSpentMinutes] = useState('30');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchWebsites();
      if (initialWebsiteId) {
        setWebsiteId(initialWebsiteId);
      }
    }
  }, [isOpen, initialWebsiteId]);

  const fetchWebsites = async () => {
    try {
      const res = await api.get('/websites');
      setWebsites(res.data);
      if (!websiteId && res.data.length > 0) {
        setWebsiteId(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!websiteId) {
      setError('Please select a website');
      return;
    }
    if (!description.trim()) {
      setError('Please describe what work was completed');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/worklogs', {
        websiteId,
        taskType,
        title,
        description,
        proofUrls,
        timeSpentMinutes: parseInt(timeSpentMinutes) || 0,
        logDate: new Date(logDate)
      });
      onSuccess?.();
      onClose();
      // Reset
      setTitle('');
      setDescription('');
      setProofUrls('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit work log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Submit Daily SEO Work Log</h2>
              <p className="text-xs text-slate-400">Record tasks completed today for ranking & site updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Website Selection & Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> Target Website *
              </label>
              <select
                value={websiteId}
                onChange={(e) => setWebsiteId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              >
                {websites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name} ({site.niche})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Date *
              </label>
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Task Category Grid */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" /> Task Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TASK_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setTaskType(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all ${
                    taskType === cat.id
                      ? `${cat.color} ring-2 ring-indigo-500 shadow-md`
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Work Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Task Headline / Summary
            </label>
            <input
              type="text"
              placeholder="e.g. Published 2 Kalyan Chart blogs & updated meta tags"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Detailed Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Detailed Work Description *
            </label>
            <textarea
              rows={3}
              placeholder="Write exactly what you did (keywords targeted, changes made in HTML/code, rankings observed, etc.)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
              required
            />
          </div>

          {/* Proof URLs & Time Spent */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-indigo-400" /> Proof URLs / Published Links (One per line)
              </label>
              <textarea
                rows={2}
                placeholder="https://mysite.com/blog/article-1&#10;https://mysite.com/blog/article-2"
                value={proofUrls}
                onChange={(e) => setProofUrls(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Time Spent (Minutes)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={timeSpentMinutes}
                onChange={(e) => setTimeSpentMinutes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Save & Log Work'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}