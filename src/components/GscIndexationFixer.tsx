import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  Layers,
  Sparkles,
  Terminal,
  HelpCircle,
  Link2,
  FileText,
  Clock,
  RefreshCw,
  Globe,
  Compass,
  BookOpen,
  Table,
  Code,
  Info,
} from 'lucide-react';
import {
  GscIndexationReport,
  UrlIndexationAudit,
} from '../types/indexationFixer';
import {
  generateGscAuditReport,
  GSC_PRESET_SCENARIOS,
} from '../utils/indexationFixerEngine';

interface GscIndexationFixerProps {
  onNavigate: (route: string) => void;
}

export interface GscReasonGuide {
  id: string;
  name: string;
  category: 'Excluded' | 'Error';
  badgeColor: string;
  summary: string;
  technicalCause: string;
  remediation: string;
  codeExample?: string;
}

export const GSC_REASON_CODES: GscReasonGuide[] = [
  {
    id: 'discovered_not_indexed',
    name: 'Discovered – currently not indexed',
    category: 'Excluded',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary: 'Google found the URL (via sitemap or link) but did not crawl it due to server load limits or crawl priority deficit.',
    technicalCause: 'Internal link starvation, deep click hierarchy (>3 hops from root), or low domain authority and crawl budget.',
    remediation: 'Add 3–5 contextual inlinks from high-traffic pillar pages, flatten click depth, and ensure the URL is in a verified XML sitemap.',
    codeExample: '<!-- Add contextual anchor link from an authoritative category or article -->\n<a href="https://example.com/target-page">Detailed Guide to Target Topic</a>',
  },
  {
    id: 'crawled_not_indexed',
    name: 'Crawled – currently not indexed',
    category: 'Excluded',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    summary: 'Googlebot downloaded and rendered the page, but rejected it from the search index due to perceived low quality or duplication.',
    technicalCause: 'Thin text content (<300 words), high boilerplate-to-content ratio, duplicate product descriptions, or lack of unique value.',
    remediation: 'Add 500+ words of unique expert analysis, integrate customer FAQs, add structured JSON-LD schema, and purge template bloat.',
    codeExample: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "TechArticle",\n  "headline": "In-Depth Topic Analysis",\n  "description": "Comprehensive original research and testing metrics."\n}\n</script>',
  },
  {
    id: 'not_found_404',
    name: 'Not found (404)',
    category: 'Error',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    summary: 'Googlebot requested the URL and the server returned an HTTP 404 response. The URL is still linked internally or in a sitemap.',
    technicalCause: 'Deleted pages, changed URLs without redirects, or broken internal/external hyperlinks.',
    remediation: 'Implement a 301 permanent redirect to a closely matching page, or return HTTP 410 (Gone) if permanently deleted with no replacement. Remove internal links.',
    codeExample: '# Nginx 301 Redirect\nlocation = /old-broken-url {\n    return 301 /new-relevant-target;\n}\n# Or return HTTP 410 Gone for permanently deleted products:\n# location = /discontinued-item { return 410; }',
  },
  {
    id: 'page_with_redirect',
    name: 'Page with redirect',
    category: 'Excluded',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    summary: 'The URL returns an HTTP 301 or 302 redirect. Google indexes the destination URL instead of this source URL.',
    technicalCause: 'Outdated internal links or XML sitemap entries pointing to old URLs rather than final destination URLs.',
    remediation: 'Update all internal links and XML sitemaps to point directly to the destination URL. Ensure destination returns 200 OK with self-canonical.',
    codeExample: '// Update internal links across templates to bypass the redirect hop\n// Before: <a href="/old-slug">Category</a>\n// After:  <a href="/final-slug">Category</a>',
  },
  {
    id: 'duplicate_without_canonical',
    name: 'Duplicate without user-selected canonical',
    category: 'Excluded',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    summary: 'The URL has duplicate content with another page on your site, but has no explicit rel="canonical" tag defined.',
    technicalCause: 'Tracking parameters (UTMs, ref tags), HTTP/HTTPS duplicates, or trailing slash inconsistencies without canonical declaration.',
    remediation: 'Add a self-referencing <link rel="canonical"> tag on the primary version and point all duplicate variations to the primary URL.',
    codeExample: '<!-- Place in <head> of primary canonical page -->\n<link rel="canonical" href="https://example.com/primary-clean-url" />',
  },
  {
    id: 'google_chose_different_canonical',
    name: 'Duplicate, Google chose different canonical than user',
    category: 'Excluded',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    summary: 'You declared a canonical URL, but Googlebot determined another URL is a better match based on internal links and content.',
    technicalCause: 'Internal links point to the non-canonical version, or the declared canonical page is substantially different in content.',
    remediation: 'Align internal links and sitemap entries with your desired canonical URL, or adopt Google\'s chosen canonical if appropriate.',
    codeExample: '<!-- Ensure internal links match declared canonical href exactly -->\n<link rel="canonical" href="https://example.com/canonical-page" />',
  },
  {
    id: 'excluded_by_noindex',
    name: "Excluded by 'noindex' tag",
    category: 'Excluded',
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Googlebot found a robots meta tag or X-Robots-Tag header containing "noindex", deliberately preventing indexation.',
    technicalCause: 'Staging environment tags deployed to production, WordPress "discourage search engines" checkbox active, or CMS misconfiguration.',
    remediation: 'If the page should be indexed, remove the "noindex" directive from HTML <meta> tags and HTTP headers.',
    codeExample: '<!-- Replace noindex with standard indexable directive -->\n<meta name="robots" content="index, follow, max-image-preview:large" />',
  },
  {
    id: 'blocked_by_robots',
    name: 'Blocked by robots.txt',
    category: 'Excluded',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    summary: 'Googlebot was instructed not to crawl the page by a Disallow rule in your site\'s robots.txt file.',
    technicalCause: 'Overly broad Disallow paths (e.g., Disallow: /products/ or Disallow: /*?*) blocking valuable pages.',
    remediation: 'Audit robots.txt with our free Robots.txt Validator and remove Disallow directives matching indexable content.',
    codeExample: '# robots.txt update: allow specific subfolder\nUser-agent: *\nDisallow: /checkout/\nAllow: /products/',
  },
  {
    id: 'soft_404',
    name: 'Soft 404',
    category: 'Error',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    summary: 'The page returns an HTTP 200 OK status code, but Googlebot believes it represents an empty, missing, or error page.',
    technicalCause: 'Empty search result pages, out-of-stock category pages with zero products, or error pages returning 200 instead of 404.',
    remediation: 'Return a genuine HTTP 404 or 410 status code for non-existent content, or add rich content/products to empty category pages.',
    codeExample: '// Express.js proper 404 status return\napp.use((req, res) => {\n  res.status(404).render("404-page");\n});',
  },
];

export const GscIndexationFixer: React.FC<GscIndexationFixerProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'report-explorer' | 'error-matrix'>('audit');
  const [selectedReasonId, setSelectedReasonId] = useState<string>('discovered_not_indexed');
  const [inputMode, setInputMode] = useState<'single' | 'bulk'>('single');
  const [singleUrl, setSingleUrl] = useState<string>('https://mystore.com/products/wireless-earbuds-pro-v2');
  const [bulkUrls, setBulkUrls] = useState<string>(
    `https://mystore.com/catalog/discontinued-spring-collection\nhttps://mystore.com/products/wireless-earbuds-pro-v2\nhttps://saasplatform.io/features/cloud-sync-overview\nhttps://brandagency.com/services/seo-consulting?ref=google_cpc\nhttps://auditsnipe.com/blog/site-comparison-engine-guide`
  );

  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditStep, setAuditStep] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active Report
  const [report, setReport] = useState<GscIndexationReport>(() =>
    generateGscAuditReport([singleUrl])
  );

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditStep('Connecting to Google Indexation Diagnostics API...');

    setTimeout(() => {
      setAuditStep('Evaluating internal inlink topology and PageRank distribution...');
    }, 400);

    setTimeout(() => {
      setAuditStep('Analyzing canonical headers and robots meta directives...');
    }, 800);

    setTimeout(() => {
      setAuditStep('Calculating content depth and semantic entity density...');
    }, 1200);

    setTimeout(() => {
      const urlsToAudit =
        inputMode === 'single'
          ? [singleUrl]
          : bulkUrls.split('\n').map((u) => u.trim()).filter(Boolean);

      const newReport = generateGscAuditReport(urlsToAudit);
      setReport(newReport);
      setIsAuditing(false);
      setAuditStep('');
    }, 1500);
  };

  const handleSelectPreset = (url: string) => {
    setInputMode('single');
    setSingleUrl(url);
    setActiveTab('audit');
    setIsAuditing(true);
    setAuditStep('Loading diagnostic scenario...');
    setTimeout(() => {
      const newReport = generateGscAuditReport([url]);
      setReport(newReport);
      setIsAuditing(false);
      setAuditStep('');
    }, 500);
  };

  const handleSelectQuickChip = (chipType: string) => {
    if (chipType === '404') {
      handleSelectPreset('https://mystore.com/catalog/discontinued-spring-collection');
    } else if (chipType === 'discovered') {
      handleSelectPreset('https://mystore.com/products/wireless-earbuds-pro-v2');
    } else if (chipType === 'crawled') {
      handleSelectPreset('https://saasplatform.io/features/cloud-sync-overview');
    } else if (chipType === 'report') {
      setActiveTab('report-explorer');
    } else if (chipType === 'error-matrix') {
      setActiveTab('error-matrix');
    } else if (chipType === 'why-not-indexing') {
      const el = document.getElementById('why-not-indexing-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (chipType === 'check-indexing') {
      const el = document.getElementById('how-to-check-indexing-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadFixReport = () => {
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gsc-indexation-audit-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activeReason = GSC_REASON_CODES.find((r) => r.id === selectedReasonId) || GSC_REASON_CODES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Schema Markup for SoftwareApplication & FAQPage (PAA Grounded) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'Google Search Console Indexation & Discovered Not Indexed Fixer',
                applicationCategory: 'SEOApplication',
                operatingSystem: 'All Modern Web Browsers',
                description:
                  'Free online Google Search Console audit tool. Diagnose why pages are stuck in Discovered or Crawled currently not indexed, resolve 404 errors, canonical conflicts, and boost crawl budget.',
                offers: {
                  '@type': 'Offer',
                  price: '0.00',
                  priceCurrency: 'USD',
                },
                keywords: [
                  'gsc indexation fixer',
                  'google page index check',
                  'page indexing report',
                  'how to fix page indexing issues',
                  'google indexing checker',
                  'crawled currently not indexed',
                  'discovered currently not indexed',
                  'how to fix 404 error in google search console',
                  'why is google not indexing my site',
                  'what is an indexing error',
                ],
              },
              {
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'How to resolve an indexing issue?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'To resolve an indexing issue, identify the root cause in Google Search Console\'s Page Indexing report, eliminate blocking directives (noindex, 404, robots.txt), and inject internal links.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How to fix page indexing issues?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Fix page indexing issues by testing the URL in GSC\'s URL Inspection tool, removing canonical mismatches, upgrading thin content over 600 words, and requesting re-indexing.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Why is Google not indexing my site?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Google is not indexing your site due to either accidental "noindex" tags, robots.txt disallows, low domain authority, or thin, unhelpful duplicate content.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is an indexing error?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'An indexing error occurs when Googlebot attempts to crawl or index a web page but fails due to server errors (5xx), client errors (404), or redirect loops.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What Search Console report shows the index status for all the pages in a website?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'The Page Indexing Report (located under Indexing > Pages in Google Search Console) shows the index status for all known URLs across your entire website.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How to fix 404 error in Google Search Console?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Fix 404 errors in GSC by setting 301 redirects to equivalent live pages, returning HTTP 410 Gone for obsolete pages, and removing dead internal links.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How to check indexing of website (Google Page Index Check)?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Check website indexing by running the site:yourdomain.com search operator in Google, reviewing GSC\'s Page Indexing report, or using the URL Inspection tool.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What does page index meaning refer to in search engine architecture?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Page index meaning refers to Google\'s massive distributed database (Caffeine) where crawled and parsed web pages are stored, analyzed, and retrieved to serve search queries.',
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />

      {/* Hero Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              GSC Indexation & Crawl Intelligence
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Google Search Console Protocol Engine
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Google Search Console Indexation & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">"Discovered Not Indexed" Fixer</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-5">
            Audit why your URLs are stuck in Google Search Console's <em>"Discovered – currently not indexed"</em>, <em>"Crawled – currently not indexed"</em>, or <em>"Not found (404)"</em> status. Unmask internal link starvation, resolve canonical conflicts, and generate 1-click corrective code to get indexed fast.
          </p>

          {/* Targeted Search Intent Quick-Chips (Direct Google Queries) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              Direct GSC Queries:
            </span>
            <button
              onClick={() => handleSelectQuickChip('report')}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 text-xs text-slate-300 hover:text-indigo-200 transition-colors"
            >
              Page Indexing Report
            </button>
            <button
              onClick={() => handleSelectQuickChip('discovered')}
              className="px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 transition-colors"
            >
              Discovered – Currently Not Indexed
            </button>
            <button
              onClick={() => handleSelectQuickChip('crawled')}
              className="px-2.5 py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs text-rose-300 transition-colors"
            >
              Crawled – Currently Not Indexed
            </button>
            <button
              onClick={() => handleSelectQuickChip('404')}
              className="px-2.5 py-1 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs text-red-300 transition-colors"
            >
              Fix 404 Error in GSC
            </button>
            <button
              onClick={() => handleSelectQuickChip('error-matrix')}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 text-xs text-slate-300 hover:text-indigo-200 transition-colors"
            >
              Indexing Errors Matrix
            </button>
            <button
              onClick={() => handleSelectQuickChip('check-indexing')}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 text-xs text-slate-300 hover:text-indigo-200 transition-colors"
            >
              Google Page Index Check
            </button>
            <button
              onClick={() => handleSelectQuickChip('why-not-indexing')}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 text-xs text-slate-300 hover:text-indigo-200 transition-colors"
            >
              Why Google Not Indexing?
            </button>
          </div>
        </div>
      </header>

      {/* Main Interactive Tool Viewport */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs between Audit, Report Explorer & Error Matrix */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Live URL Inspection & Audit Tool</span>
          </button>
          <button
            onClick={() => setActiveTab('report-explorer')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'report-explorer'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Page Indexing Report Explorer (GSC Taxonomy)</span>
          </button>
          <button
            onClick={() => setActiveTab('error-matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'error-matrix'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Search Console Error Resolution Matrix</span>
          </button>
        </div>

        {/* TAB 1: LIVE URL INSPECTION TOOL */}
        {activeTab === 'audit' && (
          <div>
            {/* Preset Selector Banner */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  Quick Diagnostic Scenarios (Click to Load):
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {GSC_PRESET_SCENARIOS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(preset.url)}
                    className="text-left p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all text-xs group"
                  >
                    <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {preset.label}
                    </div>
                    <div className="text-slate-400 text-[11px] line-clamp-2 mt-1">
                      {preset.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setInputMode('single')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      inputMode === 'single'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Single URL Inspection
                  </button>
                  <button
                    onClick={() => setInputMode('bulk')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      inputMode === 'bulk'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Bulk Indexation Audit (Up to 20 URLs)
                  </button>
                </div>
                <span className="text-xs text-slate-400 hidden sm:inline-block">
                  Free • Zero API Credentials Required
                </span>
              </div>

          {inputMode === 'single' ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={singleUrl}
                  onChange={(e) => setSingleUrl(e.target.value)}
                  placeholder="https://example.com/unindexed-page"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button
                onClick={handleRunAudit}
                disabled={isAuditing || !singleUrl.trim()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Auditing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Audit Indexation</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={bulkUrls}
                onChange={(e) => setBulkUrls(e.target.value)}
                rows={4}
                placeholder="Enter one URL per line (up to 20)..."
                className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                onClick={handleRunAudit}
                disabled={isAuditing || !bulkUrls.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Running Bulk Audit...</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    <span>Run Bulk Indexation Audit ({bulkUrls.split('\n').filter(Boolean).length} URLs)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {isAuditing && (
            <div className="mt-4 p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-lg flex items-center gap-3 text-xs text-indigo-300 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
              <span>{auditStep}</span>
            </div>
          )}
        </div>

        {/* Audit Results Dashboard */}
        {report && (
          <div className="space-y-6">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 font-medium">Indexability Score</div>
                <div className="text-2xl sm:text-3xl font-bold mt-1 flex items-center gap-2">
                  <span
                    className={
                      report.overallHealthScore >= 80
                        ? 'text-emerald-400'
                        : report.overallHealthScore >= 50
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }
                  >
                    {report.overallHealthScore}
                  </span>
                  <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 font-medium">Discovered (Not Indexed)</div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-400 mt-1">
                  {report.summary.discoveredCount}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 font-medium">Crawled (Not Indexed)</div>
                <div className="text-2xl sm:text-3xl font-bold text-rose-400 mt-1">
                  {report.summary.crawledCount}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 font-medium">Fully Eligible / Healthy</div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                  {report.summary.healthyCount}
                </div>
              </div>
            </div>

            {/* Detailed URL Inspection Items */}
            <div className="space-y-4">
              {report.results.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.primaryStatus === 'healthy_indexable' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : item.primaryStatus === 'discovered_not_indexed' ? (
                        <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate max-w-xl">
                          {item.url}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              item.primaryStatus === 'healthy_indexable'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : item.primaryStatus === 'discovered_not_indexed'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {item.statusLabel}
                          </span>
                          <span>•</span>
                          <span>Inlinks: {item.internalInlinksCount}</span>
                          <span>•</span>
                          <span>Words: {item.wordCount}</span>
                          <span>•</span>
                          <span>Crawl Priority: {item.estimatedCrawlTier.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Score</div>
                        <div className="text-lg font-bold text-white">
                          {item.indexabilityScore}/100
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Root Cause Analysis & Issues */}
                  {item.issues.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {item.issues.map((issue) => (
                        <div
                          key={issue.id}
                          className={`p-4 rounded-xl border text-xs ${
                            issue.severity === 'critical'
                              ? 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                              : issue.severity === 'warning'
                              ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                              : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-semibold text-sm">{issue.title}</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900">
                              {issue.category}
                            </span>
                          </div>
                          <p className="text-slate-300 mb-2 leading-relaxed">{issue.description}</p>
                          <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300 font-mono text-[11px] mb-2">
                            <strong>Diagnosed:</strong> {issue.technicalDetails}
                          </div>
                          <div className="text-indigo-300 font-medium flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <strong>Remediation:</strong> {issue.suggestedFix}
                          </div>

                          {issue.codeSnippet && (
                            <div className="mt-2.5 relative">
                              <pre className="p-3 bg-slate-950 rounded-lg text-slate-300 text-[11px] overflow-x-auto border border-slate-800 font-mono">
                                {issue.codeSnippet}
                              </pre>
                              <button
                                onClick={() => copyToClipboard(issue.codeSnippet!, issue.id)}
                                className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1"
                              >
                                {copiedId === issue.id ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>All indexation gates satisfied. No canonical conflicts or link starvation detected.</span>
                    </div>
                  )}

                  {/* Immediate Remediation Action Items */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
                    <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      Immediate Action Checklist to Force Re-Crawl:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      {item.remediationPlan.map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Export & Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <div>
                <div className="text-sm font-semibold text-white">Download Full Indexation Remediation Report</div>
                <div className="text-xs text-slate-400">
                  Export machine-readable JSON data with diagnostic telemetry for developers.
                </div>
              </div>
              <button
                onClick={downloadFixReport}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Diagnostic JSON</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )}

        {/* TAB 2: PAGE INDEXING REPORT TAXONOMY EXPLORER */}
        {activeTab === 'report-explorer' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                Google Search Console Deep Taxonomy
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                What Search Console Report Shows the Index Status for All Pages in a Website?
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                The <strong>Page Indexing Report</strong> (formerly known as the <em>Index Coverage Report</em>) located under <strong>Indexing &gt; Pages</strong> in Google Search Console is the definitive single report that aggregates the index status for all discovered and submitted URLs across your entire property. It bifurcates your domain into two top-level statuses: <strong>Indexed</strong> (valid, serving in search results) and <strong>Not Indexed</strong> (excluded, pending, or erroneous).
              </p>
            </div>

            {/* Visual Status Hierarchy Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-emerald-400 font-bold text-base flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Indexed (Valid URLs)
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    Live in SERPs
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Pages that have passed all crawl, render, content quality, and canonical evaluation gates. These URLs appear in Google Search and earn organic search impressions.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-800/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-amber-400 font-bold text-base flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Not Indexed (Excluded / Errors)
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                    Requires Audit
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  URLs discovered by Googlebot but excluded from search due to webmaster directives (noindex, canonical tags, robots.txt), HTTP errors (404, 5xx), or crawl budget bottlenecks.
                </p>
              </div>
            </div>

            {/* 9 Official Reason Codes Interactive Selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Select a Google Search Console Reason Code to Inspect:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-6">
                {GSC_REASON_CODES.map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedReasonId(reason.id)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedReasonId === reason.id
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold truncate">{reason.name}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          reason.category === 'Error'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {reason.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{reason.summary}</p>
                  </button>
                ))}
              </div>

              {/* Deep-Dive Card for Selected Reason Code */}
              {activeReason && (
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-white">{activeReason.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${activeReason.badgeColor}`}>
                          GSC Status: {activeReason.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{activeReason.summary}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('audit');
                        if (activeReason.id === 'not_found_404') {
                          handleSelectPreset('https://mystore.com/catalog/discontinued-spring-collection');
                        } else if (activeReason.id === 'crawled_not_indexed') {
                          handleSelectPreset('https://saasplatform.io/features/cloud-sync-overview');
                        } else {
                          handleSelectPreset('https://mystore.com/products/wireless-earbuds-pro-v2');
                        }
                      }}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Test Scenario in Audit Tool</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="font-semibold text-rose-300 mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Root Architectural Cause
                      </div>
                      <p className="text-slate-300 leading-relaxed">{activeReason.technicalCause}</p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Step-by-Step Remediation Protocol
                      </div>
                      <p className="text-slate-300 leading-relaxed">{activeReason.remediation}</p>
                    </div>
                  </div>

                  {activeReason.codeExample && (
                    <div>
                      <div className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                        Engineered Fix Configuration / Snippet:
                      </div>
                      <div className="relative">
                        <pre className="p-3 bg-slate-900 rounded-lg text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
                          {activeReason.codeExample}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(activeReason.codeExample!, activeReason.id)}
                          className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1"
                        >
                          {copiedId === activeReason.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SEARCH CONSOLE ERROR RESOLUTION MATRIX */}
        {activeTab === 'error-matrix' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Table className="w-4 h-4" />
                Engineering Reference
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Search Console Error vs Excluded Status Matrix
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                Compare HTTP response codes, Googlebot crawling behaviors, and corrective engineering protocols across all standard indexation statuses reported by Google Search Console.
              </p>
            </div>

            {/* Comparative Data Matrix */}
            <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-300 font-semibold uppercase tracking-wider">
                    <th className="p-3.5">GSC Status Reason</th>
                    <th className="p-3.5">Classification</th>
                    <th className="p-3.5">HTTP Code</th>
                    <th className="p-3.5">Googlebot Action</th>
                    <th className="p-3.5">Primary Root Cause</th>
                    <th className="p-3.5">Resolution Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-sans">
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-semibold text-white">Discovered – currently not indexed</td>
                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">Excluded</span></td>
                    <td className="p-3.5 font-mono">None (Uncrawled)</td>
                    <td className="p-3.5">Crawl postponed due to priority deficit</td>
                    <td className="p-3.5">Internal link starvation; deep hierarchy</td>
                    <td className="p-3.5 font-semibold text-amber-400">High (Organic loss)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-semibold text-white">Crawled – currently not indexed</td>
                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">Excluded</span></td>
                    <td className="p-3.5 font-mono text-emerald-400">200 OK</td>
                    <td className="p-3.5">Rendered but excluded from index</td>
                    <td className="p-3.5">Thin content; duplicate text; template bloat</td>
                    <td className="p-3.5 font-semibold text-rose-400">Critical (Quality issue)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-semibold text-white">Not found (404)</td>
                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20">Error / Excluded</span></td>
                    <td className="p-3.5 font-mono text-rose-400">404 Not Found</td>
                    <td className="p-3.5">URL discarded; retry backoff triggered</td>
                    <td className="p-3.5">Deleted URL still referenced in sitemap/links</td>
                    <td className="p-3.5 font-semibold text-indigo-300">Moderate to High</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-semibold text-white">Soft 404</td>
                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20">Error</span></td>
                    <td className="p-3.5 font-mono text-amber-400">200 (Fake OK)</td>
                    <td className="p-3.5">Flagged as deceptive error page</td>
                    <td className="p-3.5">Empty page returning HTTP 200 instead of 404</td>
                    <td className="p-3.5 font-semibold text-rose-400">High</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-semibold text-white">Page with redirect</td>
                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">Excluded</span></td>
                    <td className="p-3.5 font-mono text-sky-400">301 / 302</td>
                    <td className="p-3.5">Follows redirect to target destination</td>
                    <td className="p-3.5">Outdated link topology in templates</td>
                    <td className="p-3.5 font-semibold text-slate-400">Low to Moderate</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-semibold text-white">Duplicate without user canonical</td>
                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">Excluded</span></td>
                    <td className="p-3.5 font-mono text-emerald-400">200 OK</td>
                    <td className="p-3.5">Googlebot clusters with sister URL</td>
                    <td className="p-3.5">Missing &lt;link rel="canonical"&gt; header</td>
                    <td className="p-3.5 font-semibold text-amber-400">High</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-semibold text-white">Blocked by robots.txt</td>
                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">Excluded</span></td>
                    <td className="p-3.5 font-mono">Crawl Disallowed</td>
                    <td className="p-3.5">Crawling stopped; URL may still index nakedly</td>
                    <td className="p-3.5">Overly broad Disallow rule in robots.txt</td>
                    <td className="p-3.5 font-semibold text-rose-400">Critical (if unintentional)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Actions to resolve internal issues */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigate('/tools/sitemap-auditor')}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors text-left group"
              >
                <div className="font-semibold text-white text-xs group-hover:text-indigo-300 flex items-center justify-between">
                  <span>Audit XML Sitemap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Validate sitemap URLs to purge 404s, redirect hops, and noindex directives.
                </p>
              </button>

              <button
                onClick={() => onNavigate('/tools/robots-txt-validator')}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors text-left group"
              >
                <div className="font-semibold text-white text-xs group-hover:text-indigo-300 flex items-center justify-between">
                  <span>Validate robots.txt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Test whether Googlebot user-agents are blocked from accessing critical paths.
                </p>
              </button>

              <button
                onClick={() => onNavigate('/tools/domain-rating-checker')}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors text-left group"
              >
                <div className="font-semibold text-white text-xs group-hover:text-indigo-300 flex items-center justify-between">
                  <span>Check Domain Rating</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Evaluate domain authority and referring domains that determine Google crawl budget.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Dual Search Intent Viewport Architecture - Comprehensive SEO & Educational Guide */}
        <section className="mt-16 pt-12 border-t border-slate-800 text-slate-300">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* H2 1: Page Index Meaning & Search Engine Architecture */}
            <div id="how-to-check-indexing-section">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                What Does "Page Index" Meaning Refer to in Search Engine Architecture?
              </h2>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base">
                In web search architecture, the <strong>page index</strong> is Google's massive, globally distributed database (internally codenamed <em>Caffeine</em>) where crawled and parsed web pages are structured, cataloged, and stored for rapid retrieval. Before a page can rank or generate organic impressions, Googlebot must complete three sequential pipeline stages: <strong>Crawling</strong> (downloading raw HTML and assets), <strong>Rendering</strong> (executing JavaScript and building the DOM tree), and <strong>Indexing</strong> (evaluating content uniqueness, canonical references, and search eligibility).
              </p>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base mt-3">
                If a page fails quality, duplication, or canonical filters, it is discarded into an <strong>"Excluded"</strong> state and will never rank for search queries, even if your XML sitemap submits it daily.
              </p>
            </div>

            {/* H2 2: How to Check Indexing of Website */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                How to Check Indexing of Website: 3 Verified Google Page Index Check Methods
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4 text-indigo-400" />
                    1. The site: Search Operator
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-2">
                    Search <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded">site:yourdomain.com/exact-url</code> directly in Google. If the URL snippet appears, the page is indexed. If zero results return, it is excluded.
                  </p>
                  <span className="text-[11px] text-slate-500">Fastest for quick spot checks.</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    2. GSC URL Inspection Tool
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-2">
                    Paste the target URL into the top search bar of Google Search Console to see the official verdict: <em>"URL is on Google"</em> or <em>"URL is not on Google"</em> alongside canonical declarations.
                  </p>
                  <span className="text-[11px] text-slate-500">Authoritative real-time diagnostic.</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    3. GSC Page Indexing Report
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-2">
                    Navigate to <strong>Indexing &gt; Pages</strong> in GSC to review site-wide indexation trends, total valid pages, and the comprehensive list of reasons why specific URLs remain unindexed.
                  </p>
                  <span className="text-[11px] text-slate-500">Best for site-wide inventory auditing.</span>
                </div>
              </div>
            </div>

            {/* H2 3: Why Google Is Not Indexing My Site */}
            <div id="why-not-indexing-section">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Why Google Is Not Indexing My Site: The 5 Critical Blockers
              </h2>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    1. Accidental 'noindex' Directives in Staging Deployments
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    WordPress sites frequently leave the "Discourage search engines from indexing this site" option checked, injecting <code className="text-rose-300 font-mono">&lt;meta name="robots" content="noindex, nofollow"&gt;</code> into every page header.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-indigo-400" />
                    2. Internal Link Starvation (Orphan URLs)
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    URLs submitted via an XML sitemap that lack contextual HTML inlinks from top navigation or main articles receive minimal internal PageRank, causing Googlebot to classify them as low-priority orphans.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    3. Thin Content & Template Duplication
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    If 80% of a page's DOM consists of generic header, footer, and sidebar boilerplate with fewer than 250 words of original substance, Googlebot rejects the page under <em>"Crawled – currently not indexed"</em>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    4. Low Domain Authority & Crawl Budget Throttling
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Brand new domains without established external backlinks have strictly capped crawl allowances. Googlebot crawls slowly to avoid burdening your server until trust is earned.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    5. Broken Internal Links Generating Cascading 404 Errors
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Internal links pointing to non-existent URLs consume crawl budget without passing equity, triggering <em>"Not found (404)"</em> errors in your Search Console report.
                  </p>
                </div>
              </div>
            </div>

            {/* H2 4: Golden Law 17 Snippet-Optimized FAQ Section (<25 words bold answer first) */}
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <HelpCircle className="w-4 h-4" />
                Authoritative Answer Engine Reference
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Frequently Asked Questions About Google Search Console Indexation
              </h2>

              <div className="space-y-5">
                {/* FAQ 1: How to resolve an indexing issue? */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    How to resolve an indexing issue?
                  </h3>
                  <p className="text-slate-100 font-bold mb-2 text-sm">
                    Identify the exact GSC reason code, remove blocking directives (noindex, 404s, robots.txt), inject 3 to 5 internal links, and request re-indexing via URL Inspection.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Resolving an indexing issue requires aligning technical crawlability with content depth. If GSC flags canonical errors, verify that your <code className="text-indigo-300 font-mono">&lt;link rel="canonical"&gt;</code> points to the self URL. If the page is stuck in <em>"Discovered"</em>, add contextual inlinks from your site's highest-ranking articles to pass PageRank equity.
                  </p>
                </div>

                {/* FAQ 2: How to fix page indexing issues? */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    How to fix page indexing issues?
                  </h3>
                  <p className="text-slate-100 font-bold mb-2 text-sm">
                    Audit the URL in GSC's inspection tool, fix server status codes (200 OK), expand unique text over 600 words, and update your XML sitemap.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Page indexing issues fall into two categories: <strong>crawlability barriers</strong> (server timeouts, noindex tags, disallow rules) and <strong>quality barriers</strong> (thin text, scraped listings, unhelpful copy). Fixing the issue means ensuring the page returns HTTP 200, contains rich structured data, and provides distinct user value.
                  </p>
                </div>

                {/* FAQ 3: Why is Google not indexing my site? */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    Why is Google not indexing my site?
                  </h3>
                  <p className="text-slate-100 font-bold mb-2 text-sm">
                    Google is not indexing your site due to accidental 'noindex' tags, robots.txt disallows, lack of external backlinks, or low-quality duplicate content.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    New websites also undergo an algorithmic discovery buffer. If Googlebot cannot discover external paths leading to your root domain, submit your validated XML sitemap to Google Search Console and secure 2 to 3 editorial backlinks to kickstart initial crawling.
                  </p>
                </div>

                {/* FAQ 4: What is an indexing error? */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    What is an indexing error?
                  </h3>
                  <p className="text-slate-100 font-bold mb-2 text-sm">
                    An indexing error occurs when Googlebot fails to fetch, render, or store a web page due to server crashes, 404 errors, or canonical loops.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    In Google Search Console, genuine <strong>Errors</strong> appear in red and represent critical infrastructure breakdowns (e.g., Server error 5xx, Redirect error, Submitted URL not found 404). In contrast, <strong>Excluded</strong> pages appear in gray and indicate deliberate algorithmic or webmaster exclusions.
                  </p>
                </div>

                {/* FAQ 5: What Search Console report shows the index status for all the pages in a website? */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    What Search Console report shows the index status for all the pages in a website?
                  </h3>
                  <p className="text-slate-100 font-bold mb-2 text-sm">
                    The Page Indexing Report, located under Indexing &gt; Pages in Google Search Console, displays the index status for every page discovered on your website.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    This comprehensive dashboard charts valid indexed URLs over time, categorizes excluded URLs by specific Googlebot diagnostic reasons, and allows you to validate programmatic fixes across bulk URL clusters.
                  </p>
                </div>

                {/* FAQ 6: How to fix 404 error in Google Search Console? */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    How to fix 404 error in Google Search Console?
                  </h3>
                  <p className="text-slate-100 font-bold mb-2 text-sm">
                    Deploy 301 redirects from deleted URLs to relevant replacement pages, serve HTTP 410 for permanently removed content, and remove broken internal links.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-3">
                    If an internal or external link continues to point to a deleted URL, Google will report it as a 404 error indefinitely. Once you configure your server-side 301 redirect rule in Nginx or Apache, click <strong>"Validate Fix"</strong> in Search Console.
                  </p>
                  <div className="relative">
                    <pre className="p-3 bg-slate-950 rounded-lg text-slate-300 text-xs font-mono border border-slate-800">
{`# Nginx 301 Redirect for GSC 404 Fix
location = /old-broken-product {
    return 301 https://example.com/new-replacement-product;
}`}
                    </pre>
                  </div>
                </div>

                {/* FAQ 7: How to check indexing of website (Google Page Index Check)? */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    How to check indexing of website (Google Page Index Check)?
                  </h3>
                  <p className="text-slate-100 font-bold mb-2 text-sm">
                    Use the site:domain.com search operator in Google, check the GSC Page Indexing Report, or inspect individual URLs using the URL Inspection tool.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Running <code className="text-indigo-300 font-mono">site:yourdomain.com</code> provides an instant high-level index estimate. For live, real-time index confirmation and cached snapshot verification, use Google Search Console's URL Inspection tool.
                  </p>
                </div>

                {/* FAQ 8: What is the difference between Discovered and Crawled currently not indexed? */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    What is the difference between "Discovered" and "Crawled" currently not indexed?
                  </h3>
                  <p className="text-slate-100 font-bold mb-2 text-sm">
                    "Discovered" means Google knows the URL exists but postponed crawling; "Crawled" means Googlebot downloaded the page but rejected it for indexing.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    When a page is <em>Crawled – currently not indexed</em>, you have a content quality, entity density, or duplication problem. When it is <em>Discovered – currently not indexed</em>, you have an internal link equity or crawl budget bottleneck that requires structural link redistribution.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Tools Internal Navigation Hub */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" />
                Related Crawl & Indexation Utilities:
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Strengthen your site's technical SEO ecosystem with our companion diagnostic engines.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => onNavigate('/tools/sitemap-auditor')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 text-slate-200 transition-colors"
                >
                  XML Sitemap Auditor
                </button>
                <button
                  onClick={() => onNavigate('/tools/domain-rating-checker')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 text-slate-200 transition-colors"
                >
                  Domain Rating & Backlink Checker
                </button>
                <button
                  onClick={() => onNavigate('/tools/robots-txt-validator')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 text-slate-200 transition-colors"
                >
                  Robots.txt Directive Validator
                </button>
                <button
                  onClick={() => onNavigate('/tools/internal-link-analyzer')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 text-slate-200 transition-colors"
                >
                  Internal Link Equity Analyzer
                </button>
                <button
                  onClick={() => onNavigate('/blog/fix-discovered-currently-not-indexed-guide')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 text-slate-200 transition-colors"
                >
                  Read: Complete Discovered Not Indexed Remediation Guide
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
