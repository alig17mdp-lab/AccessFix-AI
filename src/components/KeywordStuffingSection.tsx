import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Key,
  FileText,
  Search,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Filter,
  BarChart3,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Info,
  Tag,
  SlidersHorizontal,
} from 'lucide-react';
import {
  KeywordStuffingAnalysisResult,
  KeywordStuffingItem,
  StuffingRiskLevel,
  StuffingLocation,
} from '../types';

interface KeywordStuffingSectionProps {
  stuffingData: KeywordStuffingAnalysisResult;
  domain: string;
}

export const KeywordStuffingSection: React.FC<KeywordStuffingSectionProps> = ({ stuffingData, domain }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'moderate' | 'safe'>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [showRemediationTips, setShowRemediationTips] = useState(true);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(id);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  // Filtered keyword items
  const filteredKeywords = stuffingData.allAnalyzedKeywords.filter((item) => {
    const matchesSearch = item.keyword.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'all' || item.riskLevel === filterRisk;
    const matchesLocation =
      filterLocation === 'all' || item.locations.includes(filterLocation as StuffingLocation);
    return matchesSearch && matchesRisk && matchesLocation;
  });

  const getRiskBadge = (level: StuffingRiskLevel) => {
    switch (level) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>High Stuffing Risk (&gt;3.5%)</span>
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Info className="w-3 h-3 text-amber-600" />
            <span>Elevated Warning (2.3-3.5%)</span>
          </span>
        );
      case 'safe':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Safe &amp; Balanced (0.8-2.2%)</span>
          </span>
        );
    }
  };

  const getLocationBadge = (loc: StuffingLocation) => {
    switch (loc) {
      case 'title':
        return <span key={loc} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">&lt;title&gt;</span>;
      case 'headings':
        return <span key={loc} className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">&lt;h1/h2&gt;</span>;
      case 'alt_text':
        return <span key={loc} className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">alt=&quot;&quot;</span>;
      case 'anchor_links':
        return <span key={loc} className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">&lt;a&gt; link</span>;
      case 'meta_tags':
        return <span key={loc} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">meta</span>;
      case 'hidden_elements':
        return <span key={loc} className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300">hidden</span>;
      case 'body':
      default:
        return <span key={loc} className="px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 text-[10px] font-bold border border-slate-200">&lt;body&gt;</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner: Status & Overview */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          stuffingData.stuffingStatus === 'high_stuffing_detected'
            ? 'bg-gradient-to-br from-rose-50 via-white to-rose-50/30 border-rose-300 shadow-sm'
            : stuffingData.stuffingStatus === 'moderate_risk'
            ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/30 border-amber-300 shadow-sm'
            : 'bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 border-emerald-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Real-Time On-Page Audit</span>
              {stuffingData.stuffingStatus === 'high_stuffing_detected' ? (
                <span className="inline-flex items-center gap-1.5 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-xs">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>HIGH KEYWORD STUFFING DETECTED</span>
                </span>
              ) : stuffingData.stuffingStatus === 'moderate_risk' ? (
                <span className="inline-flex items-center gap-1.5 bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>MODERATE OVER-OPTIMIZATION WARNING</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% CLEAN - NATURAL DENSITY (ZERO SPAM)</span>
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Keyword Stuffing &amp; Density Diagnostic
            </h3>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              Mathematical term frequency analysis evaluating <strong className="text-slate-900">{stuffingData.totalWordsAnalyzed.toLocaleString()} words</strong> across{' '}
              <span className="font-semibold text-slate-900">{domain}</span> for repetitive keyword packing, title/alt-text spam, hidden text, and Google Panda/SpamBrain algorithmic penalty risks.
            </p>
          </div>

          {/* Quick Score Capsule */}
          <div className="flex items-center gap-4 shrink-0 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-400 uppercase">Stuffing Penalty Risk</div>
              <div className="text-2xl font-black text-slate-900">
                {stuffingData.overallRiskScore}
                <span className="text-xs font-normal text-slate-400">/100</span>
              </div>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                stuffingData.overallRiskScore > 40
                  ? 'bg-rose-100 text-rose-700'
                  : stuffingData.overallRiskScore > 20
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {stuffingData.overallRiskScore > 40 ? 'HIGH' : stuffingData.overallRiskScore > 20 ? 'MED' : '0%'}
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Words Analyzed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Words Evaluated</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stuffingData.totalWordsAnalyzed.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Full body, title &amp; heading corpus</div>
        </div>

        {/* Card 2: High Risk Terms */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Stuffed Terms (&gt;3.5%)</span>
            <AlertTriangle className={`w-4 h-4 ${stuffingData.stuffedKeywordsCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`} />
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${stuffingData.stuffedKeywordsCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {stuffingData.stuffedKeywordsCount}
            <span className="text-xs font-normal text-slate-400 ml-1">flagged</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stuffingData.warningKeywordsCount} elevated warning terms
          </div>
        </div>

        {/* Card 3: Highest Density */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Peak Single Term Density</span>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${stuffingData.highestDensity > 3.5 ? 'text-rose-600' : stuffingData.highestDensity > 2.2 ? 'text-amber-600' : 'text-slate-900'}`}>
            {stuffingData.highestDensity}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Optimal benchmark: 1.0% - 2.0%</div>
        </div>

        {/* Card 4: Hidden Text Spam */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Hidden Text Spam</span>
            {stuffingData.hiddenTextDetected ? <EyeOff className="w-4 h-4 text-rose-600" /> : <Eye className="w-4 h-4 text-emerald-600" />}
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${stuffingData.hiddenTextDetected ? 'text-rose-600' : 'text-emerald-600'}`}>
            {stuffingData.hiddenTextDetected ? 'FOUND' : 'CLEAN'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Zero CSS/DOM text concealment</div>
        </div>
      </div>

      {/* Primary Keyword Frequency & Density Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        {/* Table Header & Interactive Filters */}
        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              <span>Analyzed Keyword Frequencies &amp; True Densities</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing exact occurrences, mathematical density %, placements, and over-optimization thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search analyzed keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>

            {/* Risk Filter */}
            <div className="flex items-center rounded-xl bg-slate-100 p-0.5 text-xs font-bold text-slate-600">
              <button
                onClick={() => setFilterRisk('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterRisk === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                All ({stuffingData.allAnalyzedKeywords.length})
              </button>
              <button
                onClick={() => setFilterRisk('high')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  filterRisk === 'high' ? 'bg-rose-600 text-white shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <span>Stuffed</span>
                <span className="text-[10px] px-1 rounded-full bg-rose-200 text-rose-900">{stuffingData.stuffedKeywordsCount}</span>
              </button>
              <button
                onClick={() => setFilterRisk('moderate')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  filterRisk === 'moderate' ? 'bg-amber-600 text-white shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <span>Warning</span>
                <span className="text-[10px] px-1 rounded-full bg-amber-200 text-amber-900">{stuffingData.warningKeywordsCount}</span>
              </button>
              <button
                onClick={() => setFilterRisk('safe')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterRisk === 'safe' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Safe
              </button>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <th className="py-3 px-6">Keyword / Phrase</th>
                <th className="py-3 px-4">Locations Found</th>
                <th className="py-3 px-4 text-center">Occurrences / Safe Max</th>
                <th className="py-3 px-4">Calculated Density</th>
                <th className="py-3 px-4">Risk Status</th>
                <th className="py-3 px-6 text-right">Action / Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKeywords.length > 0 ? (
                filteredKeywords.map((item, index) => {
                  const isExpanded = expandedKeyword === item.keyword;
                  return (
                    <React.Fragment key={index}>
                      <tr
                        className={`hover:bg-slate-50/70 transition-colors ${
                          item.riskLevel === 'high' ? 'bg-rose-50/20' : item.riskLevel === 'moderate' ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        {/* Keyword & length */}
                        <td className="py-3.5 px-6 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.keyword}</span>
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.phraseLength}-word
                            </span>
                          </div>
                        </td>

                        {/* Placements */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 flex-wrap">
                            {item.locations.map((loc) => getLocationBadge(loc))}
                          </div>
                        </td>

                        {/* Occurrences vs Safe */}
                        <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                          <div className="inline-flex items-center gap-1.5">
                            <span className="text-sm">{item.count}</span>
                            <span className="text-[11px] text-slate-400 font-normal">/ max {item.safeMaxCount}</span>
                          </div>
                        </td>

                        {/* Density Bar */}
                        <td className="py-3.5 px-4 min-w-[140px]">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-extrabold">
                              <span
                                className={
                                  item.density > 3.5
                                    ? 'text-rose-600'
                                    : item.density >= 2.3
                                    ? 'text-amber-600'
                                    : 'text-emerald-700'
                                }
                              >
                                {item.density}%
                              </span>
                              <span className="text-[10px] font-normal text-slate-400">rec. {item.recommendedDensity}</span>
                            </div>
                            {/* Visual Progress Bar */}
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.density > 3.5
                                    ? 'bg-rose-500'
                                    : item.density >= 2.3
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min((item.density / 6.0) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Risk Badge */}
                        <td className="py-3.5 px-4">{getRiskBadge(item.riskLevel)}</td>

                        {/* Action / Context Toggle */}
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.occurrencesExceeded > 0 ? (
                              <span className="text-[11px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                -{item.occurrencesExceeded} to safe
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                Balanced
                              </span>
                            )}
                            <button
                              onClick={() => setExpandedKeyword(isExpanded ? null : item.keyword)}
                              className="text-slate-400 hover:text-blue-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                              title="View Context & Excerpts"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Excerpt & Remediation Drawer */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan={6} className="py-4 px-6 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Sentence Excerpts */}
                              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Live Text Excerpt Context</span>
                                </span>
                                <div className="space-y-1.5">
                                  {item.sampleExcerpts.map((ex, i) => (
                                    <div
                                      key={i}
                                      className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 italic"
                                    >
                                      &ldquo;{ex}&rdquo;
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Remediation Fix */}
                              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                                <div>
                                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Algorithmic Remediation Advice</span>
                                  </span>
                                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                                    {item.recommendedAction}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleCopy(item.recommendedAction, item.keyword)}
                                  className="self-start text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2 cursor-pointer"
                                >
                                  {copiedKeyword === item.keyword ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedKeyword === item.keyword ? 'Copied' : 'Copy Optimization Guideline'}</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No keywords found matching &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Algorithmic Stuffing Violations Diagnostic Hub (6 Core Checks) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-slate-950">
              Multi-Vector Algorithmic Stuffing Checks ({stuffingData.violations.length})
            </h4>
            <p className="text-xs text-slate-500">
              Evaluates Google SpamBrain, Panda, WCAG accessibility rules, and on-page HTML architecture.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stuffingData.violations.map((violation) => {
            const isCrit = violation.severity === 'critical';
            const isWarn = violation.severity === 'warning';
            return (
              <div
                key={violation.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCrit
                    ? 'bg-rose-50/40 border-rose-200'
                    : isWarn
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {isCrit ? (
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    ) : isWarn ? (
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                        <Info className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <h5 className="text-sm font-bold text-slate-900">{violation.title}</h5>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isCrit
                        ? 'bg-rose-100 text-rose-800'
                        : isWarn
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {violation.severity}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] break-all">
                    <span className="text-slate-400 select-none">Evidence: </span>
                    {violation.detectedEvidence}
                  </div>

                  <p className="text-slate-600 leading-relaxed">{violation.explanation}</p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-slate-800 font-semibold">{violation.remediationAction}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1-Click White-Hat Copywriting Best Practices */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white">White-Hat Natural Language Copywriting Standards</h4>
              <p className="text-xs text-slate-400">Guaranteed compliance with Google Helpful Content &amp; SpamBrain Systems</p>
            </div>
          </div>
          <button
            onClick={() => setShowRemediationTips(!showRemediationTips)}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            {showRemediationTips ? 'Hide Tips' : 'Show Tips'}
          </button>
        </div>

        {showRemediationTips && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-800/70 border border-slate-700/60 p-4 rounded-2xl space-y-1.5">
              <div className="text-xs font-black text-emerald-400">1. Optimal 1.2% - 1.8% Density</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                For a 1,000-word page, mention your primary target keyword 10-15 times maximum across body paragraphs.
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/60 p-4 rounded-2xl space-y-1.5">
              <div className="text-xs font-black text-blue-400">2. Diverse Semantic LSI Entities</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Swap repetitive exact-match phrases with contextual synonyms (e.g. &ldquo;interactive calculator&rdquo;, &ldquo;online utility&rdquo;).
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/60 p-4 rounded-2xl space-y-1.5">
              <div className="text-xs font-black text-purple-400">3. Single Proposition Title Tag</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never repeat the primary seed word twice in the &lt;title&gt;. Maintain a clean 50-60 character proposition.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
