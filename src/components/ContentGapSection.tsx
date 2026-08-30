import React, { useState } from 'react';
import {
  Sparkles,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  FileText,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Layers,
  CheckCircle2,
  ListPlus,
  BookOpen,
  Target,
  BarChart3,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { ContentGapAnalysisResult } from '../types';

interface ContentGapSectionProps {
  contentGapData: ContentGapAnalysisResult;
  domain: string;
}

export const ContentGapSection: React.FC<ContentGapSectionProps> = ({
  contentGapData,
  domain,
}) => {
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);
  const [copiedAllRoadmap, setCopiedAllRoadmap] = useState(false);

  const missingKeywords = contentGapData.missingHighOpportunityKeywords || [];
  const missingFaqs = contentGapData.missingFaqs || [];
  const missingSections = contentGapData.missingTopicSections || [];
  const semanticEntities = contentGapData.semanticEntityExpansionGaps || [];
  const formatGaps = contentGapData.contentFormatGaps || [];

  const copyFaqSnippet = (faq: { question: string; recommendedDirectAnswerSnippet: string }, index: number) => {
    const text = `Q: ${faq.question}\nA: ${faq.recommendedDirectAnswerSnippet}`;
    navigator.clipboard.writeText(text);
    setCopiedSnippetIndex(index);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  const copyRoadmap = () => {
    const text = contentGapData.actionableExpansionPlan?.join('\n\n') || '';
    navigator.clipboard.writeText(text);
    setCopiedAllRoadmap(true);
    setTimeout(() => setCopiedAllRoadmap(false), 2500);
  };

  return (
    <div id="content-gap-analysis-container" className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-0.5 rounded-full">
              <Target className="w-3.5 h-3.5 text-amber-600" />
              Content Gap & Topic Opportunity Matrix
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              SEO, AEO & Answer Engine Optimization
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            High-Impact Content Gaps for <span className="text-blue-600">{domain}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Actionable content opportunities, missing high-demand user FAQs, semantic entity deficits, and structural sections needed to outrank competitors.
          </p>
        </div>

        <button
          onClick={copyRoadmap}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          {copiedAllRoadmap ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied Content Roadmap</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Remediation Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Content Coverage Score
          </span>
          <div className="text-3xl font-black text-amber-600 flex items-baseline gap-1.5">
            <span>{contentGapData.overallContentCoverageScore}</span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-500">32% unexplored topical demand</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            High-Opportunity Keywords
          </span>
          <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1.5">
            <span>{missingKeywords.length}</span>
            <span className="text-xs font-semibold text-emerald-600">High search demand</span>
          </div>
          <p className="text-[11px] text-slate-500">Uncaptured transactional queries</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Missing Answer Engine FAQs
          </span>
          <div className="text-3xl font-black text-blue-600 flex items-baseline gap-1.5">
            <span>{missingFaqs.length}</span>
            <span className="text-xs font-semibold text-slate-400">for AI Overviews</span>
          </div>
          <p className="text-[11px] text-slate-500">Qualify for Featured Snippets</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Potential Organic Lift
          </span>
          <div className="text-3xl font-black text-emerald-600 flex items-baseline gap-1.5">
            <span>+38%</span>
            <span className="text-xs font-semibold text-emerald-700">traffic potential</span>
          </div>
          <p className="text-[11px] text-slate-500">By closing top 3 content gaps</p>
        </div>
      </div>

      {/* SECTION 1: High-Opportunity Missing Keywords */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              High-Opportunity Missing Keywords (Target Search Demand)
            </h3>
            <p className="text-xs text-slate-500">
              Keywords with high search volume & low difficulty that competitors rank for, but this page does not yet target.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Missing Keyword Opportunity</th>
                  <th className="py-3.5 px-3">Search Demand</th>
                  <th className="py-3.5 px-3">KD %</th>
                  <th className="py-3.5 px-3">Opportunity Score</th>
                  <th className="py-3.5 px-3">Recommended Page Format</th>
                  <th className="py-3.5 px-4">Why It Matters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {missingKeywords.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-bold text-slate-900 text-sm">{item.keyword}</div>
                      <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {item.intent}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-slate-800">
                      {item.searchVolume.toLocaleString()}
                      <span className="text-[10px] font-normal text-slate-400 block">queries/mo</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {item.difficulty}% (Easy)
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 font-black text-blue-600">
                        <span>{item.trafficOpportunityScore}</span>
                        <span className="text-[10px] text-slate-400 font-normal">/100</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {item.recommendedPageType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      {item.whyMissing}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 2: Missing FAQs for Google Answer Engine & AI Overviews */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            Missing High-Value FAQs (Formatted for Google AI Overview & Featured Snippets)
          </h3>
          <p className="text-xs text-slate-500">
            Real high-volume question queries searchers ask about {domain}. Embed these with FAQPage schema to capture Google's "People Also Ask" box.
          </p>
        </div>

        <div className="space-y-3">
          {missingFaqs.map((faq, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-white border rounded-2xl transition-all shadow-xs overflow-hidden ${
                  isExpanded ? 'border-blue-400 ring-1 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg shrink-0 mt-0.5">
                      FAQ #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">{faq.question}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="capitalize font-semibold text-slate-600">{faq.searchIntent} Intent</span>
                        <span>•</span>
                        <span>~{faq.estimatedMonthlyQueries.toLocaleString()} monthly searchers</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded">
                          {faq.answerEngineRelevance} AEO Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100 bg-slate-50/50">
                    {/* Direct Answer Snippet (< 25 words rule) */}
                    <div className="p-4 rounded-xl bg-white border border-emerald-200/80 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Recommended Direct Answer Snippet (Under 25 Words for AI Snippet Capture)
                        </span>
                        <button
                          onClick={() => copyFaqSnippet(faq, idx)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          {copiedSnippetIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Copy Answer</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed italic bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
                        "{faq.recommendedDirectAnswerSnippet}"
                      </p>
                    </div>

                    {/* Implementation guidance */}
                    <div className="text-xs text-slate-600 flex items-start gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                      <Code2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{faq.detailedGuidance}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Missing Structural Topic Sections & Content Blueprint */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Missing Structural Topic Sections & Content Expansion Blueprint
          </h3>
          <p className="text-xs text-slate-500">
            Key content modules missing from the page that establish Google E-E-A-T topical completeness and increase dwell time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missingSections.map((sec, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">
                    Heading Level: &lt;{sec.recommendedHeadingLevel}&gt;
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    +{sec.potentialOrganicLiftPercent}% Potential Lift
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{sec.sectionTitle}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{sec.whyItMatters}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">Recommended Content Points:</span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {sec.suggestedContentPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Semantic Entities & Content Format Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semantic Entities Expansion */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              Missing Semantic Entities (Knowledge Graph Expansion)
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Related industry entities expected by search engines to establish complete topical authority.
            </p>
          </div>

          <div className="space-y-2.5">
            {semanticEntities.map((ent, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{ent.entity}</span>
                  <span className="text-[11px] text-slate-500 block">{ent.category} • {ent.relevanceReason}</span>
                </div>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                  Target: {ent.recommendedUsageCount}x
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Format Checklist */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ListPlus className="w-4 h-4 text-emerald-600" />
              Content Format & UX Enhancement Gaps
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Structural formatting elements that improve dwell time and reduce bounce rates.
            </p>
          </div>

          <div className="space-y-2.5">
            {formatGaps.map((fmt, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{fmt.formatType}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      fmt.status === 'missing'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {fmt.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{fmt.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Content Remediation Blueprint Roadmap */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold">4-Step Actionable Content Remediation Blueprint</h3>
          </div>
          <span className="text-xs font-bold bg-white/10 text-emerald-300 px-3 py-1 rounded-full">
            Immediate Impact
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {contentGapData.actionableExpansionPlan?.map((plan, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1">
              <span className="font-medium text-slate-100 leading-relaxed block">{plan}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
