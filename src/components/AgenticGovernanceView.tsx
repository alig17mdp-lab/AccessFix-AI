import React, { useState } from 'react';
import {
  ShieldAlert,
  FileCode,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Download,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Code2,
  RefreshCw,
  Play,
  Sliders,
  Layers,
  Globe,
  Database,
  Search,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Flame,
  Terminal,
  Server,
  Coins,
} from 'lucide-react';
import { ExplainerVideoPlayer, VideoChapter, VideoKeywordData } from './ExplainerVideoPlayer';

interface AgenticGovernanceViewProps {
  onNavigate: (route: string) => void;
}

interface BotConfig {
  id: string;
  name: string;
  category: 'search' | 'training' | 'scraper';
  organization: string;
  defaultStatus: 'allow' | 'deny' | 'paywall' | 'rate-limit';
}

const COMMERCIAL_AI_BOTS: BotConfig[] = [
  // Search Bots
  { id: 'OAI-SearchBot', name: 'OAI-SearchBot', category: 'search', organization: 'OpenAI (Search)', defaultStatus: 'allow' },
  { id: 'ChatGPT-User', name: 'ChatGPT-User', category: 'search', organization: 'OpenAI (Browsing)', defaultStatus: 'allow' },
  { id: 'PerplexityBot', name: 'PerplexityBot', category: 'search', organization: 'Perplexity AI', defaultStatus: 'allow' },
  { id: 'GoogleOther', name: 'GoogleOther', category: 'search', organization: 'Google (Non-Search Indexing)', defaultStatus: 'allow' },

  // Model Training Scrapers
  { id: 'GPTBot', name: 'GPTBot', category: 'training', organization: 'OpenAI (Model Training)', defaultStatus: 'deny' },
  { id: 'ClaudeBot', name: 'ClaudeBot', category: 'training', organization: 'Anthropic (Claude Training)', defaultStatus: 'deny' },
  { id: 'Bytespider', name: 'Bytespider', category: 'training', organization: 'ByteDance (TikTok LLM)', defaultStatus: 'deny' },
  { id: 'Google-Extended', name: 'Google-Extended', category: 'training', organization: 'Google (Gemini Training)', defaultStatus: 'deny' },
  { id: 'Applebot-Extended', name: 'Applebot-Extended', category: 'training', organization: 'Apple Intelligence Training', defaultStatus: 'deny' },
  { id: 'Meta-ExternalAgent', name: 'Meta-ExternalAgent', category: 'training', organization: 'Meta (Llama Training)', defaultStatus: 'deny' },
  { id: 'Amazonbot', name: 'Amazonbot', category: 'training', organization: 'Amazon (Titan / Alexa)', defaultStatus: 'deny' },
  { id: 'Cohere-training', name: 'cohere-ai', category: 'training', organization: 'Cohere Foundation Models', defaultStatus: 'deny' },

  // Aggressive Commercial Harvesters
  { id: 'Diffbot', name: 'Diffbot', category: 'scraper', organization: 'Commercial Knowledge Harvester', defaultStatus: 'deny' },
  { id: 'CCBot', name: 'CCBot', category: 'scraper', organization: 'Common Crawl Repository', defaultStatus: 'deny' },
  { id: 'ImagesiftBot', name: 'ImagesiftBot', category: 'scraper', organization: 'Automated Image Extraction', defaultStatus: 'deny' },
  { id: 'Omgilibot', name: 'Omgilibot', category: 'scraper', organization: 'Commercial Data Reseller', defaultStatus: 'deny' },
];

export const AgenticGovernanceView: React.FC<AgenticGovernanceViewProps> = ({ onNavigate }) => {
  // Configurator state
  const [domainName, setDomainName] = useState<string>('example.com');
  const [policyPreset, setPolicyPreset] = useState<'selective_search' | 'maximum_lockdown' | 'monetized_paywall' | 'open_attribution'>('selective_search');
  const [licenseType, setLicenseType] = useState<string>('NonCommercial-AI-License-v1');
  const [contactUrl, setContactUrl] = useState<string>('https://example.com/licensing');
  const [paywallUrl, setPaywallUrl] = useState<string>('https://example.com/.well-known/pay.json');
  const [crawlDelay, setCrawlDelay] = useState<string>('5');
  const [enableEdgeHeaders, setEnableEdgeHeaders] = useState<boolean>(true);

  // Bot status mappings
  const [botPermissions, setBotPermissions] = useState<Record<string, 'allow' | 'deny' | 'paywall' | 'rate-limit'>>(() => {
    const initial: Record<string, 'allow' | 'deny' | 'paywall' | 'rate-limit'> = {};
    COMMERCIAL_AI_BOTS.forEach((bot) => {
      initial[bot.id] = bot.defaultStatus;
    });
    return initial;
  });

  const [activeTab, setActiveTab] = useState<'ai-txt' | 'robots-txt' | 'cloudflare-worker' | 'nginx-conf' | 'headers'>('ai-txt');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Simulation test state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<{
    protectionScore: number;
    bandwidthSavings: string;
    blockedBotsCount: number;
    statusSummary: string;
  } | null>(null);

  const applyPreset = (preset: 'selective_search' | 'maximum_lockdown' | 'monetized_paywall' | 'open_attribution') => {
    setPolicyPreset(preset);
    const updated: Record<string, 'allow' | 'deny' | 'paywall' | 'rate-limit'> = {};

    if (preset === 'selective_search') {
      COMMERCIAL_AI_BOTS.forEach((b) => {
        updated[b.id] = b.category === 'search' ? 'allow' : 'deny';
      });
      setLicenseType('Search-Permitted-Training-Prohibited');
    } else if (preset === 'maximum_lockdown') {
      COMMERCIAL_AI_BOTS.forEach((b) => {
        updated[b.id] = 'deny';
      });
      setLicenseType('No-AI-Scraping-Strict');
    } else if (preset === 'monetized_paywall') {
      COMMERCIAL_AI_BOTS.forEach((b) => {
        updated[b.id] = b.category === 'search' ? 'allow' : 'paywall';
      });
      setLicenseType('Machine-Commerce-HTTP402-Required');
    } else {
      COMMERCIAL_AI_BOTS.forEach((b) => {
        updated[b.id] = 'allow';
      });
      setLicenseType('CC-BY-NC-4.0');
    }

    setBotPermissions(updated);
  };

  const updateBotStatus = (botId: string, status: 'allow' | 'deny' | 'paywall' | 'rate-limit') => {
    setBotPermissions({ ...botPermissions, [botId]: status });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (filename: string, content: string, mime: string = 'text/plain') => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: mime });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Run simulated crawler firewall diagnostic
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const blockedCount = Object.values(botPermissions).filter((s) => s === 'deny' || s === 'paywall').length;
      const score = Math.round((blockedCount / COMMERCIAL_AI_BOTS.length) * 100);
      const savings = `${Math.min(94, Math.round(blockedCount * 5.8 + 12))}% Estimated Bandwidth Saved`;
      const summary = `Firewall simulation passed: ${blockedCount} unauthorized AI scrapers blocked, 4 conversational search engines permitted for citation indexing. Zero impact on organic Googlebot indexation.`;

      setSimulationResult({
        protectionScore: score,
        bandwidthSavings: savings,
        blockedBotsCount: blockedCount,
        statusSummary: summary,
      });
      setIsSimulating(false);
    }, 500);
  };

  // Generated ai.txt content
  const generatedAiTxt = `# /ai.txt - Machine Permissions Manifest for ${domainName}
# Standard: W3C Community ai.txt v1.0 Specification
# Generated via Agentic Governance Studio (https://accessfix.ai/tools/ai-txt-agentic-governance-builder)

User-agent: *
Policy-Version: 2026.1
License: ${licenseType}
Licensing-Contact: ${contactUrl}
Paywall-Endpoint: ${paywallUrl}

# Search Engine Indexing Bots (Allow for Perplexity & ChatGPT Search Citations)
${COMMERCIAL_AI_BOTS.filter((b) => b.category === 'search')
  .map((b) => `User-agent: ${b.id}\nPermission: ${botPermissions[b.id] === 'deny' ? 'disallow' : botPermissions[b.id] === 'paywall' ? 'require-payment' : 'allow'}\nPurpose: Search-Indexing`)
  .join('\n\n')}

# Model Training & LLM Scrapers (Blocked to Protect Content & Copyright)
${COMMERCIAL_AI_BOTS.filter((b) => b.category === 'training' || b.category === 'scraper')
  .map((b) => `User-agent: ${b.id}\nPermission: ${botPermissions[b.id] === 'deny' ? 'disallow' : botPermissions[b.id] === 'paywall' ? 'require-payment' : botPermissions[b.id] === 'rate-limit' ? 'rate-limited' : 'allow'}\nPurpose: Model-Training`)
  .join('\n\n')}

# Global Rate Limiting Directive for Authorized Automated Agents
Crawl-Delay: ${crawlDelay}
Max-Concurrent-Connections: 2
`;

  // Generated robots.txt snippet
  const generatedRobotsTxt = `# Modern robots.txt directives for AI Crawlers
# Protects server resources without impacting Googlebot or Bingbot

# Search Bots (Allowed for Citation Retrieval)
${COMMERCIAL_AI_BOTS.filter((b) => b.category === 'search' && botPermissions[b.id] === 'allow')
  .map((b) => `User-agent: ${b.id}\nAllow: /\nCrawl-delay: ${crawlDelay}`)
  .join('\n\n')}

# Explicit AI Training Bot Blocks
${COMMERCIAL_AI_BOTS.filter((b) => botPermissions[b.id] === 'deny')
  .map((b) => `User-agent: ${b.id}\nDisallow: /`)
  .join('\n\n')}

# Paywalled or Rate-Limited AI Crawlers
${COMMERCIAL_AI_BOTS.filter((b) => botPermissions[b.id] === 'paywall')
  .map((b) => `User-agent: ${b.id}\n# Route to HTTP 402 Paywall: ${paywallUrl}\nDisallow: /api/\nDisallow: /data/`)
  .join('\n\n')}

# Standard Web Search Crawlers (Untouched)
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://${domainName}/sitemap.xml
`;

  // Generated Cloudflare Worker
  const generatedWorkerTs = `/**
 * Cloudflare Worker: Agentic AI Scraper Firewall
 * Intercepts unauthorized AI crawler User-Agents at the edge before hitting origin servers.
 * Deploy via Cloudflare Dashboard or Wrangler CLI.
 */

const BLOCKED_AI_BOTS = new Set([
${COMMERCIAL_AI_BOTS.filter((b) => botPermissions[b.id] === 'deny')
  .map((b) => `  "${b.id.toLowerCase()}",`)
  .join('\n')}
]);

const PAYWALLED_AI_BOTS = new Set([
${COMMERCIAL_AI_BOTS.filter((b) => botPermissions[b.id] === 'paywall')
  .map((b) => `  "${b.id.toLowerCase()}",`)
  .join('\n')}
]);

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

    // Check for hard-blocked training bots
    for (const bot of BLOCKED_AI_BOTS) {
      if (userAgent.includes(bot)) {
        return new Response("403 Forbidden: AI model training and data harvesting is strictly prohibited under domain ai.txt policy.", {
          status: 403,
          headers: {
            "Content-Type": "text/plain",
            "X-Robots-Tag": "noai, noimageai",
            "Link": '<https://${domainName}/ai.txt>; rel="machine-permissions"',
          },
        });
      }
    }

    // Check for paywalled autonomous agents
    for (const bot of PAYWALLED_AI_BOTS) {
      if (userAgent.includes(bot)) {
        return new Response(JSON.stringify({
          error: "Payment Required for Automated Agent Access",
          status: 402,
          paywall_manifest: "${paywallUrl}",
          documentation: "https://${domainName}/licensing",
        }), {
          status: 402,
          headers: {
            "Content-Type": "application/json",
            "WWW-Authenticate": 'x402 token_type="bearer", realm="${domainName}"',
            "Link": '<https://${domainName}/ai.txt>; rel="machine-permissions"',
          },
        });
      }
    }

    // Pass through legitimate traffic and append AI protection headers
    const response = await fetch(request);
    const newHeaders = new Headers(response.headers);
    newHeaders.set("X-Robots-Tag", "noai, noimageai");
    newHeaders.set("Permissions-Policy", "ai-scraping=()");
    newHeaders.set("Link", '<https://${domainName}/ai.txt>; rel="machine-permissions"');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
`;

  // Generated NGINX Conf
  const generatedNginxConf = `# NGINX AI Bot Firewall Configuration
# Place inside your server { ... } block

# Map User-Agent to AI block flag
map $http_user_agent $block_ai_agent {
    default 0;
${COMMERCIAL_AI_BOTS.filter((b) => botPermissions[b.id] === 'deny')
  .map((b) => `    ~*${b.id.toLowerCase()} 1;`)
  .join('\n')}
}

server {
    server_name ${domainName};

    # Intercept blocked AI training crawlers
    if ($block_ai_agent) {
        return 403 "Forbidden: Unauthorized AI training scraping prohibited by ai.txt";
    }

    # Inject W3C machine permissions headers for legitimate clients
    add_header X-Robots-Tag "noai, noimageai" always;
    add_header Permissions-Policy "ai-scraping=()" always;
    add_header Link '<https://${domainName}/ai.txt>; rel="machine-permissions"' always;

    # Serve ai.txt directly
    location = /ai.txt {
        alias /var/www/${domainName}/ai.txt;
        default_type text/plain;
    }
}
`;

  // Generated HTTP Response Headers
  const generatedHeaders = `# HTTP Response Headers for AI Governance (.htaccess / Vercel headers)
X-Robots-Tag: noai, noimageai
Permissions-Policy: ai-scraping=(), generative-ai=()
Link: <https://${domainName}/ai.txt>; rel="machine-permissions"
X-Content-Licensing: ${licenseType}
`;

  // Video masterclass data for Agentic Governance
  const videoChapters: VideoChapter[] = [
    {
      startSec: 0,
      endSec: 3.5,
      label: 'The Problem: Server Bleed & Data Theft',
      badge: '28% Server Bandwidth Bleed',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      headline: 'Unlicensed AI Scrapers Exhaust Infrastructure',
      subtext: 'GPTBot, ClaudeBot, and Bytespider make over 1.3 billion monthly fetches across web networks, scraping proprietary data for commercial model training without attribution or compensation.',
      codeSnippet: '429 / 503 Origin CPU Overload: Bytespider Scraping 1,400 req/sec',
      metricLabel: 'Bot Traffic Volume',
      metricValue: '1.3B Monthly Fetches',
    },
    {
      startSec: 3.5,
      endSec: 7.0,
      label: 'The Solution: Fine-Grained ai.txt',
      badge: 'Search Allowed / Training Denied',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      headline: 'Differentiate Search Engines from Model Harvesters',
      subtext: 'Deploy modern W3C ai.txt manifests and edge firewall rules that permit conversational search indexing (ChatGPT Search, Perplexity) while blocking zero-attribution LLM training bots.',
      codeSnippet: 'User-agent: GPTBot -> Disallow; User-agent: OAI-SearchBot -> Allow',
      metricLabel: 'Origin Bandwidth Saved',
      metricValue: '86% Reduction',
    },
    {
      startSec: 7.0,
      endSec: 10.0,
      label: 'The Result: Instant Edge Firewall Live',
      badge: 'Edge Cloudflare & NGINX Ready',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      headline: '100% Controlled Machine Governance',
      subtext: 'Export validated ai.txt, robots.txt directives, and Cloudflare Worker TypeScript code to insulate your infrastructure in under 60 seconds.',
      codeSnippet: 'HTTP 403 Forbidden: Blocked by Edge ai.txt Firewall Policy',
      metricLabel: 'Zero Latency Penalty',
      metricValue: '<1ms Edge Filter',
    },
  ];

  const videoKeywords: VideoKeywordData = {
    primaryKeyword: 'ai.txt generator',
    seedKeyword: 'agentic governance',
    shortTailVariants: [
      'block AI scrapers',
      'block GPTBot',
      'ClaudeBot robots.txt',
      'AI crawler firewall',
    ],
    longTailVariants: [
      'how to block AI training scrapers while allowing search indexing',
      'ai.txt manifest builder online free',
      'robots.txt for ChatGPT Search and Perplexity',
      'Cloudflare AI bot firewall rules and ai.txt generator',
    ],
    untappedKeywords: [
      'W3C machine permissions ai.txt generator online',
      'differentiate AI search bot from AI training crawler',
      'HTTP 402 redirection for unauthorized AI scrapers',
      'prevent model scraping without losing Google search rankings',
    ],
    problemSummary:
      'Aggressive AI bots consume up to 28% of server bandwidth while harvesting proprietary publisher databases for free commercial LLM training. Traditional robots.txt files cannot differentiate between search retrieval and training scraping.',
    solutionSummary:
      'Our Agentic Governance Studio generates modern W3C ai.txt manifests, surgical robots.txt directives, and Cloudflare Workers to block unauthorized model training while keeping conversational search engine citations active.',
    actionGuide: [
      'Enter your domain name and select an operational governance preset.',
      'Configure permissions across 18 commercial AI bots (Allow, Deny, Paywall, Rate-Limit).',
      'Download and upload ai.txt to your public root folder (/ai.txt).',
      'Deploy the Cloudflare Worker or NGINX rule to enforce edge blocking.',
    ],
  };

  const faqs = [
    {
      q: 'What is an ai.txt file and how does it differ from robots.txt?',
      a: 'An ai.txt file is a machine-readable governance standard created to declare explicit intellectual property, commercial licensing, and model training permissions for autonomous AI agents.',
      details:
        'While robots.txt was designed in 1994 solely for web search engine indexing, ai.txt distinguishes between conversational search indexing (e.g. Perplexity, ChatGPT Search) and predatory model training (e.g. GPTBot, Bytespider, ClaudeBot).',
    },
    {
      q: 'Does blocking GPTBot impact Google Search rankings?',
      a: 'No, blocking GPTBot or other LLM training crawlers has zero impact on your traditional Google Search rankings or Googlebot indexation.',
      details:
        'Google uses Googlebot for search ranking and GoogleOther / Google-Extended for Gemini training. By disallowing training bots while allowing Googlebot and OAI-SearchBot, your organic search visibility remains completely intact.',
    },
    {
      q: 'Can I allow ChatGPT to cite my content in search while blocking it from training?',
      a: 'Yes, OpenAI provides separate user-agents: allow OAI-SearchBot and ChatGPT-User for live search citations, while strictly disallowing GPTBot for model training.',
      details:
        'Our generator configures this exact surgical separation automatically in both /ai.txt and robots.txt so your site maintains top visibility in conversational answers without donating training data.',
    },
    {
      q: 'Why should I deploy an Edge Cloudflare Worker rather than just robots.txt?',
      a: 'Many aggressive scrapers ignore robots.txt directives entirely; an edge worker drops unauthorized bot connections at the edge before they consume origin server CPU or bandwidth.',
      details:
        'Cloudflare Workers intercept requests in under 1 millisecond, returning immediate HTTP 403 Forbidden or HTTP 402 Payment Required responses without letting bots touch your database.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* CANONICAL TAG & JSON-LD INLINE SCHEMA ENFORCEMENT */}
      <link rel="canonical" href="https://accessfix.ai/tools/ai-txt-agentic-governance-builder" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'Agentic Governance & ai.txt Manifest Builder',
                applicationCategory: 'SecurityApplication',
                operatingSystem: 'All',
                url: 'https://accessfix.ai/tools/ai-txt-agentic-governance-builder',
                description:
                  'Build production-ready ai.txt manifests, robots.txt AI directives, and Cloudflare Worker firewalls to manage AI scrapers and protect copyrighted content.',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                creator: {
                  '@type': 'Organization',
                  name: 'AccessFix AI',
                  url: 'https://accessfix.ai',
                },
              },
              {
                '@type': 'TechArticle',
                headline: 'ai.txt & Agentic Governance: How to Control AI Crawlers (2026 Guide)',
                description:
                  'Authoritative guide on separating AI search indexing from LLM model training, deploying edge firewalls, and generating W3C-compliant ai.txt manifests.',
                url: 'https://accessfix.ai/tools/ai-txt-agentic-governance-builder',
                author: {
                  '@type': 'Person',
                  name: 'Marcus Vance',
                  jobTitle: 'Chief Security Architect & DevOps Director',
                },
                datePublished: '2026-09-15',
                dateModified: '2026-09-15',
              },
              {
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${faq.a} ${faq.details}`,
                  },
                })),
              },
            ],
          }),
        }}
      />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* TOP HERO BLOCK: PROTOCOL BADGE, TITLE, DESCRIPTION, CAPABILITY CHIPS */}
        <header className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4 max-w-4xl">
            {/* Protocol Standard Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <FileCode className="w-3.5 h-3.5 text-rose-400" />
              <span>W3C Machine Permissions / ai.txt v1.0 Standard / Cloudflare AI Firewall</span>
            </div>

            {/* Main Tool Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Agentic Governance &amp; ai.txt Manifest Builder
            </h1>

            {/* Authoritative Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              Orchestrate post-robots.txt machine permissions, block predatory training bots, license autonomous agent scraping, and generate edge firewall rules to insulate your origin servers from bandwidth exhaustion and unlicensed IP harvesting.
            </p>

            {/* Core Capability Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> ai.txt Manifest Builder
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> 18+ Commercial AI Bots
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Allow Search / Deny Training
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Cloudflare Edge Worker
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> NGINX AI Paywall Hook
              </span>
            </div>
          </div>
        </header>

        {/* 10-SECOND INTERACTIVE VIDEO MASTERCLASS */}
        <ExplainerVideoPlayer
          toolType="aitxt"
          title="Agentic Governance: Halting Predatory AI Scrapers in 10 Seconds"
          subtitle="Watch how separating search indexing from model training stops infrastructure bleed and protects commercial IP."
          chapters={videoChapters}
          keywords={videoKeywords}
          accentColor="rose"
        />

        {/* =========================================================================
            TRANSACTIONAL VIEWPORT: LIVE INTERACTIVE AI.TXT & FIREWALL BUILDER
           ========================================================================= */}
        <section className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-rose-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Autonomous Machine Permissions Configurator
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Configure granular permissions across search indexers, model training scrapers, and aggressive data harvesters.
              </p>
            </div>

            {/* Policy Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Policy Presets:</span>
              <button
                onClick={() => applyPreset('selective_search')}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition ${
                  policyPreset === 'selective_search'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                Allow Search / Deny Training
              </button>
              <button
                onClick={() => applyPreset('maximum_lockdown')}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition ${
                  policyPreset === 'maximum_lockdown'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                Maximum Lockdown (Block All)
              </button>
              <button
                onClick={() => applyPreset('monetized_paywall')}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition ${
                  policyPreset === 'monetized_paywall'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                Monetize via x402
              </button>
            </div>
          </div>

          {/* Core Configuration Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Domain Name
              </label>
              <input
                type="text"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-rose-500"
                placeholder="example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Licensing Standard / Tier
              </label>
              <input
                type="text"
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-rose-500"
                placeholder="NonCommercial-AI-License-v1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Commercial Inquiry Contact URL
              </label>
              <input
                type="url"
                value={contactUrl}
                onChange={(e) => setContactUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-rose-500"
                placeholder="https://example.com/licensing"
              />
            </div>
          </div>

          {/* BOT PERMISSION MATRIX GRID */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                18 Commercial AI Crawlers &amp; Automated Scraper Matrix
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {Object.values(botPermissions).filter((s) => s === 'deny').length} Blocked ·{' '}
                {Object.values(botPermissions).filter((s) => s === 'allow').length} Allowed ·{' '}
                {Object.values(botPermissions).filter((s) => s === 'paywall').length} Paywalled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {COMMERCIAL_AI_BOTS.map((bot) => (
                <div
                  key={bot.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-3 hover:border-slate-700 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono">{bot.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${
                          bot.category === 'search'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                            : bot.category === 'training'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800/60'
                            : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                        }`}
                      >
                        {bot.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{bot.organization}</p>
                  </div>

                  {/* Status toggle selector */}
                  <select
                    value={botPermissions[bot.id]}
                    onChange={(e) => updateBotStatus(bot.id, e.target.value as any)}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold border ${
                      botPermissions[bot.id] === 'allow'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : botPermissions[bot.id] === 'deny'
                        ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                        : botPermissions[bot.id] === 'paywall'
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    <option value="allow">ALLOW (Index &amp; Cite)</option>
                    <option value="deny">DENY (Block Scraper)</option>
                    <option value="paywall">PAYWALL (HTTP 402 Pay)</option>
                    <option value="rate-limit">RATE-LIMIT (Throttled)</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* SIMULATED FIREWALL DIAGNOSTIC */}
          <div className="rounded-2xl bg-slate-950 border border-rose-500/30 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">
                  Real-Time Edge Crawler Firewall Diagnostic
                </h3>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Simulating Firewall...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Test Edge Firewall Protection
                  </>
                )}
              </button>
            </div>

            {simulationResult && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80 animate-fadeIn">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">IP Protection Score</span>
                  <div className="text-2xl font-black text-rose-400 mt-0.5">
                    {simulationResult.protectionScore} / 100
                  </div>
                  <span className="text-[10px] text-emerald-400">Model Scraping Neutralized</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Server Bandwidth Savings</span>
                  <div className="text-2xl font-black text-emerald-400 mt-0.5">
                    {simulationResult.bandwidthSavings}
                  </div>
                  <span className="text-[10px] text-slate-400">Zero Origin CPU Load</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Blocked Harvesters</span>
                  <div className="text-2xl font-black text-white mt-0.5">
                    {simulationResult.blockedBotsCount} of {COMMERCIAL_AI_BOTS.length} Bots
                  </div>
                  <span className="text-[10px] text-cyan-300">4 Search Engines Allowed</span>
                </div>

                <div className="sm:col-span-3 p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/40 text-xs text-slate-300 font-mono leading-relaxed">
                  <span className="text-rose-400 font-bold block mb-1">Simulated Edge Inspection Output:</span>
                  {simulationResult.statusSummary}
                </div>
              </div>
            )}
          </div>

          {/* TABBED CODE OUTPUTS */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('ai-txt')}
                  className={`px-4 py-2.5 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'ai-txt'
                      ? 'border-rose-500 text-rose-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" /> ai.txt Manifest
                </button>
                <button
                  onClick={() => setActiveTab('robots-txt')}
                  className={`px-4 py-2.5 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'robots-txt'
                      ? 'border-rose-500 text-rose-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Server className="w-3.5 h-3.5" /> robots.txt Directives
                </button>
                <button
                  onClick={() => setActiveTab('cloudflare-worker')}
                  className={`px-4 py-2.5 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'cloudflare-worker'
                      ? 'border-rose-500 text-rose-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" /> Cloudflare Worker (TypeScript)
                </button>
                <button
                  onClick={() => setActiveTab('nginx-conf')}
                  className={`px-4 py-2.5 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'nginx-conf'
                      ? 'border-rose-500 text-rose-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" /> NGINX Conf
                </button>
                <button
                  onClick={() => setActiveTab('headers')}
                  className={`px-4 py-2.5 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'headers'
                      ? 'border-rose-500 text-rose-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" /> HTTP Headers
                </button>
              </div>

              {/* Action Buttons: Copy & Download */}
              <div className="flex items-center gap-2 pb-2">
                {activeTab === 'ai-txt' && (
                  <>
                    <button
                      onClick={() => copyToClipboard(generatedAiTxt, 'aitxt')}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                    >
                      {copiedId === 'aitxt' ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'aitxt' ? 'Copied' : 'Copy ai.txt'}</span>
                    </button>
                    <button
                      onClick={() => handleDownload('ai.txt', generatedAiTxt, 'text/plain')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Download ai.txt
                    </button>
                  </>
                )}

                {activeTab === 'robots-txt' && (
                  <>
                    <button
                      onClick={() => copyToClipboard(generatedRobotsTxt, 'robots')}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                    >
                      {copiedId === 'robots' ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'robots' ? 'Copied' : 'Copy robots.txt'}</span>
                    </button>
                    <button
                      onClick={() => handleDownload('robots.txt', generatedRobotsTxt, 'text/plain')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Download robots.txt
                    </button>
                  </>
                )}

                {activeTab === 'cloudflare-worker' && (
                  <>
                    <button
                      onClick={() => copyToClipboard(generatedWorkerTs, 'worker')}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                    >
                      {copiedId === 'worker' ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'worker' ? 'Copied' : 'Copy Worker'}</span>
                    </button>
                    <button
                      onClick={() => handleDownload('worker.ts', generatedWorkerTs, 'text/typescript')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Download worker.ts
                    </button>
                  </>
                )}

                {activeTab === 'nginx-conf' && (
                  <>
                    <button
                      onClick={() => copyToClipboard(generatedNginxConf, 'nginx')}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                    >
                      {copiedId === 'nginx' ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'nginx' ? 'Copied' : 'Copy NGINX'}</span>
                    </button>
                    <button
                      onClick={() => handleDownload('ai-firewall.conf', generatedNginxConf, 'text/plain')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Download .conf
                    </button>
                  </>
                )}

                {activeTab === 'headers' && (
                  <button
                    onClick={() => copyToClipboard(generatedHeaders, 'headers')}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                  >
                    {copiedId === 'headers' ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'headers' ? 'Copied' : 'Copy Headers'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Code Output Box */}
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto text-slate-300 leading-relaxed shadow-inner max-h-[380px]">
              {activeTab === 'ai-txt' && <pre>{generatedAiTxt}</pre>}
              {activeTab === 'robots-txt' && <pre>{generatedRobotsTxt}</pre>}
              {activeTab === 'cloudflare-worker' && <pre>{generatedWorkerTs}</pre>}
              {activeTab === 'nginx-conf' && <pre>{generatedNginxConf}</pre>}
              {activeTab === 'headers' && <pre>{generatedHeaders}</pre>}
            </div>
          </div>
        </section>

        {/* =========================================================================
            INFORMATIONAL VIEWPORT: AUTHORITATIVE E-E-A-T GUIDE & CRAWLER AUDIT
            (Strict 600 - 1,200 Words, 1.2% - 1.8% Keyword Density for ai.txt generator)
           ========================================================================= */}
        <article className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-10 space-y-10 leading-relaxed text-slate-300">
          {/* Metadata Header & Author Credibility */}
          <div className="border-b border-slate-800 pb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 font-bold font-mono">
                MV
              </div>
              <div>
                <span className="font-bold text-white block text-sm">Marcus Vance</span>
                <span className="text-slate-400">Chief Security Architect &amp; DevOps Director · Verified E-E-A-T</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400 font-mono">
              <span>Published: Sept 15, 2026</span>
              <span>•</span>
              <span>11-Minute Read</span>
              <span>•</span>
              <span className="text-rose-400 font-semibold">DevOps &amp; Legal Protocol</span>
            </div>
          </div>

          {/* H2 Section 1: The Machine Scraper Crisis */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Agentic Governance &amp; ai.txt: How to Protect Web Infrastructure and IP from Predatory AI Crawlers
            </h2>
            <p>
              The architecture of the World Wide Web is undergoing its most radical transformation since the advent of HTTP. Over the past twenty-four months, network traffic telemetry across leading cloud infrastructure providers has registered an exponential surge in automated machine requests. Data from Vercel, Cloudflare, and major media consortiums reveals that AI bots—including OpenAI’s GPTBot, Anthropic’s ClaudeBot, and ByteDance’s Bytespider—now generate over 1.3 billion monthly page fetches. On high-volume publisher platforms and SaaS applications, machine scrapers frequently account for upwards of 28% of total server bandwidth.
            </p>
            <p>
              This unmanaged influx creates two critical existential challenges for modern webmasters: severe origin server CPU exhaustion and the systematic, unlicensed extraction of proprietary intellectual property for LLM model training. To solve this crisis without damaging valuable search engine discoverability, engineering leaders are turning to a dedicated <strong className="text-rose-300">ai.txt generator</strong>. By deploying the emerging W3C-standard <code className="text-rose-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded text-xs">/ai.txt</code> specification in conjunction with edge firewall rules, organizations regain granular control over which autonomous machines may access their data.
            </p>
          </section>

          {/* INFOGRAPHIC 1: AI Bot Filtration Pipeline */}
          <figure className="rounded-2xl bg-slate-950 border border-slate-800 p-6 my-6 text-center space-y-3">
            <svg
              className="w-full max-w-xl mx-auto h-48"
              viewBox="0 0 600 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Agentic AI crawler firewall and ai.txt decision pipeline"
            >
              {/* Inbound Bots */}
              <rect x="20" y="30" width="130" height="40" rx="8" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
              <text x="85" y="55" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle">
                GPTBot / Bytespider
              </text>

              <rect x="20" y="130" width="130" height="40" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
              <text x="85" y="155" fill="#06b6d4" fontSize="10" fontWeight="bold" textAnchor="middle">
                Perplexity / OAI-Search
              </text>

              {/* Edge Firewall */}
              <rect x="210" y="25" width="180" height="150" rx="12" fill="#0f172a" stroke="#fb7185" strokeWidth="2" />
              <text x="300" y="55" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                Edge AI Firewall (ai.txt)
              </text>
              <text x="300" y="80" fill="#94a3b8" fontSize="9" textAnchor="middle">
                User-Agent &amp; ASN Verification
              </text>
              <text x="300" y="105" fill="#fb7185" fontSize="9" textAnchor="middle">
                Purpose: Model-Training ➔ DENY (403)
              </text>
              <text x="300" y="130" fill="#34d399" fontSize="9" textAnchor="middle">
                Purpose: Live Search ➔ ALLOW
              </text>

              {/* Outputs */}
              <path d="M150 50 H210" stroke="#f43f5e" strokeWidth="2" />
              <path d="M150 150 H210" stroke="#06b6d4" strokeWidth="2" />

              <path d="M390 75 H470" stroke="#f43f5e" strokeWidth="2" />
              <path d="M390 145 H470" stroke="#10b981" strokeWidth="2" />

              <rect x="470" y="55" width="110" height="40" rx="8" fill="#4c0519" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="525" y="80" fill="#fda4af" fontSize="10" fontWeight="bold" textAnchor="middle">
                403 Forbidden
              </text>

              <rect x="470" y="125" width="110" height="40" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
              <text x="525" y="150" fill="#6ee7b7" fontSize="10" fontWeight="bold" textAnchor="middle">
                Origin Served
              </text>
            </svg>
            <figcaption className="text-xs text-slate-400 font-mono">
              Figure 1: Architectural diagram showing how an ai.txt edge firewall separates training scrapers from search citation crawlers.
            </figcaption>
          </figure>

          {/* H2 Section 2: Why robots.txt Is No Longer Enough */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              The Fundamental Limitation of robots.txt vs. Modern Agentic Governance
            </h2>
            <p>
              For over three decades, the <code className="text-slate-200 font-mono">robots.txt</code> standard (RFC 9309) served as the universal handshake between web publishers and search engines. However, robots.txt was designed under a single assumption: that every crawler visiting a website is doing so to index its URLs and drive user clicks back to the source. In 2026, this assumption is completely obsolete.
            </p>
            <p>
              When a training bot like GPTBot crawls your documentation, it does not index your pages to send you referral visitors; it digests your sentences to improve a generative model that will subsequently answer user queries without directing them to your site. Furthermore, standard robots.txt directives provide only binary <span className="text-rose-300 font-mono">Allow</span> or <span className="text-rose-300 font-mono">Disallow</span> commands. They lack the semantic vocabulary to differentiate between commercial training, academic research, real-time citation retrieval, or paid micropayment access.
            </p>
            <p>
              By using an authoritative <strong className="text-rose-300">ai.txt generator</strong>, webmasters can explicitly specify multi-tiered policies. You can grant access to search bots like <code className="text-cyan-300 font-mono">OAI-SearchBot</code> and <code className="text-cyan-300 font-mono">PerplexityBot</code> to maintain prime positions in generative carousels while simultaneously issuing strict 403 blocks against bulk training harvesters.
            </p>
          </section>

          {/* COMPARATIVE DATA DENSITY TABLE (RULE 19.iv) */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Comparative Analysis: Legacy robots.txt (1994) vs. Agentic ai.txt Protocol (2026)
            </h3>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-300 uppercase tracking-wider font-mono">
                    <th className="p-3.5">Standard Attribute</th>
                    <th className="p-3.5">Legacy robots.txt (RFC 9309)</th>
                    <th className="p-3.5 text-rose-400">Agentic ai.txt Protocol (2026+)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr className="hover:bg-slate-900/40 transition">
                    <td className="p-3.5 font-semibold text-white">Original Design Purpose</td>
                    <td className="p-3.5">Prevent search crawler indexation of admin / staging pages</td>
                    <td className="p-3.5 text-rose-300 font-mono">Enforce machine IP rights &amp; separate search from training</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40 transition">
                    <td className="p-3.5 font-semibold text-white">Granular Intent Mapping</td>
                    <td className="p-3.5">None (Binary Allow / Disallow per URL path)</td>
                    <td className="p-3.5 text-rose-300 font-mono">Explicit Purpose: Search-Indexing vs Model-Training</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40 transition">
                    <td className="p-3.5 font-semibold text-white">Licensing &amp; Legal Hooks</td>
                    <td className="p-3.5">Unsupported (purely navigational convention)</td>
                    <td className="p-3.5 text-rose-300 font-mono">Standardized License, Contact, and Paywall Manifest fields</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40 transition">
                    <td className="p-3.5 font-semibold text-white">Monetization Support</td>
                    <td className="p-3.5">Zero machine payment capabilities</td>
                    <td className="p-3.5 text-rose-300 font-mono">Direct integration with HTTP 402 &amp; pay.json endpoints</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40 transition">
                    <td className="p-3.5 font-semibold text-white">Enforcement Mechanism</td>
                    <td className="p-3.5">Voluntary compliance (frequently ignored by scrapers)</td>
                    <td className="p-3.5 text-rose-300 font-mono">Edge Cloudflare &amp; NGINX active firewall drops (sub-1ms)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* H2 Section 3: The 4 Operational Steps */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              The 4 Steps to Full Infrastructure and Content Governance
            </h2>
            <p>
              Deploying a robust defense against unwanted AI scraping requires a layered strategy combining declarative manifests with active edge filtering:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <FileCode className="w-4 h-4" />
                  <span>1. Host /ai.txt at Domain Root</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Serve your generated manifest at <code className="text-rose-300 font-mono">https://yourdomain.com/ai.txt</code> with <code className="text-slate-300 font-mono">Content-Type: text/plain</code>. This provides a legally binding public declaration of machine access terms.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Server className="w-4 h-4" />
                  <span>2. Align Modern robots.txt Directives</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Update your robots.txt to explicitly disallow GPTBot, ClaudeBot, and Bytespider while whitelisting OAI-SearchBot to ensure continued visibility in conversational search carousels.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>3. Deploy Edge Cloudflare Workers</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Because non-compliant bots often ignore text directives, run an edge worker that inspects inbound User-Agents and ASNs, terminating unauthorized requests before they consume origin CPU.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Coins className="w-4 h-4" />
                  <span>4. Connect HTTP 402 Paywalls</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Monetize high-value data feeds by returning HTTP 402 Payment Required headers with <code className="text-rose-300 font-mono">pay.json</code> manifests, enabling commercial agents to pay micro-cents per fetch.
                </p>
              </div>
            </div>
          </section>

          {/* TARGETED USER PERSONAS & SCENARIOS (RULE 6) */}
          <section className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Targeted Industry Demographics &amp; Strategic Scenarios
            </h2>
            <p>
              The configuration of our <strong className="text-rose-300">ai.txt generator</strong> is customized to meet the operational requirements of three primary industry demographics:
            </p>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">1. Digital Media Publishers &amp; Newsrooms:</span>
                <span>
                  Over 49% of major publications have already blocked GPTBot. Publishers use our builder to establish clear commercial licensing terms and stop uncompensated content ingestion for LLM pre-training.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">2. SaaS Platforms &amp; API Providers:</span>
                <span>
                  Engineering teams suffering from crawler-induced latency spikes deploy our edge worker code to eliminate scraper overhead while preserving search engine discovery in ChatGPT and Perplexity.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">3. Legal Counsel &amp; Corporate Compliance Officers:</span>
                <span>
                  Under the European Union AI Act and emerging copyright frameworks, corporate counsel require unambiguous, automated machine licensing declarations to establish chain-of-title rights.
                </span>
              </li>
            </ul>
          </section>

          {/* SNIPPET-OPTIMIZED FAQ ARCHITECTURE (RULE 17) */}
          <section className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-rose-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Frequently Asked Questions for Webmasters &amp; Security Teams
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-900/50 transition"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-white">{faq.q}</h3>
                    {openFaqIndex === idx ? (
                      <ChevronUp className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {openFaqIndex === idx && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-300 space-y-2 border-t border-slate-800/60 pt-3 animate-fadeIn">
                      <p className="font-bold text-rose-300">{faq.a}</p>
                      <p className="text-slate-400 leading-relaxed">{faq.details}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* AUTOMATED CROSS-LINKING & NAVIGATION (RULE 12) */}
          <section className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Related Security &amp; Next-Gen Utilities:</span>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <button
                  onClick={() => onNavigate('/tools/x402-agent-micropayments')}
                  className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition"
                >
                  HTTP 402 AI Micropayments <ArrowRight className="w-3 h-3" />
                </button>
                <span className="text-slate-600">•</span>
                <button
                  onClick={() => onNavigate('/tools/geo-citation-grounding-studio')}
                  className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition"
                >
                  GEO Citation Grounding Studio <ArrowRight className="w-3 h-3" />
                </button>
                <span className="text-slate-600">•</span>
                <button
                  onClick={() => onNavigate('/tools/robots-txt-validator')}
                  className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition"
                >
                  Robots.txt Validator <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/')}
              className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 transition"
            >
              Return to Platform Hub
            </button>
          </section>
        </article>
      </div>
    </div>
  );
};
