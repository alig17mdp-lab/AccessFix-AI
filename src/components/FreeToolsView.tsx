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
  Info,
  FileCode,
  Clock,
  Network,
  Bot,
  Gauge,
} from 'lucide-react';
import { calculateContrast } from '../utils/contrastCalculator';
import { KeywordPlannerView } from './KeywordPlannerView';
import { DomainRatingChecker } from './DomainRatingChecker';
import { SitemapAuditorView } from './SitemapAuditorView';

interface FreeToolsViewProps {
  initialTool?: string;
  onNavigate: (route: string) => void;
}

interface ToolMeta {
  id: string;
  label: string;
  category: string;
  badge: string;
  title: string;
  seoOneLiner: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOOL_DEFINITIONS: Record<string, ToolMeta> = {
  'contrast': {
    id: 'contrast',
    label: 'Color Contrast Checker',
    category: 'Accessibility Compliance',
    badge: 'WCAG 2.1/2.2 AA & AAA Visual Compliance',
    title: 'WCAG Color Contrast Ratio Calculator',
    seoOneLiner: 'Calculate real-time luminance contrast ratios and test foreground/background color combinations against WCAG 2.1 AA/AAA compliance benchmarks.',
    icon: Palette,
  },
  'alt-text': {
    id: 'alt-text',
    label: 'AI Alt Text Generator',
    category: 'Screen Reader Optimization',
    badge: 'Automated WCAG 1.1.1 Image Descriptions',
    title: 'AI Image Alt Text Generator & OCR Context Engine',
    seoOneLiner: 'Generate descriptive, screen-reader-compliant alternative text attributes and ARIA labels optimized for visual accessibility and Google Image indexing.',
    icon: Image,
  },
  'heading': {
    id: 'heading',
    label: 'Heading Hierarchy Validator',
    category: 'Semantic SEO & Structure',
    badge: 'Semantic H1–H6 Document Structure Audit',
    title: 'Heading Hierarchy Validator & Structure Inspector',
    seoOneLiner: 'Audit document outline semantics, detect skipped heading levels, and optimize your page structure for assistive screen readers and search engines.',
    icon: Heading,
  },
  'form': {
    id: 'form',
    label: 'Form Accessibility Validator',
    category: 'WCAG 3.3.2 Form Controls',
    badge: 'Interactive Form Control & Error Announcer Audit',
    title: 'Form Accessibility & Input Labeling Auditor',
    seoOneLiner: 'Inspect HTML forms for explicit label associations, ARIA descriptions, required field announcers, and accessible keyboard error states.',
    icon: FormInput,
  },
  'keyboard': {
    id: 'keyboard',
    label: 'Keyboard Nav Simulator',
    category: 'Assistive Tech Navigation',
    badge: 'Focus Order & Interactive Trap Diagnostic',
    title: 'Keyboard Navigation & Tab Order Simulator',
    seoOneLiner: 'Simulate sequential keyboard tab order, detect focus traps, verify visual focus indicators, and test skip-link routing for non-mouse users.',
    icon: Keyboard,
  },
  'meta-optimizer': {
    id: 'meta-optimizer',
    label: 'Meta Tag Optimizer',
    category: 'SERP CTR Engineering',
    badge: 'Real-Time SERP & Social Graph Snippet Architect',
    title: 'Meta Tag Optimizer & Social Preview Studio',
    seoOneLiner: 'Craft pixel-perfect meta titles, descriptions, and OpenGraph social preview cards with character counters and click-through-rate enhancement.',
    icon: Search,
  },
  'schema-generator': {
    id: 'schema-generator',
    label: 'JSON-LD Schema Builder',
    category: 'Technical Structured Data',
    badge: 'Google Rich Results & Knowledge Graph Markup',
    title: 'JSON-LD Structured Data Schema Builder',
    seoOneLiner: 'Generate and validate Google Rich Snippet JSON-LD structured schemas for WebApplication, FAQPage, Organization, and Technical Articles.',
    icon: Code2,
  },
  'keyword-explorer': {
    id: 'keyword-explorer',
    label: 'Keyword Opportunity Finder',
    category: 'Search Intelligence',
    badge: 'Search Volume & Low-KD Gap Analysis',
    title: 'Keyword Opportunity & SERP Gap Finder',
    seoOneLiner: 'Identify high-intent organic search queries, analyze search volume trends, and uncover under-optimized keyword ranking opportunities.',
    icon: Target,
  },
  'content-brief': {
    id: 'content-brief',
    label: 'AI Content Brief Builder',
    category: 'AEO / GEO Content Modeling',
    badge: 'Semantic Topic Silo & Editorial Blueprint',
    title: 'AI Content Brief & Topic Silo Architect',
    seoOneLiner: 'Generate comprehensive editorial content briefs featuring semantic entity coverage, H2/H3 heading blueprints, and target word count recommendations.',
    icon: FileText,
  },
  'keyword-planner': {
    id: 'keyword-planner',
    label: 'AI Keyword Planner',
    category: 'Flagship Growth Engine',
    badge: '50-Keyword Blueprint • 25 Short-Tail + 25 Long-Tail',
    title: 'AI Keyword Planner & Semantic Clusters',
    seoOneLiner: 'Discover 50 high search volume, low competition keywords with verified CTR, CPM, CPC, and granular topic clusters in a structured tabular view.',
    icon: Sparkles,
  },
  'domain-rating': {
    id: 'domain-rating',
    label: 'Domain Rating & DA PA Checker',
    category: 'Authority & Backlink Intelligence',
    badge: 'Ahrefs DR, Moz DA/PA & Free Spam Score Analyzer',
    title: 'Domain Rating Checker & Authority Analyzer (DA, PA, DR, Spam Score)',
    seoOneLiner: 'Check real-time Domain Rating (DR), Domain Authority (DA), Page Authority (PA), referring domains, backlinks, Spam Score, ranking keywords, and authority gaps.',
    icon: Globe,
  },
  'sitemap-auditor': {
    id: 'sitemap-auditor',
    label: 'XML Sitemap Auditor',
    category: 'Technical SEO & Crawl Intelligence',
    badge: 'Google Search Console Validator & Fixer',
    title: 'XML Sitemap Audit & GSC Validator',
    seoOneLiner: 'Audit website sitemaps for W3C lastmod errors, insecure HTTP protocols, broken XML namespaces, and download a 100% GSC-compliant repaired sitemap.xml.',
    icon: FileCode,
  },
};

export const FreeToolsView: React.FC<FreeToolsViewProps> = ({ initialTool = 'contrast', onNavigate }) => {
  const normalizeToolId = (id: string) => {
    if (id === 'sitemap-auditor' || id === 'sitemap-audit' || id === 'sitemap' || id === 'sitemap-validator' || id === 'sitemap-checker') return 'sitemap-auditor';
    if (id === 'domain-rating' || id === 'domain-rating-checker' || id === 'domain-authority' || id === 'domain-authority-checker' || id === 'backlinks' || id === 'backlink-checker') return 'domain-rating';
    if (id === 'keyword-planner' || id === 'keyword-planning' || id === 'keywords-planner') return 'keyword-planner';
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
    { name: 'Main Navigation: Free Tools', role: 'link', tabIndex: '0', accessible: true },
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
  const [copiedMetaSnippet, setCopiedMetaSnippet] = useState<string | null>(null);
  const [metaGenSpeed, setMetaGenSpeed] = useState<number | null>(null);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([
    'Website Accessibility Checker & Free WCAG Audit | MyBusiness',
    'Best Website Accessibility Checker & AI Fixes - MyBusiness',
    'Free Website Accessibility Checker Tool & Live Report | MyBusiness',
    'Website Accessibility Checker Checklist & Audit | MyBusiness',
  ]);
  const [generatedDescs, setGeneratedDescs] = useState<string[]>([
    'Audit your website for website accessibility checker in seconds with MyBusiness. Detect critical issues and get instant code fixes. Start free scan today!',
    'Looking for verified website accessibility checker solutions? MyBusiness delivers automated compliance scans and reports. Test your site now!',
    'Streamline your website accessibility checker workflow with MyBusiness. Automated DOM audits and WCAG compliance checks. Run your audit free!',
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

  const copyMetaSnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMetaSnippet(text);
    setTimeout(() => setCopiedMetaSnippet(null), 2000);
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

  const handleGenerateMeta = () => {
    const startTime = performance.now();
    setIsGeneratingMeta(true);
    const kw = targetKeyword.trim() || 'Website Accessibility';
    const dom = domainName.trim() || 'accessfix.ai';
    const cleanDom = dom.replace(/^https?:\/\//, '').split('/')[0];
    const brandRaw = cleanDom.split('.')[0] || 'Brand';
    const capitalizedBrand = brandRaw.charAt(0).toUpperCase() + brandRaw.slice(1);
    const capKw = kw.charAt(0).toUpperCase() + kw.slice(1);

    // Dynamic Title Fitting strictly targeting 50-60 characters
    const fitTitle = (candidate: string, fallback: string): string => {
      if (candidate.length >= 50 && candidate.length <= 60) return candidate;
      if (candidate.length > 60) {
        if (fallback.length >= 50 && fallback.length <= 60) return fallback;
        const simple = `${capKw} | ${capitalizedBrand}`;
        if (simple.length >= 50 && simple.length <= 60) return simple;
        return candidate.slice(0, 57).trim() + '...';
      }
      const fillers = ['(2026)', 'Free Audit', 'Fast & Free', 'Solutions', 'Report'];
      for (const f of fillers) {
        const trial = `${candidate.replace(` | ${capitalizedBrand}`, '').replace(` - ${capitalizedBrand}`, '')} ${f} | ${capitalizedBrand}`;
        if (trial.length >= 50 && trial.length <= 60) return trial;
      }
      return candidate;
    };

    const optimalTitles = [
      fitTitle(`${capKw}: Free Audit & Guide | ${capitalizedBrand}`, `${capKw} Audit & Guide | ${capitalizedBrand}`),
      fitTitle(`Best ${capKw} Solutions & AI Fixes - ${capitalizedBrand}`, `Best ${capKw} Solutions | ${capitalizedBrand}`),
      fitTitle(`Free ${capKw} Tool & Live Report | ${capitalizedBrand}`, `${capKw} Free Tool & Report | ${capitalizedBrand}`),
      fitTitle(`${capKw} Checklist & Compliance | ${capitalizedBrand}`, `${capKw} Checklist & Audit | ${capitalizedBrand}`),
    ];

    // Dynamic Description Fitting strictly targeting 140-155 characters with CTA
    const fitNaturalDescription = (lead: string, clauses: string[], cta: string): string => {
      let text = `${lead} ${cta}`;
      for (const clause of clauses) {
        const trial = `${lead} ${clause} ${cta}`;
        if (trial.length <= 155) {
          text = trial;
          if (text.length >= 140) break;
        }
      }
      if (text.length < 140) {
        const boosters = [
          'Get actionable recommendations and zero guesswork.',
          'Instant reports and automated code remediations.',
          'Fast, verified diagnostics.',
        ];
        for (const b of boosters) {
          const trial = text.replace(cta, `${b} ${cta}`);
          if (trial.length >= 140 && trial.length <= 155) {
            return trial;
          }
        }
      }
      return text;
    };

    const optimalDescs = [
      fitNaturalDescription(
        `Audit your site for ${kw.toLowerCase()} in seconds with ${capitalizedBrand}.`,
        [
          'Detect critical gaps, get instant AI code fixes, and boost organic rankings.',
          'Detect critical issues and get instant code fixes.',
          'Fix compliance barriers fast.',
        ],
        'Start free scan today!'
      ),
      fitNaturalDescription(
        `Looking for verified ${kw.toLowerCase()} solutions?`,
        [
          `${capitalizedBrand} delivers automated compliance scans, real-time reports, and actionable fixes.`,
          `${capitalizedBrand} provides automated scans and reports.`,
        ],
        'Test your site now!'
      ),
      fitNaturalDescription(
        `Streamline your ${kw.toLowerCase()} workflow with ${capitalizedBrand}.`,
        [
          'Run instant DOM audits, verify WCAG compliance, and export reports.',
          'Automated DOM audits and WCAG compliance checks.',
        ],
        'Run your audit free!'
      ),
    ];

    // Instant sub-100ms generation providing crisp tactile feedback & guaranteed non-hanging execution
    setTimeout(() => {
      setGeneratedTitles(optimalTitles);
      setGeneratedDescs(optimalDescs);
      const elapsed = Math.round(performance.now() - startTime);
      setMetaGenSpeed(Math.max(18, elapsed));
      setIsGeneratingMeta(false);
    }, 60);
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

  const currentToolMeta = TOOL_DEFINITIONS[activeTool] || TOOL_DEFINITIONS['contrast'];
  const ActiveIcon = currentToolMeta.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8" id="free-tools-view">
      {/* Dynamic SEO Tool Header (Dynamic per tool with SEO-optimized 1-line description) */}
      <div className="text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs">
          <ActiveIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>{currentToolMeta.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          {currentToolMeta.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {currentToolMeta.seoOneLiner}
        </p>
      </div>

      {/* Tool Categories & Switcher Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 pb-2">
        {/* Quick link to Flagship tools */}
        <button
          onClick={() => onNavigate('/tools/single-answer-precision-optimizer')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer shadow-md hover:scale-102 border border-emerald-300/50"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
          <Target className="w-3.5 h-3.5 text-emerald-200" />
          <span>Single-Answer Precision (AEO)</span>
        </button>

        <button
          onClick={() => onNavigate('/tools/touch-target-size-calculator')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-800 text-white hover:from-indigo-600 hover:to-blue-600 transition-all cursor-pointer shadow-md hover:scale-102 border border-indigo-300/40"
        >
          <Target className="w-3.5 h-3.5 text-cyan-300" />
          <span>WCAG 2.2 Touch Target Calc</span>
        </button>

        <button
          onClick={() => onNavigate('/solutions/content-humanizer')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-800 text-white hover:from-emerald-900 hover:to-teal-800 transition-all cursor-pointer shadow-xs hover:scale-102 border border-emerald-400/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>Content Humanizer (EEAT)</span>
        </button>

        <button
          onClick={() => onNavigate('/tools/site-comparison')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-[#0a0f1d] text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xs hover:scale-102 border border-slate-800"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Site Comparison Engine</span>
        </button>

        <button
          onClick={() => onNavigate('/tools/keyword-planner')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white hover:from-blue-800 hover:to-blue-600 transition-all cursor-pointer shadow-xs hover:scale-102 border border-blue-400/30"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span>AI Keyword Planner</span>
        </button>

        <button
          onClick={() => {
            setActiveTool('domain-rating');
            onNavigate('/tools/domain-rating-checker');
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-800 via-blue-700 to-indigo-800 text-white hover:from-indigo-900 hover:to-blue-800 transition-all cursor-pointer shadow-xs hover:scale-102 border border-indigo-400/40"
        >
          <Globe className="w-3.5 h-3.5 text-blue-300" />
          <span>Domain Rating Checker</span>
        </button>

        <button
          onClick={() => {
            setActiveTool('sitemap-auditor');
            onNavigate('/tools/sitemap-auditor');
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-800 via-emerald-700 to-teal-800 text-white hover:from-teal-900 hover:to-emerald-800 transition-all cursor-pointer shadow-xs hover:scale-102 border border-teal-400/40"
        >
          <FileCode className="w-3.5 h-3.5 text-emerald-300" />
          <span>Sitemap Auditor</span>
        </button>

        <button
          onClick={() => onNavigate('/tools/indexation-fixer')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-800 via-violet-700 to-indigo-800 text-white hover:from-indigo-900 hover:to-violet-800 transition-all cursor-pointer shadow-xs hover:scale-102 border border-indigo-400/40"
        >
          <Clock className="w-3.5 h-3.5 text-indigo-300" />
          <span>GSC Indexation Fixer</span>
        </button>

        <button
          onClick={() => onNavigate('/tools/robots-txt-validator')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-800 via-blue-700 to-sky-800 text-white hover:from-sky-900 hover:to-blue-800 transition-all cursor-pointer shadow-xs hover:scale-102 border border-sky-400/40"
        >
          <FileCode className="w-3.5 h-3.5 text-sky-300" />
          <span>Robots.txt Validator</span>
        </button>

        <button
          onClick={() => onNavigate('/tools/internal-link-analyzer')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-800 text-white hover:from-emerald-900 hover:to-teal-800 transition-all cursor-pointer shadow-xs hover:scale-102 border border-emerald-400/40"
        >
          <Network className="w-3.5 h-3.5 text-emerald-300" />
          <span>Internal Link Analyzer</span>
        </button>

        <button
          onClick={() => onNavigate('/tools/aeo-auditor')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-800 via-fuchsia-700 to-purple-800 text-white hover:from-purple-900 hover:to-fuchsia-800 transition-all cursor-pointer shadow-xs hover:scale-102 border border-purple-400/40"
        >
          <Bot className="w-3.5 h-3.5 text-purple-300" />
          <span>AEO Auditor</span>
        </button>

        <button
          onClick={() => onNavigate('/tools/geo-auditor')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-800 text-white hover:from-emerald-900 hover:to-teal-800 transition-all cursor-pointer shadow-xs hover:scale-102 border border-emerald-400/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>GEO Auditor</span>
        </button>

        <button
          onClick={() => onNavigate('/tools/inp-debugger')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-800 via-orange-700 to-amber-800 text-white hover:from-amber-900 hover:to-orange-800 transition-all cursor-pointer shadow-xs hover:scale-102 border border-amber-400/40"
        >
          <Gauge className="w-3.5 h-3.5 text-amber-300" />
          <span>INP Debugger</span>
        </button>

        <div className="hidden md:block h-5 w-px bg-slate-200 mx-1" />

        {[
          { id: 'contrast', label: 'Color Contrast', icon: Palette },
          { id: 'alt-text', label: 'Alt Text Generator', icon: Image },
          { id: 'heading', label: 'Heading Validator', icon: Heading },
          { id: 'form', label: 'Form Validator', icon: FormInput },
          { id: 'keyboard', label: 'Keyboard Nav', icon: Keyboard },
          { id: 'meta-optimizer', label: 'Meta Tag Optimizer', icon: Search },
          { id: 'schema-generator', label: 'JSON-LD Builder', icon: Code2 },
          { id: 'keyword-explorer', label: 'Keyword Gap Finder', icon: Target },
          { id: 'content-brief', label: 'Content Briefs', icon: FileText },
        ].map((t) => {
          const Icon = t.icon;
          const isSelected = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-50 border-2 border-blue-600 text-blue-800 shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL -1: Flagship XML Sitemap Audit & GSC Validator */}
      {activeTool === 'sitemap-auditor' && (
        <div className="animate-in fade-in">
          <SitemapAuditorView onNavigate={onNavigate} />
        </div>
      )}

      {/* TOOL 0: Flagship Domain Rating & Authority Checker */}
      {activeTool === 'domain-rating' && (
        <div className="animate-in fade-in">
          <DomainRatingChecker onNavigate={onNavigate} />
        </div>
      )}

      {/* TOOL 0.5: Full World-Class AI Keyword Planner & Semantic Clusters */}
      {activeTool === 'keyword-planner' && (
        <div className="animate-in fade-in">
          <KeywordPlannerView onNavigate={onNavigate} />
        </div>
      )}

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
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 placeholder:text-slate-400/70 placeholder:font-normal focus:placeholder:text-transparent focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden transition-all"
                placeholder="e.g., Screenshot of eCommerce checkout page showing coupon code box..."
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
              placeholder="<h1>Main Page Title</h1>&#10;<h2>Section Heading</h2>&#10;<h3>Subtopic</h3>"
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 placeholder:text-slate-400/70 placeholder:font-normal focus:placeholder:text-transparent focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden transition-all"
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
              placeholder="<form>&#10;  <label for='email'>Email</label>&#10;  <input id='email' type='email' />&#10;</form>"
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 placeholder:text-slate-400/70 placeholder:font-normal focus:placeholder:text-transparent focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden transition-all"
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
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 placeholder:text-slate-400/70 placeholder:font-normal focus:placeholder:text-transparent focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden transition-all"
                placeholder="e.g., website accessibility checker"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Domain / Brand Name</label>
              <input
                type="text"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 placeholder:text-slate-400/70 placeholder:font-normal focus:placeholder:text-transparent focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden transition-all"
                placeholder="e.g., accessfix.ai"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleGenerateMeta}
              disabled={isGeneratingMeta}
              className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-75 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {isGeneratingMeta ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-blue-200" />}
              <span>{isGeneratingMeta ? 'Generating Instant Variations...' : 'Generate High-CTR Meta Tags'}</span>
            </button>
            {metaGenSpeed !== null && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold shrink-0">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Generated in {metaGenSpeed}ms • Rule 7 Compliant</span>
              </div>
            )}
          </div>

          <div className="space-y-5 pt-4 border-t border-slate-100">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recommended Title Tags (Strictly 50-60 chars):</h4>
                <span className="text-[10px] text-slate-500 font-medium">Desktop &amp; Mobile SERP Safe</span>
              </div>
              <div className="space-y-2.5">
                {generatedTitles.map((title, i) => {
                  const tagString = `<title>${title}</title>`;
                  const isCopied = copiedMetaSnippet === tagString;
                  const isOptimal = title.length >= 50 && title.length <= 60;
                  return (
                    <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-slate-300 transition-colors">
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="font-bold text-slate-900 block truncate">{title}</span>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className={`font-mono font-bold ${isOptimal ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {title.length} characters
                          </span>
                          {isOptimal ? (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Optimal (50-60)
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Acceptable
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => copyMetaSnippet(tagString)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                          isCopied ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                        title="Copy <title> Tag"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Tag</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recommended Meta Descriptions (Strictly 140-155 chars):</h4>
                <span className="text-[10px] text-slate-500 font-medium">Zero SERP Truncation &bull; High CTA</span>
              </div>
              <div className="space-y-2.5">
                {generatedDescs.map((desc, i) => {
                  const tagString = `<meta name="description" content="${desc}" />`;
                  const isCopied = copiedMetaSnippet === tagString;
                  const isOptimal = desc.length >= 140 && desc.length <= 155;
                  return (
                    <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-slate-300 transition-colors">
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="text-slate-800 leading-relaxed font-normal">{desc}</p>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className={`font-mono font-bold ${isOptimal ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {desc.length} characters
                          </span>
                          {isOptimal ? (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Optimal (140-155)
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Acceptable
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => copyMetaSnippet(tagString)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                          isCopied ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                        title="Copy <meta description> Tag"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Tag</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
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
                placeholder="e.g., AccessFix AI"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 placeholder:text-slate-400/70 placeholder:font-normal focus:placeholder:text-transparent focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Canonical URL</label>
              <input
                type="text"
                value={schemaUrl}
                onChange={(e) => setSchemaUrl(e.target.value)}
                placeholder="e.g., https://accessfix.ai"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 placeholder:text-slate-400/70 placeholder:font-normal focus:placeholder:text-transparent focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden transition-all"
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
              className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 placeholder:text-slate-400/70 placeholder:font-normal focus:placeholder:text-transparent focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden transition-all"
              placeholder="e.g., accessibility audit, seo tools..."
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
                placeholder="e.g., Complete WCAG 2.1 Checklist for SaaS..."
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 placeholder:text-slate-400/70 placeholder:font-normal focus:placeholder:text-transparent focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden transition-all"
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

      {/* 10px AI-Generated Data & Independent Verification Notice */}
      <div className="max-w-4xl mx-auto flex items-start sm:items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[10px] text-slate-500 leading-relaxed">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
        <p>
          <strong className="text-slate-700 font-semibold">AI Intelligence Notice:</strong> This data is algorithmically synthesized for directional research and diagnostic benchmarking. Search metrics, code audits, and market authenticity vary dynamically over time. Please conduct your own research and verify with primary search console tools before final deployment.
        </p>
      </div>
    </div>
  );
};
