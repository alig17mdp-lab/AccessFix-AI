import React, { useState } from 'react';
import { ShieldCheck, Activity, Users, Globe, Database, ArrowLeft, RefreshCw, BookOpen, Layers } from 'lucide-react';
import { UserProfile, BlogPost } from '../types';
import { AdminContentHub } from './AdminContentHub';

interface AdminViewProps {
  onBack: () => void;
  currentUser: UserProfile;
  onSelectPost: (post: BlogPost) => void;
  onNavigate: (route: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  onBack,
  currentUser,
  onSelectPost,
  onNavigate,
}) => {
  const [adminTab, setAdminTab] = useState<'content' | 'telemetry'>('content');
  const [stats] = useState({
    totalUsers: 142,
    totalScansRun: 1845,
    totalWebsitesMonitored: 89,
    activeSubscribers: 64,
    aiModelStatus: 'Gemini 3.7 Flash (Active / Healthy)',
    serverUptime: '99.98%',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3.5 py-2 rounded-xl cursor-pointer hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to App</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setAdminTab('content')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                adminTab === 'content'
                  ? 'bg-white text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Content CMS & AI Engine
            </button>
            <button
              onClick={() => setAdminTab('telemetry')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                adminTab === 'telemetry'
                  ? 'bg-white text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              System Telemetry
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Super Admin</span>
          </div>
        </div>
      </div>

      {adminTab === 'content' ? (
        <AdminContentHub onSelectPost={onSelectPost} onNavigate={onNavigate} />
      ) : (
        <div className="space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              AuditSnipe AI System Telemetry & Administration
            </h1>
            <p className="text-xs text-slate-500">
              Internal operational metrics, LLM gateway performance, and subscriber management.
            </p>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-bold uppercase text-slate-400">Total Registered Users</div>
              <div className="text-3xl font-black text-slate-900">{stats.totalUsers}</div>
              <div className="text-[11px] text-emerald-600 font-semibold">+18% this month</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-bold uppercase text-slate-400">Total Scans Executed</div>
              <div className="text-3xl font-black text-slate-900">{stats.totalScansRun}</div>
              <div className="text-[11px] text-emerald-600 font-semibold">Avg 3.4s response time</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-bold uppercase text-slate-400">Active Paid Subscriptions</div>
              <div className="text-3xl font-black text-slate-900">{stats.activeSubscribers}</div>
              <div className="text-[11px] text-purple-600 font-semibold">Pro & Agency Tiers</div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Infrastructure Health Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-700">Gemini 3.7 Flash Gateway</div>
                <div className="text-emerald-600 font-bold">Operational (Latency: 520ms)</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-700">DOM Crawler Engine</div>
                <div className="text-emerald-600 font-bold">Cheerio + SSRF Defense Active</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-700">Scheduled Monitor Cron</div>
                <div className="text-emerald-600 font-bold">Running 24/7 (Next run in 42m)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

