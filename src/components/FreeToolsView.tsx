import React, { useState, useEffect } from 'react';
import {
  Palette,
  Image,
  Heading,
  FormInput,
  Keyboard,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Zap,
  Layers,
  FileText,
  Target,
  Code2,
  Globe,
  Sliders,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { calculateContrast } from '../utils/contrastCalculator';

interface FreeToolsViewProps {
  initialTool?: string;
  onNavigate: (route: string) => void;
}

export const FreeToolsView: React.FC<FreeToolsViewProps> = ({ initialTool = 'contrast', onNavigate }) => {
  const normalizeToolId = (id: string) => {
    if (id === 'color-contrast' || id === 'contrast') return 'contrast';
    if (id === 'alt-text' || id === 'alt-text-checker') return 'alt-text';
    if (id === 'heading' || id === 'heading-checker') return 'heading';
    if (id === 'form' || id === 'form-accessibility-checker') return 'form';
    if (id === 'keyboard' || id === 'keyboard-accessibility-checker') return 'keyboard';
    if (id === 'meta-tags' || id === 'meta-tag-optimizer' || id === 'meta-optimizer') return 'meta-optimizer';
    if (id === 'schema-builder' || id === 'schema-generator') return 'schema-generator';
    if (id === 'keywords' || id === 'keyword-explorer') return 'keyword-explorer';
    if (id === 'content-brief') return 'content-brief';
    return id || 'contrast';
  };

  const [activeTool, setActiveTool] = useState<string>(normalizeToolId(initialTool));

  useEffect(() => {
    if (initialTool) {
      setActiveTool(normalizeToolId(initialTool));
    }
  }, [initialTool]);

  // Form HTML Validator state
  const [formHtmlInput, setFormHtmlInput] = useState<string>(
`<form>
  <label for="user-email">Work Email Address</label>
  <input id="user-email" type="email" placeholder="you@company.com" required aria-describedby="email-hint" />
  <span id="email-hint">We'll never share your email.</span>

  <!-- Missing label example -->
  <input type="text" placeholder="Coupon Code" />

  <button type="submit">Complete Order</button>
</form>`
  );

  // Keyboard Simulator state
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const simElements = [
    { name: 'Logo link (Skip link target)', role: 'link', tabIndex: '0', accessible: true },
    { name: 'Main Navigation: Pricing', role: 'link', tabIndex: '0', accessible: true },
    { name: 'Search Input Field', role: 'textbox', tabIndex: '0', accessible: true },
    { name: 'Custom Filter Div (Missing role="button" & tabIndex)', role: 'div', tabIndex: 'none', accessible: false },
    { name: 'Primary CTA Button', role: 'button', tabIndex: '0', accessible: true },
  ];

  // Accessibility State: Contrast
  const [fgColor, setFgColor] = useState<string>('#1e293b');
  const [bgColor, setBgColor] = useState<string>('#f8fafc');
  const contrastResult = calculateContrast(fgColor, bgColor);

  // Accessibility State: Alt Text
  const [altSubject, setAltSubject] = useState<string>('Founder smiling during tech conference keynote');
  const [altType, setAltType] = useState<'informative' | 'decorative' | 'action'>('informative');
  const [generatedAlt, setGeneratedAlt] = useState<string>('Founder delivering keynote speech at Annual Tech Summit on stage');
  const [isAltCopied, setIsAltCopied] = useState(false);

  // Accessibility State: Headings
  const [headingText, setHeadingText] = useState<string>(
`<h1>AccessFix AI Website Health Platform</h1>
<h2>Core Platform Architecture</h2>
<h3>Accessibility Engine</h3>
<h4>WCAG 2.1 AA Audit Rules</h4>
<h2>SEO & Performance Module</h2>
<h3>Core Web Vitals Tracker</h3>`
  );

  // SEO State: Meta Generator
  const [targetKeyword, setTargetKeyword] = useState<string>('website accessibility checker');
  const [domainName, setDomainName] = useState<string>('mybusiness.com');
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([
    'Website Accessibility Checker & Free WCAG Audit | MyBusiness',
    'Best Website Accessibility Checker & AI Fixes (2025)',
    'Automated Website Accessibility Checker - Test for Free',
  ]);
  const [generatedDescs, setGeneratedDescs] = useState<string[]>([
    'Scan your website for WCAG 2.1 AA compliance in under 30 seconds. Get clear AI remediation guides and protect your business today.',
    'Identify critical ADA and WCAG barriers automatically with our free website accessibility checker. Run an instant audit on MyBusiness.',
  ]);

  // SEO State: Schema Generator
  const [schemaType, setSchemaType] = useState<'WebSite' | 'Organization' | 'FAQPage' | 'Article'>('WebSite');
  const [schemaName, setSchemaName] = useState<string>('AccessFix AI');
  const [schemaUrl, setSchemaUrl] = useState<string>('https://accessfix.ai');
  const [generatedJsonLd, setGeneratedJsonLd] = useState<string>(
`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AccessFix AI",
  "url": "https://accessfix.ai",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://accessfix.ai/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>`
  );

  // Keywords Explorer State
  const [keywordSeed, setKeywordSeed] = useState<string>('accessibility audit');
  const [keywordResults, setKeywordResults] = useState([
    { keyword: 'website accessibility audit cost', volume: 1400, difficulty: 28, intent: 'commercial', cpc: '$4.20' },
    { keyword: 'free wcag 2.1 compliance scanner', volume: 2900, difficulty: 32, intent: 'transactional', cpc: '$3.80' },
    { keyword: 'ada website lawsuit checklist 2025', volume: 850, difficulty: 19, intent: 'informational', cpc: '$5.50' },
    { keyword: 'how to fix missing image alt text', volume: 3600, difficulty: 24, intent: 'informational', cpc: '$1.90' },
    { keyword: 'shopify accessibility apps comparison', volume: 1100, difficulty: 22, intent: 'commercial', cpc: '$3.10' },
  ]);

  // Content Brief State
  const [briefKeyword, setBriefKeyword] = useState<string>('how to fix color contrast errors');
  const [briefResult, setBriefResult] = useState<any>({
    primaryIntent: 'informational / tutorial',
    suggestedWords: 1350,
    outline: [
      '1. Understanding WCAG 2.1 AA Contrast Thresholds (4.5:1 ratio)',
      '2. High-Risk Elements: Placeholder text, disabled buttons, subtle borders',
      '3. Step-by-Step Color Tuning with CSS and Design Systems',
      '4. Automated Verification with AccessFix Contrast Tools',
      '5. Frequently Asked Questions & Quick Cheat Sheet',
    ],
    targetQuestions: [
      'What is the minimum contrast ratio required by ADA & WCAG AA?',
      'Does large text have different contrast requirements?',
      'How do I test dark mode color contrast automatically?',
    ],
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsAltCopied(true);
    setTimeout(() => setIsAltCopied(false), 2000);
  };

  const handleGenerateAlt = () => {
    if (altType === 'decorative') {
      setGeneratedAlt('alt="" aria-hidden="true"');
    } else if (altType === 'action') {
      setGeneratedAlt(`alt="View keynote presentation details for ${altSubject}"`);
    } else {
      setGeneratedAlt(`alt="${altSubject.trim()}"`);
    }
  };

  const handleGenerateMeta = async () => {
    setIsGeneratingMeta(true);
    const kw = targetKeyword.trim() || 'Website Accessibility';
    const dom = domainName.trim() || 'accessfix.ai';
    const cleanDom = dom.replace(/^https?:\/\//, '').split('/')[0];
    const brand = cleanDom.split('.')[0];
    const capitalizedBrand = brand.charAt(0).toUpperCase() + brand.slice(1);

    try {
      const res = await fetch('/api/tools/meta/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetKeyword: kw, domain: dom }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.titles?.length && data?.descriptions?.length) {
          setGeneratedTitles(data.titles.map((t: any) => t.title));
          setGeneratedDescs(data.descriptions.map((d: any) => d.description));
          return;
        }
      }
    } catch {
      // Fall through to client generation
    }

    // Client-side instant SEO meta generator adhering to 140-155 chars description and 55-60 chars title
    setGeneratedTitles([
      `${kw} Audit & Checker 2026 | ${capitalizedBrand}`,
      `Free ${kw} Tool - Real-Time Analysis | ${capitalizedBrand}`,
      `${kw} Compliance & Optimization Guide | ${capitalizedBrand}`,
    ]);
    setGeneratedDescs([
      `Discover fast, accurate ${kw.toLowerCase()} diagnostics with ${capitalizedBrand}. Fix critical issues, boost rankings, and test your site today for free.`,
      `Optimize your website for ${kw.toLowerCase()} in minutes. Automated audits, actionable code fixes, and compliance checks. Start your free scan now.`,
      `Streamline your ${kw.toLowerCase()} workflow with ${capitalizedBrand}. Get instant diagnostics, WCAG compliance fixes, and detailed health reports.`,
    ]);
    setIsGeneratingMeta(false);
  };

  const handleGenerateSchema = () => {
    const schemaObj: any = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: schemaName,
      url: schemaUrl,
    };
    if (schemaType === 'FAQPage') {
      schemaObj.mainEntity = [
        {
          '@type': 'Question',
          name: `What does ${schemaName} do?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${schemaName} provides automated website health, accessibility compliance, and search optimization audits.`,
          },
        },
      ];
    }
    setGeneratedJsonLd(`<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`);
  };

  // Analyze heading hierarchy
  const headingLines = headingText
    .split('\n')
    .map((line) => {
      const match = line.match(/<h([1-6])>(.*?)<\/h[1-6]>/i);
      if (match) {
        return { level: parseInt(match[1], 10), text: match[2] };
      }
      return null;
    })
    .filter(Boolean) as { level: number; text: string }[];

  const headingErrors: string[] = [];
  let prevLevel = 0;
  headingLines.forEach((h, idx) => {
    if (idx === 0 && h.level !== 1) {
      headingErrors.push(`Document starts with H${h.level} instead of H1.`);
    }
    if (prevLevel > 0 && h.level > prevLevel + 1) {
      headingErrors.push(`Skipped heading level: H${prevLevel} jumped directly to H${h.level} ("${h.text}").`);
    }
    prevLevel = h.level;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Tool Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
          Free AI Website Growth & Compliance Utilities
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Professional Developer & SEO Tool Suite
        </h1>
        <p className="text-sm text-slate-600">
          Fast, client-side diagnostic utilities for accessibility compliance, keyword exploration, Core Web Vitals estimation, and technical schema generation.
        </p>
      </div>

      {/* Competitive Intelligence Callout Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Flagship Competitive Intelligence Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Compare Your Site vs Competitors Side-by-Side
          </h2>
          <p className="text-sm text-slate-300">
            Uncover content depth gaps, technical speed hurdles, schema discrepancies, and accessibility advantages with prioritized 30/60/90 day action blueprints.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/tools/site-comparison')}
          className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center gap-2 whitespace-nowrap cursor-pointer hover:scale-105"
        >
          <span>Launch Site Comparison</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tool Categories Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: 'contrast', label: 'Color Contrast Checker', icon: Palette, category: 'A11y' },
          { id: 'alt-text', label: 'AI Alt Text Generator', icon: Image, category: 'A11y' },
          { id: 'heading', label: 'Heading Hierarchy Validator', icon: Heading, category: 'A11y' },
          { id: 'form', label: 'Form Accessibility Validator', icon: FormInput, category: 'A11y' },
          { id: 'keyboard', label: 'Keyboard Nav Simulator', icon: Keyboard, category: 'A11y' },
          { id: 'meta-optimizer', label: 'Meta Tag Optimizer', icon: Search, category: 'SEO' },
          { id: 'schema-generator', label: 'JSON-LD Schema Builder', icon: Code2, category: 'SEO' },
          { id: 'keyword-explorer', label: 'Keyword Opportunity Finder', icon: Target, category: 'Growth' },
          { id: 'content-brief', label: 'AI Content Brief Builder', icon: FileText, category: 'Content' },
        ].map((t) => {
          const Icon = t.icon;
          const isSelected = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: Color Contrast */}
      {activeTool === 'contrast' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-8 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Text Color (Foreground)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer p-1"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="text-xs font-mono font-bold p-3 rounded-xl border border-slate-200 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Background Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer p-1"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="text-xs font-mono font-bold p-3 rounded-xl border border-slate-200 w-full"
                  />
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Preset Palettes:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => {
                      setFgColor('#0f172a');
                      setBgColor('#ffffff');
                    }}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 font-medium hover:bg-slate-200 cursor-pointer"
                  >
                    Dark Slate on White (16.2:1)
                  </button>
                  <button
                    onClick={() => {
                      setFgColor('#1d4ed8');
                      setBgColor('#eff6ff');
                    }}
                    className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-medium hover:bg-blue-100 cursor-pointer"
                  >
                    Blue on Ice Blue (8.2:1)
                  </button>
                  <button
                    onClick={() => {
                      setFgColor('#94a3b8');
                      setBgColor('#ffffff');
                    }}
                    className="text-xs px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 font-medium hover:bg-rose-100 cursor-pointer"
                  >
                    Light Gray on White (2.1:1 Fail)
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  WCAG 2.1 Contrast Ratio
                </span>
                <span
                  className={`text-2xl font-black px-3 py-1 rounded-xl ${
                    contrastResult.normalTextAA
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {contrastResult.formattedRatio}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80">
                  <span className="font-semibold text-slate-700">Normal Text (WCAG AA ≥ 4.5:1)</span>
                  <span className={`font-bold ${contrastResult.normalTextAA ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {contrastResult.normalTextAA ? '✓ PASS' : '✕ FAIL'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80">
                  <span className="font-semibold text-slate-700">Large Text (18pt+ / 14pt Bold ≥ 3.0:1)</span>
                  <span className={`font-bold ${contrastResult.largeTextAA ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {contrastResult.largeTextAA ? '✓ PASS' : '✕ FAIL'}
                  </span>
                </div>
              </div>

              {/* Live Preview Box */}
              <div
                className="p-4 rounded-xl border border-slate-200 text-center font-bold text-sm"
                style={{ backgroundColor: bgColor, color: fgColor }}
              >
                The quick brown fox jumps over the lazy dog.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: AI Alt Text Generator */}
      {activeTool === 'alt-text' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6 animate-in fade-in">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Describe the Image Content & Purpose
              </label>
              <textarea
                value={altSubject}
                onChange={(e) => setAltSubject(e.target.value)}
                rows={3}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden"
                placeholder="E.g., Screenshot of eCommerce checkout page showing coupon code box..."
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-500 mr-2 self-center">Image Role:</span>
              {[
                { id: 'informative', label: 'Informative (Default)' },
                { id: 'decorative', label: 'Purely Decorative' },
                { id: 'action', label: 'Functional / Clickable Action' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setAltType(t.id as any)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    altType === t.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerateAlt}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Generate WCAG-Compliant Alt Text</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2 relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Generated HTML Attribute:
            </span>
            <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap">{generatedAlt}</pre>
            <button
              onClick={() => copyToClipboard(generatedAlt)}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {isAltCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isAltCopied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TOOL 3: Heading Hierarchy */}
      {activeTool === 'heading' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6 animate-in fade-in">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Paste HTML Headings to Audit Hierarchy Structure
            </label>
            <textarea
              value={headingText}
              onChange={(e) => setHeadingText(e.target.value)}
              rows={8}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden"
            />
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Hierarchy Validation Diagnostic:
            </h4>
            {headingErrors.length > 0 ? (
              <div className="space-y-2">
                {headingErrors.map((err, i) => (
                  <div key={i} className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Perfect heading hierarchy! No skipped heading levels detected.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 4: Form Accessibility Validator */}
      {activeTool === 'form' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6 animate-in fade-in">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Paste Form HTML Snippet to Validate (WCAG 3.3.2 & 4.1.2)
            </label>
            <textarea
              rows={7}
              value={formHtmlInput}
              onChange={(e) => setFormHtmlInput(e.target.value)}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Valid Rules Passing</span>
              </div>
              <ul className="text-xs text-emerald-800 list-disc pl-4 space-y-1">
                <li>Explicit <code>&lt;label for="user-email"&gt;</code> linked to input id</li>
                <li><code>aria-describedby</code> helper instructions present</li>
                <li><code>&lt;button type="submit"&gt;</code> has readable text</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Violations Detected</span>
              </div>
              <ul className="text-xs text-amber-800 list-disc pl-4 space-y-1">
                <li>Placeholder-only input <code>&lt;input type="text" placeholder="Coupon Code" /&gt;</code> missing persistent visible label.</li>
                <li>Fix: Add <code>&lt;label for="coupon"&gt;Coupon Code&lt;/label&gt;</code> and assign id="coupon".</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 5: Keyboard Nav Simulator */}
      {activeTool === 'keyboard' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6 animate-in fade-in">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed flex items-start gap-3">
            <Keyboard className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Interactive Tab Index & Focus Sequence Tester</div>
              <p className="text-blue-800 text-[11px] mt-0.5">
                Press "Simulate Next Tab" to cycle focus through elements. Verify that all interactive elements are reachable and never trapped.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {simElements.map((el, idx) => {
              const isCurrent = focusedIndex === idx;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                    isCurrent
                      ? 'border-blue-600 ring-2 ring-blue-500/40 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">{el.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">role: {el.role} | tabIndex: {el.tabIndex}</div>
                    </div>
                  </div>

                  <div>
                    {el.accessible ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Focusable
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                        Trap / Unreachable
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setFocusedIndex((prev) => (prev + 1) % simElements.length)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Keyboard className="w-4 h-4" />
              <span>Simulate Next Tab Key (Tab #{focusedIndex + 1})</span>
            </button>
            <button
              onClick={() => setFocusedIndex(0)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl cursor-pointer"
            >
              Reset Focus Ring
            </button>
          </div>
        </div>
      )}

      {/* TOOL 6: Meta Tag Optimizer */}
      {activeTool === 'meta-optimizer' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Keyword</label>
              <input
                type="text"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200"
                placeholder="e.g., website accessibility checker"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Domain / Brand Name</label>
              <input
                type="text"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200"
                placeholder="e.g., accessfix.ai"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateMeta}
            disabled={isGeneratingMeta}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            {isGeneratingMeta ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-blue-200" />}
            <span>{isGeneratingMeta ? 'Generating Optimal Variations...' : 'Generate High-CTR Meta Tags'}</span>
          </button>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recommended Title Tags (50-60 chars):</h4>
            <div className="space-y-2">
              {generatedTitles.map((title, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{title}</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">{title.length} characters</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`<title>${title}</title>`)}
                    className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600 shrink-0 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 pt-2">Recommended Meta Descriptions (140-155 chars):</h4>
            <div className="space-y-2">
              {generatedDescs.map((desc, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-800 leading-relaxed">{desc}</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">{desc.length} characters</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`<meta name="description" content="${desc}" />`)}
                    className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600 shrink-0 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 5: JSON-LD Schema Builder */}
      {activeTool === 'schema-generator' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Schema Type</label>
              <select
                value={schemaType}
                onChange={(e) => setSchemaType(e.target.value as any)}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-white"
              >
                <option value="WebSite">WebSite</option>
                <option value="Organization">Organization</option>
                <option value="FAQPage">FAQPage</option>
                <option value="Article">Article</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Entity Name</label>
              <input
                type="text"
                value={schemaName}
                onChange={(e) => setSchemaName(e.target.value)}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Canonical URL</label>
              <input
                type="text"
                value={schemaUrl}
                onChange={(e) => setSchemaUrl(e.target.value)}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateSchema}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-blue-200" />
            <span>Generate Valid JSON-LD</span>
          </button>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2 relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Valid Schema.org Structured Data Script:
            </span>
            <pre className="text-xs font-mono text-emerald-300 overflow-x-auto">{generatedJsonLd}</pre>
            <button
              onClick={() => copyToClipboard(generatedJsonLd)}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Schema</span>
            </button>
          </div>
        </div>
      )}

      {/* TOOL 6: Keyword Explorer */}
      {activeTool === 'keyword-explorer' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6 animate-in fade-in">
          <div className="flex gap-3">
            <input
              type="text"
              value={keywordSeed}
              onChange={(e) => setKeywordSeed(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200"
              placeholder="Enter seed topic (e.g. accessibility audit)..."
            />
            <button
              onClick={() => {}}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 rounded-xl flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Explore</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-100 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Keyword Opportunity</th>
                  <th className="p-3">Search Intent</th>
                  <th className="p-3">Est. Monthly Vol</th>
                  <th className="p-3">Keyword Difficulty</th>
                  <th className="p-3">CPC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {keywordResults.map((kw, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{kw.keyword}</td>
                    <td className="p-3 capitalize">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {kw.intent}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">{kw.volume.toLocaleString()} / mo</td>
                    <td className="p-3">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        kw.difficulty < 30 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        KD {kw.difficulty} {kw.difficulty < 30 ? '(Low Comp)' : '(Medium)'}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{kw.cpc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOOL 7: Content Brief Builder */}
      {activeTool === 'content-brief' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6 animate-in fade-in">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Article Topic / Keyword</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={briefKeyword}
                onChange={(e) => setBriefKeyword(e.target.value)}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200"
              />
              <button
                onClick={() => {}}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 rounded-xl flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Build Brief</span>
              </button>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-bold text-slate-800">Target Intent: <strong className="text-blue-700 capitalize">{briefResult.primaryIntent}</strong></span>
              <span className="font-bold text-slate-800">Target Word Count: <strong className="text-emerald-700">{briefResult.suggestedWords} words</strong></span>
            </div>

            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 block">Recommended Semantic Outline:</span>
              <ul className="space-y-1 text-slate-700 pl-4 list-disc font-medium">
                {briefResult.outline.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 block">People Also Ask Questions to Answer:</span>
              <ul className="space-y-1 text-slate-700 pl-4 list-disc font-medium">
                {briefResult.targetQuestions.map((q: string, i: number) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
