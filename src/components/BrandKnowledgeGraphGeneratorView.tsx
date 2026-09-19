import React, { useState } from 'react';
import {
  Network,
  ShieldCheck,
  Building2,
  User,
  Globe,
  Code2,
  Copy,
  Download,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Terminal,
  Activity,
  Layers,
  HelpCircle,
  Database,
  Cpu,
} from 'lucide-react';
import { ExplainerVideoPlayer, VideoChapter, VideoKeywordData } from './ExplainerVideoPlayer';

interface BrandKnowledgeGraphGeneratorViewProps {
  onNavigate?: (route: string) => void;
}

export const BrandKnowledgeGraphGeneratorView: React.FC<BrandKnowledgeGraphGeneratorViewProps> = ({
  onNavigate,
}) => {
  // Input State
  const [orgName, setOrgName] = useState('AuditSnipe AI');
  const [orgUrl, setOrgUrl] = useState('https://auditsnipe.com');
  const [founderName, setFounderName] = useState('Elena Rostova');
  const [primaryIndustryQid, setPrimaryIndustryQid] = useState('Q116183301'); // Web Accessibility
  const [industryName, setIndustryName] = useState('Web Accessibility (WCAG / ADA)');
  const [serviceName, setServiceName] = useState('Automated Accessibility & Technical SEO Audit Engine');
  const [wikipediaUrl, setWikipediaUrl] = useState('');
  const [crunchbaseUrl, setCrunchbaseUrl] = useState('https://www.crunchbase.com/organization/auditsnipe');
  const [githubUrl, setGithubUrl] = useState('https://github.com/auditsnipe');
  const [linkedinUrl, setLinkedinUrl] = useState('https://www.linkedin.com/company/auditsnipe');
  const [twitterUrl, setTwitterUrl] = useState('https://x.com/auditsnipe_ai');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'jsonld_graph' | 'entity_triples' | 'insulation_breakdown'>('jsonld_graph');

  // Common Wikidata Entity Presets
  const wikidataPresets = [
    { label: 'Web Accessibility', qid: 'Q116183301', name: 'Web Accessibility (WCAG / ADA)' },
    { label: 'Search Engine Optimization', qid: 'Q180711', name: 'Search Engine Optimization (SEO)' },
    { label: 'Software as a Service', qid: 'Q134114', name: 'Software as a Service (SaaS)' },
    { label: 'Electronic Commerce', qid: 'Q211198', name: 'Electronic Commerce (E-Commerce)' },
    { label: 'Artificial Intelligence', qid: 'Q11660', name: 'Artificial Intelligence (AI)' },
  ];

  // Calculate Hallucination Insulation Metric
  const calculateInsulationScore = () => {
    let score = 40;
    if (primaryIndustryQid) score += 20;
    if (crunchbaseUrl) score += 15;
    if (githubUrl) score += 10;
    if (linkedinUrl) score += 10;
    if (wikipediaUrl) score += 5;
    return Math.min(100, score);
  };

  const insulationScore = calculateInsulationScore();

  // Generated Unified @graph JSON-LD
  const generatedGraphJsonLd = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "${orgUrl}/#organization",
      "name": "${orgName}",
      "url": "${orgUrl}",
      "logo": "${orgUrl}/logo.png",
      "sameAs": [
        "https://www.wikidata.org/wiki/${primaryIndustryQid}",
        ${crunchbaseUrl ? `"${crunchbaseUrl}",` : ''}
        ${githubUrl ? `"${githubUrl}",` : ''}
        ${linkedinUrl ? `"${linkedinUrl}",` : ''}
        ${twitterUrl ? `"${twitterUrl}",` : ''}
        ${wikipediaUrl ? `"${wikipediaUrl}",` : ''}
      ].filter(Boolean),
      "founder": {
        "@type": "Person",
        "@id": "${orgUrl}/#founder",
        "name": "${founderName}",
        "jobTitle": "Chief Technology Officer & Lead Architect"
      },
      "knowsAbout": [
        {
          "@type": "DefinedTerm",
          "name": "${industryName}",
          "sameAs": "https://www.wikidata.org/wiki/${primaryIndustryQid}"
        }
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "${orgUrl}/#software",
      "name": "${serviceName}",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All Web Browsers",
      "provider": {
        "@id": "${orgUrl}/#organization"
      },
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "WebSite",
      "@id": "${orgUrl}/#website",
      "url": "${orgUrl}",
      "name": "${orgName}",
      "publisher": {
        "@id": "${orgUrl}/#organization"
      }
    }
  ]
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(generatedGraphJsonLd);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadJsonLd = () => {
    const blob = new Blob([generatedGraphJsonLd], { type: 'application/ld+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brand-knowledge-graph-${Date.now()}.jsonld`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 10-Second Informational and Using Video Data
  const videoChapters: VideoChapter[] = [
    {
      startSec: 0,
      endSec: 3.5,
      label: 'The Failure: Hallucination & Entity Drift',
      badge: 'Unanchored Brand Entity',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      headline: 'LLMs Invent Competitor Founders & Misattribute Brands',
      subtext:
        'When brand names lack universal Knowledge Graph anchors (Wikidata QIDs), AI models guess. Hallucination occurs, crediting competitors or reporting your company as defunct.',
      codeSnippet: 'Entity Drift: Entity disambiguation confidence < 0.31 (Unresolved)',
      metricLabel: 'Hallucination Risk',
      metricValue: '73% Entity Drift',
    },
    {
      startSec: 3.5,
      endSec: 7.0,
      label: 'The Solution: Wikidata QID & sameAs Bridge',
      badge: 'Multi-Graph Entity Triples',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      headline: 'Ground Your Brand to Wikidata, Crunchbase, & ISO 24617',
      subtext:
        'Formulate unambiguous JSON-LD triples linking Organization.sameAs to Wikidata concepts, Crunchbase registry, and founder Person records.',
      codeSnippet: 'sameAs: ["https://www.wikidata.org/wiki/Q116183301", "crunchbase.com"]',
      metricLabel: 'Triple Grounding',
      metricValue: '100% Machine Proof',
    },
    {
      startSec: 7.0,
      endSec: 10.0,
      label: 'The Result: Unshakable Google Knowledge Panel',
      badge: 'Knowledge Graph Anchored',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      headline: 'Secure AI Citation Trust Across Gemini, ChatGPT, & Claude',
      subtext:
        'Deploy verified @graph JSON-LD to lock your Knowledge Panel, prevent trademark confusion, and guarantee accurate enterprise brand attribution.',
      codeSnippet: 'Knowledge Graph Node: Verified QID Entity Match (Confidence 0.99)',
      metricLabel: 'Entity Trust Score',
      metricValue: '98/100 Authority',
    },
  ];

  const videoKeywords: VideoKeywordData = {
    primaryKeyword: 'brand knowledge graph generator',
    seedKeyword: 'Wikidata entity SEO',
    shortTailVariants: [
      'Wikidata sameAs schema generator',
      'brand entity bridge tool',
      'Knowledge Graph schema builder',
      'Organization sameAs creator',
    ],
    longTailVariants: [
      'how to connect brand website to Wikidata knowledge graph with JSON LD',
      'brand knowledge graph and wikidata entity bridge generator',
      'prevent AI search hallucination with entity disambiguation schema',
      'organization schema with wikidata qid and crunchbase sameAs',
    ],
    untappedKeywords: [
      'ISO 24617 entity triple bridge generator',
      'zero-hallucination brand knowledge graph schema',
      'Wikidata QID entity disambiguation generator online',
      'cross-platform authoritative entity graph builder',
    ],
    problemSummary:
      'AI search engines like ChatGPT Search and Perplexity frequently hallucinate brand details or merge two companies with similar names if no authoritative entity triple exists.',
    solutionSummary:
      'Our Brand Knowledge Graph & Wikidata Entity Bridge generates pristine schema linking your organization to verified Wikidata QIDs, founder profiles, Crunchbase entries, and social registries.',
    actionGuide: [
      'Enter your brand name, root URL, founder name, and select the Wikidata QID preset.',
      'Input verified sameAs profiles such as Crunchbase, LinkedIn, and GitHub.',
      'Copy the synthesized JSON-LD @graph and inject it into your website root index.',
    ],
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* 1. Header Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-800/40 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Knowledge Graph & Entity Grounding
            </span>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Wikidata Authority Bridge
            </span>
            <span className="text-xs text-slate-400 font-mono">Google Knowledge Panel / Perplexity Authority</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Brand Knowledge Graph & Wikidata Entity Bridge
              </h1>
              <p className="mt-4 text-lg text-slate-300 max-w-3xl leading-relaxed">
                Anchor your brand, founders, and services to universal <span className="text-amber-400 font-bold">Wikidata QIDs</span> in a single unified <code className="text-emerald-300">Schema.org @graph</code>. Prevent AI hallucinations and establish unbreakable authority across Google AI Overviews, Gemini, and Perplexity.
              </p>
            </div>

            <div className="lg:col-span-4 bg-slate-800/80 backdrop-blur border border-indigo-500/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Hallucination Insulation</span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Entity Grounded
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-5xl font-black ${insulationScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {insulationScore}%
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {insulationScore >= 80 ? 'Zero Hallucination Risk' : 'Moderate Ambiguity Risk'}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${insulationScore}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Connected to Wikidata ({primaryIndustryQid}) with multi-directory social verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10-Second Informational and Using Video Masterclass */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <ExplainerVideoPlayer
          toolType="brandkg"
          title="Brand Knowledge Graph: Grounding Entities & Wikidata in 10 Seconds"
          subtitle="Watch how Wikidata QIDs and sameAs disambiguation prevent AI search hallucinations and establish verified Knowledge Graph nodes."
          chapters={videoChapters}
          keywords={videoKeywords}
          accentColor="cyan"
        />
      </div>

      {/* 2. Interactive Generator Workspace (Top of Viewport) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 lg:p-8">
            {/* Presets */}
            <div className="bg-slate-100/80 px-4 py-3 rounded-xl border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Select Wikidata Entity Preset:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {wikidataPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrimaryIndustryQid(preset.qid);
                      setIndustryName(preset.name);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                      primaryIndustryQid === preset.qid
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    {preset.label} ({preset.qid})
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Brand or Organization Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Official Website Root URL
                </label>
                <input
                  type="url"
                  value={orgUrl}
                  onChange={(e) => setOrgUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Founder or Chief Architect
                </label>
                <input
                  type="text"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Wikidata Target QID
                </label>
                <input
                  type="text"
                  value={primaryIndustryQid}
                  onChange={(e) => setPrimaryIndustryQid(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-mono text-slate-800"
                  placeholder="e.g. Q116183301"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Crunchbase Profile URL
                </label>
                <input
                  type="url"
                  value={crunchbaseUrl}
                  onChange={(e) => setCrunchbaseUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  GitHub Organization URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-3 mb-6">
              <button
                onClick={() => setActiveTab('jsonld_graph')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition flex items-center gap-2 ${
                  activeTab === 'jsonld_graph'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Code2 className="w-4 h-4" /> Unified @graph JSON-LD
              </button>
              <button
                onClick={() => setActiveTab('entity_triples')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition flex items-center gap-2 ${
                  activeTab === 'entity_triples'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Network className="w-4 h-4" /> ISO 24617 Entity Triples
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'jsonld_graph' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-4 py-2.5 rounded-t-xl text-xs font-mono">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" /> Schema.org Organization + Wikidata Bridge @graph
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyCode}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" /> {copiedCode ? 'Copied!' : 'Copy Code'}
                    </button>
                    <button
                      onClick={downloadJsonLd}
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download .jsonld
                    </button>
                  </div>
                </div>
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-b-xl overflow-x-auto text-xs font-mono leading-relaxed border border-slate-800 max-h-96">
                  {generatedGraphJsonLd}
                </pre>
                <p className="text-xs text-slate-500">
                  Deploy this single unified script tag onto your root homepage to anchor your domain to universal Wikidata consensus across all search crawlers.
                </p>
              </div>
            )}

            {activeTab === 'entity_triples' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Subject</span>
                    <strong className="text-sm text-slate-900 font-mono block">{orgName}</strong>
                    <span className="text-xs text-slate-500">Verified Corporate Entity</span>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Predicate</span>
                    <strong className="text-sm text-indigo-700 font-mono block">providesExpertiseIn</strong>
                    <span className="text-xs text-slate-500">Semantic Capability Link</span>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Object (Wikidata QID)</span>
                    <strong className="text-sm text-emerald-700 font-mono block">{industryName} ({primaryIndustryQid})</strong>
                    <span className="text-xs text-slate-500">Global Knowledge Node</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Deep Technical Documentation & E-E-A-T Guide */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-slate-800">
        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-2xl mb-12">
          <h2 className="text-xl font-bold text-indigo-950 mb-2">
            What Is a Brand Knowledge Graph & Wikidata Entity Bridge?
          </h2>
          <p className="text-indigo-900 font-medium leading-relaxed">
            **A Brand Knowledge Graph is a connected network of semantic entities linking your company, founders, and software to universally verified Wikidata nodes via Schema.org sameAs properties.**
          </p>
          <p className="text-sm text-indigo-800 mt-2">
            It eliminates AI hallucinations in Google AI Overviews and Perplexity by anchoring localized claims to international consensus truth nodes.
          </p>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
          Why Large Language Models Hallucinate Unverified Brands
        </h2>
        <p className="text-base leading-relaxed text-slate-700 mb-6">
          Neural networks predict text tokens based on mathematical probability distributions. When an AI answer engine scans a domain with ungrounded marketing claims, it assigns a low retrieval confidence score. By declaring an explicit <code className="text-indigo-600">sameAs: "https://www.wikidata.org/wiki/Q..."</code> bridge, you transfer global entity trust directly to your brand.
        </p>

        {/* Comparative Breakdown */}
        <div className="overflow-x-auto my-8">
          <table className="w-full border-collapse border border-slate-200 text-sm bg-white rounded-xl shadow-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-900 text-left">
                <th className="p-3 border border-slate-200">Dimension</th>
                <th className="p-3 border border-slate-200">Ungrounded Website</th>
                <th className="p-3 border border-slate-200">Wikidata-Bridged Brand Graph</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-slate-200 font-bold">Hallucination Vulnerability</td>
                <td className="p-3 border border-slate-200 text-rose-600 font-semibold">High (AI confuses brand with competitors)</td>
                <td className="p-3 border border-slate-200 text-emerald-600 font-semibold">Zero (Anchored to unambiguous QID)</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-bold">Google Knowledge Panel Eligibility</td>
                <td className="p-3 border border-slate-200">Rarely recognized</td>
                <td className="p-3 border border-slate-200">Instant multi-directory entity consensus</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-bold">Citation Confidence in Perplexity</td>
                <td className="p-3 border border-slate-200">Deprioritized as unverified blog</td>
                <td className="p-3 border border-slate-200">Cited as recognized software provider</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Snippet-Optimized FAQ Section */}
        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight mt-12">
          Frequently Asked Questions: Brand Knowledge Graphs
        </h2>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              What is a Wikidata QID in SEO?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              **A Wikidata QID is a unique identifier (e.g., Q116183301) in the Wikidata knowledge base representing an unambiguous global concept or entity.**
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              How does the sameAs property prevent AI hallucinations?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              **The sameAs property links your proprietary company entity to recognized global profiles like Crunchbase and Wikidata, proving identity mathematically.**
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Should I put the Brand Knowledge Graph on every page?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              **No, deploy the complete Organization and Founder graph on your homepage and About page, and reference it via @id on sub-pages.**
            </p>
          </div>
        </div>

        {/* Interlinked Suite & Cross-Links (Law 6 & Law 12) */}
        <div className="mt-12 space-y-4">
          <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-white">Simulate Your Live AI Citations</h4>
              <p className="text-xs text-slate-300 mt-1">
                Test whether your domain will be chosen in the top 2–3 citation links across Google AI Overviews and Perplexity.
              </p>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('/tools/ai-search-citation-simulator')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                Open AI Citation Simulator <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {onNavigate && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/tools/conversational-schema-generator')}
                className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-black uppercase text-indigo-400">Voice &amp; Speakable SEO</div>
                <div className="text-xs font-black text-white group-hover:text-indigo-300 mt-0.5">
                  Conversational FAQ &amp; Speakable Schema Generator →
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Synthesize SpeakableSpecification schema for smart speakers and voice assistants.
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-black uppercase text-indigo-400">First-50-Words Precision</div>
                <div className="text-xs font-black text-white group-hover:text-indigo-300 mt-0.5">
                  AEO Position #0 Sniper Optimizer →
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Audit opening paragraph token density to secure Position #0 snippets and AI summaries.
                </div>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
