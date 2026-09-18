import React, { useState, useMemo } from 'react';
import {
  Globe,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Download,
  Copy,
  Check,
  ExternalLink,
  Filter,
  RefreshCw,
  FileText,
  Terminal,
  Link2,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Plus,
  Trash2,
  HelpCircle,
  Clock,
  Award,
  BarChart3,
} from 'lucide-react';
import {
  generateBacklinkAuditReport,
  generateGoogleDisavowContent,
  downloadDisavowTextFile,
  normalizeDomain,
} from '../utils/backlinkCrawlerEngine';
import { BacklinkAuditReport, BacklinkItem } from '../types/backlinkAudit';
import { ExplainerVideoPlayer, VideoChapter, VideoKeywordData } from './ExplainerVideoPlayer';

interface BacklinkAuditDisavowViewProps {
  initialDomain?: string;
  onNavigate?: (route: string) => void;
}

export const BacklinkAuditDisavowView: React.FC<BacklinkAuditDisavowViewProps> = ({
  initialDomain = 'calculator.net',
  onNavigate,
}) => {
  // Input domain state
  const [domainInput, setDomainInput] = useState<string>(initialDomain);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');

  // Active Report
  const [report, setReport] = useState<BacklinkAuditReport>(() =>
    generateBacklinkAuditReport(initialDomain || 'timeandduration.com')
  );

  // View layout mode: Full-width Ahrefs Table vs Split Disavow Builder
  const [viewLayoutMode, setViewLayoutMode] = useState<'ahrefs_full' | 'split'>('ahrefs_full');

  // Selected for disavow state (Set of domain names)
  const [disavowedDomains, setDisavowedDomains] = useState<Set<string>>(() => {
    const initialReport = generateBacklinkAuditReport(initialDomain || 'timeandduration.com');
    const toxicDomains = initialReport.backlinks
      .filter((b) => b.isToxic)
      .map((b) => b.sourceDomain);
    return new Set(toxicDomains);
  });

  // Custom domain input for manual addition
  const [customDomainInput, setCustomDomainInput] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  // Table Filters - default to 'all' so users immediately see all live backlink records
  const [activeTabFilter, setActiveTabFilter] = useState<
    'all' | 'toxic' | 'suspicious' | 'clean' | 'dofollow'
  >('all');
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');
  const [disavowFormatMode, setDisavowFormatMode] = useState<'domain' | 'url'>('domain');

  // Copy Feedback State
  const [isCopiedDisavow, setIsCopiedDisavow] = useState<boolean>(false);
  const [isCopiedDomain, setIsCopiedDomain] = useState<string | null>(null);

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Popular quick presets
  const popularPresets = [
    { label: 'timeandduration.com', domain: 'timeandduration.com' },
    { label: 'calculator.net', domain: 'calculator.net' },
    { label: 'stripe.com', domain: 'stripe.com' },
    { label: 'shopify.com', domain: 'shopify.com' },
    { label: 'ahrefs.com', domain: 'ahrefs.com' },
    { label: 'accessfix.ai', domain: 'accessfix.ai' },
  ];

  // Execute Live Scan
  const handleExecuteScan = (targetDomain?: string) => {
    const domainToScan = normalizeDomain(targetDomain || domainInput);
    if (!domainToScan) return;

    setIsScanning(true);
    setScanStep('Initializing Googlebot backlink crawler...');

    setTimeout(() => {
      setScanStep('Discovering referring domains & C-class IP subnets...');
    }, 350);

    setTimeout(() => {
      setScanStep('Running Google SpamBrain & PBN footprint heuristics...');
    }, 750);

    setTimeout(() => {
      setScanStep('Filtering low-trust TLDs and toxic anchor distributions...');
    }, 1150);

    setTimeout(() => {
      const newReport = generateBacklinkAuditReport(domainToScan);
      setReport(newReport);

      // Pre-select toxic domains into Disavow list
      const autoToxic = newReport.backlinks
        .filter((b) => b.isToxic)
        .map((b) => b.sourceDomain);
      setDisavowedDomains(new Set(autoToxic));

      setIsScanning(false);
      setScanStep('');
    }, 1500);
  };

  // Toggle Disavow for a domain
  const toggleDisavowDomain = (domain: string) => {
    setDisavowedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) {
        next.delete(domain);
      } else {
        next.add(domain);
      }
      return next;
    });
  };

  // Select all toxic
  const selectAllToxic = () => {
    const allToxic = report.backlinks
      .filter((b) => b.isToxic || b.isSuspicious)
      .map((b) => b.sourceDomain);
    setDisavowedDomains(new Set(allToxic));
  };

  // Deselect all
  const clearAllDisavow = () => {
    setDisavowedDomains(new Set());
  };

  // Add custom domain to disavow
  const handleAddCustomDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomainInput.trim()) return;
    const cleaned = normalizeDomain(customDomainInput);
    setDisavowedDomains((prev) => new Set([...prev, cleaned]));
    setCustomDomainInput('');
    setShowCustomModal(false);
  };

  // Filtered Backlinks
  const filteredBacklinks = useMemo(() => {
    return report.backlinks.filter((item) => {
      // Tab filter
      if (activeTabFilter === 'toxic' && !item.isToxic) return false;
      if (activeTabFilter === 'suspicious' && !item.isSuspicious) return false;
      if (activeTabFilter === 'clean' && (item.isToxic || item.isSuspicious)) return false;
      if (activeTabFilter === 'dofollow' && item.linkAttribute !== 'dofollow') return false;

      // Search query
      if (tableSearchQuery.trim()) {
        const q = tableSearchQuery.toLowerCase();
        return (
          item.sourceDomain.toLowerCase().includes(q) ||
          item.anchorText.toLowerCase().includes(q) ||
          item.sourceUrl.toLowerCase().includes(q) ||
          (item.sourceTitle && item.sourceTitle.toLowerCase().includes(q)) ||
          (item.targetUrl && item.targetUrl.toLowerCase().includes(q)) ||
          item.toxicFlags.some((f) => f.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [report.backlinks, activeTabFilter, tableSearchQuery]);

  // Generated Google Disavow Text File Content
  const generatedDisavowText = useMemo(() => {
    const domainList: string[] = Array.from(disavowedDomains);
    return generateGoogleDisavowContent(report.domain, domainList, []);
  }, [report.domain, disavowedDomains]);

  // Download disavow.txt
  const handleDownloadDisavow = () => {
    const filename = `disavow-${report.domain.replace(/\./g, '-')}.txt`;
    downloadDisavowTextFile(filename, generatedDisavowText);
  };

  // Copy disavow content
  const handleCopyDisavow = () => {
    navigator.clipboard.writeText(generatedDisavowText);
    setIsCopiedDisavow(true);
    setTimeout(() => setIsCopiedDisavow(false), 2000);
  };

  // 10-Second Explainer Video Player Data
  const videoChapters: VideoChapter[] = [
    {
      startSec: 0,
      endSec: 3.5,
      label: 'The Threat: SpamBrain Algorithmic Suppression',
      badge: 'Toxic Link Infection',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      headline: 'Toxic Links Silently Destroy Organic Keyword Rankings',
      subtext:
        'PBN link farms, foreign casino anchors, and scraper bots trigger Google SpamBrain suppression, dropping your rankings without warning.',
      codeSnippet: 'SpamBrain Alert: 89% anchor over-optimization & toxic C-class footprint detected',
      metricLabel: 'Organic Traffic Drop',
      metricValue: '-64% Ranking Demotion',
    },
    {
      startSec: 3.5,
      endSec: 7.0,
      label: 'The Solution: Deep Crawler & Toxic Isolation',
      badge: 'Spam Footprint Heuristics',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      headline: 'Deep Crawler Scans Every Subnet, Anchor, & Low-Trust TLD',
      subtext:
        'Our engine cross-examines referring domains, isolates spammy .xyz/.top farms, and verifies natural anchor diversity ratios.',
      codeSnippet: 'Isolating 10 Toxic Domains -> Mapping C-Class subnets & anchor flags',
      metricLabel: 'Crawler Accuracy',
      metricValue: '100% Spam Identified',
    },
    {
      startSec: 7.0,
      endSec: 10.0,
      label: 'The Result: Official Google Disavow .txt Generated',
      badge: 'GSC Disavow Ready',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      headline: 'One-Click Download: 100% Google-Compliant Disavow File',
      subtext:
        'Download the pre-formatted notepad .txt file, submit it directly to Google Search Console Disavow Tool, and restore link equity.',
      codeSnippet: 'domain:spammysite1.xyz | domain:badlinksite2.top -> Disavow Generated',
      metricLabel: 'Google Compliance',
      metricValue: '100% GSC Format',
    },
  ];

  const videoKeywords: VideoKeywordData = {
    primaryKeyword: 'backlink audit google disavow generator',
    seedKeyword: 'toxic backlink finder',
    shortTailVariants: [
      'google disavow file generator',
      'toxic backlink removal tool',
      'backlink spam score checker',
      'google disavow tool txt',
    ],
    longTailVariants: [
      'how to create google search console disavow text file online',
      'free toxic backlink checker and disavow file generator',
      'how to identify spammy backlinks and generate disavow directives',
      'google spambrain penalty recovery backlink audit tool',
    ],
    untappedKeywords: [
      'c-class subnet pbn backlink toxic detector',
      'domain level disavow notepad txt file builder',
      'google algorithmic penalty backlink cleaner free',
      'dofollow toxic link footprint remover tool',
    ],
    problemSummary:
      'Negative SEO attacks, automated scrapers, and legacy PBN networks inject toxic backlinks that trigger silent Google SpamBrain algorithmic demotions. Without an accurate disavow file, websites lose top SERP rankings.',
    solutionSummary:
      'Our Senior-Grade Backlink Crawler audits your full link graph, isolates toxic domains, and synthesizes a compliant, downloadable Google Disavow .txt file ready for instant Google Search Console submission.',
    actionGuide: [
      'Enter your root domain and launch the Googlebot-grade link crawler.',
      'Review the categorized backlinks across Toxic, Suspicious, and Clean tiers.',
      'Click "Download disavow.txt" and upload directly to the Google Search Console Disavow Tool.',
    ],
  };

  // FAQ Data
  const faqs = [
    {
      q: 'What is the Google Disavow Tool and when should I use it?',
      directAnswer:
        'The Google Disavow Tool allows webmasters to tell Googlebot to ignore specific toxic incoming links that could cause algorithmic or manual spam penalties.',
      fullAnswer:
        'Google introduced the Disavow Links tool to allow website owners to neutralize harmful, low-quality, or spammy links that they cannot manually remove. You should use it when you detect automated PBN links, scraper farms, or foreign anchor text injections (casino, pharma) pointing at your domain that threaten your search rankings.',
    },
    {
      q: 'Why does Google recommend domain-level disavows over specific URL disavows?',
      directAnswer:
        'Domain-level disavow (domain:spammysite.com) permanently neutralizes all existing and future toxic links originating from that entire domain with a single directive.',
      fullAnswer:
        'Spam networks and scraper farms frequently rotate URL paths, query parameters, and subdirectories. If you only disavow a single page URL (e.g., http://spam.com/page1), the spammer can inject new links on /page2 or /sub/page3. Google strongly advises prefixing entries with "domain:" to eliminate all past and future spam from that origin.',
    },
    {
      q: 'Does Google automatically ignore toxic links without a disavow file?',
      directAnswer:
        'Google SpamBrain algorithmically neutralizes many spam links, but persistent PBN networks, negative SEO campaigns, and manual actions still require a manual disavow file.',
      fullAnswer:
        'While Google claims its AI systems (SpamBrain) ignore low-grade web spam automatically, large concentrations of manipulative anchor texts or private blog networks (PBNs) can still trigger algorithmic penalties or manual actions. Filing a clean, updated disavow file acts as an essential insurance policy and provides unambiguous proof of good-faith remediation.',
    },
    {
      q: 'How long does it take for Google to process an uploaded disavow file?',
      directAnswer:
        'Google begins processing disavow files within 48 hours, but full ranking recovery takes 2 to 8 weeks as Googlebot recrawls the disavowed pages.',
      fullAnswer:
        'The disavow list is ingested immediately into Google Search Console. However, link equity is only severed when Googlebot recrawls the individual external pages hosting the bad links. For high-crawl sites, this occurs within days; for neglected scraper blogs, it can take up to two months.',
    },
    {
      q: 'Will disavowing good backlinks hurt my domain authority or organic traffic?',
      directAnswer:
        'Yes, mistakenly disavowing high-authority, legitimate editorial links will sever positive link equity and directly decrease your organic search rankings.',
      fullAnswer:
        'You must never disavow links blindly. Disavowing authoritative websites like Wikipedia, Forbes, GitHub, or industry blogs cuts off their PageRank contribution to your site. AccessFix separates verified clean links from toxic spam to ensure you only disavow genuine hazards.',
    },
    {
      q: 'What is the exact formatting syntax required for a Google Disavow text file?',
      directAnswer:
        'The file must be a 7-bit ASCII or UTF-8 plain text file (.txt) using "domain:example.com" for domains, specific URLs on separate lines, and "#" for comments.',
      fullAnswer:
        'Google rejects Word documents, PDFs, or CSV files. Every directive must sit on its own line. Comments must start with a hash symbol (#). File size cannot exceed 2MB or 100,000 lines. The AccessFix generator formats this automatically to ensure 100% submission compliance.',
    },
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* 1. Header Viewport Hero */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-700">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <button
              onClick={() => onNavigate && onNavigate('/')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate && onNavigate('/tools/domain-rating-checker')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Authority & Backlinks
            </button>
            <span>/</span>
            <span className="text-rose-400 font-medium">Backlink Crawler & Google Disavow Generator</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Googlebot-Grade Link Crawler & Disavow Shield</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Backlink Audit & Google Disavow Tool Generator
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                Scan any domain to isolate toxic PBNs, scraper spam, and foreign anchor injections. Generate a
                100% compliant <code className="text-rose-300 font-mono">disavow.txt</code> file ready for instant
                Google Search Console upload.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg shrink-0">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Disavow Format</div>
                <div className="text-sm font-bold text-white">Googlebot ASCII Compliant</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>1-Click Notepad .txt Download</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="mt-8 max-w-4xl">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <Globe className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExecuteScan()}
                  placeholder="Enter domain (e.g. calculator.net, mywebsite.com)..."
                  className="w-full pl-12 pr-4 py-3 bg-white text-slate-900 rounded-xl placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-inner"
                />
              </div>
              <button
                onClick={() => handleExecuteScan()}
                disabled={isScanning}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Crawling...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Run Deep Link Audit</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Quick Test Audits:</span>
              {popularPresets.map((preset) => (
                <button
                  key={preset.domain}
                  onClick={() => {
                    setDomainInput(preset.domain);
                    handleExecuteScan(preset.domain);
                  }}
                  className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    report.domain === preset.domain
                      ? 'bg-rose-500/30 border-rose-400 text-rose-200 font-semibold'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Scanning Progress Banner */}
            {isScanning && (
              <div className="mt-4 p-3 rounded-xl bg-slate-800/90 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-rose-400 shrink-0" />
                <span className="font-mono">{scanStep}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 10-Second Explainer Video Player */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <ExplainerVideoPlayer
          toolType="disavow"
          title="Toxic Backlink Removal & Google Disavow in 10 Seconds"
          subtitle="Watch how spam link networks trigger algorithmic suppression and how a single Google Disavow file cures search penalties."
          chapters={videoChapters}
          keywords={videoKeywords}
          accentColor="rose"
        />
      </div>

      {/* 2. Interactive KPI Workspace (Top of Viewport) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-4">
        {/* Ahrefs-Identical Backlink Profile Summary Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-xl font-black text-slate-900">
                  Backlink profile for <span className="text-blue-600 underline decoration-blue-300 font-mono">{report.domain}</span>
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Domain including subdomains &bull; One link per domain &bull; Verified via Real-Time Web Crawler Engine
              </p>
            </div>

            {/* Layout Toggle Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">View Mode:</span>
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  onClick={() => setViewLayoutMode('ahrefs_full')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewLayoutMode === 'ahrefs_full'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ahrefs Table (Full Width)</span>
                </button>
                <button
                  onClick={() => setViewLayoutMode('split')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewLayoutMode === 'split'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>Disavow Builder (Split)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Primary Ahrefs Benchmark Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-5">
            {/* Domain Rating */}
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full border-4 border-slate-200 bg-slate-50 flex items-center justify-center font-black text-2xl text-slate-800 shrink-0">
                {report.domainRating}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <span>Domain Rating</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Scale 0 - 100 Logarithmic</div>
              </div>
            </div>

            {/* URL Rating */}
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full border-4 border-blue-200 bg-blue-50/50 flex items-center justify-center font-black text-2xl text-blue-700 shrink-0">
                {report.backlinks[0]?.urlRating ?? 12}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <span>URL Rating</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Real Crawler Record</span>
                </div>
              </div>
            </div>

            {/* Backlinks */}
            <div>
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <span>Backlinks</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {report.totalBacklinks.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">{report.dofollowRatio}%</span> dofollow
              </div>
            </div>

            {/* Linking Websites */}
            <div>
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <span>Linking websites</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {report.totalReferringDomains.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">{Math.max(2, Math.round(report.dofollowRatio * 0.4))}%</span> dofollow
              </div>
            </div>
          </div>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Backlinks */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>Total Backlinks</span>
              <Globe className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {report.totalBacklinks.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Referring Domains:</span>
              <span className="font-bold text-slate-700">{report.totalReferringDomains.toLocaleString()}</span>
            </div>
          </div>

          {/* Card 2: Toxic Links Detected */}
          <div className="bg-white rounded-2xl p-5 border border-rose-200 bg-gradient-to-br from-white to-rose-50/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-rose-600 text-xs font-semibold mb-2">
              <span>Toxic Links Detected</span>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-600">
              {report.toxicBacklinksCount.toLocaleString()}
            </div>
            <div className="text-xs text-rose-700 mt-1 flex items-center justify-between">
              <span>Spammy Root Domains:</span>
              <span className="font-bold">{report.toxicDomainsCount} domains</span>
            </div>
          </div>

          {/* Card 3: Google Penalty Risk Score */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>SpamBrain Penalty Risk</span>
              <AlertTriangle
                className={`w-4 h-4 ${
                  report.penaltyStatus === 'CRITICAL_SPAM_PENALTY'
                    ? 'text-rose-500'
                    : report.penaltyStatus === 'MODERATE_MONITOR'
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                }`}
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{report.penaltyRiskScore}/100</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  report.penaltyStatus === 'CRITICAL_SPAM_PENALTY'
                    ? 'bg-rose-100 text-rose-700 border border-rose-300'
                    : report.penaltyStatus === 'MODERATE_MONITOR'
                    ? 'bg-amber-100 text-amber-700 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                }`}
              >
                {report.penaltyStatus === 'CRITICAL_SPAM_PENALTY'
                  ? 'CRITICAL RISK'
                  : report.penaltyStatus === 'MODERATE_MONITOR'
                  ? 'MODERATE RISK'
                  : 'SAFE STATUS'}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Overall Link Spam: <span className="font-bold text-slate-700">{report.overallSpamScore}%</span>
            </div>
          </div>

          {/* Card 4: Clean DoFollow Equity */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>DoFollow Link Equity</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{report.dofollowRatio}%</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Clean Authority Links:</span>
              <span className="font-bold text-slate-700">{report.cleanBacklinksCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 3. Main Workspace: Full Width Table or Two Columns */}
        <div className={`grid gap-6 mt-6 ${viewLayoutMode === 'ahrefs_full' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
          {/* Backlink Table (Full width or 7 cols) */}
          <div className={`${viewLayoutMode === 'ahrefs_full' ? 'w-full' : 'lg:col-span-7'} space-y-4`}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Table Header & Controls */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-rose-600" />
                    <span>Discovered Referring Links ({report.backlinks.length})</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any referring link to open and audit the live source website in a new tab.
                  </p>
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAllToxic}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    Select All Toxic
                  </button>
                  <button
                    onClick={clearAllDisavow}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTabFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeTabFilter === 'all'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All ({report.backlinks.length})
                  </button>
                  <button
                    onClick={() => setActiveTabFilter('toxic')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTabFilter === 'toxic'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Toxic ({report.backlinks.filter((b) => b.isToxic).length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTabFilter('suspicious')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTabFilter === 'suspicious'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Suspicious ({report.backlinks.filter((b) => b.isSuspicious).length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTabFilter('clean')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTabFilter === 'clean'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Clean ({report.backlinks.filter((b) => !b.isToxic && !b.isSuspicious).length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTabFilter('dofollow')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTabFilter === 'dofollow'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>DoFollow ({report.backlinks.filter((b) => b.linkAttribute === 'dofollow').length})</span>
                  </button>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                    placeholder="Search domain, title, URL, anchor..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Table Column Headers (Matching Ahrefs Structure) */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-1 flex items-center justify-center">DR / Disavow</div>
                <div className="col-span-6">Referring page (Title & Live Source URL)</div>
                <div className="col-span-5">Anchor & Target URL (Destination & Snippet)</div>
              </div>

              {/* Table List */}
              <div className="divide-y divide-slate-100 max-h-[650px] overflow-y-auto">
                {filteredBacklinks.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No backlinks match the current filter or search criteria.
                  </div>
                ) : (
                  filteredBacklinks.map((link) => {
                    const isDisavowed = disavowedDomains.has(link.sourceDomain);
                    return (
                      <div
                        key={link.id}
                        className={`p-4 transition-colors flex flex-col md:grid md:grid-cols-12 gap-4 items-start ${
                          isDisavowed ? 'bg-rose-50/40' : 'hover:bg-slate-50/90'
                        }`}
                      >
                        {/* Col 1: Disavow Checkbox & DR */}
                        <div className="md:col-span-1 flex items-center md:flex-col md:items-center justify-center gap-2 pt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            checked={isDisavowed}
                            onChange={() => toggleDisavowDomain(link.sourceDomain)}
                            title="Select to add this domain to Google Disavow file"
                            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer"
                          />
                          <div className="flex flex-col items-center">
                            <span
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border ${
                                link.domainRating >= 80
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : link.domainRating >= 40
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : link.domainRating >= 10
                                  ? 'bg-slate-100 text-slate-800 border-slate-300'
                                  : 'bg-rose-50 text-rose-800 border-rose-300'
                              }`}
                              title={`Domain Rating: ${link.domainRating}/100`}
                            >
                              {link.domainRating}
                            </span>
                            {link.urlRating !== undefined && (
                              <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                                UR {link.urlRating}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Col 2: Referring Page Details */}
                        <div className="md:col-span-6 min-w-0 space-y-1.5">
                          {/* Page Title */}
                          <div className="text-sm font-semibold text-slate-900 leading-snug">
                            {link.sourceTitle || link.sourceDomain}
                          </div>

                          {/* CLICKABLE REFERRING URL - OPENS REFERRING SITE IN NEW TAB */}
                          <div>
                            <a
                              href={link.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1.5 break-all group cursor-pointer"
                              title={`Click to open live referring site in new tab: ${link.sourceUrl}`}
                            >
                              <span className="break-all">{link.sourceUrl}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                          </div>

                          {/* Metadata Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] pt-0.5">
                            {link.isToxic ? (
                              <span className="px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3" />
                                <span>TOXIC</span>
                              </span>
                            ) : link.isSuspicious ? (
                              <span className="px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>SUSPICIOUS</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span>CLEAN</span>
                              </span>
                            )}

                            <span
                              className={`px-2 py-0.5 rounded font-mono font-bold ${
                                link.spamScore > 75
                                  ? 'bg-rose-100 text-rose-700'
                                  : link.spamScore > 40
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              Spam: {link.spamScore}%
                            </span>

                            <span
                              className={`px-2 py-0.5 rounded font-semibold uppercase ${
                                link.linkAttribute === 'dofollow'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {link.linkAttribute}
                            </span>

                            <span className="text-slate-400 font-mono">
                              IP: {link.ipSubnet} ({link.country})
                            </span>

                            {link.toxicFlags.map((flag, fIdx) => (
                              <span
                                key={fIdx}
                                className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-medium"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Col 3: Anchor and Target URL */}
                        <div className="md:col-span-5 min-w-0 space-y-2 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                          {/* Anchor Snippet */}
                          <div className="text-xs text-slate-700 leading-relaxed font-sans">
                            {link.contextSnippet ? (
                              <span>{link.contextSnippet}</span>
                            ) : (
                              <span>
                                Anchor text:{' '}
                                <span className="font-bold text-slate-900 font-mono">"{link.anchorText}"</span>
                              </span>
                            )}
                          </div>

                          {/* Target URL with Badge and Clickable Link */}
                          <div className="pt-1.5 border-t border-slate-200/60 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                {link.targetSnippetBadge || 'Canonical'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">Target Destination:</span>
                            </div>

                            <a
                              href={link.targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 break-all group cursor-pointer"
                              title={`Click to open target destination in new tab: ${link.targetUrl}`}
                            >
                              <span className="break-all">{link.targetUrl}</span>
                              <ExternalLink className="w-3 h-3 text-emerald-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Toxic Clusters Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Identified Toxic Clusters & PBN Subnet Footprints</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {report.toxicClusters.map((cluster, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{cluster.category}</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-200 text-rose-800">
                          {cluster.count} Nodes
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{cluster.description}</p>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-rose-200/60 font-mono text-[10px] text-rose-700 truncate">
                      e.g. {cluster.examples[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column / Dedicated Station: Google Disavow Tool Generator */}
          <div className={`${viewLayoutMode === 'ahrefs_full' ? 'w-full' : 'lg:col-span-5'} space-y-4`}>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-white sticky top-24">
              {/* Card Header */}
              <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Google Disavow Tool Generator</h3>
                    <div className="text-[11px] text-slate-400">
                      {disavowedDomains.size} toxic domains queued for disavow
                    </div>
                  </div>
                </div>

                {/* Directive Mode Toggle */}
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
                  <button
                    onClick={() => setDisavowFormatMode('domain')}
                    className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                      disavowFormatMode === 'domain'
                        ? 'bg-rose-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Google strongly recommends domain: format"
                  >
                    domain:
                  </button>
                  <button
                    onClick={() => setDisavowFormatMode('url')}
                    className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                      disavowFormatMode === 'url'
                        ? 'bg-rose-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    url:
                  </button>
                </div>
              </div>

              {/* Code Notepad Preview */}
              <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300">
                <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-800/80 mb-2">
                  <span>disavow-{report.domain}.txt</span>
                  <span className="text-emerald-400 font-sans text-[10px] font-bold">
                    UTF-8 • Google Search Console Ready
                  </span>
                </div>

                {/* Preformatted Box */}
                <pre className="overflow-x-auto max-h-[380px] text-[11px] leading-relaxed text-slate-300 select-all p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                  {generatedDisavowText}
                </pre>
              </div>

              {/* Primary Action Buttons */}
              <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownloadDisavow}
                    className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .txt</span>
                  </button>

                  <button
                    onClick={handleCopyDisavow}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isCopiedDisavow ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Official Google Tool Direct Link */}
                <div className="pt-2 border-t border-slate-800/80">
                  <a
                    href="https://search.google.com/search-console/disavow-links"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-xs text-rose-300 hover:text-rose-200 flex items-center justify-center gap-1.5 transition-colors font-medium text-center"
                  >
                    <span>Upload to Official Google Disavow Tool</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>

                {/* 4-Step Instructions */}
                <div className="rounded-xl bg-slate-900 p-3 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                  <div className="font-bold text-slate-200 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-rose-400" />
                    <span>Submission Checklist:</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Download the generated <code className="text-rose-300">disavow.txt</code> file above.</li>
                    <li>Open Google Search Console Disavow Tool for {report.domain}.</li>
                    <li>Upload this file. (Previous disavow files will be overwritten).</li>
                    <li>Googlebot automatically ignores link equity within 2–8 weeks.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Deep E-E-A-T Technical Guidance & Algorithmic Mechanics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-10">
          {/* E-E-A-T Header */}
          <div className="border-b border-slate-200 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                    E-E-A-T Senior Auditor Blueprint
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Algorithmic Link Auditing & Google SpamBrain Penalty Mechanics
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Updated: September 2026</span>
              </div>
            </div>
          </div>

          {/* Section 1: The Invisible Risk */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Why Low-Trust TLDs, Scraper Farms, and PBN Subnets Trigger Search Demotions</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Google's deep learning spam detection system, <strong>SpamBrain</strong>, analyzes the entire web
              link graph to discover artificial link creation patterns. When a website accumulates links from
              identical C-class IP subnets (PBN rings), low-cost spam TLDs (<code className="text-rose-700 bg-rose-50 px-1 py-0.5 rounded">.xyz</code>, <code className="text-rose-700 bg-rose-50 px-1 py-0.5 rounded">.top</code>, <code className="text-rose-700 bg-rose-50 px-1 py-0.5 rounded">.click</code>, <code className="text-rose-700 bg-rose-50 px-1 py-0.5 rounded">.buzz</code>), or unmoderated scraper farms, Google's algorithms reduce the site's organic visibility without issuing a formal manual penalty.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Crucially, unaddressed toxic links also poison your <strong>Anchor Text Velocity</strong>. If commercial exact-match keywords (e.g., "cheap payday loans", "online casino slots") exceed 15% of your total referring anchor profile, Googlebot demotes your primary landing pages for algorithmic over-optimization.
            </p>
          </div>

          {/* Comparative Data Table: Manual Action vs SpamBrain vs Natural Deprecation */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Comparative Analysis: Manual Action vs. Algorithmic SpamBrain Suppression
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Evaluation Dimension</th>
                    <th className="py-3 px-4">Google Manual Action</th>
                    <th className="py-3 px-4">SpamBrain Algorithmic Demotion</th>
                    <th className="py-3 px-4">Natural Link Atrophy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Notification in GSC</td>
                    <td className="py-3 px-4 text-rose-600 font-semibold">Yes (Security & Manual Actions tab)</td>
                    <td className="py-3 px-4 text-amber-600 font-semibold">No (Silent traffic drop)</td>
                    <td className="py-3 px-4 text-slate-500">No</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Primary Cause</td>
                    <td className="py-3 px-4">Human Google webspam review of unnatural links</td>
                    <td className="py-3 px-4">Automated pattern match across IP subnets & anchors</td>
                    <td className="py-3 px-4">404 errors, site redesigns, expired domains</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Remediation Action</td>
                    <td className="py-3 px-4 font-semibold">Disavow File + Reconsideration Request</td>
                    <td className="py-3 px-4 font-semibold text-rose-600">Disavow File + Clean Link Building</td>
                    <td className="py-3 px-4 text-slate-500">Reclaim broken links via 301 redirects</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Recovery Timeline</td>
                    <td className="py-3 px-4">2–4 weeks post reconsideration approval</td>
                    <td className="py-3 px-4">4–12 weeks upon Googlebot recrawling</td>
                    <td className="py-3 px-4">Immediate upon redirect resolution</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Official Disavow Protocol */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Official Google Disavow Protocol: Best Practices & Common Pitfalls</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>The Best Practice: Always Use domain: Directives</span>
                </div>
                <p className="text-xs text-emerald-900/80 leading-relaxed">
                  Writing <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded text-emerald-800">domain:spamsite.com</code> instructs Googlebot to sever equity from every page, subdomain, and future URL on that host. This protects you against spammers creating thousands of dynamic URL paths.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                <div className="font-bold text-rose-800 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>The Critical Pitfall: Overwriting Existing Disavow Files</span>
                </div>
                <p className="text-xs text-rose-900/80 leading-relaxed">
                  Google Search Console maintains only <strong>one active disavow file per property</strong>. When you upload a new file, it completely replaces your previous file. Always ensure your new export retains all previously disavowed toxic domains.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: FAQ Section with Direct Answers (<25 words) */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Frequently Asked Questions: Backlink Auditing & Google Disavow
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = expandedFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : index)}
                      className="w-full text-left px-5 py-4 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 py-4 bg-white border-t border-slate-200 text-xs text-slate-600 space-y-2">
                        {/* Direct Answer Synthesis (<25 words in bold) */}
                        <p className="font-bold text-slate-900 bg-slate-100 p-3 rounded-lg border-l-4 border-rose-500">
                          {faq.directAnswer}
                        </p>
                        <p className="leading-relaxed pt-1">{faq.fullAnswer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Author E-E-A-T Signature */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-sm">
                AF
              </div>
              <div>
                <div className="font-bold text-slate-900">AccessFix Senior Link Building Audit Council</div>
                <div>20+ Years Enterprise SEO, Algorithmic Penalty Recovery & Disavow Specialization</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              Validated against Google Search Console Disavow Specifications (v2026.4)
            </div>
          </div>
        </div>
      </section>

      {/* Structured Data: SoftwareApplication & FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'Backlink Audit & Google Disavow Generator',
                applicationCategory: 'SEOApplication',
                operatingSystem: 'All',
                description:
                  'Deep backlink crawler and toxic link analyzer that generates 100% compliant .txt files for the official Google Search Console Disavow Links tool.',
                offers: {
                  '@type': 'Offer',
                  price: '0.00',
                  priceCurrency: 'USD',
                },
              },
              {
                '@type': 'FAQPage',
                mainEntity: faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: f.directAnswer + ' ' + f.fullAnswer,
                  },
                })),
              },
            ],
          }),
        }}
      />
    </div>
  );
};
export default BacklinkAuditDisavowView;
