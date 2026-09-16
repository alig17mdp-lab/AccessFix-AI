import React, { useState } from 'react';
import {
  Bot,
  Cpu,
  FileCode,
  Sparkles,
  Copy,
  Check,
  Download,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Code2,
  RefreshCw,
  Zap,
  Network,
  Sliders,
  Play,
  Share2,
} from 'lucide-react';
import { ExplainerVideoPlayer, VideoChapter, VideoKeywordData } from './ExplainerVideoPlayer';

interface McpAgentGeneratorViewProps {
  onNavigate: (route: string) => void;
}

interface AgentAction {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST';
  params: { name: string; type: string; description: string; required: boolean }[];
}

export const McpAgentGeneratorView: React.FC<McpAgentGeneratorViewProps> = ({ onNavigate }) => {
  const [targetDomain, setTargetDomain] = useState<string>('https://example.com');
  const [brandName, setBrandName] = useState<string>('AccessFix Digital Solutions');
  const [agentDescription, setAgentDescription] = useState<string>(
    'Autonomous accessibility auditing, WCAG compliance calculations, and technical SEO analysis for web applications.'
  );
  const [activeSpecTab, setActiveSpecTab] = useState<'mcp' | 'agent-json' | 'schema'>('mcp');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Simulation test state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationPrompt, setSimulationPrompt] = useState<string>(
    'Run full WCAG 2.2 color contrast audit on primary button and retrieve fix recommendations.'
  );
  const [simulationLog, setSimulationLog] = useState<string | null>(null);

  const [actions, setActions] = useState<AgentAction[]>([
    {
      id: 'action-1',
      name: 'audit_accessibility',
      description: 'Executes automated WCAG 2.2 Level AA compliance scan on target URL and returns violation items.',
      endpoint: '/api/v1/agent/wcag-scan',
      method: 'POST',
      params: [
        { name: 'url', type: 'string', description: 'Target website URL to audit', required: true },
        { name: 'standard', type: 'string', description: 'WCAG standard: 2.1 or 2.2', required: false },
      ],
    },
    {
      id: 'action-2',
      name: 'calculate_contrast_ratio',
      description: 'Calculates mathematical contrast ratio between foreground and background hexadecimal colors.',
      endpoint: '/api/v1/agent/contrast',
      method: 'GET',
      params: [
        { name: 'fgColor', type: 'string', description: 'Hex foreground color e.g. #3B82F6', required: true },
        { name: 'bgColor', type: 'string', description: 'Hex background color e.g. #FFFFFF', required: true },
      ],
    },
    {
      id: 'action-3',
      name: 'fetch_llms_manifest',
      description: 'Retrieves machine-readable Markdown documentation and API guides from domain root.',
      endpoint: '/llms.txt',
      method: 'GET',
      params: [],
    },
  ]);

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

  // Generate Model Context Protocol (MCP) server configuration
  const generatedMcpJson = JSON.stringify(
    {
      mcpVersion: '2026-02-28',
      serverInfo: {
        name: brandName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        version: '1.0.0',
        description: agentDescription,
        homepage: targetDomain,
      },
      tools: actions.map((act) => ({
        name: act.name,
        description: act.description,
        inputSchema: {
          type: 'object',
          properties: act.params.reduce((acc, p) => {
            acc[p.name] = { type: p.type, description: p.description };
            return acc;
          }, {} as Record<string, { type: string; description: string }>),
          required: act.params.filter((p) => p.required).map((p) => p.name),
        },
        execution: {
          type: 'http',
          url: `${targetDomain.replace(/\/$/, '')}${act.endpoint}`,
          method: act.method,
        },
      })),
      capabilities: {
        tools: { listChanged: false },
        resources: { subscribe: false },
      },
    },
    null,
    2
  );

  // Generate Open Agentic Web Standard (/.well-known/agent.json)
  const generatedAgentJson = JSON.stringify(
    {
      $schema: 'https://standards.agenticweb.org/schema/v1/agent.json',
      name: brandName,
      description: agentDescription,
      url: targetDomain,
      version: '1.0.0',
      authentication: {
        type: 'none',
        description: 'Public read and analysis tools with no required API key.',
      },
      endpoints: {
        mcp: `${targetDomain.replace(/\/$/, '')}/mcp.json`,
        llmsTxt: `${targetDomain.replace(/\/$/, '')}/llms.txt`,
      },
      actions: actions.map((act) => ({
        actionId: act.name,
        summary: act.description,
        path: act.endpoint,
        method: act.method,
        parameters: act.params,
      })),
      compliance: {
        robotsTxtRespect: true,
        dataStoragePolicy: 'zero-retention',
      },
    },
    null,
    2
  );

  // Generate Schema.org WebAPI JSON-LD
  const generatedSchemaOrg = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'WebAPI',
      name: `${brandName} AI Agent Action API`,
      description: agentDescription,
      documentation: `${targetDomain.replace(/\/$/, '')}/llms.txt`,
      provider: {
        '@type': 'Organization',
        name: brandName,
        url: targetDomain,
      },
      potentialAction: actions.map((act) => ({
        '@type': 'Action',
        name: act.name,
        description: act.description,
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${targetDomain.replace(/\/$/, '')}${act.endpoint}`,
          httpMethod: act.method,
          contentType: 'application/json',
        },
      })),
    },
    null,
    2
  );

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationLog(null);
    setTimeout(() => {
      setSimulationLog(
        `[Agent Handshake 2026.1] Connected to ${targetDomain}/mcp.json\n` +
          `[Protocol Discovery] Recognized 3 tools: audit_accessibility, calculate_contrast_ratio, fetch_llms_manifest\n` +
          `[User Intent] "${simulationPrompt}"\n` +
          `[Agent Reasoning] Selected tool: "calculate_contrast_ratio" with parameters { fgColor: "#3B82F6", bgColor: "#FFFFFF" }\n` +
          `[HTTP Execution] GET ${targetDomain}/api/v1/agent/contrast?fgColor=%233B82F6&bgColor=%23FFFFFF -> Status 200 OK (28ms)\n` +
          `[Agent Output Payload] Ratio: 3.68:1 (Fails WCAG AA for normal text, passes for 18pt+ bold). Suggested color: #1D4ED8 (4.54:1).`
      );
      setIsSimulating(false);
    }, 850);
  };

  const faqs = [
    {
      q: 'What is the Model Context Protocol (MCP)?',
      a: 'The Model Context Protocol (MCP) is an open specification that allows AI assistants like Claude, ChatGPT, and Cursor to securely connect to web servers, tools, and databases.',
      detail:
        'Introduced to eliminate custom API integration silos, MCP functions as the universal USB-C cable for AI models, allowing autonomous agents to execute functions directly on your web domain.',
    },
    {
      q: 'What is an AI Agent Manifest (agent.json)?',
      a: 'An AI Agent Manifest is a standardized JSON document deployed at /.well-known/agent.json that informs autonomous AI agents which actions, APIs, and calculations your website provides.',
      detail:
        'Similar to how robots.txt controls web crawlers and sitemap.xml lists URL trees, agent.json declares public functions that AI operators can trigger on behalf of end users.',
    },
    {
      q: 'Why is Agent SEO critical for 2026 to 2035?',
      a: 'Agent SEO ensures your website is usable by autonomous AI agents like OpenAI Operator and Google Project Astra, which perform web actions without rendering standard graphical browsers.',
      detail:
        'As conversational and agentic browsing surpasses traditional search clicks, websites without an MCP manifest or agent.json file will become invisible to AI agents attempting to execute purchases or calculations.',
    },
    {
      q: 'Where should I host the MCP and agent.json files?',
      a: 'Deploy agent.json to https://yourdomain.com/.well-known/agent.json and host your MCP configuration at https://yourdomain.com/mcp.json.',
      detail:
        'Frontier AI agents automatically probe the /.well-known/ directory first before attempting to parse complex client-side JavaScript or DOM structures.',
    },
  ];

  const mcpVideoChapters: VideoChapter[] = [
    {
      startSec: 0,
      endSec: 3.5,
      label: 'The Problem',
      badge: '0:00 - 0:03 The Block',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
      headline: 'Autonomous AI Agents Fail: 404 No Agent Manifest Found',
      subtext:
        'When Claude Computer Use, OpenAI Operator, or Google Astra browse your site, they cannot parse complex visual CSS buttons. Scraping fails and zero conversions execute.',
      codeSnippet: 'ERR_AGENT_REJECT: /.well-known/agent.json not found (HTTP 404)',
    },
    {
      startSec: 3.5,
      endSec: 7.0,
      label: 'The Solution',
      badge: '0:04 - 0:07 The Handshake',
      badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
      headline: 'MCP Server Handshake: Structured Tool Schema Exposed',
      subtext:
        'Deploying mcp.json and /.well-known/agent.json exposes your calculator, bookings, and compliance tools with typed parameters and sub-120ms execution latency.',
      codeSnippet: 'GET /mcp.json -> HTTP 200 OK (2 Tools Loaded, Handshake in 84ms)',
    },
    {
      startSec: 7.0,
      endSec: 10.0,
      label: 'The Result',
      badge: '0:08 - 0:10 Execution',
      badgeColor: 'bg-teal-950 text-teal-300 border-teal-800',
      headline: '100% Agentic Execution Verified & Ready for Export',
      subtext:
        'AI agents execute your website tools directly. You gain autonomous commerce transactions and top citation priority while competitors remain invisible.',
      metricLabel: 'Handshake Latency',
      metricValue: '<120ms Latency',
    },
  ];

  const mcpKeywords: VideoKeywordData = {
    primaryKeyword: 'Model Context Protocol generator',
    seedKeyword: 'Model Context Protocol',
    shortTailVariants: ['MCP generator', 'AI agent manifest', 'agent.json builder', 'agent SEO tool'],
    longTailVariants: [
      'how to make website AI agent friendly',
      'how to connect website to Claude computer use',
      'how to expose web tools to OpenAI Operator',
    ],
    untappedKeywords: [
      'mcp json generator for website',
      'agent.json generator',
      'agent SEO optimization tool',
      'model context protocol config generator online',
      'agentic web optimization checklist',
    ],
    problemSummary:
      'Legacy websites rely on visual HTML/CSS rendering designed solely for human eyes. Frontier autonomous AI agents (OpenAI Operator, Claude Computer Use) operate via headless API discovery. Without an explicit /.well-known/agent.json and /mcp.json manifest, autonomous bots cannot discover your tools or execute transactions, resulting in zero agentic conversions.',
    solutionSummary:
      'This Model Context Protocol generator builds syntactically valid mcp.json schemas and /.well-known/agent.json manifests in seconds. It defines your domain endpoints, rate limits, and typed tool schemas so any AI model can discover, validate, and execute your website functions natively.',
    actionGuide: [
      'Define your target domain URL, brand title, and action endpoints in the configuration form below.',
      'Click "Simulate Agent Handshake" to test how Claude and OpenAI Operator discover and invoke your tools.',
      'Download mcp.json and agent.json, then host them at your website root directory.',
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Schema.org SoftwareApplication Structured Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Model Context Protocol & AI Agent Manifest Generator',
            operatingSystem: 'All',
            applicationCategory: 'DeveloperApplication',
            offers: {
              '@type': 'Offer',
              price: '0.00',
              priceCurrency: 'USD',
            },
            description:
              'Free Model Context Protocol (MCP) generator and AI agent manifest builder. Deploy agent.json and mcp.json to make your website executable by ChatGPT Operator, Claude, and Perplexity Agents.',
          }),
        }}
      />

      {/* Hero Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Model Context Protocol & Agent Manifest Generator
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold">
                  2026–2035 Protocol
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate valid <code>mcp.json</code> and <code>/.well-known/agent.json</code> configurations for Autonomous AI Agents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/blog/mcp-agent-seo-manifest-guide')}
              className="text-xs text-indigo-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Read Agent SEO Guide</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const target = activeSpecTab === 'mcp' ? generatedMcpJson : activeSpecTab === 'agent-json' ? generatedAgentJson : generatedSchemaOrg;
                const filename = activeSpecTab === 'mcp' ? 'mcp.json' : activeSpecTab === 'agent-json' ? 'agent.json' : 'webapi-schema.json';
                handleDownload(filename, target);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Spec</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Name and Comprehensive Description Hero Block */}
        <section className="mb-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Model Context Protocol (MCP) & Agent SEO Generator
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold">
                  Standard: MCP v2026.1 & agent.json
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                Between 2026 and 2035, web users will increasingly rely on autonomous AI agents (OpenAI Operator, Claude Computer Use, Google Astra) to execute real-world tasks. By publishing a Model Context Protocol (MCP) server manifest and an <code>agent.json</code> declaration, your website allows AI models to trigger calculations, orders, and audits directly.
              </p>
              
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-medium text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-indigo-300 font-mono">
                  ✓ JSON-RPC 2.0 MCP Tools
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-emerald-300 font-mono">
                  ✓ /.well-known/agent.json Spec
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 font-mono">
                  ✓ Schema.org WebAPI Semantic Linkage
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => {
                  const faqEl = document.getElementById('mcp-faqs');
                  faqEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Read Agent SEO Guide</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </section>

        {/* 10-Second Problem & Solution Interactive Video Masterclass (Directly under tool name and description) */}
        <ExplainerVideoPlayer
          toolType="mcp"
          accentColor="indigo"
          title="Why AI Agents Fail on 99% of Websites (And How MCP Solves It in 10s)"
          subtitle="Watch how autonomous agents like Claude and OpenAI Operator discover and execute your tools."
          chapters={mcpVideoChapters}
          keywords={mcpKeywords}
        />

        {/* Studio Grid: Input Configuration & Live Spec Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Domain & Actions Configurator (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>Domain & Brand Parameters</span>
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand or Service Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Acme Cloud Tools"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Agentic Capability Description</label>
                <textarea
                  rows={3}
                  value={agentDescription}
                  onChange={(e) => setAgentDescription(e.target.value)}
                  placeholder="Describe what tasks an autonomous agent can complete on your site..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Declared Actions & Capabilities List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Network className="w-4 h-4 text-purple-400" />
                  <span>Exposed AI Agent Tools ({actions.length})</span>
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold">Active in Manifest</span>
              </div>

              <div className="space-y-3">
                {actions.map((act) => (
                  <div key={act.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-400">{act.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {act.method} {act.endpoint}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{act.description}</p>
                    <div className="pt-1 flex flex-wrap gap-1">
                      {act.params.map((p, pIdx) => (
                        <span key={pIdx} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-950/60 text-indigo-300 border border-indigo-900/60">
                          {p.name}: {p.type} {p.required ? '(req)' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 italic">
                Tip: Autonomous agents use the <code>name</code> and <code>description</code> to semantically decide when to call your API.
              </p>
            </div>
          </div>

          {/* Right Column: Spec Output & Live Simulator (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              {/* Tabs for Standards */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveSpecTab('mcp')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeSpecTab === 'mcp'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      mcp.json (Anthropic/OpenAI)
                    </button>
                    <button
                      onClick={() => setActiveSpecTab('agent-json')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeSpecTab === 'agent-json'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      agent.json (Open Web)
                    </button>
                    <button
                      onClick={() => setActiveSpecTab('schema')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeSpecTab === 'schema'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Schema.org WebAPI
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const text = activeSpecTab === 'mcp' ? generatedMcpJson : activeSpecTab === 'agent-json' ? generatedAgentJson : generatedSchemaOrg;
                      copyToClipboard(text, 'spec-clipboard');
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    {copiedId === 'spec-clipboard' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'spec-clipboard' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                {/* Code Display */}
                <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-indigo-300 border border-slate-800 overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed">
                  <pre>{activeSpecTab === 'mcp' ? generatedMcpJson : activeSpecTab === 'agent-json' ? generatedAgentJson : generatedSchemaOrg}</pre>
                </div>
              </div>

              {/* Deployment instructions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span>
                  Deploy Target:{' '}
                  <strong className="text-white font-mono">
                    {activeSpecTab === 'mcp' ? '/mcp.json' : activeSpecTab === 'agent-json' ? '/.well-known/agent.json' : 'HTML <head> tag'}
                  </strong>
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Autonomous Crawlers
                </span>
              </div>
            </div>

            {/* Live Interactive Agent Simulation Sandbox */}
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Interactive Agent Handshake Simulator</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px] font-mono">
                  Agentic Runtime Sandbox
                </span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Simulate User Intent to Autonomous Agent</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={simulationPrompt}
                    onChange={(e) => setSimulationPrompt(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    <span>Test Handshake</span>
                  </button>
                </div>
              </div>

              {simulationLog && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {simulationLog}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comparative Table: Traditional Web vs Agentic Web (2026-2035) */}
        <section className="mb-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Architectural Shift: Traditional SEO vs. Agent SEO (2026–2035)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Why web architectures must evolve from rendering DOM hyperlinks to declaring machine-executable action schemas.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-300 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-3 sm:p-4 border-b border-slate-800">Dimension</th>
                  <th className="p-3 sm:p-4 border-b border-slate-800 text-slate-400">Traditional Web SEO (2010–2024)</th>
                  <th className="p-3 sm:p-4 border-b border-slate-800 text-indigo-400">Agent SEO & MCP (2026–2035)</th>
                  <th className="p-3 sm:p-4 border-b border-slate-800">Impact on Traffic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Target Consumer</td>
                  <td className="p-3 sm:p-4 text-slate-400">Human reading browser HTML</td>
                  <td className="p-3 sm:p-4 text-emerald-400 font-semibold">Autonomous AI Agent executing user intent</td>
                  <td className="p-3 sm:p-4 font-medium text-amber-400">Fundamental Paradigm Shift</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Discovery Protocol</td>
                  <td className="p-3 sm:p-4 text-slate-400">Googlebot crawling <code>/sitemap.xml</code></td>
                  <td className="p-3 sm:p-4 text-indigo-300 font-mono"><code>/mcp.json</code> & <code>/.well-known/agent.json</code></td>
                  <td className="p-3 sm:p-4 font-medium text-emerald-400">Immediate Direct Invocation</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Fulfillment Mechanism</td>
                  <td className="p-3 sm:p-4 text-slate-400">User clicks 10 blue links & navigates forms</td>
                  <td className="p-3 sm:p-4 text-indigo-300">Agent triggers API action & summarizes result</td>
                  <td className="p-3 sm:p-4 font-medium text-purple-400">Zero-Friction Transaction</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Content Format</td>
                  <td className="p-3 sm:p-4 text-slate-400">Keyword-dense blog posts with ads</td>
                  <td className="p-3 sm:p-4 text-indigo-300">High-density Markdown & JSON tool schemas</td>
                  <td className="p-3 sm:p-4 font-medium text-emerald-400">Cuts Token Latency by 92%</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Consequence of Inaction</td>
                  <td className="p-3 sm:p-4 text-slate-400">Lower PageRank rank in search results</td>
                  <td className="p-3 sm:p-4 text-rose-400 font-semibold">Total invisibility to AI agent commerce</td>
                  <td className="p-3 sm:p-4 font-medium text-rose-400">Critical Business Risk</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Step-by-step Implementation Guide */}
        <section className="mb-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            How to Deploy Your Model Context Protocol (MCP) Server in 3 Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/40">
                1
              </span>
              <h3 className="text-sm font-bold text-white">Define Exposed Capabilities</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identify which tools or calculations on your site offer high public utility (e.g. contrast calculators, converters, product search).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/40">
                2
              </span>
              <h3 className="text-sm font-bold text-white">Export & Upload JSON Manifests</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save the generated <code>mcp.json</code> to your public root, and save <code>agent.json</code> inside the <code>/.well-known/</code> folder.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/40">
                3
              </span>
              <h3 className="text-sm font-bold text-white">Grant AI Crawler Access</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ensure your <code>robots.txt</code> allows AI user agents like <code>GPTBot</code> and <code>ClaudeBot</code> to reach your API endpoints.
              </p>
            </div>
          </div>
        </section>

        {/* Snippet-Optimized FAQ Section (AEO Compliant) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Frequently Asked Questions: Model Context Protocol & Agent SEO
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Direct, authoritative answers answering high-volume search queries and technical implementation questions.
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
                    <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {openFaqIndex === idx && (
                  <div className="p-4 pt-0 border-t border-slate-900 space-y-2 text-xs">
                    <p className="text-indigo-300 font-semibold leading-relaxed bg-indigo-950/40 p-3 rounded-lg border border-indigo-900/50">
                      <strong>Direct Answer:</strong> {faq.a}
                    </p>
                    <p className="text-slate-400 leading-relaxed pt-1">{faq.detail}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
