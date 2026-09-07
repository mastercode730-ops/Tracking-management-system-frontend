import React, { useState, useEffect } from 'react';
import { X, Globe, GitBranch, Phone, Search, Users, FileText, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function WebsiteModal({ isOpen, onClose, onSuccess, website = null }) {
  const [name, setName] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [niche, setNiche] = useState('Matka / Gaming');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [gscUrl, setGscUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('active');
  const [assignedUserIds, setAssignedUserIds] = useState([]);
  
  const [niches, setNiches] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchNichesAndUsers();
      if (website) {
        setName(website.name || '');
        setLiveUrl(website.liveUrl || '');
        setRepoUrl(website.repoUrl || '');
        setNiche(website.niche || 'General');
        setWhatsappNumber(website.whatsappNumber || '');
        setGscUrl(website.gscUrl || '');
        setNotes(website.notes || '');
        setStatus(website.status || 'active');
        setAssignedUserIds(website.assignedUsers?.map(a => a.userId || a.user?.id) || []);
      } else {
        setName('');
        setLiveUrl('');
        setRepoUrl('');
        setNiche('Matka / Gaming');
        setWhatsappNumber('');
        setGscUrl('');
        setNotes('');
        setStatus('active');
        setAssignedUserIds([]);
      }
    }
  }, [isOpen, website]);

  const fetchNichesAndUsers = async () => {
    try {
      const [nicheRes, userRes] = await Promise.all([
        api.get('/niches'),
        api.get('/users')
      ]);
      setNiches(nicheRes.data);
      setUsers(userRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const handleToggleUser = (userId) => {
    setAssignedUserIds(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Website Name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name,
        liveUrl,
        repoUrl,
        niche,
        whatsappNumber,
        gscUrl,
        notes,
        status,
        assignedUserIds
      };

      if (website) {
        await api.put(`/websites/${website.id}`, payload);
      } else {
        await api.post('/websites', payload);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save website');
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
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {website ? 'Edit Website Details' : 'Add New Portfolio Website'}
              </h2>
              <p className="text-xs text-slate-400">Configure domain, repo, WhatsApp number and team assignment</p>
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

          {/* Name & Niche */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Website Name *</label>
              <input
                type="text"
                placeholder="e.g. Matka Live 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Niche / Category</label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {niches.map((n) => (
                  <option key={n.id} value={n.name}>{n.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Live URL & Repo URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> Live Domain URL
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-indigo-400" /> GitHub / Repo URL
              </label>
              <input
                type="text"
                placeholder="https://github.com/org/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* WhatsApp & GSC Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-green-400" /> Primary WhatsApp Number
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-400" /> Google Search Console (GSC) Link
              </label>
              <input
                type="url"
                placeholder="https://search.google.com/search-console?resource_id=..."
                value={gscUrl}
                onChange={(e) => setGscUrl(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Status & Priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Website Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'active', label: 'Active', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' },
                { id: 'in_development', label: 'In Dev', color: 'border-sky-500/50 bg-sky-500/10 text-sky-300' },
                { id: 'needs_attention', label: 'Needs Attention', color: 'border-amber-500/50 bg-amber-500/10 text-amber-300' },
                { id: 'inactive', label: 'Inactive / Paused', color: 'border-slate-600 bg-slate-800 text-slate-400' }
              ].map(s => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setStatus(s.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    status === s.id ? `${s.color} ring-2 ring-indigo-500` : 'border-slate-800 bg-slate-900/40 text-slate-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assign SEO Team Members */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Assign SEO Team Members
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-900/40 rounded-xl border border-slate-800">
              {users.map(u => {
                const isSelected = assignedUserIds.includes(u.id);
                return (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => handleToggleUser(u.id)}
                    className={`p-2 rounded-lg text-xs font-medium text-left border flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{u.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Internal SEO & Strategy Notes</label>
            <textarea
              rows={2}
              placeholder="Keywords to rank, target audience, update schedule, special instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
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
              <span>{loading ? 'Saving...' : website ? 'Update Website' : 'Create Website'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}