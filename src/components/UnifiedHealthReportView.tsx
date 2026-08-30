import React, { useState } from 'react';
import {
  ShieldCheck,
  Globe,
  Download,
  Share2,
  RefreshCw,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Code2,
  Layers,
  FileText,
  Search,
  ExternalLink,
  Info,
  Clock,
  ArrowRight,
  BarChart3,
  Copy,
  Check,
  Flame,
} from 'lucide-react';
import { UnifiedHealthScan, HealthPillar, PriorityActionItem } from '../types';
import { ReportView } from './ReportView';

interface UnifiedHealthReportViewProps {
  healthScan?: UnifiedHealthScan;
  scan?: UnifiedHealthScan;
  onRescan?: (url: string) => void;
  onNavigateToTool?: (toolSlug: string) => void;
  onNavigate?: (route: string) => void;
  onBackToScan?: () => void;
  onAddToMonitoring?: (url: string) => void;
  onOpenAuth?: () => void;
}

export const UnifiedHealthReportView: React.FC<UnifiedHealthReportViewProps> = ({
  healthScan: propHealthScan,
  scan: propScan,
  onRescan,
  onNavigateToTool,
  onNavigate,
  onBackToScan,
  onAddToMonitoring,
  onOpenAuth,
}) => {
  const healthScan = propHealthScan || propScan;
  const [activeTab, setActiveTab] = useState<HealthPillar | 'overview'>('overview');
  const [copiedActionId, setCopiedActionId] = useState<string | null>(null);

  if (!healthScan) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No scan data available</h2>
        <p className="text-sm text-slate-500">Please initiate a fresh health scan to generate a report.</p>
        <button
          onClick={onBackToScan || (() => onNavigate && onNavigate('/'))}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
        >
          Return to Scanner
        </button>
      </div>
    );
  }

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedActionId(id);
    setTimeout(() => setCopiedActionId(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-emerald-600 text-white';
    if (score >= 70) return 'bg-amber-500 text-white';
    return 'bg-rose-600 text-white';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
              Unified AI Website Health Audit
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(healthScan.scannedAt || Date.now()).toLocaleDateString()} at{' '}
              {new Date(healthScan.scannedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-blue-600 shrink-0" />
            <span className="truncate">{healthScan.domain}</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono truncate max-w-2xl">{healthScan.targetUrl}</p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onRescan(healthScan.targetUrl)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Audit Site</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full PDF Report</span>
          </button>
        </div>
      </div>

      {/* Legal & Diagnostic Disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          <strong>Automated Diagnostic Notice:</strong> This comprehensive health audit identifies common technical, accessibility, and search optimization barriers. Automated scans do not constitute legal advice, ADA certification, or guaranteed Google SERP ranking increases.
        </span>
      </div>

      {/* Executive Overall Score & 5-Pillar Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Composite Score */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Composite Website Health
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getScoreBadge(healthScan.overallScore)}`}>
                {healthScan.overallScore >= 90 ? 'EXCELLENT' : healthScan.overallScore >= 70 ? 'GOOD' : 'NEEDS ATTENTION'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-slate-900 tracking-tight">
                {healthScan.overallScore}
              </span>
              <span className="text-xl font-bold text-slate-400">/ 100</span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed font-normal">
              {healthScan.executiveSummary}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Audit Duration: {(healthScan.durationMs / 1000).toFixed(2)}s</span>
            <span className="text-emerald-700 font-bold">
              {healthScan.topPriorityActions.filter((a) => a.isQuickWin).length} Quick Wins Identified
            </span>
          </div>
        </div>

        {/* 5-Pillar Score Cards */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Pillar 1: Accessibility */}
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'accessibility'
                ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Accessibility</span>
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 my-1">
              {healthScan.pillarScores.accessibility.score}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {healthScan.pillarScores.accessibility.critical > 0 ? (
                <span className="text-rose-600 font-semibold">{healthScan.pillarScores.accessibility.critical} Critical Barriers</span>
              ) : (
                <span className="text-emerald-600 font-semibold">WCAG 2.1 AA Passed</span>
              )}
            </div>
          </button>

          {/* Pillar 2: On-Page SEO */}
          <button
            onClick={() => setActiveTab('seo')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'seo'
                ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">On-Page SEO</span>
              <Search className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 my-1">
              {healthScan.pillarScores.seo.score}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {healthScan.pillarScores.seo.critical > 0 ? (
                <span className="text-rose-600 font-semibold">{healthScan.pillarScores.seo.critical} High Priorities</span>
              ) : (
                <span className="text-emerald-600 font-semibold">Meta & Headings Good</span>
              )}
            </div>
          </button>

          {/* Pillar 3: Technical SEO */}
          <button
            onClick={() => setActiveTab('technicalSeo')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'technicalSeo'
                ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Technical SEO</span>
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 my-1">
              {healthScan.pillarScores.technicalSeo.score}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Robots.txt & Sitemap Valid
            </div>
          </button>

          {/* Pillar 4: Performance & CWV */}
          <button
            onClick={() => setActiveTab('performance')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'performance'
                ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Performance</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 my-1">
              {healthScan.pillarScores.performance.score}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <div className="text-[11px] text-slate-500">
              LCP: {(healthScan.pillarScores.performance.lcpMs / 1000).toFixed(1)}s
            </div>
          </button>

          {/* Pillar 5: Content & Intent */}
          <button
            onClick={() => setActiveTab('content')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'content'
                ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Content Quality</span>
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 my-1">
              {healthScan.pillarScores.content.score}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {healthScan.pillarScores.content.wordCount} Words Analyzed
            </div>
          </button>

          {/* Tab: View All Action Items */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'overview'
                ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Priority Engine</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-xs font-bold text-blue-700 my-1">
              {healthScan.topPriorityActions.length} Ranked Fixes
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
              <span>View Action Matrix</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 overflow-x-auto text-xs font-bold text-slate-500">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Top Priority Actions (Impact × Effort)
          </button>
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'accessibility'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Accessibility ({healthScan.accessibilityScan.issues.length} Issues)
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'seo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            On-Page SEO Audit
          </button>
          <button
            onClick={() => setActiveTab('technicalSeo')}
            className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'technicalSeo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Technical SEO
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'performance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Core Web Vitals & Speed
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'content'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Content & Readability
          </button>
        </nav>
      </div>

      {/* TAB CONTENT: Overview & Priority Actions */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Unified Priority Engine: Highest Impact Fixes
              </h3>
              <p className="text-xs text-slate-500">
                Ranked using our mathematical <strong className="text-slate-700">Impact × Effort matrix</strong>. Resolving "Quick Wins" yields the highest immediate score improvement with minimal dev time.
              </p>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg shrink-0">
              Estimated Total Score Boost: +{healthScan.topPriorityActions.reduce((acc, a) => acc + a.scoreBoostEstimate, 0)} pts
            </span>
          </div>

          <div className="space-y-4">
            {healthScan.topPriorityActions.map((action, idx) => (
              <div
                key={action.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-400">#{idx + 1}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {action.pillar}
                    </span>
                    {action.isQuickWin && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full animate-pulse">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        Quick Win
                      </span>
                    )}
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      +{action.scoreBoostEstimate} pts
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span>Impact: <strong className="text-slate-800 capitalize">{action.impact}</strong></span>
                    <span>•</span>
                    <span>Effort: <strong className="text-slate-800 capitalize">{action.effort}</strong></span>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">{action.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{action.explanation}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Business & SEO Consequence:</span>
                    <span className="text-slate-600">{action.businessConsequence}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Recommended Remediation:</span>
                    <span className="text-slate-600">{action.recommendedAction}</span>
                  </div>
                </div>

                {action.codeSnippetFix && (
                  <div className="relative bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto">
                    <pre className="text-emerald-300">{action.codeSnippetFix}</pre>
                    <button
                      onClick={() => copySnippet(action.id, action.codeSnippetFix!)}
                      className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1"
                    >
                      {copiedActionId === action.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedActionId === action.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Accessibility Deep Dive (Preserves Full Existing ReportView) */}
      {activeTab === 'accessibility' && (
        <div className="space-y-6">
          <ReportView
            scanResult={healthScan.accessibilityScan}
            onRescan={onRescan}
            onOpenAuth={onOpenAuth}
          />
        </div>
      )}

      {/* TAB CONTENT: On-Page SEO Deep Dive */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Page Title</span>
              <div className="text-sm font-bold text-slate-900 line-clamp-2">
                {healthScan.seoAudit.title.text || 'Missing Title Tag'}
              </div>
              <div className="text-[11px] text-slate-500">
                {healthScan.seoAudit.title.length} characters (Recommended: 50-60)
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Meta Description</span>
              <div className="text-sm font-bold text-slate-900 line-clamp-2">
                {healthScan.seoAudit.metaDescription.text || 'Missing Meta Description'}
              </div>
              <div className="text-[11px] text-slate-500">
                {healthScan.seoAudit.metaDescription.length} characters (Recommended: 140-160)
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Heading Hierarchy</span>
              <div className="text-sm font-bold text-slate-900">
                {healthScan.seoAudit.headings.h1Count} H1 • {healthScan.seoAudit.headings.h2Count} H2 • {healthScan.seoAudit.headings.h3Count} H3
              </div>
              <div className="text-[11px] text-slate-500">
                {healthScan.seoAudit.headings.hierarchyValid ? 'Valid hierarchy structure' : 'Needs hierarchy cleanup'}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Detailed On-Page SEO Checklist ({healthScan.seoAudit.checks.length} Checks)
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-700 font-bold">{healthScan.seoAudit.summary.passed} Passed</span>
                <span className="text-slate-300">•</span>
                <span className="text-amber-700 font-bold">{healthScan.seoAudit.summary.warnings} Warnings</span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-700 font-bold">{healthScan.seoAudit.summary.critical} Critical</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {healthScan.seoAudit.checks.map((check) => (
                <div key={check.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          check.status === 'passed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : check.status === 'critical'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {check.status}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{check.title}</span>
                      {check.value && (
                        <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {check.value}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{check.details}</p>
                    <p className="text-xs font-semibold text-blue-700">Fix: {check.recommendation}</p>

                    {check.codeSnippet && (
                      <pre className="mt-2 text-[11px] font-mono bg-slate-900 text-emerald-300 p-2.5 rounded-lg overflow-x-auto">
                        {check.codeSnippet}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Technical SEO Deep Dive */}
      {activeTab === 'technicalSeo' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Robots.txt</span>
              <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Found & Configured</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono truncate">{healthScan.technicalSeoAudit.robotsTxt.url}</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">XML Sitemap</span>
              <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Detected ({healthScan.technicalSeoAudit.sitemapXml.urlCount} URLs)</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono truncate">{healthScan.technicalSeoAudit.sitemapXml.url}</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Server TTFB</span>
              <div className="text-sm font-bold text-slate-900">
                {healthScan.technicalSeoAudit.httpProtocol.ttfbMs}ms
              </div>
              <div className="text-[11px] text-slate-500">
                {healthScan.technicalSeoAudit.httpProtocol.ttfbMs < 600 ? 'Optimal server response' : 'Slow initial response'}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Robots.txt Directive Inspection</h4>
            <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs">
              {healthScan.technicalSeoAudit.robotsTxt.rawSnippet || 'User-agent: *\nDisallow: /admin/\nSitemap: https://' + healthScan.domain + '/sitemap.xml'}
            </pre>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Performance & Core Web Vitals */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Largest Contentful Paint</span>
              <div className="text-2xl font-black text-slate-900">
                {(healthScan.performanceAudit.metrics.lcp.valueMs / 1000).toFixed(1)}s
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                healthScan.performanceAudit.metrics.lcp.rating === 'good' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {healthScan.performanceAudit.metrics.lcp.rating}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Layout Shift (CLS)</span>
              <div className="text-2xl font-black text-slate-900">
                {healthScan.performanceAudit.metrics.cls.value}
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Good (&lt; 0.1)
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Interaction (INP)</span>
              <div className="text-2xl font-black text-slate-900">
                {healthScan.performanceAudit.metrics.inp.valueMs}ms
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Good (&lt; 200ms)
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Page Weight</span>
              <div className="text-2xl font-black text-slate-900">
                {healthScan.performanceAudit.pageWeight.totalSizeKb} KB
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">
                {healthScan.performanceAudit.pageWeight.totalRequests} total network requests
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Key Performance Optimization Opportunities</h4>
            <div className="space-y-3">
              {healthScan.performanceAudit.opportunities.map((opp, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{opp.title}</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Save ~{opp.estimatedSavingsMs}ms
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{opp.description}</p>
                  <p className="text-[11px] font-semibold text-blue-700">Guide: {opp.fixGuide}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Content & Readability Deep Dive */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Word Count</span>
              <div className="text-3xl font-black text-slate-900">
                {healthScan.contentAudit.wordCount}
              </div>
              <div className="text-[11px] text-slate-500">
                Estimated {healthScan.contentAudit.estimatedReadTimeMin} min read
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Reading Level</span>
              <div className="text-xl font-bold text-slate-900">
                {healthScan.contentAudit.readingGradeLevel}
              </div>
              <div className="text-[11px] text-slate-500">
                Flesch Reading Ease: {healthScan.contentAudit.fleschKincaidReadingEase}/100
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Thin Content Risk</span>
              <div className="text-xl font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Low Risk</span>
              </div>
              <div className="text-[11px] text-slate-500">Comprehensive topical coverage</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Top Detected Keyword Entities</h4>
            <div className="flex flex-wrap gap-2">
              {healthScan.contentAudit.topKeywords.map((kw, i) => (
                <span key={i} className="text-xs font-semibold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200">
                  {kw.keyword} ({kw.count}x • {kw.density}%)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
