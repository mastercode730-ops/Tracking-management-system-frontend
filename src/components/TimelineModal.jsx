import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Clock, ExternalLink, Globe, Phone, GitBranch, Search, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const TASK_BADGES = {
  blog_content: { label: '📝 Blog / Content', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  backlink: { label: '🔗 Backlink', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  on_page: { label: '⚙️ On-Page SEO', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  gsc_indexing: { label: '🔍 GSC / Indexing', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  whatsapp_cta: { label: '📱 WhatsApp Update', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  tech_fix: { label: '🛠️ Tech Fix', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  other: { label: '📌 Other', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
};

export default function TimelineModal({ isOpen, onClose, websiteId, onLogWork }) {
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && websiteId) {
      fetchWebsiteDetails();
    }
  }, [isOpen, websiteId]);

  const fetchWebsiteDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/websites/${websiteId}`);
      setWebsite(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{website?.name || 'Website History'}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {website?.niche}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Complete Daily Activity & SEO Audit Timeline</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Website Overview Bar */}
        {website && (
          <div className="px-6 py-3 bg-slate-900/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {website.liveUrl && (
                <a
                  href={website.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-400 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{website.liveUrl.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
              {website.whatsappNumber && (
                <span className="flex items-center gap-1 text-green-400">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{website.whatsappNumber}</span>
                </span>
              )}
              {website.repoUrl && (
                <a
                  href={website.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-400 hover:text-white"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Repo</span>
                </a>
              )}
              {website.gscUrl && (
                <a
                  href={website.gscUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-amber-400 hover:underline"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>GSC</span>
                </a>
              )}
            </div>

            <button
              onClick={() => {
                onClose();
                onLogWork?.(website.id);
              }}
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow transition-colors"
            >
              + Log Work for this Site
            </button>
          </div>
        )}

        {/* Content Body: Timeline */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading activity stream...</div>
          ) : !website?.workLogs || website.workLogs.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-slate-400 text-sm">No work logs recorded yet for this website.</p>
              <button
                onClick={() => {
                  onClose();
                  onLogWork?.(website.id);
                }}
                className="text-xs text-indigo-400 hover:underline"
              >
                Submit the first daily work log →
              </button>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-800 ml-4 space-y-6">
              {website.workLogs.map((log) => {
                const badge = TASK_BADGES[log.taskType] || TASK_BADGES.other;
                const urls = log.proofUrls ? log.proofUrls.split('\n').map(u => u.trim()).filter(Boolean) : [];

                return (
                  <div key={log.id} className="relative pl-6 group">
                    {/* Timeline bullet */}
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 group-hover:scale-125 transition-transform" />

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${badge.color}`}>
                            {badge.label}
                          </span>
                          {log.title && (
                            <h4 className="text-sm font-semibold text-slate-200">{log.title}</h4>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1 text-indigo-300">
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
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {log.description}
                      </p>

                      {urls.length > 0 && (
                        <div className="pt-2 border-t border-white/5 space-y-1">
                          <div className="text-[11px] font-semibold text-slate-400">Proof / Published Links:</div>
                          <div className="flex flex-wrap gap-2">
                            {urls.map((url, i) => (
                              <a
                                key={i}
                                href={url.startsWith('http') ? url : `https://${url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] font-mono border border-white/5 max-w-xs truncate"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span className="truncate">{url}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}