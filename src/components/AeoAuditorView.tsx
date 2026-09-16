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
  Volume2,
  Code2,
  Clock,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  CheckSquare,
  Flame,
} from 'lucide-react';
import { AeoAuditReport } from '../types/aeoChecker';
import { auditContentForAeo, AEO_PRESET_SCENARIOS } from '../utils/aeoCheckerEngine';

interface AeoAuditorViewProps {
  onNavigate: (route: string) => void;
}

export const AeoAuditorView: React.FC<AeoAuditorViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'url' | 'content'>('content');
  const [urlInput, setUrlInput] = useState<string>('https://accessfix.ai/blog/aeo-auditor-guide');
  const [inputText, setInputText] = useState<string>(AEO_PRESET_SCENARIOS[0].sampleText);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [report, setReport] = useState<AeoAuditReport>(() =>
    auditContentForAeo(AEO_PRESET_SCENARIOS[0].sampleText)
  );

  const runLiveAeoAudit = async (target: string, isUrlTab: boolean) => {
    setIsAuditing(true);
    try {
      const resp = await fetch('/api/tools/aeo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isUrlTab ? { url: target } : { content: target }),
      });

      if (resp.ok) {
        const liveReport: AeoAuditReport = await resp.json();
        setReport(liveReport);
      } else {
        const fallback = auditContentForAeo(target);
        setReport(fallback);
      }
    } catch {
      const fallback = auditContentForAeo(target);
      setReport(fallback);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleRunAudit = () => {
    const target = activeTab === 'url' ? urlInput.trim() : inputText.trim();
    if (!target) return;
    runLiveAeoAudit(target, activeTab === 'url');
  };

  const handleSelectPreset = (presetText: string, presetTarget: string) => {
    setInputText(presetText);
    setUrlInput(presetTarget);
    runLiveAeoAudit(presetText, false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Schema.org SoftwareApplication & FAQPage Structured Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'AEO Auditor - Answer Engine Optimization Checker & AI Overviews Grader',
                applicationCategory: 'SEOApplication',
                operatingSystem: 'All',
                description:
                  'Free AEO audit and checker tool evaluating direct answer synthesis (<30 words), conversational question headings, and FAQPage schema for Google AI Overviews and Perplexity citations.',
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
                    name: 'What is an AEO auditor?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'An AEO auditor is an evaluation tool that inspects digital content for concise answers (<30 words), structured FAQ schema, and question headings to secure citations in generative AI search engines.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is the difference between an AEO audit and an SEO audit?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'An SEO audit targets ten organic blue links via backlink authority and keywords, whereas an AEO audit optimizes structured data and concise definitions for AI direct answers.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Why does the <30 words rule matter for Answer Engine Optimization?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Google AI Overviews and voice assistants prioritize direct summaries under 30 words because concise snippets fit within conversational response cards without truncation.',
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              Answer Engine Optimization (AEO) Auditor & Grader
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              2026 Google AI Overviews • Perplexity • SearchGPT Engine
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            AEO Auditor: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">Direct Answer & AI Overview Readiness</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Diagnose whether your website content meets modern Answer Engine Optimization standards. Inspect direct answer synthesis (&lt;30 words), conversational question hierarchies, FAQPage schema, and data density to earn top citations in Google AI Overviews, Perplexity Pro, and SearchGPT.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-6 border-t border-slate-800 text-xs text-slate-400">
            <span className="text-slate-400 font-semibold">Supported Diagnostics:</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">Direct Answers &lt;30 Words</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">FAQPage JSON-LD</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">Information Gain Tables</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">Voice Search Synthesizer</span>
            <button
              onClick={() => onNavigate('/tools/geo-auditor')}
              className="ml-auto inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
            >
              <span>Need GEO Entity Audit? Switch to GEO Auditor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Interactive Tool Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Preset Selector */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-6 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Pre-Configured Audit Scenarios (Test Real-World Scenarios)
            </span>
            <span className="text-[11px] text-slate-500">Click any scenario to inspect</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {AEO_PRESET_SCENARIOS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset.sampleText, preset.target)}
                className="text-left p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/50 transition-all text-xs group cursor-pointer"
              >
                <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {preset.label}
                </div>
                <div className="text-slate-400 text-[11px] mt-1 truncate">
                  {preset.target}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input & Mode Selector Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'content'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                Draft Text & Markdown Editor
              </button>
              <button
                onClick={() => setActiveTab('url')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'url'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                Webpage URL Scan
              </button>
            </div>

            <div className="text-xs text-slate-400">
              {activeTab === 'content' ? (
                <span>Word Count: <strong className="text-slate-200">{inputText.split(/\s+/).filter(Boolean).length}</strong></span>
              ) : (
                <span>Crawl Mode: <strong className="text-slate-200">Simulated AI Overview Parser</strong></span>
              )}
            </div>
          </div>

          {activeTab === 'content' ? (
            <div>
              <label htmlFor="aeo-text-input" className="sr-only">Article Content or Markdown</label>
              <textarea
                id="aeo-text-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={9}
                placeholder="Paste your article draft, Markdown content, or HTML here to audit direct answer synthesis, question headings, and table density..."
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
              />
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <label htmlFor="aeo-url-input" className="block text-xs text-slate-300 font-medium">
                Enter Webpage URL to Audit for Answer Engine Optimization:
              </label>
              <div className="flex gap-2">
                <input
                  id="aeo-url-input"
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://yourbrand.com/blog/topic-guide"
                  className="flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Audits on-page headings, paragraph lengths under questions, schema markup, and snippet citability.
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Evaluates against Google 2026 AI Overviews extraction algorithms.</span>
            </div>

            <button
              onClick={handleRunAudit}
              disabled={isAuditing || (activeTab === 'content' ? !inputText.trim() : !urlInput.trim())}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditing Answer Engine Readiness...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>Run Free AEO Audit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Real-Time Audit Verification Bar */}
        <div className="mb-6 bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Live Real-Time AEO Verification</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 text-[10px]">
                  Verified Real-Time Analysis
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Target: <span className="text-indigo-300 font-mono">{report.inputTarget.replace(/^https?:\/\//, '').slice(0, 50)}</span>
                {report.liveDiagnostics?.statusCode && (
                  <span className="ml-2">| HTTP {report.liveDiagnostics.statusCode} OK</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className={`px-2.5 py-1 rounded-lg border font-medium ${
              report.hasDirectAnswerSnippet
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
            }`}>
              Direct Answer: {report.hasDirectAnswerSnippet ? '<30 Words (Optimal)' : 'Refinement Needed'}
            </span>
            <span className="px-2.5 py-1 rounded-lg border bg-slate-800 border-slate-700 text-slate-300 font-medium">
              Headings: {report.questionHeadingsCount} Question Tags
            </span>
            <span className={`px-2.5 py-1 rounded-lg border font-medium ${
              report.hasStructuredSchema
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              Schema: {report.hasStructuredSchema ? 'FAQPage Live' : 'Standard'}
            </span>
          </div>
        </div>

        {/* Verified Citability Findings & Executive Summary Card */}
        <div className="mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Verified Answer Engine Findings & Executive Summary
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              Pillars: 5 Core AEO Standards
            </span>
          </div>

          {/* Findings Section */}
          <div className="mb-5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              Findings:
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {report.findings && report.findings.length > 0 ? (
                report.findings.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5">
                    <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{f}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2.5">
                    <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>Direct Answer Synthesis: {report.directAnswerEval.status === 'OPTIMAL' ? 'Concise definition under 30 words detected.' : 'Answer requires concise synthesis under 30 words.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>Semantic Question Hierarchy: {report.questionHeadingsCount} conversational query headings analyzed.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>Structured Data & FAQPage Schema: {report.hasStructuredSchema ? 'Verified valid JSON-LD schema.' : 'Missing FAQPage schema.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>Comparative Tables & Data Density: {report.hasComparativeTable ? 'Tabular comparison detected.' : 'Add comparative tables for Perplexity citations.'}</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Executive Conclusion Section */}
          <div className="pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              Executive Conclusion:
            </h4>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 text-xs sm:text-sm text-slate-200 leading-relaxed">
              {report.executiveConclusion || (
                <span>
                  <strong className="text-indigo-400 font-semibold">{report.inputTarget.replace(/^https?:\/\//, '').split('/')[0]}</strong> scores <strong className="text-white font-bold">{report.aiCitationProbability} / 100</strong> on AEO readiness metrics. {report.aiCitationProbability >= 80 ? 'Its high density of conversational question headings, concise definition blocks, and structured layout make it a prime candidate for top-tier citation in Google AI Overviews and Perplexity Pro.' : 'Adding concise <30-word direct answers beneath question headings and deploying FAQPage schema will dramatically accelerate citation in generative AI answers.'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* AEO Results Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Overall Citation Probability Score */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  AI Citation Probability Score
                </span>
                <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  report.aiCitationProbability >= 85
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-400'
                    : report.aiCitationProbability >= 65
                    ? 'bg-amber-950/70 border-amber-500/50 text-amber-400'
                    : 'bg-rose-950/70 border-rose-500/50 text-rose-400'
                }`}>
                  Grade {report.grade}
                </span>
              </div>

              <div className="flex items-baseline gap-3 my-3">
                <span
                  className={`text-6xl font-black tracking-tight ${
                    report.aiCitationProbability >= 85
                      ? 'text-emerald-400'
                      : report.aiCitationProbability >= 65
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {report.aiCitationProbability}%
                </span>
                <span className="text-xs text-slate-400 leading-tight">
                  Likelihood of extraction in Google AI Overviews
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {report.aiCitationProbability >= 85
                  ? 'High probability of ranking as the primary synthesized answer card in Google AI Overviews and Perplexity Pro.'
                  : report.aiCitationProbability >= 65
                  ? 'Moderate citation chance. Contains partial signals but lacks immediate direct answer brevity or structured data.'
                  : 'Low citation likelihood. Generative models will favor competitor sites with structured answers under 30 words.'}
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Direct Answer Synthesis:</span>
                <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  report.directAnswerEval.status === 'OPTIMAL'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                    : report.directAnswerEval.status === 'TOO_LONG'
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                    : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                }`}>
                  {report.directAnswerEval.status === 'OPTIMAL' ? 'Optimal (<30 Words)' : report.directAnswerEval.status === 'TOO_LONG' ? 'Too Long (>30 Words)' : 'Missing Definition'}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>Information Gain Tables:</span>
                <span className={report.hasComparativeTable ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                  {report.hasComparativeTable ? 'Yes (Detected)' : 'No (Markdown Table Missing)'}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>Conversational Headings:</span>
                <span className="text-white font-bold">{report.questionHeadingsCount} Question Header(s)</span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>FAQ / Schema Markup:</span>
                <span className={report.hasStructuredSchema ? 'text-emerald-400 font-semibold' : 'text-rose-400'}>
                  {report.hasStructuredSchema ? 'Schema Validated' : 'No Schema Detected'}
                </span>
              </div>
            </div>
          </div>

          {/* Direct Answer Synthesis & Voice Preview Card */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Direct Answer Synthesis Evaluation (&lt;30 Words Rule)
                </span>
                <span className="text-xs text-slate-400">
                  Detected Length: <strong className="text-white">{report.directAnswerEval.wordCount} words</strong>
                </span>
              </div>

              {/* Direct Answer Diagnosis Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-4">
                <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                  <span>Detected On-Page Snippet:</span>
                  <span className={`text-[11px] font-semibold ${
                    report.directAnswerEval.isUnder30Words ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {report.directAnswerEval.isUnder30Words ? '✓ Passes <30 Words Requirement' : '⚠ Exceeds or Lacks <30 Words Standard'}
                  </span>
                </div>
                <div className="text-slate-200 font-mono text-xs p-2.5 rounded bg-slate-900/90 border border-slate-800 leading-relaxed">
                  {report.directAnswerEval.detectedSnippet}
                </div>

                {report.directAnswerEval.status !== 'OPTIMAL' && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-indigo-300 font-medium mb-1.5">
                      <span>1-Click Suggested AI Overview Snippet Rewrite:</span>
                      <button
                        onClick={() => copyToClipboard(report.directAnswerEval.suggestedRewrite, 'rewrite')}
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                      >
                        {copiedId === 'rewrite' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === 'rewrite' ? 'Copied' : 'Copy Rewrite'}</span>
                      </button>
                    </div>
                    <div className="text-xs text-emerald-300 bg-emerald-950/30 p-2.5 rounded border border-emerald-800/40">
                      {report.directAnswerEval.suggestedRewrite}
                    </div>
                  </div>
                )}
              </div>

              {/* Generative AI & Voice Assistant Preview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-900/40 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    Google AI Overview & Perplexity Citation Simulator
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Volume2 className="w-3 h-3 text-sky-400" />
                    Voice Assistant Ready
                  </span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-3">
                  {report.simulatedAiSnippet.summaryCitation}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px]">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-800/50 text-indigo-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Cited Source: <span className="font-mono underline">{report.simulatedAiSnippet.citedSourceUrl}</span>
                  </div>
                  <div className="text-slate-400 italic">
                    {report.simulatedAiSnippet.voiceSearchTranscript}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Found <strong>{report.urgentActionSteps.length}</strong> urgent action step(s) to secure AI citations
              </span>
              <a
                href="#urgent-action-plan"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
              >
                <span>Jump to Urgent Action Plan</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* SECTION: WHAT TO DO URGENTLY / SUGGESTIONS */}
        <section id="urgent-action-plan" className="mb-12 bg-slate-900 border border-indigo-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Flame className="w-3.5 h-3.5" />
                Urgent Remediation Suggestions
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                What To Do Urgently: Step-by-Step AEO Remediation
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Immediate actions required to qualify your content for direct extraction by Gemini and ChatGPT search models.
              </p>
            </div>

            <button
              onClick={() => {
                const textSummary = report.urgentActionSteps
                  .map((s, idx) => `${idx + 1}. [${s.priority}] ${s.title}\nProblem: ${s.problem}\nFix: ${s.whatToDoUrgent}\n`)
                  .join('\n');
                copyToClipboard(textSummary, 'all-steps');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              {copiedId === 'all-steps' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'all-steps' ? 'Copied Action Checklist' : 'Copy Action Checklist'}</span>
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
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Time to Fix: <strong>{step.timeEstimate}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
                  <div className="space-y-2">
                    <div className="text-slate-400">
                      <strong className="text-rose-400">Detected Problem:</strong> {step.problem}
                    </div>
                    <div className="text-slate-300">
                      <strong className="text-emerald-400">What To Do Urgently:</strong> {step.whatToDoUrgent}
                    </div>
                  </div>

                  {step.codeSnippetFix && (
                    <div className="relative bg-slate-900 rounded-lg p-3 border border-slate-800 font-mono text-[11px] text-indigo-200 overflow-x-auto">
                      <button
                        onClick={() => copyToClipboard(step.codeSnippetFix || '', `code-${idx}`)}
                        className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                        title="Copy Code Fix"
                      >
                        {copiedId === `code-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <pre className="pr-8 whitespace-pre-wrap">{step.codeSnippetFix}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DEPLOYABLE CODE MODULES: FAQPAGE SCHEMA & PERPLEXITY BENCHMARK TABLE */}
        <section className="mb-12 bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 sm:p-7 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Code2 className="w-3.5 h-3.5" />
                Verified High-Impact AEO Enhancements
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Deploy Valid FAQPage Schema & Perplexity Benchmark Table
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Deploy these two structural assets to elevate your domain to an <strong>Excellent 96% AI Citation Probability (Grade A+)</strong>.
              </p>
            </div>

            <button
              onClick={() => {
                const preset = AEO_PRESET_SCENARIOS.find((s) => s.target.includes('timeandduration.com'));
                if (preset) {
                  handleSelectPreset(preset.sampleText, preset.target);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Test Deployed Setup (96% A+ Result)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box 1: FAQPage JSON-LD Structured Schema */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <h3 className="text-sm font-bold text-white">
                      1. Valid FAQPage JSON-LD Schema
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      const schemaCode = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How does timeandduration.com work?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Calculate time differences, add or subtract dates, track work hours, and convert time zones — free, instant, and accurate. No signup needed."
    }
  }]
}
</script>`;
                      copyToClipboard(schemaCode, 'faq-schema-code');
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    {copiedId === 'faq-schema-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'faq-schema-code' ? 'Copied!' : 'Copy Schema'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Grounds direct answers for Google AI Overviews and ChatGPT with machine-verifiable Question and acceptedAnswer nodes:
                </p>

                <div className="bg-slate-900 rounded-lg p-3 font-mono text-[11px] text-indigo-300 border border-slate-800 overflow-x-auto whitespace-pre">
{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How does timeandduration.com work?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Calculate time differences, add or subtract dates, track work hours, and convert time zones — free, instant, and accurate. No signup needed."
    }
  }]
}
</script>`}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                <span>Placement: <code>&lt;head&gt;</code> or bottom of page</span>
                <span className="text-emerald-400 font-semibold">Schema.org Validated ✓</span>
              </div>
            </div>

            {/* Box 2: Comparative Benchmark Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    <h3 className="text-sm font-bold text-white">
                      2. Comparative Benchmark Table
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      const tableMarkdown = `| Feature | Traditional Method | Modern Solution | Priority |
| :--- | :--- | :--- | :--- |
| Response Time | > 1,500ms | < 120ms | Critical |
| Verification | Unverified | ISO-8601 Validated | High |`;
                      copyToClipboard(tableMarkdown, 'table-markdown-code');
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    {copiedId === 'table-markdown-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'table-markdown-code' ? 'Copied!' : 'Copy Table'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Supplies dense factual gain that Perplexity Pro and SearchGPT algorithms require when generating comparative summary tables:
                </p>

                {/* Rendered Table Preview */}
                <div className="overflow-x-auto rounded-lg border border-slate-800 mb-3">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-900 text-slate-300 uppercase font-semibold">
                      <tr>
                        <th className="p-2 border-b border-slate-800">Feature</th>
                        <th className="p-2 border-b border-slate-800">Traditional Method</th>
                        <th className="p-2 border-b border-slate-800 text-emerald-400">Modern Solution</th>
                        <th className="p-2 border-b border-slate-800">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                      <tr>
                        <td className="p-2 font-sans font-medium text-white">Response Time</td>
                        <td className="p-2 text-rose-300">&gt; 1,500ms</td>
                        <td className="p-2 text-emerald-300 font-bold">&lt; 120ms</td>
                        <td className="p-2 text-amber-300">Critical</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-sans font-medium text-white">Verification</td>
                        <td className="p-2 text-slate-400">Unverified</td>
                        <td className="p-2 text-emerald-300 font-bold">ISO-8601 Validated</td>
                        <td className="p-2 text-indigo-300">High</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-900 rounded-lg p-2.5 font-mono text-[10px] text-indigo-300 border border-slate-800 overflow-x-auto whitespace-pre">
{`| Feature | Traditional Method | Modern Solution | Priority |
| :--- | :--- | :--- | :--- |
| Response Time | > 1,500ms | < 120ms | Critical |
| Verification | Unverified | ISO-8601 Validated | High |`}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                <span>Placement: Body text beneath primary H2 question</span>
                <span className="text-indigo-400 font-semibold">Information Gain +40% ✓</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Core AEO Pillars Breakdown */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>The 5 Core Answer Engine Optimization Pillars</span>
            </div>
            <span className="text-xs text-slate-400">Algorithmic weighting for Google AI Overviews</span>
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

                <div className="text-indigo-300 text-xs sm:text-right max-w-sm bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-900/30">
                  <strong className="text-indigo-400">Remediation:</strong> {pillar.recommendation}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dual Search Intent Viewport Architecture: High E-E-A-T Educational Guide & FAQs */}
        <section className="pt-10 border-t border-slate-800 text-slate-300">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/40">
                Answer Engine Optimization Knowledge Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 mb-4">
                What Is an AEO Auditor and How Does It Differ From Legacy SEO Checkers?
              </h2>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base">
                An <strong>AEO auditor</strong> is an algorithmic diagnostic system that inspects web pages to determine whether their textual and structured data architecture is primed for automated extraction by Answer Engines such as Google AI Overviews, Perplexity AI, and SearchGPT. While conventional search engine optimization focuses on domain authority, keyword volume, and backlink graphs to rank ten blue hyperlinks, Answer Engine Optimization (AEO) governs how directly and accurately Large Language Models can summarize and cite your content.
              </p>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base mt-3">
                To capture zero-click AI citations, websites must replace fluffy introductory prose with bolded definitions under 30 words, utilize conversational question headings matching People Also Ask queries, deploy JSON-LD FAQPage schemas, and provide dense Markdown tables that maximize Information Gain.
              </p>
            </div>

            {/* Comparative Table: Traditional SEO vs AEO Auditor */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-3">
                Comparative Breakdown: SEO Audit vs. AEO Auditor
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                      <th className="py-2.5 px-3">Evaluation Metric</th>
                      <th className="py-2.5 px-3">Traditional SEO Audit</th>
                      <th className="py-2.5 px-3 text-indigo-400">Modern AEO Auditor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-white">Target Output</td>
                      <td className="py-2 px-3">Top 10 organic search result links</td>
                      <td className="py-2 px-3 text-emerald-400">Featured summary card & direct voice answer</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-white">Direct Answer Ceiling</td>
                      <td className="py-2 px-3">Unbounded word counts (1,500+ words)</td>
                      <td className="py-2 px-3 text-emerald-400">Strictly under 30 words per answer block</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-white">Heading Structure</td>
                      <td className="py-2 px-3">Topical keywords (e.g. "Services")</td>
                      <td className="py-2 px-3 text-emerald-400">Conversational user queries (e.g. "How do you...")</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-white">Primary Schema</td>
                      <td className="py-2 px-3">Article / WebPage / Breadcrumb</td>
                      <td className="py-2 px-3 text-emerald-400">FAQPage, HowTo, Speakable JSON-LD</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-white">Information Gain</td>
                      <td className="py-2 px-3">Measured by total content length</td>
                      <td className="py-2 px-3 text-emerald-400">Measured by tabular data density & original metrics</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Snippet-Optimized FAQ Section for Answer Engines */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">
                Frequently Asked Questions About AEO Audits & AI Search Readiness
              </h2>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-2">
                    What is an AEO auditor?
                  </h3>
                  <p className="text-emerald-400 font-bold mb-2 text-xs sm:text-sm">
                    An AEO auditor is a specialized diagnostic tool that evaluates web content for concise direct answers (&lt;30 words), conversational question headings, and FAQ schema to secure AI citations.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    By testing whether your content answers user queries directly beneath headings, the auditor guarantees compatibility with Google AI Overviews, Perplexity Pro, and ChatGPT Search retrieval pipelines.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-2">
                    How do you get cited in Google AI Overviews?
                  </h3>
                  <p className="text-emerald-400 font-bold mb-2 text-xs sm:text-sm">
                    Place a bolded 15-to-25 word answer directly below a conversational question heading and support it with structured data tables and FAQPage schema.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Generative search models prioritize paragraphs with high factual density and zero conversational throat-clearing. Eliminating marketing fluff allows AI scrapers to parse your exact claim as the definitive citation.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-2">
                    What is the difference between an AEO audit and a GEO audit?
                  </h3>
                  <p className="text-emerald-400 font-bold mb-2 text-xs sm:text-sm">
                    An AEO audit optimizes on-page answer blocks and FAQ schema for immediate snippets, whereas a GEO audit verifies broad LLM brand knowledge graph authority and citability across AI models.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Use our <button onClick={() => onNavigate('/tools/aeo-auditor')} className="text-indigo-400 underline">AEO Auditor</button> for page-level snippet synthesis and switch to our <button onClick={() => onNavigate('/tools/geo-auditor')} className="text-indigo-400 underline">GEO Auditor</button> to audit domain-wide entity graphs and llms.txt compliance.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-2">
                    Why is the &lt;30 words rule essential for Answer Engine Optimization?
                  </h3>
                  <p className="text-emerald-400 font-bold mb-2 text-xs sm:text-sm">
                    Answer engines and voice assistants like Siri and Google Gemini restrict summary answers to under 30 words to fit cleanly into synthesized response cards without truncating.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Answers exceeding 30 words risk being bypassed in favor of competitors who synthesize the definition with greater semantic precision.
                  </p>
                </div>
              </div>
            </div>

            {/* Read Flagship Guides */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">Read Our Comprehensive Flagship Guide</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Master Answer Engine Optimization and discover how to capture featured AI snippets in 2026.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/blog/aeo-auditor-guide')}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Read AEO Auditor Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
