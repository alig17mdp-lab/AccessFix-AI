import React, { useState, useEffect } from 'react';
import {
  SiteComparisonResult,
  SiteComparisonRequest,
  ScorecardCategory,
  GrowthActionItem,
  CompetitorWinningKeyword,
  QuickWinOpportunity,
  ContentGapItemDetailed,
  SiteWeaknessItem,
  CompetitorStrengthArea,
  WinningPatternItem,
  ContentStrategyGeneratorItem,
  KeywordClusterComparisonItem,
  InternalLinkOpportunityItem,
  OnPageComparisonItem,
  SerpInsightItem,
  SiteAdvantageItem,
  CompetitorWeaknessOpportunity,
  RoadmapItem,
} from '../types';
import {
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Award,
  Layers,
  Zap,
  Globe,
  FileText,
  Link2,
  ShieldCheck,
  Download,
  Share2,
  Printer,
  Copy,
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  BarChart3,
  Compass,
  ListOrdered,
  Calendar,
  Key,
  Flame,
  Info,
  RefreshCw,
  Sliders,
  Check,
} from 'lucide-react';

interface SiteComparisonViewProps {
  onNavigate?: (route: string, params?: any) => void;
}

export const SiteComparisonView: React.FC<SiteComparisonViewProps> = ({ onNavigate }) => {
  // Input states
  const [yourUrl, setYourUrl] = useState('https://acme-ecommerce.example.com');
  const [competitorUrl, setCompetitorUrl] = useState('https://vanguard-retail.example.com');
  const [country, setCountry] = useState('US');
  const [industry, setIndustry] = useState('Ecommerce / Retail');
  const [comparisonDepth, setComparisonDepth] = useState<'standard' | 'deep'>('deep');

  // Execution states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SiteComparisonResult | null>(null);

  // UI interaction states
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'keywords' | 'content' | 'weaknesses' | 'technical' | 'roadmap'>('overview');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'Critical' | 'High' | 'Medium'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [whiteLabelMode, setWhiteLabelMode] = useState(false);
  const [expandedStrategyId, setExpandedStrategyId] = useState<string | null>('strat-1');

  // Load sample demonstration comparison on initial mount if not run
  useEffect(() => {
    handleRunComparison();
  }, []);

  const handleRunComparison = async (overrideYour?: string, overrideComp?: string) => {
    const targetYour = overrideYour || yourUrl;
    const targetComp = overrideComp || competitorUrl;

    if (!targetYour.trim() || !targetComp.trim()) {
      setError('Please provide valid URLs for both Your Site and the Competitor Site.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Progressive loading indicator updates
    setLoadingStep('Connecting to AccessFix Crawler Bot & validating domains...');
    const stepTimer1 = setTimeout(() => setLoadingStep('Auditing DOM, technical SEO, and WCAG accessibility...'), 900);
    const stepTimer2 = setTimeout(() => setLoadingStep('Extracting competitor keyword rankings & search volume...'), 1800);
    const stepTimer3 = setTimeout(() => setLoadingStep('Performing Content Gap analysis & ranking Top 15 Growth Actions...'), 2700);

    try {
      const response = await fetch('/api/tools/site-comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yourUrl: targetYour,
          competitorUrl: targetComp,
          country,
          industry,
          comparisonDepth,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Comparison failed with status code ${response.status}`);
      }

      const data: SiteComparisonResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Site comparison execution failed:', err);
      setError(err.message || 'Unable to complete comparison. Please verify the URLs and try again.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handlePrefillDemo = (type: 'ecommerce' | 'saas' | 'agency') => {
    let y = 'https://acme-ecommerce.example.com';
    let c = 'https://vanguard-retail.example.com';
    let ind = 'Ecommerce / Retail';

    if (type === 'saas') {
      y = 'https://flowdash-app.example.io';
      c = 'https://linear-metrics.example.com';
      ind = 'SaaS / B2B Software';
    } else if (type === 'agency') {
      y = 'https://brightcreative.example.org';
      c = 'https://apexmedia.example.com';
      ind = 'Digital Agency / Services';
    }

    setYourUrl(y);
    setCompetitorUrl(c);
    setIndustry(ind);
    handleRunComparison(y, c);
  };

  const handleCopyShareLink = () => {
    if (!result) return;
    const shareUrl = `${window.location.origin}/tools/site-comparison?id=${result.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleExportCsv = () => {
    if (!result) return;
    const rows = [
      ['Rank', 'Action Title', 'Priority', 'Impact', 'Effort', 'Category', 'Recommended Action', 'Related URL'],
      ...result.top15Actions.map((a) => [
        a.rank,
        `"${a.title.replace(/"/g, '""')}"`,
        a.priority,
        a.impact,
        a.effort,
        a.category,
        `"${a.recommendedAction.replace(/"/g, '""')}"`,
        `"${a.relatedUrl || ''}"`,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `accessfix-comparison-${result.yourSite.domain}-vs-${result.competitorSite.domain}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter actions
  const filteredActions = result?.top15Actions.filter((a) => {
    const matchesPriority = priorityFilter === 'all' || a.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    return matchesPriority && matchesCategory;
  });

  return (
    <div id="site-comparison-container" className="min-h-screen bg-slate-900 text-slate-100 pb-24">
      {/* ----------------- TOP HERO & CONTROL SECTION ----------------- */}
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
              <button
                onClick={() => onNavigate?.('/tools')}
                className="hover:text-cyan-400 transition-colors"
              >
                AccessFix Tools
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-cyan-400">Site Comparison</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Sparkles className="w-3 h-3 mr-1 text-cyan-400" />
                AccessFix Competitive Intelligence v2.0
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Live SSRF Protected
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Site Comparison
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-4xl">
              Compare your website with a competitor and discover exactly what you need to improve, copy strategically, and outperform.
            </p>
          </div>

          {/* Two URLs Dual Comparison Input Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
              {/* Your Site Input */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 focus-within:border-cyan-500 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="your-url-input" className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center">
                    <Globe className="w-3.5 h-3.5 mr-1.5" />
                    Your Website URL
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">Target Subject</span>
                </div>
                <input
                  id="your-url-input"
                  type="url"
                  value={yourUrl}
                  onChange={(e) => setYourUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-transparent text-white placeholder-slate-500 font-mono text-sm sm:text-base focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              {/* Competitor Site Input */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 focus-within:border-amber-500 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="competitor-url-input" className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center">
                    <Flame className="w-3.5 h-3.5 mr-1.5" />
                    Competitor Website URL
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">Market Benchmark</span>
                </div>
                <input
                  id="competitor-url-input"
                  type="url"
                  value={competitorUrl}
                  onChange={(e) => setCompetitorUrl(e.target.value)}
                  placeholder="https://competitorsite.com"
                  className="w-full bg-transparent text-white placeholder-slate-500 font-mono text-sm sm:text-base focus:outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Advanced Filters & Action Bar */}
            <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Country */}
                <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                  <span className="text-slate-400">Target Region:</span>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="US">🇺🇸 United States (US)</option>
                    <option value="UK">🇬🇧 United Kingdom (UK)</option>
                    <option value="CA">🇨🇦 Canada (CA)</option>
                    <option value="AU">🇦🇺 Australia (AU)</option>
                    <option value="DE">🇩🇪 Germany (DE)</option>
                    <option value="FR">🇫🇷 France (FR)</option>
                  </select>
                </div>

                {/* Industry */}
                <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                  <span className="text-slate-400">Industry:</span>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Ecommerce / Retail">Ecommerce / Retail</option>
                    <option value="SaaS / B2B Software">SaaS / B2B Software</option>
                    <option value="Digital Agency / Services">Digital Agency / Services</option>
                    <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                    <option value="Finance & Fintech">Finance & Fintech</option>
                  </select>
                </div>

                {/* Quick Demo Buttons */}
                <div className="hidden xl:flex items-center space-x-1 pl-2 border-l border-slate-700 text-xs text-slate-400">
                  <span>Samples:</span>
                  <button
                    onClick={() => handlePrefillDemo('ecommerce')}
                    className="px-2 py-1 hover:bg-slate-700/60 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    Ecommerce
                  </button>
                  <button
                    onClick={() => handlePrefillDemo('saas')}
                    className="px-2 py-1 hover:bg-slate-700/60 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    SaaS
                  </button>
                  <button
                    onClick={() => handlePrefillDemo('agency')}
                    className="px-2 py-1 hover:bg-slate-700/60 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    Agency
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                id="btn-run-site-comparison"
                onClick={() => handleRunComparison()}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin text-slate-950" />
                    Analyzing Competitor...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2 text-slate-950" />
                    COMPARE SITES
                  </>
                )}
              </button>
            </div>

            {/* Live Progress Bar if Loading */}
            {isLoading && (
              <div className="mt-4 pt-3 border-t border-slate-700/60">
                <div className="flex items-center justify-between text-xs text-cyan-400 mb-1.5">
                  <span className="font-medium flex items-center">
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    {loadingStep}
                  </span>
                  <span className="font-mono text-slate-400">Real-time Crawl</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 to-teal-400 h-1.5 rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start">
                <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ----------------- RESULT REPORT SECTION ----------------- */}
      {result && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Report Top Toolbar: Export / White-label / Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Comparison ID:</span>
              <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-cyan-300">{result.id}</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Duration:</span>
              <span className="text-xs text-slate-300 font-mono">{(result.durationMs / 1000).toFixed(1)}s</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setWhiteLabelMode(!whiteLabelMode)}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  whiteLabelMode
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
                title="Toggle White-Label Client Mode (removes internal branding for client presentations)"
              >
                <Sliders className="w-3.5 h-3.5 mr-1.5" />
                {whiteLabelMode ? 'White-Label: ON' : 'Agency White-Label'}
              </button>

              <button
                onClick={handleCopyShareLink}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    Share Report
                  </>
                )}
              </button>

              <button
                onClick={handleExportCsv}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                Export CSV
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                Print / PDF
              </button>
            </div>
          </div>

          {/* Sticky Tab Navigation */}
          <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md pt-2 pb-3 mb-8 border-b border-slate-800">
            <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar" aria-label="Comparison views">
              {[
                { id: 'overview', label: 'Executive Summary', icon: Award },
                { id: 'actions', label: `Top 15 Actions (${result.top15Actions.length})`, icon: TrendingUp },
                { id: 'keywords', label: `Winning Keywords (${result.winningKeywords.length})`, icon: Key },
                { id: 'content', label: `Content Gaps (${result.contentGaps.length})`, icon: FileText },
                { id: 'weaknesses', label: `Weaknesses & Strengths`, icon: AlertTriangle },
                { id: 'technical', label: 'On-Page & Technical', icon: Layers },
                { id: 'roadmap', label: '30/60/90 Day Roadmap', icon: Calendar },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 mr-1.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ============================================================ */}
          {/* TAB 1: EXECUTIVE SUMMARY & SCORECARD MATRIX */}
          {/* ============================================================ */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Executive Dual Gauge Banner */}
              <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Your Site Score */}
                  <div className="lg:col-span-4 bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-teal-400"></div>
                    <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">Your Website</div>
                    <div className="text-sm font-medium text-slate-300 truncate mb-4">{result.yourSite.domain}</div>
                    <div className="inline-flex items-baseline justify-center">
                      <span className="text-5xl sm:text-6xl font-extrabold text-white">{result.yourSite.scores.overall}</span>
                      <span className="text-slate-500 text-lg font-medium ml-1">/100</span>
                    </div>
                    <div className="mt-3 text-xs text-slate-400 font-medium">AccessFix Diagnostic Score</div>
                    <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <div className="text-slate-400">SEO</div>
                        <div className="font-bold text-white">{result.yourSite.scores.seo}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">A11y</div>
                        <div className="font-bold text-white">{result.yourSite.scores.accessibility}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Tech</div>
                        <div className="font-bold text-white">{result.yourSite.scores.technicalSeo}</div>
                      </div>
                    </div>
                  </div>

                  {/* Center Delta & Highlights */}
                  <div className="lg:col-span-4 text-center px-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 border border-slate-700 text-slate-400 font-extrabold text-sm mb-3">
                      VS
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Performance Differential</div>
                    <div className={`text-2xl font-black ${
                      result.yourSite.scores.overall >= result.competitorSite.scores.overall
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}>
                      {result.yourSite.scores.overall >= result.competitorSite.scores.overall
                        ? `+${result.yourSite.scores.overall - result.competitorSite.scores.overall} pts Advantage`
                        : `-${result.competitorSite.scores.overall - result.yourSite.scores.overall} pts Competitor Lead`}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      {result.yourSite.scores.overall >= result.competitorSite.scores.overall
                        ? 'Your website leads in overall technical and accessibility compliance. Prioritize content depth to dominate search results.'
                        : 'Competitor holds an organic visibility advantage through broader keyword topic siloing and richer structured data.'}
                    </p>

                    <button
                      onClick={() => setActiveTab('actions')}
                      className="mt-4 inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                    >
                      View Top 15 Actions to Win <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </button>
                  </div>

                  {/* Competitor Score */}
                  <div className="lg:col-span-4 bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">Competitor Website</div>
                    <div className="text-sm font-medium text-slate-300 truncate mb-4">{result.competitorSite.domain}</div>
                    <div className="inline-flex items-baseline justify-center">
                      <span className="text-5xl sm:text-6xl font-extrabold text-white">{result.competitorSite.scores.overall}</span>
                      <span className="text-slate-500 text-lg font-medium ml-1">/100</span>
                    </div>
                    <div className="mt-3 text-xs text-slate-400 font-medium">AccessFix Diagnostic Score</div>
                    <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <div className="text-slate-400">SEO</div>
                        <div className="font-bold text-white">{result.competitorSite.scores.seo}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">A11y</div>
                        <div className="font-bold text-white">{result.competitorSite.scores.accessibility}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Tech</div>
                        <div className="font-bold text-white">{result.competitorSite.scores.technicalSeo}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scorecard Disclaimer */}
                <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center">
                    <Info className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0" />
                    <span>{result.executiveSummary.dataSourceDisclaimer}</span>
                  </div>
                  <span className="hidden sm:inline font-mono text-[11px] text-slate-500">Live Crawl & Heuristics</span>
                </div>
              </div>

              {/* 4 Pillars Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center">
                    <Award className="w-3.5 h-3.5 mr-1" />
                    Your Biggest Advantage
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {result.executiveSummary.biggestAdvantage}
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1 flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    Your Biggest Gap
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {result.executiveSummary.biggestGap}
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    Biggest Opportunity
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {result.executiveSummary.biggestOpportunity}
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-1" />
                    First Action (Next 7 Days)
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {result.executiveSummary.recommendedFirstAction}
                  </p>
                </div>
              </div>

              {/* Scorecard Matrix Table */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-cyan-400" />
                    Competitive Scorecard Matrix
                  </h3>
                  <span className="text-xs text-slate-400">Pillar-by-Pillar Comparison</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-700/80">
                      <tr>
                        <th className="py-3.5 px-4 sm:px-6">Category / Pillar</th>
                        <th className="py-3.5 px-4 text-center font-mono text-cyan-400">Your Site</th>
                        <th className="py-3.5 px-4 text-center font-mono text-amber-400">Competitor</th>
                        <th className="py-3.5 px-4 text-center">Gap</th>
                        <th className="py-3.5 px-4 text-center">Leader</th>
                        <th className="py-3.5 px-6">Strategic Diagnostic Analysis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {result.scorecard.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-4 px-4 sm:px-6 font-semibold text-white">
                            {row.category}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-block font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                              {row.yourScore}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-block font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                              {row.competitorScore}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex items-center font-mono font-bold text-xs px-2 py-0.5 rounded ${
                              row.gap > 0
                                ? 'text-emerald-400 bg-emerald-500/10'
                                : row.gap < 0
                                ? 'text-rose-400 bg-rose-500/10'
                                : 'text-slate-400 bg-slate-700'
                            }`}>
                              {row.gap > 0 ? `+${row.gap}` : row.gap === 0 ? '0' : row.gap}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {row.winner === 'your_site' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Your Site
                              </span>
                            )}
                            {row.winner === 'competitor' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Competitor
                              </span>
                            )}
                            {row.winner === 'tie' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-700 text-slate-300">
                                Parity
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-slate-300 text-xs leading-relaxed">
                            {row.analysis}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Sources Transparency Banner */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-1.5">
                <div className="font-semibold text-slate-300 flex items-center mb-2">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-cyan-400" />
                  AccessFix Transparent Multi-Engine Attribution:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div>• <strong>Crawled Data:</strong> {result.dataSources.crawledData}</div>
                  <div>• <strong>Keywords:</strong> {result.dataSources.keywordData}</div>
                  <div>• <strong>SERP Features:</strong> {result.dataSources.serpData}</div>
                  <div>• <strong>Accessibility:</strong> {result.dataSources.accessibilityData}</div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: TOP 15 ACTIONS TO OUTPERFORM COMPETITOR */}
          {/* ============================================================ */}
          {activeTab === 'actions' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/70 border border-slate-700/80 rounded-xl p-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-cyan-400" />
                    Top 15 Strategic Actions to Outperform {result.competitorSite.domain}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ranked dynamically by: <span className="font-mono text-cyan-300">Impact × Opportunity × Effort × Relevance</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center space-x-1 bg-slate-900 rounded-lg p-1 border border-slate-700">
                    <span className="text-slate-400 px-2">Priority:</span>
                    {(['all', 'Critical', 'High', 'Medium'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriorityFilter(p)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                          priorityFilter === p
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {p === 'all' ? 'All' : p}
                      </button>
                    ))}
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Content Gap">Content Gap</option>
                    <option value="On-Page SEO">On-Page SEO</option>
                    <option value="Technical SEO">Technical SEO</option>
                    <option value="Accessibility">Accessibility</option>
                    <option value="Internal Linking">Internal Linking</option>
                    <option value="Performance">Performance</option>
                  </select>
                </div>
              </div>

              {/* Actions List Grid */}
              <div className="space-y-4">
                {filteredActions?.map((action) => (
                  <div
                    key={action.id}
                    className="bg-slate-800/80 border border-slate-700/80 hover:border-cyan-500/40 rounded-xl p-5 transition-all shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-sm flex items-center justify-center font-mono">
                          #{action.rank}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="text-base font-bold text-white">{action.title}</h4>
                            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                              {action.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{action.description}</p>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                        <span className={`px-2 py-0.5 rounded ${
                          action.priority === 'Critical'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : action.priority === 'High'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {action.priority} Priority
                        </span>

                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                          Impact: <strong className="text-white">{action.impact}</strong>
                        </span>

                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                          Effort: <strong className="text-white">{action.effort}</strong>
                        </span>

                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono">
                          Score: {action.rankScore}/100
                        </span>
                      </div>
                    </div>

                    {/* Why It Matters & Action Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-700/60 text-xs">
                      <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/40">
                        <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1 flex items-center">
                          <Info className="w-3 h-3 mr-1 text-amber-400" />
                          Why It Matters
                        </div>
                        <p className="text-slate-300">{action.whyItMatters}</p>
                      </div>

                      <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/40 flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1 flex items-center">
                            <Zap className="w-3 h-3 mr-1 text-cyan-400" />
                            Recommended Action Step
                          </div>
                          <p className="text-slate-300">{action.recommendedAction}</p>
                        </div>

                        {action.actionRoute && (
                          <div className="mt-2 text-right">
                            <button
                              onClick={() => onNavigate?.(action.actionRoute!)}
                              className="inline-flex items-center text-[11px] font-bold text-cyan-400 hover:text-cyan-300"
                            >
                              Launch Related Tool <ArrowRight className="w-3 h-3 ml-1" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: COMPETITOR WINNING KEYWORDS & QUICK WINS */}
          {/* ============================================================ */}
          {activeTab === 'keywords' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Quick Wins Banner (Striking Distance: pos 11-20) */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-emerald-400" />
                      Your Striking Distance Quick-Wins (Positions 11–20)
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Keywords you already rank for that can reach Page 1 with fast, low-effort on-page optimization.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {result.quickWins.length} High-Yield Queries
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.quickWins.map((qw) => (
                    <div key={qw.id} className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-white font-mono">{qw.keyword}</span>
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            Pos #{qw.currentPosition} → #{qw.competitorPosition}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-400 mb-2 font-mono">
                          <span>Vol: <strong className="text-white">{qw.searchVolume.toLocaleString()}/mo</strong></span>
                          <span>KD: <strong className="text-white">{qw.difficulty}/100</strong></span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">{qw.actionableStep}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 font-mono">Target: {qw.targetPageUrl.split('/').pop()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Winning Keywords Table */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center">
                      <Key className="w-4 h-4 mr-2 text-cyan-400" />
                      Competitor Winning Keywords to Target
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Keywords where {result.competitorSite.domain} ranks in top 5 and captures high-converting search volume.
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Formula: Opportunity Score = (Vol × CPC) / KD</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-700/80">
                      <tr>
                        <th className="py-3.5 px-4 sm:px-6">Keyword Query</th>
                        <th className="py-3.5 px-4">Search Intent</th>
                        <th className="py-3.5 px-4 text-center font-mono">Volume</th>
                        <th className="py-3.5 px-4 text-center font-mono">KD</th>
                        <th className="py-3.5 px-4 text-center font-mono">CPC</th>
                        <th className="py-3.5 px-4 text-center font-mono text-amber-400">Comp Pos</th>
                        <th className="py-3.5 px-4 text-center font-mono text-cyan-400">Your Pos</th>
                        <th className="py-3.5 px-4 text-center">Opp Score</th>
                        <th className="py-3.5 px-6">Recommended Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {result.winningKeywords.map((kw) => (
                        <tr key={kw.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-4 px-4 sm:px-6 font-semibold text-white font-mono">
                            {kw.keyword}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-700 text-slate-300 capitalize">
                              {kw.intent}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center font-mono text-slate-200">
                            {kw.searchVolume.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-center font-mono">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              kw.difficulty < 30 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                            }`}>
                              {kw.difficulty}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center font-mono text-slate-300">
                            ${kw.cpcUsd.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-center font-mono font-bold text-amber-400">
                            #{kw.competitorPosition}
                          </td>
                          <td className="py-4 px-4 text-center font-mono text-slate-400">
                            {kw.yourPosition ? `#${kw.yourPosition}` : '—'}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-block font-mono font-bold text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">
                              {kw.opportunityScore}/100
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-300 text-xs leading-relaxed">
                            {kw.recommendedAction}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: CONTENT GAPS & CONTENT STRATEGY GENERATOR */}
          {/* ============================================================ */}
          {activeTab === 'content' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Content Gaps Grid */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-cyan-400" />
                      Content Gaps (Topics Covered by Competitor Missing on Your Site)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Publish these high-intent pages to capture qualified organic search traffic.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">{result.contentGaps.length} Critical Gaps Identified</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.contentGaps.map((gap) => (
                    <div key={gap.id} className="bg-slate-900/90 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            gap.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {gap.priority} Priority • {gap.contentType}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            ~{gap.estimatedMonthlyDemand.toLocaleString()} searches/mo
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mb-2">{gap.topic}</h4>
                        <p className="text-xs text-slate-300 mb-3">{gap.whyItMatters}</p>
                        <div className="text-xs font-mono text-slate-400 space-y-1 mb-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                          <div>Target KW: <span className="text-cyan-300 font-bold">{gap.primaryKeyword}</span></div>
                          <div>Suggested URL: <span className="text-slate-300">{gap.recommendedYourUrl}</span></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                        <span className="text-[11px] text-slate-500 font-mono">Intent: {gap.searchIntent}</span>
                        <button
                          onClick={() => onNavigate?.('/tools/content-brief', { keyword: gap.primaryKeyword })}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                        >
                          <Sparkles className="w-3 h-3 mr-1 text-cyan-400" />
                          Generate Content Brief
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready-to-Publish Content Strategy Blueprints */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-1 flex items-center">
                  <Compass className="w-4 h-4 mr-2 text-cyan-400" />
                  Turnkey Content Strategy Blueprints
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Complete page blueprints with semantic keyword distribution, outline structure, and conversion hooks.
                </p>

                <div className="space-y-4">
                  {result.contentStrategies.map((strat) => {
                    const isExpanded = expandedStrategyId === strat.id;
                    return (
                      <div key={strat.id} className="bg-slate-900/90 border border-slate-700 rounded-xl overflow-hidden">
                        <div
                          onClick={() => setExpandedStrategyId(isExpanded ? null : strat.id)}
                          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                        >
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">{strat.searchIntent} Intent</span>
                              <span className="text-xs text-slate-500">•</span>
                              <span className="text-xs text-slate-400 font-mono">Est. {strat.estimatedWords} words</span>
                            </div>
                            <h4 className="text-base font-bold text-white">{strat.suggestedTitle}</h4>
                          </div>
                          <button className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 ml-4">
                            {isExpanded ? 'Collapse Blueprint' : 'Expand Blueprint'}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4 text-xs">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-2">
                                  Semantic Keyword Cluster
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  <span className="bg-cyan-500/20 text-cyan-300 font-bold px-2 py-1 rounded">
                                    Primary: {strat.primaryKeyword}
                                  </span>
                                  {strat.supportingKeywords.map((sk, idx) => (
                                    <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-1 rounded">
                                      {sk}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-2">
                                  Target Persona & Call-to-Action
                                </div>
                                <p className="text-slate-300 mb-1"><strong>Persona:</strong> {strat.targetAudience}</p>
                                <p className="text-slate-300"><strong>CTA Hook:</strong> {strat.callToAction}</p>
                              </div>
                            </div>

                            <div>
                              <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-2">
                                Recommended Structural Heading Outline (H2 / H3)
                              </div>
                              <div className="space-y-1.5 bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-slate-300">
                                {strat.recommendedOutline.map((heading, hIdx) => (
                                  <div key={hIdx} className="flex items-start">
                                    <span className="text-cyan-400 mr-2 font-bold">•</span>
                                    <span>{heading}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: WEAKNESSES & STRENGTHS (WHY COMPETITOR IS STRONGER) */}
          {/* ============================================================ */}
          {activeTab === 'weaknesses' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Why Competitor is Stronger Section */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-1 flex items-center">
                  <Flame className="w-4 h-4 mr-2 text-amber-400" />
                  Why the Competitor is Stronger (Diagnostic Area Analysis)
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Root-cause breakdown of why {result.competitorSite.domain} outperforms your domain in specific growth dimensions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.competitorStrengthAreas.map((area, idx) => (
                    <div key={idx} className="bg-slate-900/90 border border-slate-700 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-white">{area.area}</h4>
                        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          Gap: -{Math.abs(area.gap)} pts
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">{area.whyCompetitorIsStronger}</p>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                          How to Bridge This Gap:
                        </div>
                        <p className="text-slate-300">{area.howToBridgeGap}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Winning Patterns (Learn -> Adapt -> Improve) */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-1 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
                  Competitor Winning Patterns (Strategic Adaptations)
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Strategic principles observed on {result.competitorSite.domain}. <em>Learn the model, adapt for your audience, and build a superior implementation without copying flaws.</em>
                </p>

                <div className="space-y-4">
                  {result.winningPatterns.map((pat) => (
                    <div key={pat.id} className="bg-slate-900/90 border border-slate-700 rounded-xl p-5">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        <h4 className="text-sm font-bold text-white">{pat.title}</h4>
                      </div>
                      <p className="text-xs text-slate-300 mb-3">{pat.pattern}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <div>
                          <strong className="text-amber-400 block mb-1">Strategic Takeaway:</strong>
                          <span className="text-slate-300">{pat.strategicTakeaway}</span>
                        </div>
                        <div>
                          <strong className="text-emerald-400 block mb-1">How to Outperform:</strong>
                          <span className="text-slate-300">{pat.howToImproveNotCopy}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Site's Real Weaknesses (10-15 Itemized List) */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-1 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-rose-400" />
                  Your Site Weakness Analysis ({result.siteWeaknesses.length} Itemized Findings)
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Ranked by severity. Each weakness includes live evidence, business impact, and specific remediation instructions.
                </p>

                <div className="space-y-3">
                  {result.siteWeaknesses.map((w) => (
                    <div key={w.id} className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-rose-400">#{w.rank}</span>
                          <span className="font-bold text-white text-sm">{w.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-400">
                            {w.pillar}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            w.impact === 'High' ? 'text-rose-400 bg-rose-500/10' : 'text-amber-400 bg-amber-500/10'
                          }`}>
                            {w.impact} Impact
                          </span>
                          <span className="text-slate-400">Effort: {w.effort}</span>
                        </div>
                      </div>
                      <p className="text-slate-300 mb-2"><strong>Problem:</strong> {w.problem}</p>
                      <p className="text-slate-400 mb-2 font-mono text-[11px]"><strong>Evidence:</strong> {w.evidence}</p>
                      <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-slate-300">
                        <strong className="text-cyan-400">Fix:</strong> {w.recommendedAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6: ON-PAGE & TECHNICAL DIRECT COMPARISON */}
          {/* ============================================================ */}
          {activeTab === 'technical' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Side-by-Side On-Page Table */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center">
                    <Layers className="w-4 h-4 mr-2 text-cyan-400" />
                    On-Page & Technical Direct Comparison
                  </h3>
                  <span className="text-xs text-slate-400">Direct Crawled DOM Signals</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-700/80">
                      <tr>
                        <th className="py-3.5 px-4 sm:px-6">Element</th>
                        <th className="py-3.5 px-4 text-cyan-400">Your Website</th>
                        <th className="py-3.5 px-4 text-amber-400">Competitor Website</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-6">Analysis & Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {result.onPageComparison.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-4 px-4 sm:px-6 font-semibold text-white">
                            {item.element}
                          </td>
                          <td className="py-4 px-4 font-mono text-xs text-slate-300 max-w-[200px] truncate">
                            {String(item.yourValue)}
                          </td>
                          <td className="py-4 px-4 font-mono text-xs text-slate-300 max-w-[200px] truncate">
                            {String(item.competitorValue)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            {item.status === 'advantage' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Advantage
                              </span>
                            )}
                            {item.status === 'gap' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Gap
                              </span>
                            )}
                            {item.status === 'parity' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-700 text-slate-300">
                                Parity
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-slate-300 text-xs leading-relaxed">
                            <p className="mb-1">{item.analysis}</p>
                            <p className="text-cyan-400 font-medium">{item.recommendation}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Internal Linking Opportunities */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-1 flex items-center">
                  <Link2 className="w-4 h-4 mr-2 text-cyan-400" />
                  Internal Link Silo Optimization Opportunities
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Recommended contextual links to distribute PageRank authority across your site.
                </p>

                <div className="space-y-3">
                  {result.internalLinkOpportunities.map((link) => (
                    <div key={link.id} className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 font-mono">
                          <span className="text-slate-400 truncate max-w-[200px]">{link.sourceUrl.split('/').pop() || 'Root'}</span>
                          <ArrowRight className="w-3 h-3 text-cyan-400" />
                          <span className="text-cyan-300 font-bold truncate max-w-[200px]">{link.destinationUrl.split('/').pop()}</span>
                        </div>
                        <p className="text-slate-300">Anchor: <strong className="text-white">"{link.suggestedAnchor}"</strong> • {link.rationale}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20">
                        {link.priority} Priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 7: 30 / 60 / 90 DAY ACTION PLAN ROADMAP */}
          {/* ============================================================ */}
          {activeTab === 'roadmap' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
                      30 / 60 / 90 Day Strategic Growth Roadmap
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      A clear quarterly timeline engineered to systematically eliminate gaps and overtake {result.competitorSite.domain}.
                    </p>
                  </div>
                  <button
                    onClick={handleExportCsv}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Export Roadmap CSV
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Month 1: Days 1-30 */}
                  <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-cyan-400"></div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Phase 1: Days 1–30</span>
                        <span className="text-xs font-mono text-slate-400">Quick Wins & Fixes</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-3">Technical Foundation & Page 2 Upgrades</h4>
                      <p className="text-xs text-slate-300 mb-4">
                        Eliminate all critical crawling/schema gaps and upgrade striking-distance keywords (pos 11–20) to capture immediate organic lift.
                      </p>

                      <div className="space-y-3">
                        {result.actionRoadmap.first30Days.map((item) => (
                          <div key={item.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-white">{item.title}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                                {item.priority}
                              </span>
                            </div>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{item.actionSummary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Month 2: Days 31-60 */}
                  <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-teal-400"></div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Phase 2: Days 31–60</span>
                        <span className="text-xs font-mono text-slate-400">Topical Authority</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-3">Pillar Guides & Interactive Tool Deployment</h4>
                      <p className="text-xs text-slate-300 mb-4">
                        Deploy dedicated high-intent interactive tool pages and launch the 2,400-word authority pillar guide to conquer high-volume queries.
                      </p>

                      <div className="space-y-3">
                        {result.actionRoadmap.days31To60.map((item) => (
                          <div key={item.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-white">{item.title}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                {item.priority}
                              </span>
                            </div>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{item.actionSummary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Month 3: Days 61-90 */}
                  <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-purple-400"></div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Phase 3: Days 61–90</span>
                        <span className="text-xs font-mono text-slate-400">Dominance & Scale</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-3">Topic Silos & Continuous Automated Monitoring</h4>
                      <p className="text-xs text-slate-300 mb-4">
                        Interlink all content assets into robust semantic topic silos and lock in gains with automated 24/7 crawler monitoring.
                      </p>

                      <div className="space-y-3">
                        {result.actionRoadmap.days61To90.map((item) => (
                          <div key={item.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-white">{item.title}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                                {item.priority}
                              </span>
                            </div>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{item.actionSummary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
};
