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
} from 'lucide-react';
import {
  AeoAuditReport,
} from '../types/aeoChecker';
import {
  auditContentForAeo,
  AEO_PRESET_SCENARIOS,
} from '../utils/aeoCheckerEngine';

interface AeoReadinessCheckerProps {
  onNavigate: (route: string) => void;
}

export const AeoReadinessChecker: React.FC<AeoReadinessCheckerProps> = ({ onNavigate }) => {
  const [inputText, setInputText] = useState<string>(AEO_PRESET_SCENARIOS[0].sampleText);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [report, setReport] = useState<AeoAuditReport>(() =>
    auditContentForAeo(AEO_PRESET_SCENARIOS[0].sampleText)
  );

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const newReport = auditContentForAeo(inputText);
      setReport(newReport);
      setIsAuditing(false);
    }, 700);
  };

  const handleSelectPreset = (text: string) => {
    setInputText(text);
    setIsAuditing(true);
    setTimeout(() => {
      const newReport = auditContentForAeo(text);
      setReport(newReport);
      setIsAuditing(false);
    }, 400);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'AI Overviews & Answer Engine Optimization (AEO) Readiness Checker',
                applicationCategory: 'SEOApplication',
                operatingSystem: 'All',
                description:
                  'Evaluate your content for Google AI Overviews, Perplexity, and ChatGPT Search. Analyze direct answer placement, semantic question headers, schema, and information gain.',
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
                    name: 'What is Answer Engine Optimization (AEO)?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'AEO is formatting content with concise direct answers, structured schema, and clear semantic headings so AI engines can easily extract and cite it.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do you get cited in Google AI Overviews?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Place a bolded 15-to-25 word answer directly below a conversational question heading and support it with structured data tables and schema.',
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
              <Cpu className="w-3.5 h-3.5" />
              Generative AI Search & Citation Readiness
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              2026 Google AI Overviews & Perplexity Algorithm Model
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            AI Overviews & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">Answer Engine Optimization (AEO) Checker</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Test whether your content is primed to be extracted and cited as the #1 source by Google AI Overviews, Perplexity AI, and ChatGPT Search. Benchmark against direct-answer formatting, information gain, and semantic entity grounding.
          </p>
        </div>
      </header>

      {/* Main Interactive Tool Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Preset Selector */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Select Testing Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {AEO_PRESET_SCENARIOS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset.sampleText)}
                className="text-left p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all text-xs group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                  {preset.label}
                </div>
                <div className="text-slate-400 text-[11px] mt-1 truncate">
                  {preset.target}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input & Editor Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-xs font-semibold text-slate-300">
              Input Article URL or Draft Markdown/HTML
            </span>
            <span className="text-xs text-slate-400">Word Count: {inputText.split(/\s+/).filter(Boolean).length}</span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
            placeholder="Paste your article draft or URL here..."
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleRunAudit}
              disabled={isAuditing || !inputText.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditing AEO Signals...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>Analyze AI Citation Readiness</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AEO Results Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Probability Score Card */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                AI Citation Probability Score
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-5xl font-extrabold ${
                    report.aiCitationProbability >= 80
                      ? 'text-emerald-400'
                      : report.aiCitationProbability >= 60
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {report.aiCitationProbability}%
                </span>
                <span className="text-lg font-bold text-slate-400">({report.grade})</span>
              </div>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {report.aiCitationProbability >= 80
                  ? 'High probability of being cited as an authoritative summary source in Google AI Overviews and Perplexity.'
                  : report.aiCitationProbability >= 60
                  ? 'Moderate citation potential. Lacks direct structured tables or immediate answer blocks.'
                  : 'Low citation chance. AI models will likely favor competitor pages with tighter answer synthesis.'}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Direct Answer Block:</span>
                <span className={report.hasDirectAnswerSnippet ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                  {report.hasDirectAnswerSnippet ? 'Detected' : 'Missing'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Information Gain Tables:</span>
                <span className={report.hasComparativeTable ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                  {report.hasComparativeTable ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Question Headings:</span>
                <span className="text-white font-bold">{report.questionHeadingsCount}</span>
              </div>
            </div>
          </div>

          {/* Simulated AI Overview Snippet Box */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4" />
                Live Generative AI Citation Preview
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-900/30 text-xs">
                <div className="flex items-center gap-2 text-slate-400 text-[11px] mb-2">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Google AI Overview • Synthesized Response</span>
                </div>
                <div className="text-slate-200 text-sm leading-relaxed mb-3">
                  {report.simulatedAiSnippet.summaryCitation}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-950/60 border border-indigo-800/40 text-[11px] text-indigo-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Source: <span className="underline font-mono">{report.simulatedAiSnippet.citedSourceUrl}</span>
                </div>
              </div>
            </div>

            {/* Action Items */}
            {report.actionableImprovements.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-2">Top Optimization Priorities:</div>
                <ul className="space-y-1 text-xs text-slate-400">
                  {report.actionableImprovements.map((act, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 5 AEO Pillars Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-12">
          <div className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>The 5 Core Answer Engine Optimization Pillars</span>
          </div>

          <div className="space-y-3">
            {report.pillars.map((pillar, pIdx) => (
              <div
                key={pIdx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {pillar.status === 'passed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="font-semibold text-white text-sm">{pillar.pillarName}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                      Score: {pillar.score}/100
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{pillar.detectedInsight}</p>
                </div>

                <div className="text-indigo-300 text-xs sm:text-right max-w-xs">
                  <strong>Fix:</strong> {pillar.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dual Search Intent Viewport Architecture - SEO Guide & FAQs */}
        <section className="pt-10 border-t border-slate-800 text-slate-300">
          <div className="max-w-4xl mx-auto space-y-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                What Is Answer Engine Optimization (AEO) and How Does It Differ From Traditional SEO?
              </h2>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base">
                Traditional SEO focused on keyword density, metadata placement, and backlinks to rank ten blue links on a search results page. <strong>Answer Engine Optimization (AEO)</strong> is the practice of structuring website content so Large Language Models (LLMs)—including Google's Gemini-powered AI Overviews, Perplexity AI, and SearchGPT—can instantaneously parse, extract, and cite your exact data points as definitive answers.
              </p>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base mt-3">
                To capture AI citations, articles must provide zero-fluff answers under 30 words, utilize semantic question tags, format data in markdown comparison tables, and maintain strong <button onClick={() => onNavigate('/tools/domain-rating-checker')} className="text-indigo-400 underline hover:text-indigo-300">domain authority</button>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Frequently Asked Questions About Answer Engine Optimization (AEO)
              </h2>

              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    What is Answer Engine Optimization (AEO)?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    AEO is formatting content with concise direct answers, structured schema, and clear semantic headings so AI engines can easily extract and cite it.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    By providing bolded, direct answers to conversational questions, you increase the likelihood that search algorithms select your URL as the primary citation.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    How do you get cited in Google AI Overviews?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    Place a bolded 15-to-25 word answer directly below a conversational question heading and support it with structured data tables and schema.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Avoid introductory narrative filler. Generative search engines prioritize paragraphs with high factual density and structured schema.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    Does schema markup improve AI Overview rankings?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    Yes, JSON-LD FAQPage, HowTo, and TechArticle schemas allow AI crawlers to parse entity relationships with high algorithmic confidence.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Pairing structured JSON-LD with matching on-page HTML eliminates ambiguity during automated content retrieval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
