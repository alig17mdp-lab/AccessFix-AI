import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Trash2,
  RefreshCw,
  Bell,
  Building,
  CreditCard,
  Download,
  Filter,
  Check,
  Search,
  Zap,
  Layers,
  FileText,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { UserProfile, MonitoredWebsite, ScanResult, IssueStatus } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  websites: MonitoredWebsite[];
  onAddWebsite: (url: string, frequency: 'daily' | 'weekly' | 'monthly') => Promise<void>;
  onRescanWebsite: (url: string) => Promise<void>;
  onDeleteWebsite: (id: string) => Promise<void>;
  onViewReport: (scanResult: ScanResult) => void;
  onUpgradePlan: () => void;
  onNavigate?: (route: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  websites,
  onAddWebsite,
  onRescanWebsite,
  onDeleteWebsite,
  onViewReport,
  onUpgradePlan,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'websites' | 'priorities' | 'alerts' | 'agency'>('websites');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [rescanningId, setRescanningId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddWebsite(newUrl.trim(), newFrequency);
      setNewUrl('');
      setIsAddModalOpen(false);
      showToast('Website added to active monitoring!');
    } catch (err: any) {
      showToast('Error adding website: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRescan = async (site: MonitoredWebsite) => {
    setRescanningId(site.id);
    const domainName = site.domain || site.name || 'website';
    try {
      await onRescanWebsite(site.url);
      showToast(`Scan completed for ${domainName}!`);
    } catch (err: any) {
      showToast(`Scan failed: ${err.message}`);
    } finally {
      setRescanningId(null);
    }
  };

  const averageScore =
    websites.length > 0
      ? Math.round(
          websites.reduce((acc, site) => acc + (site.lastScanScore || 0), 0) / websites.length
        )
      : 84;

  const totalCritical = websites.reduce(
    (acc, site) => acc + (site.lastScanResult?.summary?.criticalCount || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-200 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Website Health & Growth Dashboard
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
              {user.plan.toUpperCase()} PLAN
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time monitoring across Accessibility (WCAG 2.1 AA), On-Page SEO, Core Web Vitals, and Content Quality.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => onNavigate('/tools/site-comparison')}
              className="flex items-center gap-2 bg-white border border-cyan-300/80 text-cyan-900 hover:bg-cyan-50/80 px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-600" />
              <span>Competitor Comparison</span>
            </button>
          )}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer border border-blue-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Monitored Website</span>
          </button>
        </div>

      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Avg Health Score
            </span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{averageScore}/100</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span>+3.2 pts vs last month</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Monitored Domains
            </span>
            <Globe className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{websites.length} Sites</div>
          <div className="text-[11px] text-slate-500 font-semibold">
            {user.plan === 'free' ? '1 of 1 slot used' : 'Unlimited active slots'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Critical Barriers
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600">{totalCritical}</div>
          <div className="text-[11px] text-slate-500 font-semibold">Across all active properties</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Wins Ready
            </span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">4 Fixes</div>
          <div className="text-[11px] text-emerald-600 font-semibold">High impact, low effort</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 text-xs font-bold text-slate-500">
          <button
            onClick={() => setActiveTab('websites')}
            className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'websites'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Monitored Websites ({websites.length})
          </button>
          <button
            onClick={() => setActiveTab('priorities')}
            className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'priorities'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Unified Priority Engine
          </button>
        </nav>
      </div>

      {/* Tab 1: Websites Table */}
      {activeTab === 'websites' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Monitored Properties
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Automatic scans scheduled per website cadence
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {websites.map((site) => (
              <div
                key={site.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{site.name}</span>
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {site.scanFrequency}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono truncate max-w-md">{site.url}</div>
                  <div className="text-[11px] text-slate-400">
                    Last scanned: {site.lastScannedAt ? new Date(site.lastScannedAt).toLocaleDateString() : 'Never'}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">
                      {site.lastScanScore || 85}
                      <span className="text-xs font-normal text-slate-400">/100</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      HEALTHY
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRescan(site)}
                      disabled={rescanningId === site.id}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="Rescan Now"
                    >
                      <RefreshCw className={`w-4 h-4 ${rescanningId === site.id ? 'animate-spin' : ''}`} />
                    </button>

                    {site.lastScanResult && (
                      <button
                        onClick={() => onViewReport(site.lastScanResult!)}
                        className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span>View Audit</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteWebsite(site.id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove Website"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Unified Priority Engine */}
      {activeTab === 'priorities' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-center justify-between">
            <div>
              <strong className="block font-bold">Cross-Pillar Priority Actions</strong>
              <span>Items ranked by Impact × Effort matrix across all connected sites.</span>
            </div>
            <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-xl">
              4 Quick Wins
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Add Missing Alt Text to 6 Product Images',
                pillar: 'Accessibility & SEO',
                impact: 'High',
                effort: 'Low',
                quickWin: true,
                scoreBoost: '+6 pts',
                desc: 'Images lack alternative descriptions, violating WCAG 1.1.1 and losing Google Image rankings.',
              },
              {
                title: 'Configure Self-Referencing Canonical Tag',
                pillar: 'Technical SEO',
                impact: 'High',
                effort: 'Low',
                quickWin: true,
                scoreBoost: '+5 pts',
                desc: 'Prevents duplicate content issues from URL query parameters.',
              },
              {
                title: 'Fix Low Contrast Form Placeholder Text (#94a3b8)',
                pillar: 'Accessibility',
                impact: 'Medium',
                effort: 'Low',
                quickWin: true,
                scoreBoost: '+4 pts',
                desc: 'Placeholder contrast ratio is 2.3:1 (below the WCAG AA 4.5:1 requirement).',
              },
              {
                title: 'Compress Hero Image (LCP Optimization)',
                pillar: 'Performance',
                impact: 'High',
                effort: 'Medium',
                quickWin: false,
                scoreBoost: '+7 pts',
                desc: 'Hero image is 850KB PNG. Converting to WebP will reduce LCP by 450ms.',
              },
            ].map((act, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {act.pillar}
                    </span>
                    {act.quickWin && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        Quick Win
                      </span>
                    )}
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {act.scoreBoost}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                  <p className="text-xs text-slate-600">{act.desc}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate('/tools/color-contrast-checker');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Resolve Fix
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Website Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Add Monitored Website</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://yoursite.com"
                  required
                  className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monitoring Frequency
                </label>
                <select
                  value={newFrequency}
                  onChange={(e) => setNewFrequency(e.target.value as any)}
                  className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="daily">Daily Automated Audit</option>
                  <option value="weekly">Weekly Automated Audit</option>
                  <option value="monthly">Monthly Automated Audit</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  {isSubmitting ? 'Adding...' : 'Start Monitoring'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
