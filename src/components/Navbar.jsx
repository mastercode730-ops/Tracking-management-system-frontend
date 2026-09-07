import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Globe, LogOut, User, Shield, PlusCircle } from 'lucide-react';

export default function Navbar({ onOpenLogModal }) {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#111827]/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            SEO Tracker
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">
              Operations Hub
            </span>
          </h1>
          <p className="text-xs text-slate-400">Multi-Site SEO & Daily Worklog System</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenLogModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Daily Work</span>
        </button>

        <div className="h-6 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-slate-800/80 border border-white/5 py-1.5 px-3 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                {user?.name}
                {isAdmin && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-0.5">
                    <Shield className="w-2.5 h-2.5" /> Admin
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Log Out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}