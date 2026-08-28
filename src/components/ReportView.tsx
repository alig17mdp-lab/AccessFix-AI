import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Download,
  FileText,
  Printer,
  Search,
  Filter,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Code,
  Layers,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import { ScanResult, AccessibilityIssue, SeverityLevel, IssueCategory, IssueStatus } from '../types';
import { downloadJsonReport, downloadCsvReport, copyMarkdownReport } from '../utils/exportHelpers';

interface ReportViewProps {
  scan: ScanResult;
  onBackToScan: () => void;
  onAddToMonitoring?: (url: string) => void;
  onOpenAuth?: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  scan,
  onBackToScan,
  onAddToMonitoring,
  onOpenAuth,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<Record<string, 'html' | 'react' | 'wordpress' | 'shopify'>>({});
  const [expandedIssueIds, setExpandedIssueIds] = useState<Set<string>>(new Set([scan.issues[0]?.id]));
  const [issuesState, setIssuesState] = useState<AccessibilityIssue[]>(scan.issues);
  const [aiLoadingIds, setAiLoadingIds] = useState<Set<string>>(new Set());
  const [markdownCopied, setMarkdownCopied] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedIssueIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyMarkdown = () => {
    const md = copyMarkdownReport(scan);
    navigator.clipboard.writeText(md);
    setMarkdownCopied(true);
    setTimeout(() => setMarkdownCopied(false), 2500);
  };

  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    setIssuesState((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, status: newStatus } : iss))
    );

    try {
      await fetch(`/api/scans/${scan.id}/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.warn('Status sync error', e);
    }
  };

  const handleAskAiForIssue = async (issue: AccessibilityIssue) => {
    setAiLoadingIds((prev) => new Set(prev).add(issue.id));
    try {
      const res = await fetch('/api/ai/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueTitle: issue.title,
          category: issue.category,
          wcagCriteria: issue.wcagCriteria,
          affectedElement: issue.affectedElement,
          htmlSnippet: issue.htmlSnippet,
          url: scan.targetUrl,
        }),
      });

      if (res.ok) {
        const remediation = await res.json();
        setIssuesState((prev) =>
          prev.map((iss) =>
            iss.id === issue.id
              ? {
                  ...iss,
                  explanation: remediation.plainEnglishSummary || iss.explanation,
                  whyItMatters: remediation.businessImpact || iss.whyItMatters,
                  recommendedFix: remediation.contentFix || iss.recommendedFix,
                  technicalFix: {
                    ...iss.technicalFix,
                    ...(remediation.codeSnippet || {}),
                  },
                  aiSuggestion: {
                    plainEnglishSummary: remediation.plainEnglishSummary,
                    businessImpact: remediation.businessImpact,
                    contentFix: remediation.contentFix,
                    developerFix: remediation.developerFix,
                  },
                }
              : iss
          )
        );
      }
    } catch (err) {
      console.error('AI fix request failed', err);
    } finally {
      setAiLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(issue.id);
        return next;
      });
    }
  };

  // Filter issues
  const filteredIssues = issuesState.filter((issue) => {
    if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) {
      return false;
    }
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.affectedElement.toLowerCase().includes(q) ||
        issue.wcagCriteria.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <ShieldAlert className="w-3 h-3" />
            <span>Critical</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3" />
            <span>High</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <AlertCircle className="w-3 h-3" />
            <span>Medium</span>
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-400 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Info className="w-3 h-3" />
            <span>Low</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            <span>Passed</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8 print:hidden">
        <button
          onClick={onBackToScan}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600 bg-white border border-slate-200 hover:bg-slate-50 px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Scan</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={() => downloadCsvReport(scan)}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => downloadJsonReport(scan)}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {markdownCopied ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{markdownCopied ? 'Summary Copied!' : 'Copy Markdown'}</span>
          </button>
        </div>
      </div>

      {/* Hero Score & Executive Summary Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Score Gauge (Professional Polish Circular SVG) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Accessibility Health Score
            </span>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={scan.score >= 90 ? '#2563EB' : scan.score >= 70 ? '#D97706' : '#DC2626'}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * scan.score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-900">
                <span className="text-4xl font-bold tracking-tight">{scan.score}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
              </div>
            </div>
            <div className="mt-3 text-xs font-semibold text-slate-700">
              {scan.score >= 90 ? 'High Accessibility' : scan.score >= 70 ? 'Moderate Compliance' : 'Action Required'}
            </div>
          </div>

          {/* Report Details & Metadata */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Audit Target
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1 truncate max-w-lg">
                  {scan.targetUrl}
                </h2>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div>Scanned on {new Date(scan.scannedAt).toLocaleDateString()}</div>
                <div>Audit duration: {(scan.durationMs / 1000).toFixed(2)}s</div>
              </div>
            </div>

            {/* Executive summary block */}
            <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Executive Summary</span>
              </div>
              <p>{scan.executiveSummary}</p>
            </div>

            {/* Severity Breakdown Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-red-700">{scan.summary.criticalCount}</div>
                <div className="text-[11px] font-bold text-red-600 uppercase tracking-wide">Critical</div>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-orange-700">{scan.summary.highCount}</div>
                <div className="text-[11px] font-bold text-orange-600 uppercase tracking-wide">High</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-slate-700">{scan.summary.mediumCount}</div>
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Medium</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-slate-600">{scan.summary.lowCount}</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Low</div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                <div className="text-2xl font-bold text-blue-700">{scan.summary.passedCount}</div>
                <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">Passed Checks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong>Compliance Advisory:</strong> This score represents automated programmatic rule evaluation against WCAG 2.1 Level AA criteria. It does not constitute official legal certification or guarantee of ADA lawsuit immunity.
          </p>
        </div>
      </div>

      {/* Issues Explorer & Filters */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Detected Issues ({filteredIssues.length})
            </h3>
            <p className="text-xs text-slate-500">
              Filter by category, search by element, or view AI remediation fixes.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search issues or elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Filter Chips & Tabs */}
        <div className="space-y-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-200 text-xs">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'images', label: 'Images' },
              { id: 'headings', label: 'Headings' },
              { id: 'links', label: 'Links' },
              { id: 'buttons', label: 'Buttons' },
              { id: 'forms', label: 'Forms' },
              { id: 'color', label: 'Color & Contrast' },
              { id: 'structure', label: 'Structure & Landmarks' },
              { id: 'tables', label: 'Tables' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Severity Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Filter Severity:</span>
            {[
              { id: 'all', label: 'All Severities' },
              { id: 'critical', label: 'Critical' },
              { id: 'high', label: 'High' },
              { id: 'medium', label: 'Medium' },
              { id: 'low', label: 'Low' },
            ].map((sev) => (
              <button
                key={sev.id}
                onClick={() => setSelectedSeverity(sev.id)}
                className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                  selectedSeverity === sev.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {sev.label}
              </button>
            ))}
          </div>
        </div>

        {/* Issue Cards List */}
        {filteredIssues.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-blue-500 mx-auto" />
            <h4 className="text-lg font-bold text-slate-900">No issues found matching your filters</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try resetting your category or severity filters to view all audit findings.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSeverity('all');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => {
              const isExpanded = expandedIssueIds.has(issue.id);
              const activeTab = activeCodeTab[issue.id] || 'html';
              const isAiLoading = aiLoadingIds.has(issue.id);

              const cardBorderClass =
                issue.severity === 'critical'
                  ? 'border-red-100 bg-red-50/40'
                  : issue.severity === 'high'
                  ? 'border-orange-100 bg-orange-50/40'
                  : 'border-slate-200 bg-white';

              return (
                <div
                  key={issue.id}
                  id={`issue-card-${issue.id}`}
                  className={`border rounded-2xl shadow-xs hover:shadow-md transition-all overflow-hidden ${cardBorderClass}`}
                >
                  {/* Header row */}
                  <div
                    onClick={() => toggleExpand(issue.id)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-black/[0.02] transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {getSeverityBadge(issue.severity)}
                        <span className="text-[11px] font-bold uppercase bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                          {issue.category}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {issue.wcagCriteria}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{issue.title}</h4>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>Affected:</span>
                        <code className="bg-white border border-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono text-[11px]">
                          {issue.affectedElement}
                        </code>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <select
                        aria-label={`Update resolution status for issue ${issue.title}`}
                        value={issue.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(issue.id, e.target.value as IssueStatus);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border cursor-pointer ${
                          issue.status === 'fixed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : issue.status === 'in_progress'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : issue.status === 'ignored'
                            ? 'bg-slate-100 text-slate-500 border-slate-200'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="open">Status: Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="fixed">Resolved / Fixed</option>
                        <option value="ignored">Ignored</option>
                      </select>

                      <button
                        aria-label={isExpanded ? 'Collapse issue details' : 'Expand issue details'}
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details Body */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-200/60 space-y-5 bg-white">
                      {/* 2-Column Explanation & Impact */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Problem Explanation
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {issue.explanation}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Why It Matters (User & Legal Impact)
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {issue.whyItMatters}
                          </p>
                        </div>
                      </div>

                      {/* Recommended Content Fix */}
                      <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span>AI Insights & Remediation</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAskAiForIssue(issue)}
                            disabled={isAiLoading}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-white border border-blue-200 px-3 py-1 rounded-lg transition-colors cursor-pointer shadow-xs"
                          >
                            <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                            <span>{isAiLoading ? 'Synthesizing Fix...' : 'Ask AI to Remediate'}</span>
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {issue.recommendedFix}
                        </p>
                      </div>

                      {/* Technical Developer Fix Code Snippets */}
                      <div className="bg-slate-900 rounded-xl overflow-hidden text-slate-100 shadow-md">
                        {/* Tab Headers */}
                        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-blue-400" />
                            <span className="font-bold text-slate-200">Remediation Code</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {['html', 'react', 'wordpress', 'shopify'].map((platform) => (
                              <button
                                key={platform}
                                onClick={() =>
                                  setActiveCodeTab((prev) => ({
                                    ...prev,
                                    [issue.id]: platform as any,
                                  }))
                                }
                                className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                                  activeTab === platform
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                }`}
                              >
                                {platform}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Code Box */}
                        <div className="p-4 relative group font-mono text-xs overflow-x-auto leading-relaxed">
                          {issue.technicalFix[activeTab] ? (
                            <pre className="text-blue-200 whitespace-pre-wrap">
                              {issue.technicalFix[activeTab]}
                            </pre>
                          ) : (
                            <pre className="text-slate-400 whitespace-pre-wrap">
                              {issue.technicalFix.html || '<!-- Remediate following standard semantic guidelines -->'}
                            </pre>
                          )}

                          <button
                            onClick={() =>
                              handleCopy(
                                issue.technicalFix[activeTab] || issue.technicalFix.html || '',
                                issue.id
                              )
                            }
                            className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                          >
                            {copiedId === issue.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-blue-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Call to action card for continuous monitoring */}
      <div className="mt-12 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Continuous Automated Protection
          </span>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            Enable Weekly Automated Monitoring for {new URL(scan.targetUrl).hostname}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Protect your website from regression when team members publish new content or themes. Get automated weekly scan reports and instant alerts whenever scores change.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (onAddToMonitoring) onAddToMonitoring(scan.targetUrl);
            }}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
