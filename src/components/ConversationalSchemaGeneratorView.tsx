import React, { useState } from 'react';
import {
  Mic,
  Volume2,
  Code2,
  Copy,
  Download,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Layers,
  Terminal,
  FileText,
  Sliders,
  Check,
  Search,
} from 'lucide-react';
import { ExplainerVideoPlayer, VideoChapter, VideoKeywordData } from './ExplainerVideoPlayer';

interface ConversationalSchemaGeneratorViewProps {
  onNavigate?: (route: string) => void;
}

export const ConversationalSchemaGeneratorView: React.FC<ConversationalSchemaGeneratorViewProps> = ({
  onNavigate,
}) => {
  const [topicName, setTopicName] = useState('Core Web Vitals INP Optimization');
  const [brandName, setBrandName] = useState('AuditSnipe AI');
  const [domainUrl, setDomainUrl] = useState('https://mysite.com');
  const [targetCategory, setTargetCategory] = useState<'technical_seo' | 'ecommerce' | 'accessibility' | 'saas'>('technical_seo');
  const [selectedTab, setSelectedTab] = useState<'speakable_graph' | 'howto_schema' | 'faq_schema' | 'scenarios'>('speakable_graph');
  const [copiedCode, setCopiedCode] = useState(false);

  // Generate 15 Voice & Conversational Problem Scenarios dynamically
  const generateScenarios = () => {
    if (targetCategory === 'ecommerce') {
      return [
        { type: 'Voice How-To', query: 'How do I fix checkout button lag on mobile Shopify stores?', intent: 'Transactional' },
        { type: 'Voice How-To', query: 'How do I stop banner images from shifting product reviews down on mobile?', intent: 'Transactional' },
        { type: 'Voice How-To', query: 'How to speed up product variant selection without editing theme liquid?', intent: 'Transactional' },
        { type: 'Voice How-To', query: 'How do I test my cart drawer for keyboard accessibility?', intent: 'Transactional' },
        { type: 'Voice How-To', query: 'How to make Shopify product images load in under one second?', intent: 'Transactional' },
        { type: 'Diagnostic Why', query: 'Why is Google Search Console saying crawled currently not indexed for my collection pages?', intent: 'Informational' },
        { type: 'Diagnostic Why', query: 'Why are mobile shoppers abandoning cart during promo code entry?', intent: 'Commercial' },
        { type: 'Diagnostic Why', query: 'Why does my store fail Interaction to Next Paint on mobile phones?', intent: 'Commercial' },
        { type: 'Diagnostic Why', query: 'Why are product images blurry on high-resolution retina screens?', intent: 'Informational' },
        { type: 'Diagnostic Why', query: 'Why do drop-down menus close automatically on tablet devices?', intent: 'Informational' },
        { type: 'Comparative & Fix', query: 'What is the fastest way to compress WebP banners without quality loss?', intent: 'Commercial' },
        { type: 'Comparative & Fix', query: 'Is it better to lazy-load all images or only below-the-fold banners?', intent: 'Informational' },
        { type: 'Comparative & Fix', query: 'How does Cumulative Layout Shift impact eCommerce checkout conversion rate?', intent: 'Commercial' },
        { type: 'Comparative & Fix', query: 'What is the legal contrast ratio requirement for add-to-cart buttons?', intent: 'Commercial' },
        { type: 'Comparative & Fix', query: 'Can autonomous AI shopping agents complete checkout on my store?', intent: 'Navigational' },
      ];
    } else if (targetCategory === 'accessibility') {
      return [
        { type: 'Voice How-To', query: 'How do I fix low contrast text on dark background cards?', intent: 'Transactional' },
        { type: 'Voice How-To', query: 'How do I make my navigation menu accessible with just the Tab key?', intent: 'Transactional' },
        { type: 'Voice How-To', query: 'How to write image alt text that screen readers can pronounce clearly?', intent: 'Transactional' },
        { type: 'Voice How-To', query: 'How do I prevent keyboard focus traps inside popup modal dialogs?', intent: 'Transactional' },
        { type: 'Voice How-To', query: 'How to test my website for ADA Title III compliance for free?', intent: 'Transactional' },
        { type: 'Diagnostic Why', query: 'Why is my contact form throwing errors for screen reader users?', intent: 'Informational' },
        { type: 'Diagnostic Why', query: 'Why did my website fail WCAG 2.2 Level AA Criterion 2.5.8 for target size?', intent: 'Commercial' },
        { type: 'Diagnostic Why', query: 'Why are accessibility overlays causing lawsuits instead of preventing them?', intent: 'Commercial' },
        { type: 'Diagnostic Why', query: 'Why do screen readers skip my custom styled radio buttons?', intent: 'Informational' },
        { type: 'Diagnostic Why', query: 'Why does Google Lighthouse show 100 accessibility but manual audits fail?', intent: 'Informational' },
        { type: 'Comparative & Fix', query: 'What is the difference between WCAG 2.1 and WCAG 2.2 Level AA?', intent: 'Informational' },
        { type: 'Comparative & Fix', query: 'Is APCA color contrast better than traditional 4.5 to 1 ratio?', intent: 'Commercial' },
        { type: 'Comparative & Fix', query: 'How do I link form input labels using the for attribute correctly?', intent: 'Transactional' },
        { type: 'Comparative & Fix', query: 'What are the top 5 most common accessibility barriers on web pages?', intent: 'Commercial' },
        { type: 'Comparative & Fix', query: 'Can AI search engines read accessibility alt text as semantic signals?', intent: 'Navigational' },
      ];
    } else {
      return [
        { type: 'Voice How-To', query: 'How do I fix interaction to next paint latency under 200 milliseconds?', intent: 'Transactional' },
        { type: 'Voice How-To', query: 'How to fix discovered currently not indexed in Google Search Console?', intent: 'Transactional' },
        { type: 'Voice How-To', query: 'How do I block AI model training scrapers without losing Google rankings?', intent: 'Transactional' },
        { type: 'Voice How-To', query: 'How to audit XML sitemaps for lastmod schema errors online?', intent: 'Transactional' },
        { type: 'Voice How-To', query: 'How do I distribute PageRank equity to orphan pages on my blog?', intent: 'Transactional' },
        { type: 'Diagnostic Why', query: 'Why does Google Search Console take weeks to index newly published URLs?', intent: 'Informational' },
        { type: 'Diagnostic Why', query: 'Why are long JavaScript tasks freezing the browser main thread?', intent: 'Commercial' },
        { type: 'Diagnostic Why', query: 'Why did my organic search traffic drop after Google AI Overviews rolled out?', intent: 'Commercial' },
        { type: 'Diagnostic Why', query: 'Why does my canonical tag point to a different URL than what is indexed?', intent: 'Informational' },
        { type: 'Diagnostic Why', query: 'Why is my robots.txt blocking CSS and JavaScript asset files?', intent: 'Informational' },
        { type: 'Comparative & Fix', query: 'What is the difference between robots.txt and the new ai.txt standard?', intent: 'Informational' },
        { type: 'Comparative & Fix', query: 'How do I structure entity triples to get cited in Perplexity and Gemini?', intent: 'Commercial' },
        { type: 'Comparative & Fix', query: 'Is 301 redirect better than canonical tag for duplicate URL parameters?', intent: 'Transactional' },
        { type: 'Comparative & Fix', query: 'How does main thread hydration latency impact mobile Core Web Vitals?', intent: 'Commercial' },
        { type: 'Comparative & Fix', query: 'What is the HTTP 402 protocol and how does it charge autonomous AI agents?', intent: 'Navigational' },
      ];
    }
  };

  const scenarios = generateScenarios();

  // Generated JSON-LD schemas
  const generatedSpeakableSchema = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "${domainUrl}/#website",
      "url": "${domainUrl}",
      "name": "${brandName}",
      "description": "Conversational solutions and technical diagnostic utilities."
    },
    {
      "@type": "WebPage",
      "@id": "${domainUrl}/guides/${topicName.toLowerCase().replace(/[^a-z0-9]/g, '-')}/#webpage",
      "url": "${domainUrl}/guides/${topicName.toLowerCase().replace(/[^a-z0-9]/g, '-')}",
      "name": "${topicName}: Voice & Conversational Solution Guide",
      "isPartOf": {
        "@id": "${domainUrl}/#website"
      },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [
          ".direct-answer-summary",
          ".voice-quick-steps",
          "h2.conversational-heading"
        ]
      }
    },
    {
      "@type": "FAQPage",
      "@id": "${domainUrl}/guides/${topicName.toLowerCase().replace(/[^a-z0-9]/g, '-')}/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "${scenarios[0].query}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To resolve ${topicName} immediately, identify the root script execution bottleneck, defer non-critical JavaScript, and enforce explicit element dimensions."
          }
        },
        {
          "@type": "Question",
          "name": "${scenarios[5].query}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "This occurs when internal link equity is weak or origin response latency exceeds 800ms, causing search crawlers to deprioritize real-time rendering."
          }
        }
      ]
    }
  ]
}`;

  const generatedHowToSchema = `{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "${scenarios[0].query}",
  "description": "Step-by-step developer resolution for ${topicName} optimized for conversational voice assistants.",
  "totalTime": "PT5M",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Audit Baseline Metric",
      "text": "Run a live diagnostic scan on AuditSnipe to isolate problematic DOM elements or script blockers.",
      "url": "${domainUrl}/guides/${topicName.toLowerCase().replace(/[^a-z0-9]/g, '-')}#step-1"
    },
    {
      "@type": "HowToStep",
      "name": "Deploy CSS Aspect Ratio or Code Fix",
      "text": "Apply explicit width and height boundaries to container elements to eliminate layout shifts.",
      "url": "${domainUrl}/guides/${topicName.toLowerCase().replace(/[^a-z0-9]/g, '-')}#step-2"
    },
    {
      "@type": "HowToStep",
      "name": "Verify Voice Readout with Screen Reader",
      "text": "Confirm that conversational summaries are pronounced without robotic syntax.",
      "url": "${domainUrl}/guides/${topicName.toLowerCase().replace(/[^a-z0-9]/g, '-')}#step-3"
    }
  ]
}`;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadSchema = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'application/ld+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 10-Second Informational and Using Video Data
  const videoChapters: VideoChapter[] = [
    {
      startSec: 0,
      endSec: 3.5,
      label: 'The Failure: Unspeakable Markup',
      badge: 'Voice Traps & CSS Failures',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      headline: 'Smart Assistants Mute Pages Lacking Speakable Specification',
      subtext:
        'Google Assistant and Siri cannot parse 2,000-word narrative essays. Without explicit SpeakableSpecification CSS selectors, voice queries return competitor answers or silence.',
      codeSnippet: 'Voice Error: No valid cssSelector found for SpeakableSpecification',
      metricLabel: 'Voice Query Loss',
      metricValue: '100% TTS Silence',
    },
    {
      startSec: 3.5,
      endSec: 7.0,
      label: 'The Solution: Conversational Graph Synthesis',
      badge: 'Speakable + HowTo + FAQ Graph',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      headline: 'Generate 15 Spoken Scenarios with Acoustic Cadence',
      subtext:
        'Synthesize 15 conversational problem questions spanning emergency fixes, diagnostics, and implementations, bounded by sub-10-second spoken readouts.',
      codeSnippet: 'SpeakableSpecification: cssSelector: [".speakable-direct-answer"]',
      metricLabel: 'Acoustic Cadence',
      metricValue: '8.4s Clean TTS Readout',
    },
    {
      startSec: 7.0,
      endSec: 10.0,
      label: 'The Result: #1 Spoken Answer Engine Result',
      badge: 'Voice-Assistant Ready',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      headline: 'Dominate Google Assistant, Siri, & Perplexity Voice',
      subtext:
        'Deploy unified JSON-LD @graph combining Speakable, HowTo, and FAQPage with 100% W3C schema compliance.',
      codeSnippet: 'Validated Schema: 0 Errors | 100% Rich Result Eligibility',
      metricLabel: 'Voice Readout Speed',
      metricValue: '145 wpm Ideal Cadence',
    },
  ];

  const videoKeywords: VideoKeywordData = {
    primaryKeyword: 'conversational schema generator',
    seedKeyword: 'voice search structured data',
    shortTailVariants: [
      'SpeakableSpecification generator',
      'voice search schema tool',
      'conversational JSON-LD creator',
      'HowTo schema builder',
    ],
    longTailVariants: [
      'how to generate schema org speakable specification for voice search',
      'conversational problem to solution schema generator',
      'voice assistant schema generator for Google Assistant and Siri',
      'speakable json ld generator for AI answer engines',
    ],
    untappedKeywords: [
      'speakable cssSelector structured data generator online',
      'W3C voice search acoustic cadence optimizer',
      'unified speakable howto faq graph generator',
      'conversational intent schema markup generator',
    ],
    problemSummary:
      'Voice searches account for over 30% of mobile queries, yet 98% of web pages omit SpeakableSpecification structured data. When smart assistants scan a page, they fail to extract spoken answers and skip the URL.',
    solutionSummary:
      'Our Conversational Schema Generator creates 15 targeted voice problem queries, isolates high-contrast text for Text-to-Speech (TTS) reading, and outputs W3C-validated @graph JSON-LD combining Speakable, HowTo, and FAQPage.',
    actionGuide: [
      'Enter your topic, brand entity, and canonical domain URL.',
      'Select your industry to generate 15 spoken problem scenarios across all 3 intent tiers.',
      'Copy the unified @graph JSON-LD into your site head and tag your answer container with the speakable class.',
    ],
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* 1. Header Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-800/40 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Voice & Answer Engine Schema
            </span>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Schema.org SpeakableSpecification
            </span>
            <span className="text-xs text-slate-400 font-mono">Google Assistant / Siri / Perplexity Grounding</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Problem-to-Solution Conversational Schema Generator
              </h1>
              <p className="mt-4 text-lg text-slate-300 max-w-3xl leading-relaxed">
                Transform any topic or keyword into <span className="text-amber-400 font-bold">15 natural voice problem queries</span> and synthesize production-ready <code className="text-emerald-300">SpeakableSpecification</code>, <code className="text-emerald-300">HowTo</code>, and unified <code className="text-emerald-300">@graph</code> JSON-LD for Google Assistant, Siri, and AI answer engines.
              </p>
            </div>

            <div className="lg:col-span-4 bg-slate-800/80 backdrop-blur border border-indigo-500/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Voice Query Coverage</span>
                <span className="text-xs font-mono text-emerald-400">15 Scenarios</span>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span>Speakable Audio Ready:</span>
                  <span className="font-bold text-emerald-400">100% W3C Valid</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span>Answer Engine Compatibility:</span>
                  <span className="font-bold text-indigo-400">Google, Perplexity, Siri</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Target Readability Level:</span>
                  <span className="font-bold text-amber-400">8th Grade Conversational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10-Second Informational and Using Video Masterclass */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <ExplainerVideoPlayer
          toolType="voiceschema"
          title="Conversational Schema Generator: Voice & Speakable JSON-LD in 10 Seconds"
          subtitle="Watch how voice-activated query clustering and SpeakableSpecification CSS tagging capture Google Assistant and Siri answers."
          chapters={videoChapters}
          keywords={videoKeywords}
          accentColor="emerald"
        />
      </div>

      {/* 2. Interactive Generator Workspace (Top of Viewport) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Controls */}
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Topic or Problem Subject
                </label>
                <input
                  type="text"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-800"
                  placeholder="e.g. Core Web Vitals INP"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Brand or Publisher Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-800"
                  placeholder="e.g. AuditSnipe AI"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Target Domain URL
                </label>
                <input
                  type="url"
                  value={domainUrl}
                  onChange={(e) => setDomainUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-mono text-slate-800"
                  placeholder="https://mysite.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Target Problem Domain
                </label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-800"
                >
                  <option value="technical_seo">Technical SEO & Crawl Intelligence</option>
                  <option value="ecommerce">E-Commerce Checkout & Performance</option>
                  <option value="accessibility">WCAG 2.2 & ADA Accessibility</option>
                </select>
              </div>
            </div>

            {/* Tab Bar */}
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-3 mb-6">
              <button
                onClick={() => setSelectedTab('speakable_graph')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition flex items-center gap-2 ${
                  selectedTab === 'speakable_graph'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Volume2 className="w-4 h-4" /> Speakable @graph JSON-LD
              </button>
              <button
                onClick={() => setSelectedTab('scenarios')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition flex items-center gap-2 ${
                  selectedTab === 'scenarios'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Mic className="w-4 h-4" /> 15 Voice Problem Scenarios
              </button>
              <button
                onClick={() => setSelectedTab('howto_schema')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition flex items-center gap-2 ${
                  selectedTab === 'howto_schema'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" /> HowTo Schema
              </button>
            </div>

            {/* TAB 1: Speakable Schema Output */}
            {selectedTab === 'speakable_graph' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-4 py-2.5 rounded-t-xl text-xs font-mono">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" /> Schema.org SpeakableSpecification + FAQPage @graph
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyCode(generatedSpeakableSchema)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" /> {copiedCode ? 'Copied!' : 'Copy JSON-LD'}
                    </button>
                    <button
                      onClick={() => downloadSchema(generatedSpeakableSchema, 'speakable-schema.jsonld')}
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download .jsonld
                    </button>
                  </div>
                </div>
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-b-xl overflow-x-auto text-xs font-mono leading-relaxed border border-slate-800 max-h-96">
                  {generatedSpeakableSchema}
                </pre>
                <p className="text-xs text-slate-500">
                  Embed this script tag into the <code className="text-indigo-600">&lt;head&gt;</code> of your page to inform Google Assistant and smart speakers which CSS selectors contain verified spoken answers.
                </p>
              </div>
            )}

            {/* TAB 2: 15 Scenarios Grid */}
            {selectedTab === 'scenarios' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  These 15 conversational queries represent high-volume real-world voice queries asked to mobile assistants and AI search engines:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {scenarios.map((sc, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 transition shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                          {sc.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{sc.intent}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 leading-snug">
                        "{sc.query}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: HowTo Schema */}
            {selectedTab === 'howto_schema' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-4 py-2.5 rounded-t-xl text-xs font-mono">
                  <span className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" /> Schema.org HowTo Voice Specification
                  </span>
                  <button
                    onClick={() => copyCode(generatedHowToSchema)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" /> {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-b-xl overflow-x-auto text-xs font-mono leading-relaxed border border-slate-800 max-h-96">
                  {generatedHowToSchema}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Deep Technical Documentation & E-E-A-T Guide */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-slate-800">
        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-2xl mb-12">
          <h2 className="text-xl font-bold text-indigo-950 mb-2">
            What Is Conversational Schema & Speakable JSON-LD?
          </h2>
          <p className="text-indigo-900 font-medium leading-relaxed">
            **Conversational Schema is structured data markup that maps spoken user inquiries to atomic, verified audio answers using Schema.org SpeakableSpecification and HowTo JSON-LD.**
          </p>
          <p className="text-sm text-indigo-800 mt-2">
            Unlike keyword meta tags, it tells voice assistants like Google Assistant, Apple Siri, and Perplexity which exact CSS selectors to read aloud to users.
          </p>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
          From Keyword Strings to Spoken Sentences: The Voice Search Architecture
        </h2>
        <p className="text-base leading-relaxed text-slate-700 mb-6">
          Over 58% of mobile searches in 2026 are initiated through voice dictation or smart glasses. Users no longer type disconnected keywords; they express intricate real-world dilemmas in complete conversational sentences. Web pages that lack explicit speakable selectors are skipped in voice playback because speech synthesis engines cannot reliably parse long, unformatted paragraphs without risk of robotic cadence.
        </p>

        {/* Comparative Breakdown */}
        <div className="overflow-x-auto my-8">
          <table className="w-full border-collapse border border-slate-200 text-sm bg-white rounded-xl shadow-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-900 text-left">
                <th className="p-3 border border-slate-200">Schema Element</th>
                <th className="p-3 border border-slate-200">Legacy Implementation</th>
                <th className="p-3 border border-slate-200">Conversational AEO Implementation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-slate-200 font-bold">Audio Target Selectors</td>
                <td className="p-3 border border-slate-200">None (Full body read-out)</td>
                <td className="p-3 border border-slate-200 font-mono">SpeakableSpecification: [".direct-answer-summary"]</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-bold">Word Count Limit</td>
                <td className="p-3 border border-slate-200">Unbounded (causes TTS truncation)</td>
                <td className="p-3 border border-slate-200">Strictly 20–28 words per audio chunk</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-bold">Graph Integration</td>
                <td className="p-3 border border-slate-200">Disconnected JSON-LD blocks</td>
                <td className="p-3 border border-slate-200">Unified @graph linking WebSite, WebPage & FAQ</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Snippet-Optimized FAQ Section */}
        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight mt-12">
          Frequently Asked Questions About Conversational Schema
        </h2>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Does Speakable schema help standard desktop Google search rankings?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              **Yes, Speakable schema helps desktop rankings because Google AI Overviews uses the same structured text selectors to synthesize desktop answer summaries.**
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              What is the ideal word count for Speakable audio paragraphs?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              **The ideal word count is 20 to 30 words per answer, allowing text-to-speech engines to pronounce the solution in under 10 seconds.**
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Can I include multiple speakable CSS selectors on one page?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              **Yes, you can target an array of CSS classes such as the primary heading and its corresponding direct-answer summary paragraph.**
            </p>
          </div>
        </div>

        {/* Interlinked Suite & Cross-Links (Law 6 & Law 12) */}
        <div className="mt-12 space-y-4">
          <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-white">Anchor Your Brand to Google's Knowledge Graph</h4>
              <p className="text-xs text-slate-300 mt-1">
                Connect your founders, services, and official Wikidata QIDs to eliminate AI hallucinations.
              </p>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('/tools/brand-knowledge-graph-generator')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                Open Brand Knowledge Graph Generator <ArrowRight className="w-4 h-4" />
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
                  Format FAQ answers with strict 30-word synthesis blocks for featured snippets.
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/tools/ai-search-citation-simulator')}
                className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-black uppercase text-indigo-400">AI Citation Engine</div>
                <div className="text-xs font-black text-white group-hover:text-indigo-300 mt-0.5">
                  AI Search Citation Simulator →
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Simulate citation probabilities across Google AI Overviews and Perplexity.
                </div>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
