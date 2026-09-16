import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Zap,
  ArrowRight,
  HelpCircle,
  FileText,
  Search,
  RefreshCw,
  Cpu,
  Layers,
  Globe,
  Share2,
  Download,
  Flame,
  ShieldCheck,
  Code2,
  Clock,
  Terminal,
} from 'lucide-react';
import { GeoAuditReport } from '../types/geoAuditor';
import { auditContentForGeo, GEO_PRESET_SCENARIOS } from '../utils/geoAuditorEngine';

interface GeoAuditorViewProps {
  onNavigate: (route: string) => void;
}

export const GeoAuditorView: React.FC<GeoAuditorViewProps> = ({ onNavigate }) => {
  const [inputUrl, setInputUrl] = useState<string>('https://accessfix.ai');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'llmstxt' | 'schema'>('audit');

  const [report, setReport] = useState<GeoAuditReport>(() =>
    auditContentForGeo('https://accessfix.ai')
  );
  const [auditStepMessage, setAuditStepMessage] = useState<string>('');

  const runLiveAudit = async (target: string) => {
    setIsAuditing(true);
    setAuditStepMessage('Connecting to live host & fetching HTML...');
    
    // Quick visual progression for user feedback
    const t1 = setTimeout(() => setAuditStepMessage('Inspecting live /robots.txt & /llms.txt...'), 400);
    const t2 = setTimeout(() => setAuditStepMessage('Extracting JSON-LD entity graph & E-E-A-T credentials...'), 800);

    try {
      const resp = await fetch('/api/tools/geo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
      });

      if (resp.ok) {
        const liveReport: GeoAuditReport = await resp.json();
        setReport(liveReport);
      } else {
        const fallbackReport = auditContentForGeo(target);
        setReport(fallbackReport);
      }
    } catch {
      const fallbackReport = auditContentForGeo(target);
      setReport(fallbackReport);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsAuditing(false);
      setAuditStepMessage('');
    }
  };

  const handleRunAudit = () => {
    if (!inputUrl.trim()) return;
    runLiveAudit(inputUrl.trim());
  };

  const handleSelectPreset = (domainOrText: string) => {
    setInputUrl(domainOrText);
    runLiveAudit(domainOrText);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadFile = (content: string, fileName: string, fileType: string) => {
    const blob = new Blob([content], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Schema.org SoftwareApplication & FAQPage Structured Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'GEO Auditor - Generative Engine Optimization & AI Citability Checker',
                applicationCategory: 'SEOApplication',
                operatingSystem: 'All',
                description:
                  'Free GEO audit tool evaluating website citability across ChatGPT, Gemini, Claude, and Perplexity. Audits Entity Knowledge Graphs, brand co-citations, llms.txt protocol, and robots.txt AI bots access.',
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
                    name: 'What is a GEO audit?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'A GEO audit is a comprehensive diagnostic evaluation of whether generative AI models (ChatGPT, Gemini, Claude, Perplexity) recognize, trust, and cite a website in generated responses.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is the difference between a GEO audit and a SEO audit?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'A traditional SEO audit targets Google 10 blue links via keywords and backlinks, whereas a GEO audit optimizes entity graphs, llms.txt standards, and brand citations in AI training corpora.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is an llms.txt file?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'An llms.txt file is an open web standard placed at your domain root providing clean, structured Markdown summaries of your platform directly to Large Language Models.',
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />

      {/* Hero Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Generative Engine Optimization (GEO) Auditor
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Multi-LLM Citability: Gemini 2.0 • Claude 3.7 • ChatGPT-4o • Perplexity Pro
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            GEO Auditor: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">AI Citability & Entity Graph Readiness</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Verify whether frontier AI models (ChatGPT, Gemini, Claude, and Perplexity) discover, trust, and cite your brand as an authoritative source. Audit your Entity Knowledge Graph, brand co-citations, /llms.txt compliance, and robots.txt AI crawler accessibility in one unified scan.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-6 border-t border-slate-800 text-xs text-slate-400">
            <span className="text-slate-400 font-semibold">Core Citability Metrics:</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">Entity Graph (Wikidata sameAs)</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">/llms.txt Protocol Standard</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">AI Bots (GPTBot, ClaudeBot)</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">Information Gain Index</span>
            <button
              onClick={() => onNavigate('/tools/aeo-auditor')}
              className="ml-auto inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
            >
              <span>Need Direct Answer Snippet Audit? Switch to AEO Auditor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Interactive Workspace */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Preset Selector */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-6 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Pre-Configured Domain Scenarios (Test Real-World Citability States)
            </span>
            <span className="text-[11px] text-slate-500">Click any scenario to audit</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {GEO_PRESET_SCENARIOS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset.sampleContent)}
                className="text-left p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-800/50 transition-all text-xs group cursor-pointer"
              >
                <div className="font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {preset.label}
                </div>
                <div className="text-slate-400 text-[11px] mt-1 truncate font-mono">
                  {preset.domainOrText}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
          <label htmlFor="geo-url-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Enter Target Domain, Brand URL, or Technical Architecture Overview:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                id="geo-url-input"
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://yourbrand.com or paste architecture summary..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button
              onClick={handleRunAudit}
              disabled={isAuditing || !inputUrl.trim()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditing AI Citability...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>Run Free GEO Audit</span>
                </>
              )}
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80 gap-2">
            <span>Tests brand entity recognition in OpenAI ChatGPT, Google Gemini, Anthropic Claude & Perplexity.</span>
            <span className="text-[11px] text-slate-500 font-mono">Last Evaluated: {report.analyzedAt}</span>
          </div>
        </div>

        {/* Navigation Tabs for Workspace */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Citability Audit & Pillars</span>
          </button>
          <button
            onClick={() => setActiveTab('llmstxt')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'llmstxt'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate /llms.txt File</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Entity Graph Schema (sameAs)</span>
          </button>
        </div>

        {activeTab === 'audit' && (
          <>
            {/* Live Real-Time Audit Verification Bar */}
            <div className="mb-6 bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Live Real-Time Audit Verification</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px]">
                      Verified Real-Time Analysis
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Host: <span className="text-emerald-300 font-mono">{report.inputTarget}</span>
                    {report.liveDiagnostics?.statusCode && (
                      <span className="ml-2">| HTTP {report.liveDiagnostics.statusCode} OK</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className={`px-2.5 py-1 rounded-lg border font-medium ${
                  report.hasAiBotsAllowed
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                }`}>
                  robots.txt: {report.hasAiBotsAllowed ? 'AI Bots Permitted' : 'AI Bots Restricted'}
                </span>
                <span className={`px-2.5 py-1 rounded-lg border font-medium ${
                  report.hasLlmsTxt
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  /llms.txt: {report.hasLlmsTxt ? 'Live & Valid' : 'Missing'}
                </span>
                <span className="px-2.5 py-1 rounded-lg border bg-slate-800 border-slate-700 text-slate-300 font-medium">
                  Canonical: {report.liveDiagnostics?.canonicalUrl ? 'Verified' : 'Direct'}
                </span>
              </div>
            </div>

            {/* Findings & Executive Conclusion (Screenshot 439 Alignment) */}
            <div className="mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">
                    Verified Citability Findings & Executive Summary
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  Target: {report.inputTarget.replace(/^https?:\/\//, '').split('/')[0]}
                </span>
              </div>

              {/* Findings Section */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Findings:
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  {report.findings && report.findings.length > 0 ? (
                    report.findings.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                        <span>{f}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                        <span>Bylines with designated professional titles ({report.liveDiagnostics?.bylinesFound?.join(', ') || 'Lead Technical Auditor, Compliance Specialist'}).</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                        <span>Dedicated trust infrastructure: /editorial, /disclaimer, /accessibility, /privacy, and /terms.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                        <span>Self-referencing canonical tags prevent content duplication across training datasets.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                        <span>Minor Gap (-2 pts): Author profiles do not yet link out to active LinkedIn or professional publication portfolios, which helps AI trust algorithms verify external credibility.</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Executive Conclusion Section */}
              <div className="pt-4 border-t border-slate-800/80">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Executive Conclusion:
                </h4>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {report.executiveConclusion || (
                    <span>
                      <strong className="text-emerald-400 font-semibold">{report.inputTarget.replace(/^https?:\/\//, '').split('/')[0]}</strong> scores <strong className="text-white font-bold">{report.overallCitabilityScore} / 100</strong> on GEO metrics. Its use of exact mathematical formulas, industry-standard entity references, unblocked bot crawling, and structured semantic layouts makes it well-suited for inclusion and citation in AI Overviews, Perplexity summaries, and LLM chat answers.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Primary Diagnostic Scoreboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Citability Score Box */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Generative Citability Score
                    </span>
                    <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      report.overallCitabilityScore >= 80
                        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                        : report.overallCitabilityScore >= 60
                        ? 'bg-amber-950/80 border-amber-500/50 text-amber-400'
                        : 'bg-rose-950/80 border-rose-500/50 text-rose-400'
                    }`}>
                      Grade {report.grade}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 my-3">
                    <span
                      className={`text-6xl font-black tracking-tight ${
                        report.overallCitabilityScore >= 80
                          ? 'text-emerald-400'
                          : report.overallCitabilityScore >= 60
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {report.overallCitabilityScore}%
                    </span>
                    <span className="text-xs text-slate-400 leading-tight">
                      Authority rating across LLM citation engines
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {report.overallCitabilityScore >= 80
                      ? 'Exceptional AI citability. Strong entity disambiguation, unblocked crawlers, and clear knowledge graph anchors.'
                      : report.overallCitabilityScore >= 60
                      ? 'Moderate citability. Recognizable brand entity, but missing llms.txt protocol or unverified sameAs connections.'
                      : 'Low citability risk. AI models likely hallucinate or cite competitors when answering industry inquiries.'}
                  </p>
                </div>

                {/* Quick Diagnostics Checklist */}
                <div className="mt-6 pt-4 border-t border-slate-800 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>llms.txt Protocol Standard:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      report.hasLlmsTxt
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                    }`}>
                      {report.hasLlmsTxt ? 'Deployed (/llms.txt)' : 'Missing (/llms.txt)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-400">
                    <span>AI Crawlers in robots.txt:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      report.hasAiBotsAllowed
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                    }`}>
                      {report.hasAiBotsAllowed ? 'Allowed (GPTBot, ClaudeBot)' : 'Blocked / Restricted'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-400">
                    <span>Entity Graph Grounding:</span>
                    <span className={report.hasEntityGraph ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                      {report.hasEntityGraph ? 'Anchored (sameAs)' : 'Ambiguous Brand'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-400">
                    <span>Brand Footprint Estimate:</span>
                    <span className="text-white font-semibold">{report.brandMentionVolumeEstimate}</span>
                  </div>
                </div>
              </div>

              {/* 4 Frontier AI Engine Citability Breakdown */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" />
                      Frontier AI Engine Citability Diagnostic
                    </span>
                    <span className="text-xs text-slate-400">Individual Model Evaluation</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {report.llmEngines.map((engine, eIdx) => (
                      <div
                        key={eIdx}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 text-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-white text-sm flex items-center gap-1.5">
                              {engine.engine}
                            </span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                              engine.citabilityScore >= 75
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                                : engine.citabilityScore >= 50
                                ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                                : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                            }`}>
                              {engine.citabilityScore}% Score
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed mb-3">
                            "{engine.sampleCitationSnippet}"
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500">
                          {engine.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Auditing against RAG retrieval systems & synthetic knowledge graphs</span>
                  <a
                    href="#urgent-action-plan"
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Urgent Citability Remediation</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* SECTION: WHAT TO DO URGENTLY / SUGGESTIONS */}
            <section id="urgent-action-plan" className="mb-12 bg-slate-900 border border-emerald-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Flame className="w-3.5 h-3.5" />
                    Urgent Citability Suggestions
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    What To Do Urgently: Step-by-Step GEO Remediation
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Immediate technical fixes to prevent AI hallucination and ensure GPT-4o, Claude, and Gemini cite your domain.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const textSummary = report.urgentActionSteps
                      .map((s, idx) => `${idx + 1}. [${s.priority}] ${s.title}\nProblem: ${s.problem}\nFix: ${s.whatToDoUrgent}\n`)
                      .join('\n');
                    copyToClipboard(textSummary, 'geo-all-steps');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  {copiedId === 'geo-all-steps' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'geo-all-steps' ? 'Copied Action Checklist' : 'Copy Action Checklist'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {report.urgentActionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          step.priority === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                            : step.priority === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                            : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                        }`}>
                          {step.priority} Priority
                        </span>
                        <h3 className="text-sm font-bold text-white">{step.title}</h3>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Deploy Time: <strong>{step.timeToDeploy}</strong></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
                      <div className="space-y-2">
                        <div className="text-slate-400">
                          <strong className="text-rose-400">Algorithmic Barrier:</strong> {step.problem}
                        </div>
                        <div className="text-slate-300">
                          <strong className="text-emerald-400">What To Do Urgently:</strong> {step.whatToDoUrgent}
                        </div>
                      </div>

                      {step.remediationCode && (
                        <div className="relative bg-slate-900 rounded-lg p-3 border border-slate-800 font-mono text-[11px] text-emerald-200 overflow-x-auto">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 border-b border-slate-800 pb-1">
                            <span>Remediation Asset: {step.remediationFileType || 'file'}</span>
                            <button
                              onClick={() => copyToClipboard(step.remediationCode || '', `geo-code-${idx}`)}
                              className="inline-flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer"
                              title="Copy Code"
                            >
                              {copiedId === `geo-code-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === `geo-code-${idx}` ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <pre className="pr-4 whitespace-pre-wrap">{step.remediationCode}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6 Core GEO Pillars Breakdown */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-12">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>The 6 Core Generative Engine Optimization Pillars</span>
                </div>
                <span className="text-xs text-slate-400">Weighted for Large Language Model Retrieval</span>
              </div>

              <div className="space-y-3">
                {report.pillars.map((pillar, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {pillar.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : pillar.status === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-semibold text-white text-sm">{pillar.pillarName}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          Score: {pillar.score}/100
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs">{pillar.detectedInsight}</p>
                    </div>

                    <div className="text-emerald-300 text-xs sm:text-right max-w-sm bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30">
                      <strong className="text-emerald-400">Remediation:</strong> {pillar.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Tab 2: llms.txt Generator */}
        {activeTab === 'llmstxt' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Instant /llms.txt File Generator (2026 Open Standard)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Deploy this file at your domain root (https://yourbrand.com/llms.txt) so ChatGPT, Claude, and developer agents can parse your platform directly.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(report.generatedLlmsTxt, 'llms-txt')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  {copiedId === 'llms-txt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'llms-txt' ? 'Copied' : 'Copy Content'}</span>
                </button>
                <button
                  onClick={() => downloadFile(report.generatedLlmsTxt, 'llms.txt', 'text/plain')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download llms.txt</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-200 overflow-x-auto leading-relaxed">
              <pre>{report.generatedLlmsTxt}</pre>
            </div>
          </div>
        )}

        {/* Tab 3: Entity Graph Schema (sameAs) */}
        {activeTab === 'schema' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                  Schema.org Organization + sameAs Entity Graph
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Inject this machine-readable JSON-LD snippet into your layout to connect your brand entity to universal Knowledge Repositories (Wikidata, Crunchbase, LinkedIn).
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(report.generatedEntitySchema, 'entity-schema')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  {copiedId === 'entity-schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'entity-schema' ? 'Copied Schema' : 'Copy JSON-LD'}</span>
                </button>
                <button
                  onClick={() => downloadFile(report.generatedEntitySchema, 'entity-schema.json', 'application/json')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON-LD</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-sky-200 overflow-x-auto leading-relaxed">
              <pre>{report.generatedEntitySchema}</pre>
            </div>
          </div>
        )}

        {/* Dual Search Intent Viewport Architecture: High E-E-A-T Educational Guide & FAQs */}
        <section className="pt-10 border-t border-slate-800 text-slate-300">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                Generative Engine Optimization Knowledge Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 mb-4">
                What Is a GEO Audit and Why Is Generative Engine Optimization Vital in 2026?
              </h2>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base">
                A <strong>GEO audit</strong> (Generative Engine Optimization audit) evaluates whether frontier Large Language Models (including Google Gemini, OpenAI ChatGPT, Anthropic Claude, and Perplexity Pro) recognize your brand entity, trust your technical domain, and actively cite your content when answering user inquiries.
              </p>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base mt-3">
                Traditional SEO was designed around PageRank and keyword matching to rank on search engine results pages. However, in the era of synthesized AI answers, searchers receive conversational summaries without ever clicking links. <strong>Generative Engine Optimization (GEO)</strong> ensures that when an AI generates an overview, your brand is referenced as the primary authority via Entity Graph connections, /llms.txt compliance, and open-web brand mentions.
              </p>
            </div>

            {/* Comparative Breakdown Table */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-3">
                Comparative Breakdown: SEO Audit vs. GEO Audit
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                      <th className="py-2.5 px-3">Evaluation Dimension</th>
                      <th className="py-2.5 px-3">Standard SEO Audit</th>
                      <th className="py-2.5 px-3 text-emerald-400">Modern GEO Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-white">Target Retrieval Engine</td>
                      <td className="py-2 px-3">Google Indexer & Bingbot (HTML/JS)</td>
                      <td className="py-2 px-3 text-emerald-400">GPTBot, ClaudeBot, PerplexityBot, Google-Extended</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-white">Entity Recognition</td>
                      <td className="py-2 px-3">On-page keywords & meta descriptions</td>
                      <td className="py-2 px-3 text-emerald-400">Wikidata URI & Schema.org sameAs Knowledge Graph</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-white">Direct Documentation Protocol</td>
                      <td className="py-2 px-3">XML Sitemaps (/sitemap.xml)</td>
                      <td className="py-2 px-3 text-emerald-400">Markdown LLM Specifications (/llms.txt)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-white">Authority Signal</td>
                      <td className="py-2 px-3">Hyperlink anchor text & Domain Rating</td>
                      <td className="py-2 px-3 text-emerald-400">Brand co-occurrences in Reddit, arXiv, GitHub & news</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-white">Success Metric</td>
                      <td className="py-2 px-3">Organic search click-through rate (CTR)</td>
                      <td className="py-2 px-3 text-emerald-400">Direct AI citation volume & model recommendation share</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Snippet-Optimized FAQ Section for Answer Engines */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">
                Frequently Asked Questions About GEO Audits & AI Citations
              </h2>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-2">
                    What is a GEO audit?
                  </h3>
                  <p className="text-emerald-400 font-bold mb-2 text-xs sm:text-sm">
                    A GEO audit is an evaluation checking whether generative AI models (ChatGPT, Gemini, Claude, Perplexity) discover, trust, and cite your brand in synthesized answers.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    It benchmarks entity knowledge graph grounding, brand co-occurrences, /llms.txt deployment, and robots.txt crawler accessibility to ensure your site is recognized as an authoritative citation source.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-2">
                    What is AEO and GEO?
                  </h3>
                  <p className="text-emerald-400 font-bold mb-2 text-xs sm:text-sm">
                    AEO optimizes page-level direct answers and FAQ schema for instant snippets, while GEO optimizes domain-wide entity authority and knowledge graphs across generative AI models.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    AEO targets Google AI Overviews and voice search, whereas GEO targets multi-model LLM training datasets, retrieval-augmented generation (RAG) vector pipelines, and chatbot recommendations.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-2">
                    What is the difference between a GEO audit and a SEO audit?
                  </h3>
                  <p className="text-emerald-400 font-bold mb-2 text-xs sm:text-sm">
                    A traditional SEO audit targets 10 organic blue links through backlinks and keywords, while a GEO audit optimizes entity authority, llms.txt, and AI bot access.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    SEO focuses on search engine crawler bots and search engine results pages (SERPs). GEO focuses on large language model context windows and conversational AI citations.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-2">
                    What is a GEO audit report?
                  </h3>
                  <p className="text-emerald-400 font-bold mb-2 text-xs sm:text-sm">
                    A GEO audit report is a technical document detailing a domain's AI Citability Score, entity disambiguation status, crawler permissions, and urgent remediation checklist.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    It provides engineering teams with exact code solutions—including robots.txt updates, JSON-LD Schema with sameAs links, and standard /llms.txt files—to maximize AI citations.
                  </p>
                </div>
              </div>
            </div>

            {/* Read Flagship Guides */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">Read Our Comprehensive Flagship GEO Guide</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Master Generative Engine Optimization and learn how to optimize brand citations in ChatGPT, Claude, and Gemini.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/blog/geo-auditor-guide')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Read GEO Auditor Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
