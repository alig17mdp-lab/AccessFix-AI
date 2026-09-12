import React, { useState } from 'react';
import {
  FileCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Zap,
  ArrowRight,
  Terminal,
  Bot,
  Search,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  Shield,
  Gauge,
  Layers,
  Code2,
  ExternalLink,
  Cpu,
  Server,
  Lock,
} from 'lucide-react';
import {
  RobotsValidationReport,
  PathTestResult,
  BotCategory,
} from '../types/robotsValidator';
import {
  validateRobotsTxt,
  testPathAgainstRobots,
  ROBOTS_PRESET_SCENARIOS,
  MONITORED_BOTS,
} from '../utils/robotsValidatorEngine';

interface RobotsTxtValidatorProps {
  onNavigate: (route: string) => void;
}

export const RobotsTxtValidator: React.FC<RobotsTxtValidatorProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'cloudflare' | 'gbot_limits'>('simulator');
  const [content, setContent] = useState<string>(ROBOTS_PRESET_SCENARIOS[0].content);
  const [testUrlPath, setTestUrlPath] = useState<string>('/blog/sample-post');
  const [selectedBot, setSelectedBot] = useState<string>('Googlebot');
  const [botFilter, setBotFilter] = useState<'all' | 'ai_scraper' | 'ai_search_retriever' | 'search'>('all');
  const [testResult, setTestResult] = useState<PathTestResult | null>(() =>
    testPathAgainstRobots('/blog/sample-post', 'Googlebot', ROBOTS_PRESET_SCENARIOS[0].content)
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active validation report
  const [report, setReport] = useState<RobotsValidationReport>(() =>
    validateRobotsTxt(ROBOTS_PRESET_SCENARIOS[0].content)
  );

  const handleValidate = (newText: string) => {
    setContent(newText);
    const newReport = validateRobotsTxt(newText);
    setReport(newReport);
    if (testUrlPath) {
      setTestResult(testPathAgainstRobots(testUrlPath, selectedBot, newText));
    }
  };

  const handleTestPath = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testUrlPath.trim()) return;
    const res = testPathAgainstRobots(testUrlPath, selectedBot, content);
    setTestResult(res);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadRobotsFile = () => {
    const blob = new Blob([report.repairedRobotsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredBots = report.botsStatus.filter((b) => {
    if (botFilter === 'all') return true;
    return b.category === botFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Schema Markup for SoftwareApplication & FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'AI Crawler Validator & Access Checker (Robots.txt Simulator)',
                alternateName: 'Free AI Crawler Checker & Crawlability Validator',
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'All',
                description:
                  'Free online AI crawler checker, crawlability validator, and robots.txt simulator. Audit bot access for GPTBot, ClaudeBot, PerplexityBot, and Googlebot. Test raw HTML execution, Cloudflare AI rules, and G-bot limits.',
                offers: {
                  '@type': 'Offer',
                  price: '0.00',
                  priceCurrency: 'USD',
                },
              },
              {
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'What does an AI crawlability checker do?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'An AI crawlability checker analyzes robots.txt exclusion rules, inspects HTTP response headers, and simulates whether AI crawlers can access raw HTML without JavaScript rendering blocks.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do I check if AI crawlers can access my website?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Paste your robots.txt directives into the AccessFix AI Crawler Checker to simulate bot-by-bot permissions across 16 major AI scrapers and search engines.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How to block AI crawlers in Cloudflare?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Enable Cloudflare’s "Block AI Scrapers and Crawlers" toggle in Security Settings, or create a custom WAF firewall rule targeting specific AI bot user-agents.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is the difference between GPTBot, ChatGPT-User, and OAI-SearchBot?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'GPTBot scrapes training data, ChatGPT-User executes live user-prompt browsing, and OAI-SearchBot indexes web pages for SearchGPT conversational citations.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is a G bot limit checker?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'A G bot limit checker monitors Googlebot’s crawl capacity, host server load limits, and HTTP 429/503 responses, ensuring Google crawls pages without overloading your server.',
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />

      {/* Hero Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              AI Crawler Access Checker & Robots.txt Simulator
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              2026 AI Search & Googlebot Specification (RFC 9309)
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            AI Crawler Validator & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">Crawlability Checker</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-6">
            Free diagnostic tool to inspect website crawlability, validate <code className="text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded">robots.txt</code> syntax, govern 16 AI crawler bots (including OpenAI GPTBot, ClaudeBot, and Perplexity), test raw HTML vs JavaScript rendering, and configure Cloudflare WAF bot defense.
          </p>

          {/* Sub-tool Tab Switcher */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Crawler & Robots.txt Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('cloudflare')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'cloudflare'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Cloudflare AI Bot Rules Generator</span>
            </button>

            <button
              onClick={() => setActiveTab('gbot_limits')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gbot_limits'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>G-Bot Limit & Crawl Rate Diagnostic</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Interactive Tool Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: AI CRAWLER & ROBOTS.TXT SIMULATOR */}
        {activeTab === 'simulator' && (
          <>
            {/* Preset Scenarios */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 mb-6">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Crawler Governance Presets:</span>
                </div>
                <span className="text-[11px] text-slate-500 font-normal">Click any preset to load & simulate</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {ROBOTS_PRESET_SCENARIOS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleValidate(preset.content)}
                    className="text-left p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all text-xs group cursor-pointer"
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

            {/* Editor & Live Simulation Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Left Column: Code Editor */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-slate-200">
                      robots.txt Directives ({report.totalLines} lines)
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(content, 'copy_input')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'copy_input' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy Directives</span>
                  </button>
                </div>

                <textarea
                  value={content}
                  onChange={(e) => handleValidate(e.target.value)}
                  rows={15}
                  className="w-full flex-1 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
                  placeholder="User-agent: *&#10;Disallow: /admin/"
                />

                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <span>Supports RFC 9309 rules, wildcards (* and $)</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Real-Time Live Validation
                  </span>
                </div>
              </div>

              {/* Right Column: Live Safety & AI Visibility Scorecards */}
              <div className="lg:col-span-5 space-y-4">
                {/* 3-Metric Scorecard */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Crawlability & AI Governance Scores
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center border-b border-slate-800 pb-4 mb-4">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Search Safety</div>
                      <div
                        className={`text-2xl font-black ${
                          report.safetyScore >= 80
                            ? 'text-emerald-400'
                            : report.safetyScore >= 50
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {report.safetyScore}%
                      </div>
                      <div className="text-[9px] text-slate-500 mt-0.5">RFC 9309 Rules</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">AI Visibility</div>
                      <div
                        className={`text-2xl font-black ${
                          report.aiVisibilityScore >= 80
                            ? 'text-sky-400'
                            : report.aiVisibilityScore >= 50
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {report.aiVisibilityScore}%
                      </div>
                      <div className="text-[9px] text-slate-500 mt-0.5">Search Citations</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Scraper Block</div>
                      <div className="text-2xl font-black text-indigo-400">
                        {report.aiScraperBlockRate}%
                      </div>
                      <div className="text-[9px] text-slate-500 mt-0.5">Training Opt-out</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed mb-3">
                    {report.safetyScore >= 80
                      ? 'Safe configuration: Googlebot & search spiders enjoy full crawl access without rendering locks.'
                      : report.safetyScore >= 50
                      ? 'Warning: direct render-blocking or sitemap syntax errors detected.'
                      : 'Critical Danger: Your directives could cause site-wide de-indexation!'}
                  </div>

                  {/* Critical Asset Indicators */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div
                      className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                        report.criticalAssetBlocking.cssBlocked
                          ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      {report.criticalAssetBlocking.cssBlocked ? (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span>CSS Styles: {report.criticalAssetBlocking.cssBlocked ? 'Blocked' : 'Open'}</span>
                    </div>

                    <div
                      className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                        report.criticalAssetBlocking.jsBlocked
                          ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      {report.criticalAssetBlocking.jsBlocked ? (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span>JavaScript: {report.criticalAssetBlocking.jsBlocked ? 'Blocked' : 'Open'}</span>
                    </div>
                  </div>
                </div>

                {/* Path Tester Sub-Widget with Execution Profile Simulation */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-indigo-400" />
                      <span>Live Path Access Simulator</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Simulate Bot Behavior</span>
                  </div>

                  <form onSubmit={handleTestPath} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={selectedBot}
                        onChange={(e) => {
                          setSelectedBot(e.target.value);
                          setTestResult(testPathAgainstRobots(testUrlPath, e.target.value, content));
                        }}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <optgroup label="Search Engine Bots">
                          <option value="Googlebot">Googlebot (Search)</option>
                          <option value="Bingbot">Bingbot (Search & Copilot)</option>
                          <option value="DuckDuckBot">DuckDuckBot</option>
                        </optgroup>
                        <optgroup label="AI Real-Time Search & Citations">
                          <option value="PerplexityBot">PerplexityBot (Search)</option>
                          <option value="ChatGPT-User">ChatGPT-User (Live Browse)</option>
                          <option value="OAI-SearchBot">OAI-SearchBot (SearchGPT)</option>
                          <option value="Claude-Web">Claude-Web</option>
                        </optgroup>
                        <optgroup label="AI Model Training Scrapers">
                          <option value="GPTBot">GPTBot (OpenAI Training)</option>
                          <option value="ClaudeBot">ClaudeBot (Anthropic)</option>
                          <option value="CCBot">CCBot (Common Crawl)</option>
                          <option value="Google-Extended">Google-Extended (Gemini)</option>
                          <option value="Bytespider">Bytespider (TikTok AI)</option>
                          <option value="Meta-ExternalAgent">Meta-ExternalAgent</option>
                          <option value="Amazonbot">Amazonbot (Rufus AI)</option>
                        </optgroup>
                      </select>

                      <input
                        type="text"
                        value={testUrlPath}
                        onChange={(e) => setTestUrlPath(e.target.value)}
                        placeholder="/path/to/test"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow cursor-pointer"
                    >
                      Simulate Crawler Response
                    </button>
                  </form>

                  {testResult && (
                    <div className="mt-3.5 space-y-2">
                      <div
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                          testResult.allowed
                            ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                            : 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {testResult.allowed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                          <span className="font-semibold">
                            {testResult.bot} is {testResult.allowed ? 'ALLOWED' : 'BLOCKED'}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] opacity-80 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {testResult.matchedRule}
                        </span>
                      </div>

                      {/* Bot Execution Profile Badge */}
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                        <div className="flex items-center justify-between text-slate-300 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Execution Profile:</span>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-indigo-300 font-mono">
                            {testResult.botExecutionMode}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          {testResult.behaviorNote}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 16-Bot Generative AI & Search Crawler Permission Matrix */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      16-Bot AI Crawler & Search Engine Permission Matrix
                    </h3>
                    <p className="text-xs text-slate-400">
                      Evaluated in real-time under IETF RFC 9309 directive precedence standards
                    </p>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setBotFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      botFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({report.botsStatus.length})
                  </button>
                  <button
                    onClick={() => setBotFilter('ai_scraper')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      botFilter === 'ai_scraper' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Training Scrapers
                  </button>
                  <button
                    onClick={() => setBotFilter('ai_search_retriever')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      botFilter === 'ai_search_retriever' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    AI Search / Citations
                  </button>
                  <button
                    onClick={() => setBotFilter('search')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      botFilter === 'search' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Search Engines
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredBots.map((bot, bIdx) => (
                  <div
                    key={bIdx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5 text-slate-400" />
                          {bot.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                            bot.status === 'allowed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : bot.status === 'disallowed'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {bot.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 leading-relaxed mb-2">
                        <span className="text-slate-300 font-semibold">{bot.organization}</span> • {bot.description}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="capitalize">{bot.botType.replace('_', ' ')}</span>
                      <button
                        onClick={() => {
                          setSelectedBot(bot.name);
                          setTestResult(testPathAgainstRobots(testUrlPath, bot.name, content));
                        }}
                        className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                      >
                        Simulate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues & Remediations */}
            {report.issues.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
                <div className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Detected Syntax & SEO Vulnerabilities ({report.issues.length})</span>
                </div>

                <div className="space-y-3">
                  {report.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-xl border text-xs ${
                        issue.severity === 'critical'
                          ? 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                          : issue.severity === 'warning'
                          ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-sm">{issue.title}</span>
                        <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900">
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-slate-300 mb-2 leading-relaxed">{issue.description}</p>
                      <div className="text-indigo-300 font-medium flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <strong>Suggested Fix:</strong> {issue.suggestedFix}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1-Click Clean Repaired Robots.txt Download */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl mb-12">
              <div>
                <div className="text-sm font-semibold text-white">Generate Validated & Clean Robots.txt</div>
                <div className="text-xs text-slate-400">
                  Download optimized robots.txt adhering to 2026 search engine and AI crawler specifications.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(report.repairedRobotsTxt, 'copy_repaired')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'copy_repaired' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy Clean File</span>
                </button>
                <button
                  onClick={downloadRobotsFile}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download robots.txt</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: CLOUDFLARE & EDGE WAF AI RULES */}
        {activeTab === 'cloudflare' && (
          <div className="space-y-6 mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Cloudflare AI Crawler Protection & WAF Rules
                  </h2>
                  <p className="text-xs text-slate-400">
                    How to block aggressive AI scrapers at the edge before they consume server bandwidth
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-sky-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Method 1: Cloudflare 1-Click AI Scraper Toggle
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Cloudflare provides an automated 1-click toggle called <strong>"Block AI Scrapers and Crawlers"</strong> located under:
                  </p>
                  <div className="p-2 rounded-lg bg-slate-900 text-xs font-mono text-indigo-300">
                    Cloudflare Dashboard → Security → Bots → AI Scrapers & Crawlers
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    When enabled, Cloudflare automatically fingerprints known AI training bots (ByteDance, Anthropic, OpenAI, Meta) and returns an HTTP 403 Forbidden before the request touches your origin server.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-sky-300 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    Method 2: Custom Cloudflare WAF Expression
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    If you want to allow AI search engines (like <strong>SearchGPT</strong> and <strong>Perplexity</strong>) while blocking training crawlers (like <strong>GPTBot</strong> and <strong>Bytespider</strong>), use this custom WAF rule:
                  </p>
                  <div className="relative">
                    <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                      {report.cloudflareWafSnippet}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(report.cloudflareWafSnippet, 'copy_waf')}
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] flex items-center gap-1 hover:text-white cursor-pointer"
                    >
                      {copiedId === 'copy_waf' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy WAF</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Edge vs Robots.txt Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Enforcement Layer</th>
                      <th className="py-2.5 px-3">Bandwidth Cost</th>
                      <th className="py-2.5 px-3">Polite Bot Compliance</th>
                      <th className="py-2.5 px-3">Malicious Scraper Defense</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Cloudflare Edge WAF</td>
                      <td className="py-2.5 px-3 text-emerald-400">0 KB (Blocked at Edge)</td>
                      <td className="py-2.5 px-3">100% Enforced</td>
                      <td className="py-2.5 px-3 text-emerald-400">High (IP/Fingerprint Block)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Robots.txt Directive</td>
                      <td className="py-2.5 px-3 text-amber-400">Origin Server Request Hits</td>
                      <td className="py-2.5 px-3">100% Compliant (RFC 9309)</td>
                      <td className="py-2.5 px-3 text-rose-400">Ignored by Rogue Scrapers</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: G-BOT LIMIT & CRAWL BUDGET DIAGNOSTIC */}
        {activeTab === 'gbot_limits' && (
          <div className="space-y-6 mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    G-Bot Limit Checker & Crawl Rate Architecture
                  </h2>
                  <p className="text-xs text-slate-400">
                    How Googlebot calculates host load capacity, crawl demand, and crawl rate thresholds
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pillar 1</div>
                  <div className="text-sm font-bold text-emerald-400 mb-2">Crawl Rate Limit (Host Load)</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Googlebot monitors your server response time (TTFB). If your server responds in &lt;200ms, Googlebot increases parallel connections. If 503 or 429 errors spike, Googlebot immediately throttles crawl speed.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pillar 2</div>
                  <div className="text-sm font-bold text-indigo-400 mb-2">Crawl Demand (URL Value)</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Even with unlimited host capacity, Google will not crawl your site if pages lack internal links or popularity. High crawl demand requires fresh sitemaps, internal links, and high user query volume.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pillar 3</div>
                  <div className="text-sm font-bold text-amber-400 mb-2">Crawl-Delay Directive Rule</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong>Googlebot ignores the Crawl-delay directive</strong> in robots.txt. Bingbot and Yandex respect it, but Googlebot only adjusts crawl limits via Google Search Console settings and automated server latency feedback.
                  </p>
                </div>
              </div>

              {/* Actionable Health Checklist */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Checklist: Optimizing Your Website for Googlebot & AI Crawl Limits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Eliminate HTTP 429 (Too Many Requests) & 503 errors</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Disallow infinite URL loops (e.g. dynamic faceted filters)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Ensure XML Sitemap contains only canonical 200 OK URLs</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Review Google Search Console → Settings → Crawl Stats report</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dual Search Intent Viewport Architecture - SEO & Educational Content */}
        <section className="pt-10 border-t border-slate-800 text-slate-300">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Section 1: What an AI Crawlability Checker Does */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                What an AI Crawlability Checker Does: 3 Core Technical Pillars
              </h2>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base mb-4">
                An <strong>AI crawlability checker</strong> audits how modern automated bots (such as OpenAI's GPTBot, Anthropic's ClaudeBot, PerplexityBot, and Googlebot) discover, parse, and evaluate your web application. Unlike legacy SEO checkers that only test desktop HTML, a modern AI crawler validator executes three essential diagnostic pillars:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2 text-indigo-400">
                    1. Analyzes robots.txt Directives
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Checks if your site blocks specific AI user-agents through exclusion rules. Verifies RFC 9309 directive specificity so you don't accidentally block Google while attempting to block training scrapers.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2 text-sky-400">
                    2. Simulates Bot Execution Profiles
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Tests how a page loads without executing JavaScript, mimicking how many AI crawlers fetch raw HTML. Compares this with Googlebot's headless Chromium Web Rendering Service (WRS).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2 text-emerald-400">
                    3. Inspects Meta Tags & Response Headers
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Identifies indexability hurdles like <code className="text-slate-300">noindex</code> tags, <code className="text-slate-300">X-Robots-Tag</code> headers, or edge firewall blocks that silently prevent generative AI citations.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: AI Crawler Taxonomy */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                The 2026 AI Crawler Directory: Training Scrapers vs Search Retrievers
              </h2>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base mb-4">
                Not all AI bots are identical. Modern digital strategy requires distinguishing between <strong>model training scrapers</strong> (which harvest content for foundation models without sending traffic) and <strong>real-time search answer retrievers</strong> (which power SearchGPT, Perplexity, and Google AI Overviews):
              </p>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-950">
                      <th className="py-3 px-4">Crawler User-Agent</th>
                      <th className="py-3 px-4">Operator</th>
                      <th className="py-3 px-4">Primary Purpose</th>
                      <th className="py-3 px-4">Drives Referral Traffic?</th>
                      <th className="py-3 px-4">Recommended Policy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-300">GPTBot</td>
                      <td className="py-3 px-4">OpenAI</td>
                      <td className="py-3 px-4">Foundation model training (GPT-4o)</td>
                      <td className="py-3 px-4 text-rose-400">No</td>
                      <td className="py-3 px-4 font-semibold text-amber-300">Disallow (if desired)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-sky-300">OAI-SearchBot</td>
                      <td className="py-3 px-4">OpenAI</td>
                      <td className="py-3 px-4">SearchGPT web search indexing</td>
                      <td className="py-3 px-4 text-emerald-400">Yes (Direct Citations)</td>
                      <td className="py-3 px-4 font-semibold text-emerald-400">Keep ALLOWED</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-300">ClaudeBot</td>
                      <td className="py-3 px-4">Anthropic</td>
                      <td className="py-3 px-4">Claude 3.5 Sonnet training data</td>
                      <td className="py-3 px-4 text-rose-400">No</td>
                      <td className="py-3 px-4 font-semibold text-amber-300">Disallow (if desired)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-sky-300">PerplexityBot</td>
                      <td className="py-3 px-4">Perplexity AI</td>
                      <td className="py-3 px-4">Conversational search answers</td>
                      <td className="py-3 px-4 text-emerald-400">Yes (Primary Source Citations)</td>
                      <td className="py-3 px-4 font-semibold text-emerald-400">Keep ALLOWED</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-rose-300">Bytespider</td>
                      <td className="py-3 px-4">ByteDance</td>
                      <td className="py-3 px-4">TikTok AI & Doubao LLM scraper</td>
                      <td className="py-3 px-4 text-rose-400">No</td>
                      <td className="py-3 px-4 font-semibold text-rose-400">Block in WAF / Disallow</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-300">Googlebot</td>
                      <td className="py-3 px-4">Google</td>
                      <td className="py-3 px-4">Core Search & AI Overviews</td>
                      <td className="py-3 px-4 text-emerald-400">Yes (Massive Organic Volume)</td>
                      <td className="py-3 px-4 font-semibold text-emerald-400">MANDATORY ALLOW</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Snippet-Ready FAQs */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Frequently Asked Questions About AI Crawlers, Access Checkers & Robots.txt
              </h2>

              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    What does an AI crawlability checker do?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    An AI crawlability checker analyzes robots.txt rules, inspects HTTP response headers, and tests whether AI bots can access raw HTML without JavaScript rendering blocks.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    It verifies that your web infrastructure permits real-time answer engines to cite your brand while confirming that training scrapers are restricted according to your intellectual property preferences.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    How do I check if AI crawlers can access my website (AI crawler access checker)?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    Paste your domain or robots.txt directives into the AccessFix AI Crawler Access Checker to simulate bot-by-bot permissions across 16 major AI scrapers and search engines.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Our real-time engine maps your exclusion paths against IETF RFC 9309 rules, displaying whether each crawler is allowed, blocked, or partially restricted.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    How to block AI crawlers in Cloudflare (AI crawler Cloudflare)?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    Enable Cloudflare’s "Block AI Scrapers and Crawlers" toggle in Security Settings, or create a custom WAF firewall rule targeting specific AI bot user-agents.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Cloudflare’s edge firewall drops AI scraper connections immediately, saving server bandwidth and preventing automated model harvesting before requests reach your hosting server.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    What is the OpenAI crawler and how do you control it?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    OpenAI operates three distinct crawlers: GPTBot for LLM model training, ChatGPT-User for live user-prompt browsing, and OAI-SearchBot for SearchGPT web indexing.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    To preserve citations in SearchGPT while blocking training data harvesting, declare <code className="text-slate-300">User-agent: GPTBot Disallow: /</code> while allowing <code className="text-slate-300">User-agent: OAI-SearchBot Allow: /</code>.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    What is a G bot limit checker and how does Google manage crawl limits?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    A G bot limit checker monitors Googlebot’s crawl capacity, host server load limits, and HTTP 429/503 responses, ensuring Google crawls pages without overloading your server.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Remember that Googlebot completely ignores <code className="text-slate-300">Crawl-delay</code> in robots.txt. If your server is strained, optimize TTFB under 200ms or calibrate crawl rate settings directly in Google Search Console.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    Can I test AI crawler permissions for free with GitHub open-source scripts?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    Yes, open-source Python and Node.js crawlers on GitHub allow custom URL parsing, while AccessFix provides a 100% free web-based validator without requiring local installation.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Using our web validator eliminates dependency maintenance, provides live RFC 9309 rule precedence parsing, and instantly generates clean production robots.txt files.
                  </p>
                </div>
              </div>
            </div>

            {/* Cross-tool Navigation Hub */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Ready to Diagnose Your Entire Crawl Architecture?
                </h3>
                <p className="text-xs text-slate-400">
                  Combine robots.txt validation with our GSC Indexation Fixer and XML Sitemap Auditor.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('/tools/indexation-fixer')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer shadow"
                >
                  GSC Indexation Fixer
                </button>
                <button
                  onClick={() => onNavigate('/tools/sitemap-auditor')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer border border-slate-700"
                >
                  Sitemap Auditor
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

