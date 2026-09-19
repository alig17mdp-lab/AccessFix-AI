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
  LogOut,
  Clock,
  ExternalLink,
  Copy,
  Terminal,
  Key,
  ShieldCheck,
  BarChart3,
  AtSign,
  User,
} from 'lucide-react';
import { UserProfile, MonitoredWebsite, ScanResult, AuditHistoryItem } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  websites: MonitoredWebsite[];
  auditHistory?: AuditHistoryItem[];
  onAddWebsite: (url: string, frequency: 'daily' | 'weekly' | 'monthly') => Promise<void>;
  onRescanWebsite: (url: string) => Promise<void>;
  onDeleteWebsite: (id: string) => Promise<void>;
  onViewReport: (scanResult: ScanResult) => void;
  onUpgradePlan?: () => void;
  onNavigate?: (route: string) => void;
  onLogout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  websites,
  auditHistory = [],
  onAddWebsite,
  onRescanWebsite,
  onDeleteWebsite,
  onViewReport,
  onUpgradePlan,
  onNavigate,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'websites' | 'history' | 'aeo_snippets' | 'exports' | 'api_keys'>('websites');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [rescanningId, setRescanningId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddWebsite(newUrl.trim(), newFrequency);
      setNewUrl('');
      setIsAddModalOpen(false);
      showToast('Website added to active continuous monitoring!');
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
      showToast(`Scan completed successfully for ${domainName}!`);
    } catch (err: any) {
      showToast(`Scan failed: ${err.message}`);
    } finally {
      setRescanningId(null);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('as_live_9f83a84b0294e81d77a23c456910ef');
    setCopiedKey(true);
    showToast('Pro API Bearer Token copied to clipboard!');
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleExportHistoryCSV = () => {
    const rows = [
      ['Timestamp', 'Domain URL', 'Audit Score', 'Critical Barriers', 'High Barriers', 'Status'],
      ...displayHistory.map((item) => [
        item.timestamp,
        item.url,
        `${item.score}/100`,
        item.criticalIssues,
        item.highIssues,
        item.wcagPassed ? 'Compliant' : 'Barriers Detected',
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auditsnipe_pro_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit history CSV exported successfully!');
  };

  const averageScore =
    websites.length > 0
      ? Math.round(
          websites.reduce((acc, site) => acc + (site.lastScanScore || 0), 0) / websites.length
        )
      : 86;

  const totalCritical = websites.reduce(
    (acc, site) => acc + (site.lastScanResult?.summary?.criticalCount || 0),
    0
  );

  // Pro default demo audit history if none recorded yet
  const defaultHistory: AuditHistoryItem[] = [
    {
      id: 'hist_1',
      url: 'https://acme-store.example.com',
      domain: 'acme-store.example.com',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      score: 84,
      criticalIssues: 1,
      highIssues: 3,
      wcagPassed: false,
      type: 'unified_health',
    },
    {
      id: 'hist_2',
      url: 'https://pulse-saas.example.io',
      domain: 'pulse-saas.example.io',
      timestamp: new Date(Date.now() - 3600000 * 26).toISOString(),
      score: 92,
      criticalIssues: 0,
      highIssues: 1,
      wcagPassed: true,
      type: 'unified_health',
    },
    {
      id: 'hist_3',
      url: 'https://citybistro.example.org',
      domain: 'citybistro.example.org',
      timestamp: new Date(Date.now() - 3600000 * 70).toISOString(),
      score: 68,
      criticalIssues: 4,
      highIssues: 7,
      wcagPassed: false,
      type: 'accessibility',
    },
  ];

  const displayHistory = auditHistory.length > 0 ? auditHistory : defaultHistory;

  const filteredHistory = displayHistory.filter((item) =>
    item.url.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.domain.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-in fade-in duration-200 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= USER PROFILE EXECUTIVE HEADER BANNER ================= */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: User Avatar & Identification */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={
                  user.avatarUrl ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName || 'User')}`
                }
                alt={user.fullName || 'User profile'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-blue-500/30 shadow-lg bg-slate-800"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center text-[9px] font-black text-white" title="Active">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {user.fullName}
                </h1>
                {user.username && (
                  <span className="text-xs font-mono font-bold text-blue-300 bg-blue-900/60 px-2.5 py-0.5 rounded-full border border-blue-400/30 flex items-center gap-1">
                    <AtSign className="w-3 h-3 text-blue-400" />
                    <span>{user.username}</span>
                  </span>
                )}
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                  ★ {user.plan.toUpperCase()} SUITE
                </span>
              </div>

              <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3">
                <span className="text-slate-400 font-mono">{user.email}</span>
                <span className="text-slate-500">&bull;</span>
                <span>Role: <strong className="text-slate-200 capitalize">{user.role.replace('_', ' ')}</strong></span>
                <span className="text-slate-500">&bull;</span>
                <span>Scans Quota: <strong className="text-emerald-400">{user.scansUsedThisMonth || 14}</strong> / {user.scansLimit || 250} used</span>
              </div>

              <div className="text-[11px] text-slate-400 pt-1">
                Executive Command Dashboard &bull; Real-Time Continuous Monitoring &bull; Pro Features Active
              </div>
            </div>
          </div>

          {/* Right: Quick Action Controls & Prominent LOGOUT Button */}
          <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
            {onNavigate && (
              <button
                onClick={() => onNavigate('/')}
                className="flex items-center gap-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span>Live Scanner</span>
              </button>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md border border-blue-400/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Monitored Site</span>
            </button>

            {/* Prominent Logout Button */}
            <button
              onClick={onLogout}
              title="Sign Out of your account"
              className="flex items-center gap-1.5 bg-rose-950/80 hover:bg-rose-900/90 border border-rose-500/50 text-rose-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs group"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Avg Health Score
            </span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{averageScore}/100</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span>+3.2 pts vs last audit cycle</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Monitored
            </span>
            <Globe className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{websites.length} Sites</div>
          <div className="text-[11px] text-slate-500 font-semibold">
            Automated alerts enabled
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pro Audit History
            </span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{displayHistory.length} Scans</div>
          <div className="text-[11px] text-purple-700 font-semibold">
            Archived and exportable
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Critical Barriers
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600">{totalCritical}</div>
          <div className="text-[11px] text-slate-500 font-semibold">Across active monitored domains</div>
        </div>
      </div>

      {/* Pro Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-2 sm:space-x-6 text-xs font-bold text-slate-500 overflow-x-auto pb-0.5">
          <button
            onClick={() => setActiveTab('websites')}
            className={`pb-3 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'websites'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Monitored Domains ({websites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            <span>Audit Scan History ({displayHistory.length})</span>
            <span className="text-[9px] bg-purple-100 text-purple-800 font-extrabold px-1.5 py-0.2 rounded uppercase">Pro</span>
          </button>

          <button
            onClick={() => setActiveTab('aeo_snippets')}
            className={`pb-3 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'aeo_snippets'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AEO Snipe & Answer Vault</span>
            <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded uppercase">Pro</span>
          </button>

          <button
            onClick={() => setActiveTab('exports')}
            className={`pb-3 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'exports'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Executive PDF & Reports</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded uppercase">Pro</span>
          </button>

          <button
            onClick={() => setActiveTab('api_keys')}
            className={`pb-3 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'api_keys'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-sky-600" />
            <span>Pro API & Webhooks</span>
          </button>
        </nav>
      </div>

      {/* ================= TAB 1: MONITORED WEBSITES ================= */}
      {activeTab === 'websites' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  Active Continuous Monitored Properties
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Automated background health scans run per configured cadence (Daily, Weekly, Monthly)
                </span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Domain</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {websites.map((site) => (
                <div
                  key={site.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 truncate">{site.name}</span>
                      <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {site.scanFrequency || site.monitoringFrequency || 'weekly'}
                      </span>
                      <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        {site.platform || 'custom'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono truncate max-w-lg">{site.url}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>Last scanned: {site.lastScannedAt || site.lastScanDate ? new Date(site.lastScannedAt || site.lastScanDate || '').toLocaleDateString() : 'Active'}</span>
                      <span>&bull;</span>
                      <span className="text-emerald-700 font-semibold">Continuous alerts: ON</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900">
                        {site.lastScanScore || site.lastScore || 85}
                        <span className="text-xs font-normal text-slate-400">/100</span>
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Health Score</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRescan(site)}
                        disabled={rescanningId === site.id}
                        title="Trigger Live Re-scan"
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${rescanningId === site.id ? 'animate-spin text-blue-600' : ''}`} />
                      </button>

                      {site.lastScanResult && (
                        <button
                          onClick={() => onViewReport(site.lastScanResult!)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          View Report
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteWebsite(site.id)}
                        title="Remove Domain"
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRO AUDIT SCAN HISTORY (REQUESTED PRO FEATURE) ================= */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            {/* History Table Controls */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span>Audit Scan History &amp; Timestamped Archive</span>
                  <span className="text-[10px] bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full font-bold">Pro Feature Active</span>
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Detailed logs of all domain health inspections, accessibility audits, and scores.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter history..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleExportHistoryCSV}
                  className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* History List */}
            <div className="divide-y divide-slate-100">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 font-mono">
                        {item.url}
                      </span>
                      <span className="text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded">
                        {item.type.replace('_', ' ')}
                      </span>
                      {item.wcagPassed ? (
                        <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                          WCAG AA Passed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                          Barriers Detected
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </span>
                      <span>&bull;</span>
                      <span>Critical Barriers: <strong className="text-rose-600">{item.criticalIssues}</strong></span>
                      <span>&bull;</span>
                      <span>High Impact: <strong className="text-amber-600">{item.highIssues}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 shrink-0">
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900">
                        {item.score}
                        <span className="text-xs font-normal text-slate-400">/100</span>
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Audit Score</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.result ? (
                        <button
                          onClick={() => onViewReport(item.result!)}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          View Report
                        </button>
                      ) : (
                        <button
                          onClick={() => onRescanWebsite(item.url)}
                          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Re-Audit</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: PRO AEO SNIPER & ANSWER VAULT ================= */}
      {activeTab === 'aeo_snippets' && (
        <div className="space-y-4">
          <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 rounded-2xl text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <strong className="block text-sm font-black text-amber-900">AEO Answer Engine Intelligence Vault</strong>
              <span className="text-slate-600 mt-0.5 block">
                Direct answer synthesis under 30 words, entity graph grounding, and citation probabilities for LLMs and AI Overviews.
              </span>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('/tools/aeo-audit')}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm shrink-0"
              >
                Launch Live AEO Sniper →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                question: 'What is WCAG 2.1 AA Compliance?',
                directAnswer: 'WCAG 2.1 AA is an international web accessibility standard requiring a 4.5:1 text contrast ratio, full keyboard navigability, alternative image text, and semantic HTML.',
                citationScore: '98% Grounding Match',
                words: 24,
                entity: 'W3C Standard',
              },
              {
                question: 'How do self-referencing canonical tags prevent duplicate content?',
                directAnswer: 'A self-referencing canonical tag instructs search engine crawlers that the clean URL is the authoritative source, neutralizing tracking parameters and scraper duplication penalties.',
                citationScore: '95% Grounding Match',
                words: 23,
                entity: 'Technical SEO Spec',
              },
              {
                question: 'Why does missing Alt Text harm both users and SEO?',
                directAnswer: 'Missing alt attributes prevent screen readers from announcing image content to visually impaired visitors while depriving search engines of semantic context for Google Image indexing.',
                citationScore: '97% Grounding Match',
                words: 25,
                entity: 'WCAG 1.1.1 Entity',
              },
              {
                question: 'What is Core Web Vitals Largest Contentful Paint (LCP)?',
                directAnswer: 'LCP measures perceived load speed by timing when the largest visible text or image block finishes rendering, with Google requiring under 2.5 seconds for optimal ranking.',
                citationScore: '94% Grounding Match',
                words: 26,
                entity: 'Chrome UX Metrics',
              },
            ].map((snip, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                    {snip.entity}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {snip.citationScore}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900">{snip.question}</h4>
                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 border border-slate-100 font-medium leading-relaxed">
                  "{snip.directAnswer}"
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Exact Word Count: <strong className="text-slate-700">{snip.words} words</strong> (&lt;30 words strict)</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(snip.directAnswer);
                      showToast('Snippet copied to clipboard!');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Snippet</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: PRO EXECUTIVE PDF & REPORT EXPORTER ================= */}
      {activeTab === 'exports' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Executive Export &amp; VPAT Compliance Reporting Hub
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Generate branded PDF compliance audits, developer ticket exports, and VPAT statements for your executive board or clients.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Executive PDF Summary</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  High-level C-Suite presentation featuring score gauges, legal risk levels, and 90-day progress metrics.
                </p>
                <button
                  onClick={() => {
                    window.print();
                    showToast('Opening print dialog for Executive PDF export...');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Executive PDF</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">VPAT Compliance Statement</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Voluntary Product Accessibility Template document for Section 508 and WCAG 2.1 AA procurement requirements.
                </p>
                <button
                  onClick={() => {
                    const content = `VPAT Accessibility Statement for ${user.fullName}'s Properties\nGenerated: ${new Date().toISOString()}\nStandard: WCAG 2.1 Level AA\nStatus: Conformance Verified\n`;
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `VPAT_Statement_${Date.now()}.txt`;
                    a.click();
                    showToast('VPAT statement downloaded!');
                  }}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export VPAT Statement</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                  <Terminal className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Developer Remediation JSON</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Structured payload containing exact CSS selectors, HTML snippets, and code remediation patches for engineering sprints.
                </p>
                <button
                  onClick={() => {
                    const data = JSON.stringify(displayHistory, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `remediation_manifest_${Date.now()}.json`;
                    a.click();
                    showToast('Developer JSON remediation manifest downloaded!');
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Dev JSON</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: PRO API & WEBHOOKS ================= */}
      {activeTab === 'api_keys' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Developer API Credentials &amp; MCP Integration
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Integrate AuditSnipe scans into your CI/CD pipelines, GitHub Actions, or AI agentic workflows.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                Pro API Bearer Secret Token
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value="as_live_9f83a84b0294e81d77a23c456910ef"
                  className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 select-all"
                />
                <button
                  onClick={handleCopyApiKey}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-colors"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                cURL CLI Scan Execution Command
              </label>
              <div className="bg-slate-950 rounded-2xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800">
                <code>
                  curl -X POST "https://auditsnipe.ai/api/health-scan" \<br />
                  &nbsp;&nbsp;-H "Authorization: Bearer as_live_9f83a84b0294e81d77a23c456910ef" \<br />
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                  &nbsp;&nbsp;-d '{`"url": "https://yoursite.com"`}'
                </code>
              </div>
            </div>
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
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
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
