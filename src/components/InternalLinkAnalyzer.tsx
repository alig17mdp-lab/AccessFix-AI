import React, { useState } from 'react';
import {
  Link2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Layers,
  Network,
  RefreshCw,
  Search,
} from 'lucide-react';
import {
  InternalLinkAuditReport,
} from '../types/internalLinkAnalyzer';
import {
  analyzeInternalLinkGraph,
  LINK_PRESET_SCENARIOS,
} from '../utils/internalLinkEngine';

interface InternalLinkAnalyzerProps {
  onNavigate: (route: string) => void;
}

export const InternalLinkAnalyzer: React.FC<InternalLinkAnalyzerProps> = ({ onNavigate }) => {
  const [domainInput, setDomainInput] = useState<string>('https://myshopify-store.com');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [report, setReport] = useState<InternalLinkAuditReport>(() =>
    analyzeInternalLinkGraph('https://myshopify-store.com')
  );

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const newReport = analyzeInternalLinkGraph(domainInput);
      setReport(newReport);
      setIsAnalyzing(false);
    }, 800);
  };

  const handleSelectPreset = (domain: string) => {
    setDomainInput(domain);
    setIsAnalyzing(true);
    setTimeout(() => {
      const newReport = analyzeInternalLinkGraph(domain);
      setReport(newReport);
      setIsAnalyzing(false);
    }, 400);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Schema Markup for SoftwareApplication & FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'Internal Link Equity & PageRank Silo Analyzer',
                applicationCategory: 'SEOApplication',
                operatingSystem: 'All Modern Web Browsers',
                description:
                  'Free online internal link auditor and PageRank equity calculator. Uncover orphan pages, repair deep pagination traps, and construct semantic topic clusters.',
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
                    name: 'How does internal linking distribute PageRank equity across a website?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Internal links pass link equity from high-authority URLs (like your homepage) to deeper articles, signaling topical hierarchy and speeding up indexation.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is an orphan page in SEO?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'An orphan page is a live URL that has zero internal HTML links pointing to it from anywhere on the same website.',
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
              <Network className="w-3.5 h-3.5" />
              Internal PageRank & Silo Architecture
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Mathematical PageRank Flow Simulation
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Internal Link Equity & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">PageRank Silo Analyzer</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Audit how link equity flows through your website. Discover unlinked orphan pages, detect PageRank leaks to utility footers, and construct high-converting semantic topic silos with AI link bridge suggestions.
          </p>
        </div>
      </header>

      {/* Main Interactive Tool Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Preset Selector */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Simulate Common Silo Architecture Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {LINK_PRESET_SCENARIOS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset.domain)}
                className="text-left p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all text-xs group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {preset.label}
                </div>
                <div className="text-slate-400 text-[11px] line-clamp-2 mt-1">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleRunAnalysis} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Enter domain (e.g., https://example.com)..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mapping Graph...</span>
                </>
              ) : (
                <>
                  <Network className="w-4 h-4" />
                  <span>Analyze Internal PageRank</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Scorecard Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium">Internal Link Health</div>
            <div className="text-2xl sm:text-3xl font-bold mt-1 flex items-center gap-2">
              <span
                className={
                  report.overallLinkingScore >= 80
                    ? 'text-emerald-400'
                    : report.overallLinkingScore >= 50
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }
              >
                {report.overallLinkingScore}
              </span>
              <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium">Detected Orphan Pages</div>
            <div className="text-2xl sm:text-3xl font-bold text-rose-400 mt-1">
              {report.orphanPagesCount}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium">Deep Pages (Crawl Depth ≥ 4)</div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 mt-1">
              {report.deepPagesCount}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium">PageRank Leaks</div>
            <div className="text-2xl sm:text-3xl font-bold text-indigo-400 mt-1">
              {report.pageRankLeaksCount}
            </div>
          </div>
        </div>

        {/* Actionable Link Bridge Recommendations */}
        {report.recommendations.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
            <div className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Recommended Internal Link Bridges (Highest Equity Transfer)</span>
            </div>

            <div className="space-y-3">
              {report.recommendations.map((rec, rIdx) => (
                <div
                  key={rIdx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="text-slate-300">
                      Link from <span className="font-mono text-indigo-300">{rec.sourceUrl}</span> (PR {rec.sourcePageRank})
                    </div>
                    <div className="text-slate-300">
                      Point to <span className="font-mono text-emerald-300">{rec.targetUrl}</span>
                    </div>
                    <div className="text-slate-400">
                      Suggested Anchor Text: <strong className="text-white">"{rec.recommendedAnchor}"</strong>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-[11px]">
                      {rec.expectedEquityBoost}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page Node Equity Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-12">
          <div className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Network className="w-4 h-4 text-indigo-400" />
            <span>Internal Page Node Telemetry & Crawl Depth</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Page Title & Path</th>
                  <th className="pb-3 font-semibold">Inlinks</th>
                  <th className="pb-3 font-semibold">Internal PageRank</th>
                  <th className="pb-3 font-semibold">Crawl Depth</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {report.nodes.map((node) => (
                  <tr key={node.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="font-semibold text-white">{node.title}</div>
                      <div className="font-mono text-[11px] text-slate-400 truncate max-w-sm">
                        {node.url}
                      </div>
                    </td>
                    <td className="py-3 font-bold text-slate-200">{node.inlinkCount}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-400">{node.internalPageRank.toFixed(1)}</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${node.internalPageRank * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">
                      {node.crawlDepth === 99 ? (
                        <span className="text-rose-400 font-bold">Orphan (∞)</span>
                      ) : (
                        <span>{node.crawlDepth} Clicks</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          node.status === 'healthy'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : node.status === 'orphan'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : node.status === 'pagerank_leak'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {node.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dual Search Intent Viewport Architecture - SEO Guide & FAQs */}
        <section className="pt-10 border-t border-slate-800 text-slate-300">
          <div className="max-w-4xl mx-auto space-y-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                What Is Internal PageRank and Why Does Internal Linking Matter?
              </h2>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base">
                While external backlinks from high-authority websites build your domain's aggregate power (measured via our <button onClick={() => onNavigate('/tools/domain-rating-checker')} className="text-indigo-400 underline hover:text-indigo-300">Domain Rating & Backlinks checker</button>), <strong>internal linking</strong> governs how that authority is distributed across your individual URLs.
              </p>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base mt-3">
                When you link from your homepage to a sub-page, you transfer internal PageRank equity and establish clear topical silos. Search engines rely on internal links to understand site hierarchy, discover new pages without sitemap delays, and assign ranking priority.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Frequently Asked Questions About Internal Link Equity
              </h2>

              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    How does internal linking distribute PageRank equity across a website?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    Internal links pass link equity from high-authority URLs (like your homepage) to deeper articles, signaling topical hierarchy and speeding up indexation.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    A page with multiple inbound internal links signals to Googlebot that it represents a core revenue or topical entity, granting it priority over low-inlink blog posts.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    What is an orphan page in technical SEO?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    An orphan page is a live URL that has zero internal HTML links pointing to it from anywhere on the same website.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Even if an orphan page is included in your XML sitemap, search engines struggle to crawl it frequently, often causing it to become stuck in <button onClick={() => onNavigate('/tools/indexation-fixer')} className="text-indigo-400 underline hover:text-indigo-300">"Discovered – currently not indexed"</button> status in Google Search Console.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    What is a PageRank leak in website navigation?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    A PageRank leak occurs when excessive internal links point to low-value utility pages (like Privacy Policy or Terms) rather than commercial landing pages.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Placing unoptimized utility links in header navigation dilutes the link equity that should flow to high-converting product categories and pillar articles.
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
