import React, { useState } from 'react';
import {
  Coins,
  Cpu,
  ShieldCheck,
  Zap,
  Terminal,
  Copy,
  Check,
  Download,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Code2,
  RefreshCw,
  Play,
  CheckCircle2,
  Sliders,
  DollarSign,
  Layers,
  FileCode,
  Network,
  ArrowRight,
} from 'lucide-react';
import { ExplainerVideoPlayer, VideoChapter, VideoKeywordData } from './ExplainerVideoPlayer';

interface X402MicropaymentsViewProps {
  onNavigate: (route: string) => void;
}

export const X402MicropaymentsView: React.FC<X402MicropaymentsViewProps> = ({ onNavigate }) => {
  const [targetDomain, setTargetDomain] = useState<string>('https://example.com');
  const [protectedEndpoint, setProtectedEndpoint] = useState<string>('/api/v1/agent/premium-audit');
  const [pricePerCall, setPricePerCall] = useState<string>('0.002');
  const [settlementNetwork, setSettlementNetwork] = useState<'base_usdc' | 'lightning_l402' | 'solana_pay'>('base_usdc');
  const [recipientWallet, setRecipientWallet] = useState<string>('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
  const [activeTab, setActiveTab] = useState<'headers' | 'pay-json' | 'middleware'>('headers');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Simulation test state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationPrompt, setSimulationPrompt] = useState<string>(
    'Claude Operator requesting deep compliance audit on /api/v1/agent/premium-audit'
  );
  const [simulationLog, setSimulationLog] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Generate HTTP 402 Response Headers
  const generatedHeaders = `HTTP/1.1 402 Payment Required
Server: Cloudflare
Content-Type: application/json; charset=utf-8
WWW-Authenticate: ${settlementNetwork === 'lightning_l402' ? 'L402' : 'x402'} token_type="bearer", realm="${targetDomain}"
x402-version: 2026.1
x402-price: ${pricePerCall}
x402-currency: ${settlementNetwork === 'lightning_l402' ? 'SAT' : 'USDC'}
x402-network: ${settlementNetwork === 'lightning_l402' ? 'bitcoin-lightning' : settlementNetwork === 'base_usdc' ? 'base-mainnet' : 'solana-mainnet'}
x402-recipient: ${recipientWallet}
x402-invoice-url: ${targetDomain.replace(/\/$/, '')}/api/v1/x402/invoice?endpoint=${encodeURIComponent(protectedEndpoint)}
Access-Control-Expose-Headers: WWW-Authenticate, x402-price, x402-invoice-url

{
  "error": "Payment Required",
  "message": "Autonomous agent micropayment required to access this endpoint.",
  "price": "${pricePerCall} ${settlementNetwork === 'lightning_l402' ? 'SAT' : 'USDC'}",
  "payUrl": "${targetDomain.replace(/\/$/, '')}/api/v1/x402/invoice",
  "documentation": "${targetDomain.replace(/\/$/, '')}/.well-known/pay.json"
}`;

  // Generate /.well-known/pay.json machine-readable manifest
  const generatedPayJson = JSON.stringify(
    {
      $schema: 'https://standards.agenticweb.org/schema/v1/pay.json',
      version: '1.0.0',
      publisher: targetDomain,
      description: 'Autonomous AI agent machine-to-machine payment protocol specifications.',
      settlementMethods: [
        {
          id: settlementNetwork,
          type: settlementNetwork === 'lightning_l402' ? 'lightning' : 'smart-contract',
          network: settlementNetwork === 'lightning_l402' ? 'bitcoin' : settlementNetwork === 'base_usdc' ? 'base' : 'solana',
          token: settlementNetwork === 'lightning_l402' ? 'SAT' : 'USDC',
          recipient: recipientWallet,
        },
      ],
      rateLimits: {
        agentBurstLimit: 120,
        quotaPeriod: '1m',
      },
      endpoints: [
        {
          path: protectedEndpoint,
          method: 'POST',
          price: pricePerCall,
          currency: settlementNetwork === 'lightning_l402' ? 'SAT' : 'USDC',
          description: 'Deep WCAG 2.2 accessibility compliance audit for autonomous agents.',
        },
        {
          path: '/api/v1/agent/contrast',
          method: 'GET',
          price: '0.0001',
          currency: settlementNetwork === 'lightning_l402' ? 'SAT' : 'USDC',
          description: 'High-speed color contrast calculations.',
        },
      ],
    },
    null,
    2
  );

  // Generate Express.js / Cloudflare Worker Middleware Snippet
  const generatedMiddleware = `// Express / Node.js x402 Agent Payment Verification Middleware
import express from 'express';

export function x402Paywall(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  
  // 1. Verify if the autonomous agent provided an x402 payment proof token
  if (!authHeader || !authHeader.startsWith('Bearer x402_')) {
    res.setHeader('WWW-Authenticate', 'x402 realm="${targetDomain}"');
    res.setHeader('x402-price', '${pricePerCall}');
    res.setHeader('x402-network', '${settlementNetwork}');
    res.setHeader('x402-recipient', '${recipientWallet}');
    return res.status(402).json({
      error: 'Payment Required',
      price: '${pricePerCall} USDC',
      invoiceUrl: '${targetDomain}/api/v1/x402/invoice'
    });
  }

  // 2. Validate token on-chain or through settlement node
  const agentPaymentToken = authHeader.replace('Bearer ', '');
  // verifyReceipt(agentPaymentToken) -> true
  next();
}`;

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationLog(null);
    setTimeout(() => {
      setSimulationLog(
        `[Agent Request Initiated] Claude Operator queried ${protectedEndpoint}\n` +
          `[HTTP Intercept] Server returned HTTP 402 Payment Required\n` +
          `[Header Parsed] WWW-Authenticate: x402 price="${pricePerCall} USDC", network="${settlementNetwork}"\n` +
          `[Agent Wallet Handshake] Agent signed micro-transaction: ${pricePerCall} USDC to ${recipientWallet.slice(0, 10)}...\n` +
          `[Token Minted] Receipt token: x402_tx_${Date.now().toString(16)}_verified\n` +
          `[Re-request with Auth] GET ${protectedEndpoint} (Authorization: Bearer x402_tx...)\n` +
          `[Server Response] HTTP 200 OK (Latency: 68ms) -> Deep audit payload unlocked successfully.`
      );
      setIsSimulating(false);
    }, 750);
  };

  const x402VideoChapters: VideoChapter[] = [
    {
      startSec: 0,
      endSec: 3.5,
      label: 'The Problem',
      badge: '0:00 - 0:03 Unpaid Scraping',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
      headline: 'Autonomous AI Scrapers Consume Content Without Paying',
      subtext:
        'AI agents never view ads, never click banners, and bypass traditional human paywalls. Publishers lose millions in bandwidth and compute with zero monetization.',
      codeSnippet: 'BOT_SCRAPE: OpenAI Operator extracted 140,000 words (Ad Revenue: $0.00)',
    },
    {
      startSec: 3.5,
      endSec: 7.0,
      label: 'The Solution',
      badge: '0:04 - 0:07 HTTP 402 Handshake',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
      headline: 'HTTP 402 Protocol Triggered: Instant Machine Micropayment',
      subtext:
        'Your server intercepts AI requests with standardized x402 headers and /.well-known/pay.json. The bot pays micro-cents ($0.001 to $0.05) per call automatically.',
      codeSnippet: 'HTTP 402 Payment Required -> WWW-Authenticate: x402 price="0.002 USDC"',
    },
    {
      startSec: 7.0,
      endSec: 10.0,
      label: 'The Result',
      badge: '0:08 - 0:10 Automated Revenue',
      badgeColor: 'bg-teal-950 text-teal-300 border-teal-800',
      headline: 'Real-Time Machine-to-Machine Revenue: 100% Automated',
      subtext:
        'Every autonomous agent query deposits instant micro-payments directly to your wallet without CAPTCHAs, human friction, or chargebacks.',
      metricLabel: 'Bot Revenue',
      metricValue: '$0.002 / Bot Query',
    },
  ];

  const x402Keywords: VideoKeywordData = {
    primaryKeyword: 'HTTP 402 payment required generator',
    seedKeyword: 'HTTP 402',
    shortTailVariants: ['x402 generator', 'agent paywall builder', 'L402 protocol generator', 'pay.json generator'],
    longTailVariants: [
      'how to charge AI bots for scraping website',
      'how to set up HTTP 402 paywall for AI agents',
      'monetize website traffic from autonomous AI agents',
    ],
    untappedKeywords: [
      'x402 header generator online',
      '/.well-known/pay.json generator',
      'how to block AI scrapers unless they pay',
      'machine to machine micropayments for webmasters',
      'ai agent paywall config for cloudflare and nginx',
      'l402 lightning paywall generator for api',
    ],
    problemSummary:
      'Autonomous AI agents browse websites headlessly. They strip articles, tools, and calculators without viewing advertisements or buying subscriptions. Webmasters bear the server compute costs while receiving zero monetization from millions of agent interactions.',
    solutionSummary:
      'This HTTP 402 & x402 generator configures the official IETF machine-to-machine payment protocol headers and /.well-known/pay.json manifests. It forces autonomous bots (ChatGPT Operator, Claude Computer Use) to pay micro-cents per HTTP request programmatically.',
    actionGuide: [
      'Enter your website domain, protected API route, and price per query ($0.001 to $0.05).',
      'Choose your settlement rail (USDC on Base, Bitcoin Lightning L402, or Solana Pay) and input your recipient address.',
      'Copy the generated HTTP 402 headers or download /.well-known/pay.json to deploy directly to your web server.',
    ],
  };

  const faqs = [
    {
      q: 'What is the HTTP 402 Payment Required status code?',
      a: 'HTTP 402 Payment Required is an official IETF HTTP status code reserved for digital payment systems that was historically unused until modern autonomous AI agent micropayments emerged.',
      detail:
        'Standardized by Coinbase, Cloudflare, and the Agentic Web Consortium, HTTP 402 allows web servers to challenge incoming AI crawlers and automated agents with a machine-readable invoice.',
    },
    {
      q: 'What is the x402 protocol?',
      a: 'The x402 protocol is an open web specification that specifies HTTP response headers and JSON schemas for machine-to-machine micropayments without requiring human login or manual credit cards.',
      detail:
        'When an AI agent receives an x402 header, its integrated wallet executes a micro-transaction (e.g. $0.002 USDC or 10 Satoshis) and retries the request with an authorization token.',
    },
    {
      q: 'What is /.well-known/pay.json?',
      a: 'The pay.json file is a standardized machine-readable manifest placed at your website root that declares payment rails, token pricing per endpoint, and accepted settlement networks for AI agents.',
      detail:
        'Autonomous bots check /.well-known/pay.json alongside robots.txt and agent.json to understand how much bandwidth or computational queries cost on your domain.',
    },
    {
      q: 'How does x402 differ from traditional paywalls like Stripe?',
      a: 'Traditional paywalls require human input (credit card forms, OTPs, CAPTCHAs), whereas x402 is 100% programmatic and handles sub-penny micropayments ($0.0005) with zero credit card merchant fees.',
      detail:
        'Because AI agents execute thousands of automated tasks per minute, traditional $10/month subscriptions fail. Per-query micro-metering is the dominant monetization model for 2026–2035.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-white">
      {/* Schema.org SoftwareApplication Structured Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'HTTP 402 & x402 AI Agent Micropayments Generator',
            operatingSystem: 'All',
            applicationCategory: 'FinancialApplication',
            offers: {
              '@type': 'Offer',
              price: '0.00',
              priceCurrency: 'USD',
            },
            description:
              'Generate HTTP 402 Payment Required headers and /.well-known/pay.json manifests. Monetize autonomous AI agents, ChatGPT Operator, and Claude scraping your web utilities.',
          }),
        }}
      />

      {/* Hero Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  HTTP 402 & x402 AI Agent Micropayments Generator
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                  2026–2035 Protocol
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Machine-to-Machine Agent Paywalls, <code>pay.json</code> Manifests & L402 Headers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/blog/x402-ai-agent-micropayments-guide')}
              className="text-xs text-amber-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Read x402 Monetization Guide</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const target = activeTab === 'headers' ? generatedHeaders : activeTab === 'pay-json' ? generatedPayJson : generatedMiddleware;
                const filename = activeTab === 'headers' ? 'http-402-headers.txt' : activeTab === 'pay-json' ? 'pay.json' : 'x402-middleware.ts';
                handleDownload(filename, target);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Paywall</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Name and Comprehensive Description Hero Block */}
        <section className="mb-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-orange-950/80 border border-amber-500/30 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  HTTP 402 & x402 AI Agent Micropayments Generator
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                  Standard: x402 / L402 (2026–2035)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                As autonomous AI agents (ChatGPT Operator, Claude Computer Use, Perplexity) replace human ad-clicking visitors, traditional display advertising produces zero revenue. This utility generates cryptographic <strong>HTTP 402 Payment Required</strong> response headers, machine-readable <code>/.well-known/pay.json</code> manifests, and Express/Cloudflare middlewares. Monetize programmatic scraping at <strong>0.1¢ to 5¢ per query</strong> directly settled via USDC on Base or Lightning L402.
              </p>
              
              {/* Feature Value Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-medium text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-amber-300 font-mono">
                  ✓ Machine-to-Machine Settlement (28ms)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-emerald-300 font-mono">
                  ✓ Zero Chargeback Risk
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 font-mono">
                  ✓ Universal Express & Cloudflare Middleware
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => {
                  const faqEl = document.getElementById('x402-faqs');
                  faqEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Read x402 Spec Guide</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </section>

        {/* 10-Second Problem & Solution Interactive Video Masterclass (Directly under tool name and description) */}
        <ExplainerVideoPlayer
          toolType="x402"
          accentColor="amber"
          title="Why AI Bots Scrape for Free (And How HTTP 402 Solves It in 10 Seconds)"
          subtitle="Watch how autonomous agents like ChatGPT Operator pay per query automatically via x402."
          chapters={x402VideoChapters}
          keywords={x402Keywords}
        />

        {/* Studio Grid: Input Configuration & Live Spec Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Configurator (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Agent Paywall Configuration</span>
                </h3>
                <span className="text-[11px] text-slate-400">Step 1 of 2</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Website Domain</label>
                <input
                  type="url"
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                  placeholder="https://yourdomain.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Protected Endpoint / Route</label>
                <input
                  type="text"
                  value={protectedEndpoint}
                  onChange={(e) => setProtectedEndpoint(e.target.value)}
                  placeholder="/api/v1/agent/audit"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Price Per Query</label>
                  <input
                    type="text"
                    value={pricePerCall}
                    onChange={(e) => setPricePerCall(e.target.value)}
                    placeholder="0.002"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Settlement Rail</label>
                  <select
                    value={settlementNetwork}
                    onChange={(e) => setSettlementNetwork(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="base_usdc">Base (USDC Micropayments)</option>
                    <option value="lightning_l402">Bitcoin Lightning (L402)</option>
                    <option value="solana_pay">Solana Pay (USDC / SOL)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Recipient Address / Node Key
                </label>
                <input
                  type="text"
                  value={recipientWallet}
                  onChange={(e) => setRecipientWallet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Estimated Monetization Potential Widget */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Projected Bot Scraping Yield</span>
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold">100% Retained</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">10,000 Bot Queries</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">
                    ${(parseFloat(pricePerCall || '0') * 10000).toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">100,000 Bot Queries</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">
                    ${(parseFloat(pricePerCall || '0') * 100000).toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Zero credit card merchant processing fees: settlements occur instantly on L2/Lightning rails.
              </p>
            </div>
          </div>

          {/* Right Column: Code Output & Live Simulator (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                {/* Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('headers')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'headers'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      HTTP 402 Headers
                    </button>
                    <button
                      onClick={() => setActiveTab('pay-json')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'pay-json'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      pay.json Manifest
                    </button>
                    <button
                      onClick={() => setActiveTab('middleware')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'middleware'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Express / Node Middleware
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const text = activeTab === 'headers' ? generatedHeaders : activeTab === 'pay-json' ? generatedPayJson : generatedMiddleware;
                      copyToClipboard(text, 'x402-clipboard');
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    {copiedId === 'x402-clipboard' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'x402-clipboard' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                {/* Code Preview */}
                <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-amber-300 border border-slate-800 overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed">
                  <pre>{activeTab === 'headers' ? generatedHeaders : activeTab === 'pay-json' ? generatedPayJson : generatedMiddleware}</pre>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span>
                  Deploy Target:{' '}
                  <strong className="text-white font-mono">
                    {activeTab === 'headers' ? 'Web Server HTTP Response' : activeTab === 'pay-json' ? '/.well-known/pay.json' : 'API Gateway Middleware'}
                  </strong>
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Machine-to-Machine Verified
                </span>
              </div>
            </div>

            {/* Live Interactive Agent Payment Sandbox */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Interactive x402 Payment Handshake Simulator</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 text-[10px] font-mono">
                  Autonomous Agent Simulator
                </span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Simulate Autonomous Bot Request</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={simulationPrompt}
                    onChange={(e) => setSimulationPrompt(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    <span>Test 402 Handshake</span>
                  </button>
                </div>
              </div>

              {simulationLog && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {simulationLog}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comparative Benchmark Table */}
        <section className="mb-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Traditional Human Paywalls vs. Autonomous Agent x402 Micropayments
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Why credit-card paywalls block AI commerce and how machine-to-machine micropayments unlock frictionless revenue.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-300 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-3 sm:p-4 border-b border-slate-800">Monetization Metric</th>
                  <th className="p-3 sm:p-4 border-b border-slate-800 text-rose-400">Legacy Paywall (Stripe/PayPal)</th>
                  <th className="p-3 sm:p-4 border-b border-slate-800 text-amber-400">x402 Protocol & pay.json (2026–2035)</th>
                  <th className="p-3 sm:p-4 border-b border-slate-800">Advantage for Publishers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Autonomous Agent Usability</td>
                  <td className="p-3 sm:p-4 text-rose-400">0% (Fails on CAPTCHA & credit card forms)</td>
                  <td className="p-3 sm:p-4 text-emerald-400 font-semibold">100% (Native programmatic handshake)</td>
                  <td className="p-3 sm:p-4 font-medium text-emerald-400">Instant AI Monetization</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Transaction Minimum</td>
                  <td className="p-3 sm:p-4 text-slate-400">$0.50 (30¢ + 2.9% fee makes small fees impossible)</td>
                  <td className="p-3 sm:p-4 text-amber-300 font-mono">$0.0001 (Sub-cent micro-metering)</td>
                  <td className="p-3 sm:p-4 font-medium text-purple-400">Granular Pay-Per-Query</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Settlement Latency</td>
                  <td className="p-3 sm:p-4 text-slate-400">2 to 7 business banking days</td>
                  <td className="p-3 sm:p-4 text-amber-300 font-mono">&lt; 150 milliseconds on-chain</td>
                  <td className="p-3 sm:p-4 font-medium text-emerald-400">Immediate Direct Liquidity</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Chargeback / Fraud Risk</td>
                  <td className="p-3 sm:p-4 text-rose-400">High (Dispute fees & stolen credit cards)</td>
                  <td className="p-3 sm:p-4 text-emerald-400">0% (Cryptographically signed irrevocable receipts)</td>
                  <td className="p-3 sm:p-4 font-medium text-emerald-400">Zero Chargeback Losses</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Snippet-Optimized FAQ Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Frequently Asked Questions: HTTP 402 & AI Agent Micropayments
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Factual, snippet-optimized answers to high-volume developer queries and monetization questions.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 transition-colors">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-900/50 cursor-pointer"
                >
                  <h3 className="text-sm font-bold text-white">{faq.q}</h3>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {openFaqIndex === idx && (
                  <div className="p-4 pt-0 border-t border-slate-900 space-y-2 text-xs">
                    <p className="text-amber-300 font-semibold leading-relaxed bg-amber-950/40 p-3 rounded-lg border border-amber-900/50">
                      <strong>Direct Answer:</strong> {faq.a}
                    </p>
                    <p className="text-slate-400 leading-relaxed pt-1">{faq.detail}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related Web Monetization & Governance Tools (Law 6 & Law 12) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800/60">
                Agentic Monetization Cluster
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Related AI Governance &amp; Crawler Authorization Tools
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/tools')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('/tools/ai-txt-agentic-governance-builder')}
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-black uppercase text-amber-400">Agent Directives</div>
              <div className="text-xs font-black text-white group-hover:text-amber-300 mt-0.5">
                AI Crawler &amp; ai.txt Builder →
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Configure rate-limiting, licensing, and crawler permissions for AI agents.
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/tools/robots-txt-validator')}
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-black uppercase text-amber-400">Crawl Permissions</div>
              <div className="text-xs font-black text-white group-hover:text-amber-300 mt-0.5">
                Robots.txt &amp; AI Bot Validator →
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Simulate 16 major AI crawlers against your current robots.txt file.
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-black uppercase text-amber-400">Position #0 Sniper</div>
              <div className="text-xs font-black text-white group-hover:text-amber-300 mt-0.5">
                AEO Position #0 Sniper Optimizer →
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Extract high-value answers and verify first-50-words snippet compliance.
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
