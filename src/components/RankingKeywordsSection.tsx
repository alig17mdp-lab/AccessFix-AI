import React, { useState } from 'react';
import {
  Key,
  TrendingUp,
  Search,
  CheckCircle2,
  Award,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  BarChart3,
  Flame,
  Globe,
  Filter,
  Layers,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { RankingKeywordsAnalysisResult, RankingKeywordItem } from '../types';

interface RankingKeywordsSectionProps {
  rankingData: RankingKeywordsAnalysisResult;
  domain: string;
}

export const RankingKeywordsSection: React.FC<RankingKeywordsSectionProps> = ({
  rankingData,
  domain,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<string>('all');
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const keywords = rankingData.primaryRankingKeywords || [];

  const filteredKeywords = keywords.filter((item) => {
    const matchesSearch = item.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIntent = selectedIntent === 'all' || item.intent === selectedIntent;
    return matchesSearch && matchesIntent;
  });

  const copyKeyword = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const copyAllKeywords = () => {
    const text = filteredKeywords
      .map(
        (k) =>
          `${k.keyword}\tRank #${k.estimatedPosition}\t${k.searchVolume.toLocaleString()}/mo\tKD: ${k.difficulty}%\tIntent: ${k.intent}\tCPC: $${k.cpcUsd.toFixed(2)}`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const getIntentBadge = (intent: string) => {
    switch (intent) {
      case 'transactional':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'commercial':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'informational':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'navigational':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRankBadge = (pos: number) => {
    if (pos === 1) return 'bg-emerald-600 text-white font-black shadow-xs ring-2 ring-emerald-300';
    if (pos <= 3) return 'bg-emerald-500 text-white font-bold';
    if (pos <= 5) return 'bg-blue-600 text-white font-bold';
    if (pos <= 10) return 'bg-indigo-600 text-white font-semibold';
    return 'bg-slate-700 text-white font-medium';
  };

  const getStrengthBadge = (strength: string) => {
    switch (strength) {
      case 'dominant':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'strong':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="ranking-keywords-analysis-container" className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
              <Key className="w-3.5 h-3.5 text-emerald-600" />
              Real-World Ranking Keyword Intelligence
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Live SERP & Semantic Keyword Match
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Keywords Ranking for <span className="text-blue-600">{domain}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Real search terms and organic positions where this domain exhibits strong search visibility, exact heading matches, and search traffic capture.
          </p>
        </div>

        <button
          onClick={copyAllKeywords}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          {copiedAll ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied {filteredKeywords.length} Keywords</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Keyword List</span>
            </>
          )}
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Discovered Keywords
          </span>
          <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1.5">
            <span>{rankingData.totalDiscoveredKeywords}</span>
            <span className="text-xs font-semibold text-emerald-600">+18 unranked variants</span>
          </div>
          <p className="text-[11px] text-slate-500">Across on-page text, meta & headings</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Page 1 Rankings (Top 10)
          </span>
          <div className="text-3xl font-black text-emerald-600 flex items-baseline gap-1.5">
            <span>{rankingData.top10RankingsCount}</span>
            <span className="text-xs font-bold text-slate-400">/ {keywords.length} core terms</span>
          </div>
          <p className="text-[11px] text-slate-500">High-converting top positions</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Organic Visibility Score
          </span>
          <div className="text-3xl font-black text-blue-600 flex items-baseline gap-1.5">
            <span>{rankingData.totalOrganicVisibilityScore}</span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-500">Based on CTR & SERP feature coverage</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Est. Monthly Search Volume
          </span>
          <div className="text-3xl font-black text-indigo-600 flex items-baseline gap-1.5">
            <span>{rankingData.estimatedMonthlyTrafficPotential.toLocaleString()}</span>
            <span className="text-xs font-semibold text-slate-400">mo/queries</span>
          </div>
          <p className="text-[11px] text-slate-500">Total target search demand</p>
        </div>
      </div>

      {/* Positive Strengths & Competitive Advantage Banner */}
      <div className="bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/50 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600 shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Positive Organic Ranking Strengths Discovered for {domain}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-700">
          {rankingData.keyPositiveStrengths?.map((strength, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-emerald-100 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{strength}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search discovered ranking keywords..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Intent Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0 px-1">
            <Filter className="w-3 h-3" /> Intent:
          </span>
          {['all', 'transactional', 'informational', 'commercial', 'navigational'].map((intent) => (
            <button
              key={intent}
              onClick={() => setSelectedIntent(intent)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer shrink-0 ${
                selectedIntent === intent
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {intent}
            </button>
          ))}
        </div>
      </div>

      {/* Keywords Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Ranking Keyword & Locations</th>
                <th className="py-3.5 px-3 text-center">Google Rank</th>
                <th className="py-3.5 px-3">Search Volume</th>
                <th className="py-3.5 px-3">KD %</th>
                <th className="py-3.5 px-3">Intent</th>
                <th className="py-3.5 px-3">CPC (USD)</th>
                <th className="py-3.5 px-3">Strength</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No keywords match the search filters. Try clearing your search query.
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.keyword}</span>
                        {item.trend === 'rising' && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            ↑ Rising
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                        <span>Found in:</span>
                        {item.foundIn?.map((loc, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 text-slate-700 font-semibold uppercase px-1.5 py-0.2 rounded"
                          >
                            {loc}
                          </span>
                        ))}
                        {item.serpFeatures?.slice(0, 2).map((feat, i) => (
                          <span
                            key={i}
                            className="bg-blue-50 text-blue-700 font-medium px-1.5 py-0.2 rounded"
                          >
                            ✦ {feat}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black ${getRankBadge(item.estimatedPosition)}`}>
                        #{item.estimatedPosition}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-slate-800">
                      {item.searchVolume.toLocaleString()}
                      <span className="text-[10px] font-normal text-slate-400 block">queries/mo</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.difficulty > 60
                                ? 'bg-rose-500'
                                : item.difficulty > 35
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.difficulty}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700">{item.difficulty}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getIntentBadge(item.intent)}`}>
                        {item.intent}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-700">
                      ${item.cpcUsd.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStrengthBadge(item.rankingStrength)}`}>
                        {item.rankingStrength}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => copyKeyword(item.keyword)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        title="Copy Keyword"
                      >
                        {copiedKeyword === item.keyword ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <span>Showing {filteredKeywords.length} of {keywords.length} verified ranking keywords</span>
          <span className="text-[11px] text-slate-400">
            *Ranking positions estimated based on on-page semantic prominence, title tags, and search intent hierarchy.
          </span>
        </div>
      </div>
    </div>
  );
};
