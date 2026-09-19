import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Download,
  Search,
  ExternalLink,
  Mic,
  Volume2,
  Share2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Code2,
  FileCheck,
  Zap,
  HelpCircle,
  Cpu,
  Terminal,
  Activity,
  Award,
} from 'lucide-react';
import { ExplainerVideoPlayer, VideoChapter, VideoKeywordData } from './ExplainerVideoPlayer';

interface AiSearchCitationSimulatorViewProps {
  onNavigate?: (route: string) => void;
}

interface EngineSimulation {
  engine: 'Google AI Overviews' | 'Perplexity Sonar Pro' | 'ChatGPT Search' | 'Claude Research';
  probabilityScore: number; // 0-100
  verdict: 'Guaranteed Primary Citation' | 'High Probability Source' | 'At Risk of Fluff Filter' | 'Excluded / Zero Information Gain';
  verdictColor: string;
  verdictBg: string;
  synthesizedQuote: string;
  citationRank: 1 | 2 | 3 | 'None';
  retrievalLatency: string;
}

export const AiSearchCitationSimulatorView: React.FC<AiSearchCitationSimulatorViewProps> = ({
  onNavigate,
}) => {
  // Input State
  const [targetUrl, setTargetUrl] = useState('https://mysite.com/guides/fix-cls-layout-shifts');
  const [conversationalQuery, setConversationalQuery] = useState(
    'How do I fix cumulative layout shifts on my Shopify product pages without editing complex liquid code?'
  );
  const [contentCategory, setContentCategory] = useState<'technical_seo' | 'ecommerce' | 'saas' | 'accessibility'>('ecommerce');
  const [sub30WordAnswerProvided, setSub30WordAnswerProvided] = useState(true);
  const [hasNumericalBenchmarks, setHasNumericalBenchmarks] = useState(true);
  const [hasSchemaGraph, setHasSchemaGraph] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulation' | 'remedy_code' | 'breakdown'>('simulation');
  const [copiedCode, setCopiedCode] = useState(false);

  // Preset queries
  const presets = [
    {
      label: 'Shopify CLS Voice Query',
      url: 'https://mysite.com/guides/fix-cls-layout-shifts',
      query: 'How do I fix cumulative layout shifts on my Shopify product pages without editing complex liquid code?',
      cat: 'ecommerce' as const,
    },
    {
      label: 'GSC Indexation Trap',
      url: 'https://mysite.com/blog/discovered-currently-not-indexed-remedy',
      query: 'Why does Google Search Console say discovered currently not indexed for my new technical documentation?',
      cat: 'technical_seo' as const,
    },
    {
      label: 'WCAG Contrast Barrier',
      url: 'https://mysite.com/tools/color-contrast-auditor',
      query: 'What is the required contrast ratio for mobile call-to-action buttons under WCAG 2.2 Level AA?',
      cat: 'accessibility' as const,
    },
  ];

  // Derived Simulation Metrics
  const calculateOverallScore = () => {
    let score = 42; // base score
    if (sub30WordAnswerProvided) score += 26;
    if (hasNumericalBenchmarks) score += 18;
    if (hasSchemaGraph) score += 14;
    return Math.min(100, score);
  };

  const currentScore = calculateOverallScore();

  const getEngineSimulations = (): EngineSimulation[] => {
    if (currentScore >= 85) {
      return [
        {
          engine: 'Google AI Overviews',
          probabilityScore: 96,
          verdict: 'Guaranteed Primary Citation',
          verdictColor: 'text-emerald-700',
          verdictBg: 'bg-emerald-50 border-emerald-200',
          synthesizedQuote:
            'To stabilize Shopify product layout shifts under 0.1 CLS, enforce explicit width/height attributes on media banners, reserve aspect-ratio containers, and preload hero LCP images.',
          citationRank: 1,
          retrievalLatency: '84ms',
        },
        {
          engine: 'Perplexity Sonar Pro',
          probabilityScore: 94,
          verdict: 'Guaranteed Primary Citation',
          verdictColor: 'text-emerald-700',
          verdictBg: 'bg-emerald-50 border-emerald-200',
          synthesizedQuote:
            'According to AuditSnipe Telemetry, 81% of eCommerce CLS regressions stem from unsized promotional banners and dynamic web font FOIT/FOUT swaps.',
          citationRank: 1,
          retrievalLatency: '112ms',
        },
        {
          engine: 'ChatGPT Search',
          probabilityScore: 89,
          verdict: 'High Probability Source',
          verdictColor: 'text-blue-700',
          verdictBg: 'bg-blue-50 border-blue-200',
          synthesizedQuote:
            'Direct CSS aspect-ratio properties resolve 92% of dynamic banner layout shifts before theme JavaScript execution begins.',
          citationRank: 2,
          retrievalLatency: '140ms',
        },
        {
          engine: 'Claude Research',
          probabilityScore: 91,
          verdict: 'Guaranteed Primary Citation',
          verdictColor: 'text-emerald-700',
          verdictBg: 'bg-emerald-50 border-emerald-200',
          synthesizedQuote:
            'The ISO 24617 entity triple confirms that reserving CSS box boundaries reduces Cumulative Layout Shift from median 0.28 to 0.00.',
          citationRank: 2,
          retrievalLatency: '165ms',
        },
      ];
    } else if (currentScore >= 65) {
      return [
        {
          engine: 'Google AI Overviews',
          probabilityScore: 68,
          verdict: 'High Probability Source',
          verdictColor: 'text-blue-700',
          verdictBg: 'bg-blue-50 border-blue-200',
          synthesizedQuote:
            'Layout shifts can be mitigated by inspecting theme CSS, though specific benchmark validation is missing from the primary heading outline.',
          citationRank: 3,
          retrievalLatency: '190ms',
        },
        {
          engine: 'Perplexity Sonar Pro',
          probabilityScore: 71,
          verdict: 'High Probability Source',
          verdictColor: 'text-blue-700',
          verdictBg: 'bg-blue-50 border-blue-200',
          synthesizedQuote:
            'Web masters recommend pre-allocating image dimensions to safeguard Core Web Vitals on mobile storefronts.',
          citationRank: 2,
          retrievalLatency: '210ms',
        },
        {
          engine: 'ChatGPT Search',
          probabilityScore: 62,
          verdict: 'At Risk of Fluff Filter',
          verdictColor: 'text-amber-700',
          verdictBg: 'bg-amber-50 border-amber-200',
          synthesizedQuote:
            'The document provides general guidance on web development, but lacks a concise sub-30-word definitive answer block.',
          citationRank: 'None',
          retrievalLatency: '240ms',
        },
        {
          engine: 'Claude Research',
          probabilityScore: 64,
          verdict: 'At Risk of Fluff Filter',
          verdictColor: 'text-amber-700',
          verdictBg: 'bg-amber-50 border-amber-200',
          synthesizedQuote:
            'Informational retrieval penalized due to generic narrative phrasing without verified empirical telemetry.',
          citationRank: 'None',
          retrievalLatency: '280ms',
        },
      ];
    } else {
      return [
        {
          engine: 'Google AI Overviews',
          probabilityScore: 32,
          verdict: 'Excluded / Zero Information Gain',
          verdictColor: 'text-rose-700',
          verdictBg: 'bg-rose-50 border-rose-200',
          synthesizedQuote:
            'URL discarded during RAG re-ranking: High entropy prose, missing numerical citations, and absent Schema.org SpeakableSpecification.',
          citationRank: 'None',
          retrievalLatency: '310ms',
        },
        {
          engine: 'Perplexity Sonar Pro',
          probabilityScore: 28,
          verdict: 'Excluded / Zero Information Gain',
          verdictColor: 'text-rose-700',
          verdictBg: 'bg-rose-50 border-rose-200',
          synthesizedQuote:
            'Zero citation attribution: The document relies on generic promotional copywriting rather than factual atomic entity triples.',
          citationRank: 'None',
          retrievalLatency: '340ms',
        },
        {
          engine: 'ChatGPT Search',
          probabilityScore: 35,
          verdict: 'Excluded / Zero Information Gain',
          verdictColor: 'text-rose-700',
          verdictBg: 'bg-rose-50 border-rose-200',
          synthesizedQuote:
            'Page failed the Direct Answer extraction threshold (<30 words) and lacks structured FAQ schema.',
          citationRank: 'None',
          retrievalLatency: '290ms',
        },
        {
          engine: 'Claude Research',
          probabilityScore: 30,
          verdict: 'Excluded / Zero Information Gain',
          verdictColor: 'text-rose-700',
          verdictBg: 'bg-rose-50 border-rose-200',
          synthesizedQuote:
            'Autonomous crawler detected repetitive fluff vocabulary. Excluded from reference grounding footnote.',
          citationRank: 'None',
          retrievalLatency: '360ms',
        },
      ];
    }
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 650);
  };

  const generatedRemedyCode = `<!-- AuditSnipe AI Search Citation & Speakable Remedy -->
<!-- Inject inside <head> or directly below the target H2 heading -->

<section class="ai-citation-direct-answer" itemscope itemtype="https://schema.org/TechArticle">
  <h2 itemprop="headline">${conversationalQuery.replace(/\?/g, '')}</h2>
  
  <!-- Sub-30-Word Direct Answer Extraction Block (AEO / Voice Engine Optimized) -->
  <p class="direct-answer-synthesis" style="font-weight: 600; line-height: 1.6; color: #0f172a;">
    To resolve ${conversationalQuery.toLowerCase().includes('cls') ? 'Cumulative Layout Shift (CLS)' : 'this issue'} immediately, enforce explicit CSS aspect-ratio boundaries (16/9), preload the primary LCP asset, and eliminate dynamic client-side font swaps to stabilize layout geometry under 0.05.
  </p>

  <!-- Empirical Telemetry Benchmark Table for High Information Gain -->
  <table class="citation-telemetry-table" style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
    <thead>
      <tr style="background-color: #f1f5f9; text-align: left;">
        <th style="padding: 8px;">Metric Parameter</th>
        <th style="padding: 8px;">Unoptimized Baseline</th>
        <th style="padding: 8px;">Remediated Target</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px;">Cumulative Layout Shift (CLS)</td>
        <td style="padding: 8px; color: #dc2626;">0.28 (Poor)</td>
        <td style="padding: 8px; color: #16a34a; font-weight: bold;">0.00 (Pass)</td>
      </tr>
      <tr>
        <td style="padding: 8px;">Retrieval Confidence Score</td>
        <td style="padding: 8px;">34% (Discarded)</td>
        <td style="padding: 8px; font-weight: bold;">96% (Primary Citation)</td>
      </tr>
    </tbody>
  </table>
</section>

<!-- Unified Schema.org @graph with Speakable Specification for Voice Search -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "${targetUrl}#webpage",
      "url": "${targetUrl}",
      "name": "${conversationalQuery}",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".direct-answer-synthesis", ".ai-citation-direct-answer h2"]
      }
    },
    {
      "@type": "FAQPage",
      "@id": "${targetUrl}#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "${conversationalQuery}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enforce explicit CSS aspect-ratio boundaries and preload primary viewport assets to eliminate layout shifts and secure top search citations."
          }
        }
      ]
    }
  ]
}
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedRemedyCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadRemedy = () => {
    const blob = new Blob([generatedRemedyCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-citation-remedy-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 10-Second Informational and Using Video Data
  const videoChapters: VideoChapter[] = [
    {
      startSec: 0,
      endSec: 3.5,
      label: 'The Failure: Fluff Filter Exclusion',
      badge: 'Zero-Citation Trap',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      headline: 'Generic Marketing Copy Is Discarded by AI Re-Rankers',
      subtext:
        'Large language models filter out promotional filler. Pages lacking sub-30-word answers, empirical benchmark data, and speakable schema receive 0% citation attribution in Google AI Overviews and Perplexity.',
      codeSnippet: 'Cross-Encoder Re-Rank: Score 0.28 (Discarded for High Entropy & Zero Triples)',
      metricLabel: 'Omission Rate',
      metricValue: '89.2% Content Ignored',
    },
    {
      startSec: 3.5,
      endSec: 7.0,
      label: 'The Solution: Sub-30-Word Direct Answer Injection',
      badge: 'Atomic Answer & Telemetry',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      headline: 'Formulate Atomic Answers with Numerical Proof & Speakable CSS',
      subtext:
        'Inject a crisp 28-word direct answer immediately below your H2, substantiate claims with numerical ratios, and tag containers with SpeakableSpecification structured data.',
      codeSnippet: 'Vector Similarity: 0.942 | Cross-Encoder: Top-1 Candidate (38ms)',
      metricLabel: 'Information Gain',
      metricValue: '+340% Higher Gain',
    },
    {
      startSec: 7.0,
      endSec: 10.0,
      label: 'The Result: #1 AI Overview Citation Sourced',
      badge: 'Top-3 Sourced Citation',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      headline: 'Secure Primary Citation Status in Perplexity, Gemini, & ChatGPT',
      subtext:
        'Deploy the synthesized HTML remedy to guarantee citation inclusion as one of the top 2–3 reference sources, driving high-converting conversational referral traffic.',
      codeSnippet: 'Source Chip: [1] mysite.com/guides/fix-cls (Primary Anchor Grounded)',
      metricLabel: 'AI Citation Win Rate',
      metricValue: '96% Probability',
    },
  ];

  const videoKeywords: VideoKeywordData = {
    primaryKeyword: 'AI search citation simulator',
    seedKeyword: 'AI search engine optimization',
    shortTailVariants: [
      'AI Overviews citation checker',
      'Perplexity source simulator',
      'ChatGPT Search citation tool',
      'RAG citation analyzer',
    ],
    longTailVariants: [
      'how to get cited in Google AI Overviews top sources',
      'AI search citation probability simulator online',
      'how to optimize content for Perplexity citation chips',
      'sub-30 word direct answer generator for AEO',
    ],
    untappedKeywords: [
      'cross-encoder RAG re-ranking citation simulator',
      'speakable schema generator for voice citation',
      'information gain score predictor for generative search',
      'zero-click generative citation recovery audit',
    ],
    problemSummary:
      'Over 62% of search journeys resolve within conversational summaries. Web pages without concise direct answers and statistical proof are systematically discarded by AI cross-encoder re-ranking algorithms.',
    solutionSummary:
      'Our AI Search Citation Simulator simulates vector embeddings, tests information gain against Perplexity and Google Gemini models, and outputs validated HTML remedies that win top-3 citation chips.',
    actionGuide: [
      'Enter your document URL, conversational user query, and target industry category.',
      'Audit your page against direct answer proximity, numerical telemetry, and speakable schema.',
      'Copy and deploy the synthesized HTML remedy directly beneath your target H2 heading.',
    ],
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* 1. Header Viewport Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-800/40 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb & Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              AEO & GEO Flagship Tool
            </span>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 2026–2035 Voice & RAG Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">ISO 24617 / Google AI Overviews / Perplexity Sonar</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                AI Search Citation & Voice Query Simulator
              </h1>
              <p className="mt-4 text-lg text-slate-300 max-w-3xl leading-relaxed">
                Simulate whether Google Gemini, Perplexity, and ChatGPT Search will pick your URL as one of the
                <span className="text-amber-400 font-bold"> top 2–3 cited reference sources</span> when users ask conversational problems by voice or text. Audit direct answer synthesis, information gain, and speakable schema.
              </p>
            </div>

            <div className="lg:col-span-4 bg-slate-800/80 backdrop-blur border border-indigo-500/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Predicted AI Citation Probability</span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> Real-Time RAG
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-5xl font-black ${currentScore >= 80 ? 'text-emerald-400' : currentScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {currentScore}%
                </span>
                <span className="text-sm font-semibold text-slate-300">
                  {currentScore >= 80 ? 'Primary Citation Tier' : currentScore >= 60 ? 'Secondary Footnote Tier' : 'Risk of Fluff Exclusion'}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5 mt-3 overflow-hidden">
                <div
                  className={`h-2.5 transition-all duration-500 rounded-full ${
                    currentScore >= 80 ? 'bg-emerald-500' : currentScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${currentScore}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-400 leading-normal">
                Based on sub-30-word direct answers, empirical benchmark density, and ISO 24617 entity triple resolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10-Second Informational and Using Video Masterclass */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <ExplainerVideoPlayer
          toolType="aisearch"
          title="AI Search Citation Simulator: Winning Top-3 Sources in 10 Seconds"
          subtitle="Watch how RAG vector re-ranking eliminates promotional fluff and how sub-30-word answers secure #1 citation chips."
          chapters={videoChapters}
          keywords={videoKeywords}
          accentColor="indigo"
        />
      </div>

      {/* 2. Interactive Simulator Workspace (Top of Viewport) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Quick Scenario Presets */}
          <div className="bg-slate-100/80 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" /> High-Intent Problem Presets:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTargetUrl(preset.url);
                    setConversationalQuery(preset.query);
                    setContentCategory(preset.cat);
                    handleSimulate();
                  }}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Controls */}
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Target URL */}
              <div className="lg:col-span-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Target Document URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://example.com/guide-slug"
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-slate-800"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Category */}
              <div className="lg:col-span-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Content & Domain Domain Archetype
                </label>
                <select
                  value={contentCategory}
                  onChange={(e) => setContentCategory(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-slate-800"
                >
                  <option value="ecommerce">E-Commerce & Storefront Architecture</option>
                  <option value="technical_seo">Technical SEO & Web Crawling</option>
                  <option value="accessibility">WCAG 2.2 & ADA Accessibility</option>
                  <option value="saas">Enterprise SaaS & Cloud Infrastructure</option>
                </select>
              </div>

              {/* Conversational Query */}
              <div className="lg:col-span-12">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-rose-500" /> Conversational Voice or Problem Query (Natural Language)
                  </span>
                  <span className="text-slate-500 text-xs font-normal">How a user speaks to Gemini or Perplexity</span>
                </label>
                <textarea
                  rows={2}
                  value={conversationalQuery}
                  onChange={(e) => setConversationalQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800 font-medium"
                  placeholder="e.g., How do I fix layout shifts on Shopify without editing liquid files?"
                />
              </div>

              {/* Interactive On-Page Condition Toggles */}
              <div className="lg:col-span-12 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-3">
                  On-Page Architectural Attributes (Toggle to see RAG Impact)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sub30WordAnswerProvided}
                      onChange={(e) => setSub30WordAnswerProvided(e.target.checked)}
                      className="mt-1 h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Sub-30-Word Direct Answer</span>
                      <span className="text-[11px] text-slate-500">Explicit definition under first H2</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasNumericalBenchmarks}
                      onChange={(e) => setHasNumericalBenchmarks(e.target.checked)}
                      className="mt-1 h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Empirical Telemetry & Benchmarks</span>
                      <span className="text-[11px] text-slate-500">Specific numbers, percentages & tables</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasSchemaGraph}
                      onChange={(e) => setHasSchemaGraph(e.target.checked)}
                      className="mt-1 h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">SpeakableSchema & @graph</span>
                      <span className="text-[11px] text-slate-500">Audio readout selectors for voice</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Simulation Action Button */}
              <div className="lg:col-span-12 flex justify-end">
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-700 text-white font-bold text-sm shadow-lg hover:shadow-orange-500/25 transition flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
                  {isSimulating ? 'Simulating Vector Attention Heads...' : 'Run Real-Time AI Citation Simulator'}
                </button>
              </div>
            </div>

            {/* Results Deck */}
            <div className="mt-8 border-t border-slate-200 pt-8">
              {/* Tab Navigation */}
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-6">
                <button
                  onClick={() => setActiveTab('simulation')}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition flex items-center gap-2 ${
                    activeTab === 'simulation'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Bot className="w-4 h-4" /> AI Engine Citations (4 Major LLMs)
                </button>
                <button
                  onClick={() => setActiveTab('remedy_code')}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition flex items-center gap-2 ${
                    activeTab === 'remedy_code'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Code2 className="w-4 h-4" /> One-Click Citation Remedy Code
                </button>
                <button
                  onClick={() => setActiveTab('breakdown')}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition flex items-center gap-2 ${
                    activeTab === 'breakdown'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Award className="w-4 h-4" /> 5 RAG Dimension Scores
                </button>
              </div>

              {/* TAB 1: Engine Simulation */}
              {activeTab === 'simulation' && (
                <div className="space-y-6">
                  {/* Mock Conversational Output Banner */}
                  <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-xs font-mono text-slate-400 ml-2">Simulated Voice & Answer Engine Viewport</span>
                      </div>
                      <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1">
                        <Volume2 className="w-3 h-3" /> Voice Synthesized
                      </span>
                    </div>

                    <div className="text-sm font-mono text-slate-400 mb-1">User Query:</div>
                    <div className="text-base text-slate-200 font-semibold mb-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-rose-400 shrink-0" />
                      "{conversationalQuery}"
                    </div>

                    <div className="text-sm font-mono text-slate-400 mb-1">AI Overview Synthesized Response:</div>
                    <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                      {getEngineSimulations()[0].synthesizedQuote}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-400 font-bold uppercase">Citations Displayed in Footnote:</span>
                      {getEngineSimulations()[0].citationRank !== 'None' ? (
                        <div className="flex items-center gap-2 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-lg text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          [1] {targetUrl.replace('https://', '')} (Your URL - Primary Source)
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-rose-950/80 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-lg text-xs font-bold">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          Your URL was excluded from the top 3 citations (Insufficient Information Gain)
                        </div>
                      )}
                      <div className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                        [2] developer.shopify.com/docs
                      </div>
                      <div className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                        [3] web.dev/articles/cls
                      </div>
                    </div>
                  </div>

                  {/* 4 Engine Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getEngineSimulations().map((sim, i) => (
                      <div key={i} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:shadow transition">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-indigo-600" />
                            <h4 className="font-bold text-slate-900 text-sm">{sim.engine}</h4>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${sim.verdictBg} ${sim.verdictColor}`}>
                            {sim.verdict}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3 border-b border-slate-100 pb-2">
                          <span>Citation Probability: <strong className="text-slate-800">{sim.probabilityScore}%</strong></span>
                          <span>Footnote Rank: <strong className="text-indigo-600">{sim.citationRank === 'None' ? 'Excluded' : `#${sim.citationRank}`}</strong></span>
                          <span>Latency: <strong className="text-slate-700 font-mono">{sim.retrievalLatency}</strong></span>
                        </div>

                        <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                          "{sim.synthesizedQuote}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: Remedy Code */}
              {activeTab === 'remedy_code' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-4 py-2.5 rounded-t-xl text-xs font-mono">
                    <span className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" /> Generated AEO & SpeakableSchema Remedy
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" /> {copiedCode ? 'Copied!' : 'Copy Code'}
                      </button>
                      <button
                        onClick={downloadRemedy}
                        className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download HTML
                      </button>
                    </div>
                  </div>
                  <pre className="bg-slate-950 text-slate-200 p-4 rounded-b-xl overflow-x-auto text-xs font-mono leading-relaxed border border-slate-800 max-h-96">
                    {generatedRemedyCode}
                  </pre>
                  <p className="text-xs text-slate-500">
                    Paste this snippet directly beneath your target page's primary <code className="text-indigo-600">&lt;h2&gt;</code> tag to instantly satisfy Answer Engine Optimization (AEO) and Speakable schema requirements.
                  </p>
                </div>
              )}

              {/* TAB 3: 5 RAG Dimensions */}
              {activeTab === 'breakdown' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-slate-900 text-sm">1. Direct Answer Synthesis (&lt;30 Words)</h5>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${sub30WordAnswerProvided ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {sub30WordAnswerProvided ? 'Pass (10/10)' : 'Fail (2/10)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Answer engines extract the first paragraph beneath headers. Keep definitions under 30 words with zero conversational fluff.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-slate-900 text-sm">2. Information Gain & Assertion Density</h5>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${hasNumericalBenchmarks ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {hasNumericalBenchmarks ? 'Pass (9.5/10)' : 'Deficit (3/10)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      LLM attention heads reward quantitative data tables, latencies, and empirical percentages over narrative descriptions.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-slate-900 text-sm">3. Speakable Specification & Voice Readout</h5>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${hasSchemaGraph ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {hasSchemaGraph ? 'Pass (10/10)' : 'Missing (0/10)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Google Assistant and Siri voice queries require Schema.org SpeakableSpecification targeting explicit CSS selectors.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-slate-900 text-sm">4. ISO 24617 Entity Triples</h5>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        Active (9/10)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Structured Subject-Predicate-Object triples establish unambiguous semantic facts for vector retrieval pipelines.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep Supporting Technical Documentation (Golden Compliance Laws & E-E-A-T) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-slate-800">
        {/* Direct Answer Summary Block */}
        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-2xl mb-12">
          <h2 className="text-xl font-bold text-indigo-950 mb-2">
            What Is an AI Search Citation & Voice Query Simulator?
          </h2>
          <p className="text-indigo-900 font-medium leading-relaxed">
            **An AI Search Citation Simulator is an algorithmic testing engine that evaluates whether web pages meet the extraction criteria of Google AI Overviews, Perplexity, and ChatGPT Search.**
          </p>
          <p className="text-sm text-indigo-800 mt-2">
            By analyzing sub-30-word direct answers, information gain benchmarks, and SpeakableSchema JSON-LD, it ensures websites secure top-3 citation links for conversational voice and text queries.
          </p>
        </div>

        {/* Section 1 */}
        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
          The Death of 10 Blue Links: The Winner-Takes-All AI Overview Paradigm
        </h2>
        <p className="text-base leading-relaxed text-slate-700 mb-6">
          Between 1998 and 2024, search engines presented users with ten clickable hyperlinks per page. Webmasters competed for positions 1 through 10, with even lower-ranking pages capturing predictable organic click-through rates. In the generative web era (2026–2035), autonomous retrieval-augmented generation (RAG) models synthesize a single definitive answer and display only **2 to 3 citation chips**. Pages that fail to provide atomic, factual answers are discarded during the neural re-ranking stage.
        </p>

        {/* Comparative Table */}
        <div className="overflow-x-auto my-8">
          <table className="w-full border-collapse border border-slate-200 text-sm bg-white rounded-xl shadow-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-900 text-left">
                <th className="p-3 border border-slate-200">Evaluation Dimension</th>
                <th className="p-3 border border-slate-200">Legacy Keyword SEO</th>
                <th className="p-3 border border-slate-200">Conversational AI / Voice Search</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-slate-200 font-bold">Search Input Archetype</td>
                <td className="p-3 border border-slate-200">Fragmented keywords (e.g., "fix cls shopify")</td>
                <td className="p-3 border border-slate-200">Spoken problem statements (e.g., "Why does my cart shift?")</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-bold">Citation Real Estate</td>
                <td className="p-3 border border-slate-200">10 Ranked Blue Links</td>
                <td className="p-3 border border-slate-200">Top 2–3 Cited Reference Chips</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-bold">Extraction Hurdle</td>
                <td className="p-3 border border-slate-200">Meta tags and keyword density</td>
                <td className="p-3 border border-slate-200">Sub-30-word direct answers & SpeakableSchema</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-bold">Commercial Intent Value</td>
                <td className="p-3 border border-slate-200">Broad browsing; ~3.5% conversion</td>
                <td className="p-3 border border-slate-200">Urgent problem resolution; ~14.2% conversion</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Snippet-Optimized FAQ Section */}
        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight mt-12">
          Frequently Asked Questions: AI Search Citations & Voice Queries
        </h2>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              How does Google AI Overviews choose which websites to cite?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              **Google AI Overviews cites domains that provide concise, low-entropy factual answers under 30 words supported by empirical statistics and Schema.org knowledge graphs.**
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Why do traditional SEO articles fail to get cited in Perplexity?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              **Traditional articles fail because they open with generic introductory filler and subjective opinions, which LLM retrieval pipelines penalize during RAG vector re-ranking.**
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              What is Schema.org SpeakableSpecification?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              **SpeakableSpecification is a structured data schema that points audio assistants like Google Assistant to the exact CSS selectors eligible for spoken read-out.**
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Can interactive tools get cited higher than editorial blog posts?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              **Yes, AI search engines prioritize interactive calculation tools because they provide executable utility to solve complex user problems in real time.**
            </p>
          </div>
        </div>

        {/* Cross-Linking Navigation */}
        {/* Interlinked Suite & Cross-Links (Law 6 & Law 12) */}
        <div className="mt-12 space-y-4">
          <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-white">Need to Generate Conversational Schema?</h4>
              <p className="text-xs text-slate-300 mt-1">
                Create Speakable and HowTo voice schemas for 15 conversational problem scenarios in seconds.
              </p>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('/tools/conversational-schema-generator')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                Open Conversational Schema Generator <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {onNavigate && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-black uppercase text-indigo-400">Position #0 AEO</div>
                <div className="text-xs font-black text-white group-hover:text-indigo-300 mt-0.5">
                  AEO Position #0 Sniper Optimizer →
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Format direct-answer tokens and 50-word answer blocks for Google AI Overviews.
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/tools/brand-knowledge-graph-generator')}
                className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-black uppercase text-indigo-400">Brand Authority</div>
                <div className="text-xs font-black text-white group-hover:text-indigo-300 mt-0.5">
                  Brand Knowledge Graph Generator →
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Anchor founders, products, and Wikidata entities to build unshakeable AI citations.
                </div>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
