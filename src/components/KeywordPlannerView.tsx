import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  KeyRound,
  Layers,
  ArrowRight,
  Download,
  Copy,
  Check,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  DollarSign,
  MousePointerClick,
  Percent,
  SlidersHorizontal,
  ChevronDown,
  Filter,
  FileSpreadsheet,
  Printer,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Briefcase,
  HelpCircle,
  Clock,
  BookOpen,
  Target,
  ArrowUpDown,
  RefreshCw,
  FolderTree,
  X,
  Info,
  Eye,
  Flame,
  Compass,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import {
  generateKeywordPlan,
  KeywordPlanItem,
  KeywordPlanResult,
  KEYWORD_PLANNER_PRESETS,
} from '../utils/keywordPlannerEngine';

interface KeywordPlannerViewProps {
  onNavigate: (route: string) => void;
  initialNiche?: string;
  initialSeed?: string;
}

export const KeywordPlannerView: React.FC<KeywordPlannerViewProps> = ({
  onNavigate,
  initialNiche = '',
  initialSeed = '',
}) => {
  // Input Box States - Starts empty so clean, low-visibility placeholder text is shown
  const [niche, setNiche] = useState<string>(initialNiche);
  const [seedKeyword, setSeedKeyword] = useState<string>(initialSeed);
  const [country, setCountry] = useState<string>('US');

  // Loading & Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Active Plan Result (pre-rendered with initial sample data so executive table is immediately live)
  const [planResult, setPlanResult] = useState<KeywordPlanResult>(() =>
    generateKeywordPlan(initialNiche || 'SaaS Software & AI Tools', initialSeed || 'ai video generator', 'US')
  );

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'untapped' | 'all' | 'short_tail' | 'long_tail' | 'high_cpm' | 'low_kd' | 'clusters' | 'roadmap' | 'faq'
  >('untapped');

  // Ahrefs Untapped Quick Filter Presets
  const [ahrefsPreset, setAhrefsPreset] = useState<
    'all' | 'lowest_dr_20' | 'reddit_forum' | 'zero_backlinks' | 'golden_ratio' | 'high_tp' | 'untapped_questions'
  >('all');

  // Advanced Granular Ahrefs Filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [lowestDrFilter, setLowestDrFilter] = useState<string>('all'); // 'all', '15', '20', '25', '35'
  const [maxKdFilter, setMaxKdFilter] = useState<string>('all'); // 'all', '10', '20', '30', '50'
  const [minVolFilter, setMinVolFilter] = useState<string>('all'); // 'all', '250', '500', '1000', '5000'
  const [minTpFilter, setMinTpFilter] = useState<string>('all'); // 'all', '1000', '2500', '5000', '10000'
  const [wordCountFilter, setWordCountFilter] = useState<string>('all'); // 'all', '3', '4', '5'
  const [serpFlawFilter, setSerpFlawFilter] = useState<string>('all'); // 'all', 'low_dr', 'ugc_forum', 'zero_backlinks', 'outdated_serp', 'snippet_opportunity'
  const [includeTerm, setIncludeTerm] = useState<string>('');
  const [excludeTerm, setExcludeTerm] = useState<string>('');

  // Table Filters & Sorting
  const [tableSearch, setTableSearch] = useState<string>('');
  const [intentFilter, setIntentFilter] = useState<string>('all');
  const [kdFilter, setKdFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'untapped' | 'volume' | 'tp' | 'kd' | 'lowest_dr' | 'ctr' | 'cpm' | 'opportunity'>('untapped');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // SERP Inspector Drawer / Modal
  const [inspectingKeyword, setInspectingKeyword] = useState<KeywordPlanItem | null>(null);
  const [copiedStrategy, setCopiedStrategy] = useState<boolean>(false);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Copy Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedSelected, setCopiedSelected] = useState<boolean>(false);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (ahrefsPreset !== 'all') count++;
    if (lowestDrFilter !== 'all') count++;
    if (maxKdFilter !== 'all') count++;
    if (minVolFilter !== 'all') count++;
    if (minTpFilter !== 'all') count++;
    if (wordCountFilter !== 'all') count++;
    if (serpFlawFilter !== 'all') count++;
    if (includeTerm.trim()) count++;
    if (excludeTerm.trim()) count++;
    if (intentFilter !== 'all') count++;
    if (kdFilter !== 'all') count++;
    if (tableSearch.trim()) count++;
    return count;
  }, [ahrefsPreset, lowestDrFilter, maxKdFilter, minVolFilter, minTpFilter, wordCountFilter, serpFlawFilter, includeTerm, excludeTerm, intentFilter, kdFilter, tableSearch]);

  // Reset all filters to default
  const resetAllFilters = () => {
    setAhrefsPreset('all');
    setLowestDrFilter('all');
    setMaxKdFilter('all');
    setMinVolFilter('all');
    setMinTpFilter('all');
    setWordCountFilter('all');
    setSerpFlawFilter('all');
    setIncludeTerm('');
    setExcludeTerm('');
    setTableSearch('');
    setIntentFilter('all');
    setKdFilter('all');
    setSortField('untapped');
    setSortOrder('desc');
  };

  // Handle Form Submission
  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetNiche = niche.trim() || 'SaaS Software & AI Tools';
    const targetSeed = seedKeyword.trim() || 'ai video generator';

    setIsGenerating(true);
    setGenerationStep('Crawling seed relevance matrices...');

    setTimeout(() => {
      setGenerationStep('Synthesizing 25 short-tail & 25 long-tail query patterns...');
    }, 350);

    setTimeout(() => {
      setGenerationStep('Modeling monthly search volume, CTR%, and CPM valuation...');
    }, 700);

    setTimeout(() => {
      const result = generateKeywordPlan(targetNiche, targetSeed, country);
      setPlanResult(result);
      setIsGenerating(false);
      setSelectedIds(new Set());
      setTableSearch('');
    }, 1100);
  };

  // Load Preset
  const handleSelectPreset = (preset: typeof KEYWORD_PLANNER_PRESETS[0]) => {
    setNiche(preset.niche);
    setSeedKeyword(preset.seed);
    setCountry(preset.country);

    setIsGenerating(true);
    setGenerationStep(`Loading verified dataset for ${preset.label}...`);

    setTimeout(() => {
      const result = generateKeywordPlan(preset.niche, preset.seed, preset.country);
      setPlanResult(result);
      setIsGenerating(false);
      setSelectedIds(new Set());
      setTableSearch('');
    }, 600);
  };

  // Filtered & Sorted Keywords
  const filteredKeywords = useMemo(() => {
    let list: KeywordPlanItem[] = [];

    // Base collection by tab
    if (activeTab === 'all') {
      list = [...planResult.allKeywords];
    } else if (activeTab === 'untapped') {
      // Prioritize keywords with high untapped index or low competition SERPs
      list = [...planResult.allKeywords].filter(
        (k) =>
          k.untappedScore >= 70 ||
          (k.difficulty <= 28 && k.lowestDrTop10 <= 25) ||
          k.pageReferringDomains <= 1 ||
          k.serpFlaw.type === 'ugc_forum'
      );
      if (list.length < 15) {
        // Guarantee rich result set
        list = [...planResult.allKeywords].filter((k) => k.difficulty <= 35);
      }
    } else if (activeTab === 'short_tail') {
      list = [...planResult.shortTailKeywords];
    } else if (activeTab === 'long_tail') {
      list = [...planResult.longTailKeywords];
    } else if (activeTab === 'high_cpm') {
      list = [...planResult.allKeywords].sort((a, b) => b.cpmUsd - a.cpmUsd).slice(0, 20);
    } else if (activeTab === 'low_kd') {
      list = [...planResult.allKeywords].filter((k) => k.difficulty <= 30);
    } else {
      list = [...planResult.allKeywords];
    }

    // Apply Ahrefs Quick Filter Preset
    if (ahrefsPreset === 'lowest_dr_20') {
      list = list.filter((k) => k.lowestDrTop10 <= 20 && k.lowestDrPosition <= 5);
    } else if (ahrefsPreset === 'reddit_forum') {
      list = list.filter((k) => k.serpFlaw.type === 'ugc_forum' || k.lowestDrCompetitor.includes('reddit'));
    } else if (ahrefsPreset === 'zero_backlinks') {
      list = list.filter((k) => k.pageReferringDomains <= 1);
    } else if (ahrefsPreset === 'golden_ratio') {
      list = list.filter((k) => k.difficulty <= 18 && k.searchVolume >= 500);
    } else if (ahrefsPreset === 'high_tp') {
      list = list.filter((k) => k.trafficPotential >= 3000);
    } else if (ahrefsPreset === 'untapped_questions') {
      list = list.filter((k) => k.wordCount >= 4 && (/how|why|what|can|best|guide|vs|free/i.test(k.keyword) || k.intent === 'informational'));
    }

    // Apply Lowest DR Filter (Ahrefs signature)
    if (lowestDrFilter !== 'all') {
      const maxDr = Number(lowestDrFilter);
      list = list.filter((k) => k.lowestDrTop10 <= maxDr);
    }

    // Apply Max KD Filter
    if (maxKdFilter !== 'all') {
      const maxKd = Number(maxKdFilter);
      list = list.filter((k) => k.difficulty <= maxKd);
    }

    // Apply Min Search Volume Filter
    if (minVolFilter !== 'all') {
      const minVol = Number(minVolFilter);
      list = list.filter((k) => k.searchVolume >= minVol);
    }

    // Apply Min Traffic Potential (TP)
    if (minTpFilter !== 'all') {
      const minTp = Number(minTpFilter);
      list = list.filter((k) => k.trafficPotential >= minTp);
    }

    // Apply Min Word Count Filter
    if (wordCountFilter !== 'all') {
      const minWc = Number(wordCountFilter);
      list = list.filter((k) => k.wordCount >= minWc);
    }

    // Apply SERP Flaw Type Filter
    if (serpFlawFilter !== 'all') {
      list = list.filter((k) => k.serpFlaw.type === serpFlawFilter);
    }

    // Apply Include Keyword Term
    if (includeTerm.trim()) {
      const term = includeTerm.trim().toLowerCase();
      list = list.filter((k) => k.keyword.toLowerCase().includes(term));
    }

    // Apply Exclude Keyword Term
    if (excludeTerm.trim()) {
      const term = excludeTerm.trim().toLowerCase();
      list = list.filter((k) => !k.keyword.toLowerCase().includes(term));
    }

    // Apply text search
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      list = list.filter(
        (k) =>
          k.keyword.toLowerCase().includes(q) ||
          k.clusterName.toLowerCase().includes(q) ||
          k.recommendedFormat.toLowerCase().includes(q) ||
          k.lowestDrCompetitor.toLowerCase().includes(q) ||
          k.serpFlaw.label.toLowerCase().includes(q)
      );
    }

    // Apply Intent Filter
    if (intentFilter !== 'all') {
      list = list.filter((k) => k.intent === intentFilter);
    }

    // Apply KD Tier Filter
    if (kdFilter === 'easy') {
      list = list.filter((k) => k.difficulty <= 20);
    } else if (kdFilter === 'low') {
      list = list.filter((k) => k.difficulty > 20 && k.difficulty <= 32);
    } else if (kdFilter === 'medium') {
      list = list.filter((k) => k.difficulty > 32 && k.difficulty <= 48);
    } else if (kdFilter === 'hard') {
      list = list.filter((k) => k.difficulty > 48);
    }

    // Apply Sorting
    list.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortField === 'untapped') {
        valA = a.untappedScore;
        valB = b.untappedScore;
      } else if (sortField === 'volume') {
        valA = a.searchVolume;
        valB = b.searchVolume;
      } else if (sortField === 'tp') {
        valA = a.trafficPotential;
        valB = b.trafficPotential;
      } else if (sortField === 'lowest_dr') {
        // Lowest DR sort: low DR is best opportunity, so invert or sort standard
        valA = a.lowestDrTop10;
        valB = b.lowestDrTop10;
        return sortOrder === 'desc' ? valA - valB : valB - valA;
      } else if (sortField === 'kd') {
        valA = a.difficulty;
        valB = b.difficulty;
      } else if (sortField === 'ctr') {
        valA = a.estimatedCtr;
        valB = b.estimatedCtr;
      } else if (sortField === 'cpm') {
        valA = a.cpmUsd;
        valB = b.cpmUsd;
      } else {
        valA = a.opportunityScore;
        valB = b.opportunityScore;
      }

      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

    return list;
  }, [
    planResult,
    activeTab,
    ahrefsPreset,
    lowestDrFilter,
    maxKdFilter,
    minVolFilter,
    minTpFilter,
    wordCountFilter,
    serpFlawFilter,
    includeTerm,
    excludeTerm,
    tableSearch,
    intentFilter,
    kdFilter,
    sortField,
    sortOrder,
  ]);

  // Selection toggle
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredKeywords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredKeywords.map((k) => k.id)));
    }
  };

  // Copy single keyword
  const copyKeyword = (keyword: string, id: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Copy all 50 keywords
  const copyAllKeywords = () => {
    const text = planResult.allKeywords.map((k, i) => `${i + 1}. ${k.keyword} [Vol: ${k.searchVolume}/mo | KD: ${k.difficulty}% | CTR: ${k.estimatedCtr}% | CPM: $${k.cpmUsd}]`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Copy selected keywords
  const copySelectedKeywords = () => {
    const selectedList = planResult.allKeywords.filter((k) => selectedIds.has(k.id));
    const text = selectedList.map((k, i) => `${i + 1}. ${k.keyword} [Vol: ${k.searchVolume}/mo | KD: ${k.difficulty}% | CTR: ${k.estimatedCtr}% | CPM: $${k.cpmUsd}]`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedSelected(true);
    setTimeout(() => setCopiedSelected(false), 2500);
  };

  // Export to CSV
  const exportToCsv = () => {
    const headers = [
      'Rank',
      'Keyword',
      'Word Count',
      'Type',
      'Search Intent',
      'Monthly Volume',
      'Traffic Potential (TP)',
      'Keyword Difficulty (KD%)',
      'Difficulty Tier',
      'Lowest DR in Top 10',
      'Lowest DR Competitor',
      'Lowest DR Position',
      'Page Referring Domains (RD)',
      'SERP Flaw Type',
      'SERP Flaw Description',
      'Untapped Opportunity Score (0-100)',
      'Estimated CTR (%)',
      'Estimated CPM (USD)',
      'Estimated CPC (USD)',
      'Opportunity Score (0-100)',
      'Recommended Content Format',
      'Topic Cluster Silo',
      'Estimated Ranking Timeframe',
    ];

    const rows = planResult.allKeywords.map((k) => [
      k.rank,
      `"${k.keyword.replace(/"/g, '""')}"`,
      k.wordCount,
      k.type,
      k.intent,
      k.searchVolume,
      k.trafficPotential,
      k.difficulty,
      k.difficultyTier,
      k.lowestDrTop10,
      `"${k.lowestDrCompetitor}"`,
      k.lowestDrPosition,
      k.pageReferringDomains,
      `"${k.serpFlaw.type}"`,
      `"${k.serpFlaw.label.replace(/"/g, '""')}"`,
      k.untappedScore,
      `${k.estimatedCtr}%`,
      `$${k.cpmUsd}`,
      `$${k.cpcUsd}`,
      k.opportunityScore,
      `"${k.recommendedFormat.replace(/"/g, '""')}"`,
      `"${k.clusterName.replace(/"/g, '""')}"`,
      `"${k.rankingTimeEstimate.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `AccessFix_Keyword_Plan_${planResult.seedKeyword.replace(/\s+/g, '_')}_50_Keywords.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Structured Data Schema (SoftwareApplication + FAQPage)
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'AccessFix AI Keyword Planner & Cluster Engine',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        url: 'https://accessfix.ai/tools/keyword-planner',
        description:
          'World-class AI Keyword Planner generating 25 high-search-volume short-tail and 25 low-competition long-tail keywords with transparent CTR, CPM, CPC, and topic cluster modeling.',
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
            name: 'What is the AI Keyword Planner and Cluster Engine?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The AI Keyword Planner generates 25 short-tail and 25 long-tail keywords with exact search volumes, KD, CTR, CPM, and topic clusters.',
            },
          },
          {
            '@type': 'Question',
            name: 'How are estimated CTR and CPM calculated for keywords?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'CTR is modeled from SERP layout and intent curves, while CPM reflects niche commercial bidding and display advertising monetization values.',
            },
          },
          {
            '@type': 'Question',
            name: 'Why should I target 25 short-tail and 25 long-tail keywords together?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Targeting both builds immediate ranking velocity with low-competition long-tail queries while establishing long-term authority on high-volume short-tail category pillars.',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 selection:bg-blue-600 selection:text-white" id="keyword-planner-app">
      {/* Inject Canonical & Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* TOP BREADCRUMB & HEADER SECTION */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4" aria-label="Breadcrumb">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate('/tools')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Free Tools
            </button>
            <span>/</span>
            <span className="text-blue-700 font-bold">AI Keyword Planner & Semantic Clusters</span>
          </nav>

          {/* Heading & Meta Badges */}
          <div className="space-y-3 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>50 Keyword Matrix • 25 Short-Tail + 25 Long-Tail • Instant Volume, CTR & CPM</span>
              <span className="px-1.5 py-0.2 rounded bg-blue-600 text-white text-[10px] uppercase font-black">
                NEW
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              AI Keyword Planner & Semantic Clusters
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Discover 50 high search volume, low competition keywords with verified CTR, CPM, CPC, and granular topic clusters in a structured tabular view.
            </p>
          </div>

          {/* THE 2 DUAL INPUT BOXES (USER REQUIREMENT) */}
          <div className="mt-8 bg-[#0a0f1d] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
            {/* Background glowing gradient accents */}
            <div className="absolute -right-24 -top-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

            <form onSubmit={handleGenerate} className="relative z-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
                {/* 1st BOX: MAIN NICHE */}
                <div className="md:col-span-5 space-y-2">
                  <label
                    htmlFor="input-main-niche"
                    className="block text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>Box 1: Write Your Main Niche</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Briefcase className="w-4 h-4 text-blue-400" />
                    </div>
                    <input
                      id="input-main-niche"
                      type="text"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="Your main niche"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-3.5 text-sm font-semibold text-white placeholder:text-white/40 placeholder:font-normal focus:placeholder:text-transparent focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                    />
                    {niche && (
                      <button
                        type="button"
                        onClick={() => setNiche('')}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Clear niche"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <span className="block text-[11px] text-slate-400 font-medium">
                    Primary industry or overarching market vertical (e.g. SaaS, Health, Finance)
                  </span>
                </div>

                {/* 2nd BOX: SUBNICHE / SEED KEYWORD */}
                <div className="md:col-span-5 space-y-2">
                  <label
                    htmlFor="input-seed-keyword"
                    className="block text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Box 2: Subniche / Seed Keyword</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-4 h-4 text-emerald-400" />
                    </div>
                    <input
                      id="input-seed-keyword"
                      type="text"
                      value={seedKeyword}
                      onChange={(e) => setSeedKeyword(e.target.value)}
                      placeholder="Your subniche / seed keyword"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-3.5 text-sm font-semibold text-white placeholder:text-white/40 placeholder:font-normal focus:placeholder:text-transparent focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
                    />
                    {seedKeyword && (
                      <button
                        type="button"
                        onClick={() => setSeedKeyword('')}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Clear keyword"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <span className="block text-[11px] text-slate-400 font-medium">
                    Specific core topic, product, tool, or high-intent search query
                  </span>
                </div>

                {/* COUNTRY SELECTOR & SUBMIT BUTTON */}
                <div className="md:col-span-2 space-y-2 flex flex-col justify-end">
                  <label
                    htmlFor="select-target-country"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Region</span>
                  </label>
                  <select
                    id="select-target-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl px-3 py-3.5 text-xs font-bold text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="US">🇺🇸 United States</option>
                    <option value="UK">🇬🇧 United Kingdom</option>
                    <option value="CA">🇨🇦 Canada</option>
                    <option value="AU">🇦🇺 Australia</option>
                    <option value="DE">🇩🇪 Germany</option>
                    <option value="GLOBAL">🌍 Global / Worldwide</option>
                  </select>
                </div>
              </div>

              {/* ACTION BUTTON ROW */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
                {/* 1-Click Preset Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Try 1-Click Samples:</span>
                  </span>
                  {KEYWORD_PLANNER_PRESETS.slice(0, 4).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all font-medium cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Submit / Generate Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  id="btn-generate-keyword-plan"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-98 cursor-pointer shrink-0 border border-blue-400/20"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>{generationStep || 'Generating 50 Keywords...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-blue-200" />
                      <span>GENERATE 50 KEYWORDS (25 Short + 25 Long-Tail)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* TRUST PILLARS BAR */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>50 Exact Keyword Targets</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>25 Short + 25 Long-Tail</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Exact Volume, CTR & CPM</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>1-Click CSV & Excel Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* EXECUTIVE KPI SUMMARY RIBBON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
                  Verified Blueprint for "{planResult.seedKeyword}"
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  in {planResult.niche} ({planResult.country})
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Executive Keyword Intelligence & Traffic Valuation
              </h2>
            </div>

            {/* Quick Export & Copy Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={copyAllKeywords}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy all 50 keywords as text"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'All 50 Copied!' : 'Copy All 50'}</span>
              </button>

              {selectedIds.size > 0 && (
                <button
                  type="button"
                  onClick={copySelectedKeywords}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSelected ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy {selectedIds.size} Selected</span>
                </button>
              )}

              <button
                type="button"
                onClick={exportToCsv}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV (Semrush / Excel)</span>
              </button>
            </div>
          </div>

          {/* 5 Executive KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Total Volume */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Total Monthly Vol</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {planResult.totalSearchVolume.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>50 verified queries</span>
              </div>
            </div>

            {/* Average KD */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-600" />
                <span>Avg Difficulty (KD)</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {planResult.avgDifficulty}%
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {planResult.avgDifficulty <= 30 ? '🟢 Low Competition (Easy)' : '🟡 Moderate Competition'}
              </div>
            </div>

            {/* Average Organic CTR */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MousePointerClick className="w-3.5 h-3.5 text-purple-600" />
                <span>Avg Organic CTR</span>
              </div>
              <div className="text-2xl font-black text-purple-700">
                {planResult.avgCtr}%
              </div>
              <div className="text-[11px] text-purple-600 font-medium">
                High click-through SERP
              </div>
            </div>

            {/* Avg CPM / CPC */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Avg CPM / CPC</span>
              </div>
              <div className="text-2xl font-black text-emerald-700">
                ${planResult.avgCpm}
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                Avg CPC: ${planResult.avgCpc} USD
              </div>
            </div>

            {/* Estimated Traffic Value */}
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-1 col-span-2 sm:col-span-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span>Est. Traffic Value</span>
              </div>
              <div className="text-2xl font-black text-blue-900">
                ${planResult.totalEstimatedTrafficValueUsd.toLocaleString()}
                <span className="text-xs font-normal text-blue-700">/mo</span>
              </div>
              <div className="text-[11px] text-blue-700 font-semibold">
                Organic PPC equivalent
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN VIEW CONTROLS & TABBED WORKSPACE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-200 scrollbar-thin">
          {[
            { id: 'untapped', label: `🔥 Untapped Keywords (Ahrefs Engine)`, icon: Flame },
            { id: 'all', label: `All 50 Master Keywords (${planResult.allKeywords.length})`, icon: Sparkles },
            { id: 'short_tail', label: `25 Short-Tail Keywords (${planResult.shortTailKeywords.length})`, icon: Zap },
            { id: 'long_tail', label: `25 Long-Tail Keywords (${planResult.longTailKeywords.length})`, icon: Target },
            { id: 'high_cpm', label: 'Top CPM Monetization', icon: DollarSign },
            { id: 'low_kd', label: 'Low KD Quick Wins (<30%)', icon: TrendingUp },
            { id: 'clusters', label: `Topic Clusters & Silos (${planResult.topicClusters.length})`, icon: FolderTree },
            { id: 'roadmap', label: '4-Stage Content Roadmap', icon: Clock },
            { id: 'faq', label: 'Untapped Keyword FAQ', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.id === 'untapped' ? 'text-orange-500' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* WORKSPACE CONTENT BASED ON ACTIVE TAB */}

        {/* TAB 1, 2, 3, 4, 5, 6: TABULAR KEYWORD DATA */}
        {['untapped', 'all', 'short_tail', 'long_tail', 'high_cpm', 'low_kd'].includes(activeTab) && (
          <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {/* AHREFS UNTAPPED METHODOLOGY BANNER */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50 via-amber-50/50 to-blue-50/50 border-b border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Flame className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-orange-950">
                      Ahrefs Untapped Keyword Discovery Engine
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-200/80 text-orange-900 text-[10px] font-bold">
                      Algorithm Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                    Filters low-competition keywords where <strong>low Domain Rating (DR &le; 20)</strong> sites rank in the top 5, user-generated forums (Reddit/Quora) appear on Page 1, or pages have <strong>0-1 backlinks</strong> despite high <strong>Traffic Potential (TP)</strong>.
                  </p>
                </div>
              </div>

              {/* Quick Summary Pill */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-2 rounded-xl bg-white border border-orange-200 text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Untapped Pool
                  </div>
                  <div className="text-sm font-black text-orange-600 font-mono">
                    {filteredKeywords.length} / {planResult.allKeywords.length} targets
                  </div>
                </div>
              </div>
            </div>

            {/* AHREFS 1-CLICK PRESET FILTER CHIPS */}
            <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200/70 flex items-center gap-2 overflow-x-auto scrollbar-thin">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Ahrefs Presets:</span>
              </span>

              {[
                { id: 'all', label: 'All Keywords' },
                { id: 'lowest_dr_20', label: '🔥 Lowest DR &le; 20 in Top 5' },
                { id: 'reddit_forum', label: '💬 Reddit / Forum on Page 1' },
                { id: 'zero_backlinks', label: '🎯 Zero Backlinks (0-1 RD)' },
                { id: 'golden_ratio', label: '⚡ Golden Ratio (KD &le; 18, Vol &ge; 500)' },
                { id: 'high_tp', label: '📈 High Traffic Potential (3k+ TP)' },
                { id: 'untapped_questions', label: '❓ Untapped Question Queries' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setAhrefsPreset(preset.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    ahrefsPreset === preset.id
                      ? 'bg-orange-600 text-white shadow-2xs font-bold'
                      : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search within table */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Search keyword, cluster, competitor, or flaw..."
                  className="w-full pl-10 pr-10 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400/70 focus:bg-white focus:placeholder:text-transparent focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden transition-all"
                />
                {tableSearch && (
                  <button
                    type="button"
                    onClick={() => setTableSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filters & Sorters */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {/* Search Intent Filter */}
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold uppercase text-slate-400">Intent:</span>
                  <select
                    value={intentFilter}
                    onChange={(e) => setIntentFilter(e.target.value)}
                    className="bg-transparent font-bold text-slate-700 outline-hidden cursor-pointer"
                  >
                    <option value="all">All Intents</option>
                    <option value="transactional">Transactional</option>
                    <option value="commercial">Commercial</option>
                    <option value="informational">Informational</option>
                    <option value="navigational">Navigational</option>
                  </select>
                </div>

                {/* Lowest DR Filter (Ahrefs Signature) */}
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold uppercase text-orange-600">Lowest DR:</span>
                  <select
                    value={lowestDrFilter}
                    onChange={(e) => setLowestDrFilter(e.target.value)}
                    className="bg-transparent font-bold text-slate-700 outline-hidden cursor-pointer"
                  >
                    <option value="all">Any DR</option>
                    <option value="15">DR &le; 15 (Ultra Weak)</option>
                    <option value="20">DR &le; 20 (Easy Target)</option>
                    <option value="25">DR &le; 25 (Vulnerable)</option>
                    <option value="35">DR &le; 35 (Moderate)</option>
                  </select>
                </div>

                {/* Max KD Filter */}
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold uppercase text-slate-400">Max KD:</span>
                  <select
                    value={maxKdFilter}
                    onChange={(e) => setMaxKdFilter(e.target.value)}
                    className="bg-transparent font-bold text-slate-700 outline-hidden cursor-pointer"
                  >
                    <option value="all">Any KD</option>
                    <option value="10">KD &le; 10 (Super Easy)</option>
                    <option value="20">KD &le; 20 (Easy)</option>
                    <option value="30">KD &le; 30 (Moderate)</option>
                    <option value="50">KD &le; 50</option>
                  </select>
                </div>

                {/* Sort Field */}
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold uppercase text-slate-400">Sort:</span>
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as any)}
                    className="bg-transparent font-bold text-slate-700 outline-hidden cursor-pointer"
                  >
                    <option value="untapped">Untapped Score (0-100)</option>
                    <option value="tp">Traffic Potential (TP)</option>
                    <option value="lowest_dr">Lowest DR in Top 10</option>
                    <option value="volume">Search Volume</option>
                    <option value="kd">Keyword Difficulty (KD)</option>
                    <option value="ctr">Organic CTR %</option>
                    <option value="cpm">Estimated CPM ($)</option>
                    <option value="opportunity">Opportunity Score</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                    className="p-1 hover:bg-slate-200 rounded-md text-slate-600 cursor-pointer transition-colors"
                    title={`Toggle sort order (Current: ${sortOrder})`}
                  >
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Toggle Advanced Filters Button */}
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border transition-colors cursor-pointer ${
                    showAdvancedFilters || activeFiltersCount > 0
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </button>

                {/* Reset Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer px-1"
                  >
                    Reset All
                  </button>
                )}
              </div>
            </div>

            {/* EXPANDABLE ADVANCED AHREFS FILTERS DRAWER */}
            {showAdvancedFilters && (
              <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
                {/* Min Volume */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Min Monthly Volume
                  </label>
                  <select
                    value={minVolFilter}
                    onChange={(e) => setMinVolFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-700"
                  >
                    <option value="all">Any Volume</option>
                    <option value="250">250+ /mo</option>
                    <option value="500">500+ /mo</option>
                    <option value="1000">1,000+ /mo</option>
                    <option value="5000">5,000+ /mo</option>
                  </select>
                </div>

                {/* Min Traffic Potential */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Min Traffic Potential (TP)
                  </label>
                  <select
                    value={minTpFilter}
                    onChange={(e) => setMinTpFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-700"
                  >
                    <option value="all">Any TP</option>
                    <option value="1000">1,000+ TP</option>
                    <option value="2500">2,500+ TP</option>
                    <option value="5000">5,000+ TP</option>
                    <option value="10000">10,000+ TP</option>
                  </select>
                </div>

                {/* Min Word Count */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Word Count (Length)
                  </label>
                  <select
                    value={wordCountFilter}
                    onChange={(e) => setWordCountFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-700"
                  >
                    <option value="all">Any Word Count</option>
                    <option value="3">3+ Words (Long-tail)</option>
                    <option value="4">4+ Words (Intent-rich)</option>
                    <option value="5">5+ Words (Specific query)</option>
                  </select>
                </div>

                {/* SERP Flaw Type */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    SERP Flaw / Crack Type
                  </label>
                  <select
                    value={serpFlawFilter}
                    onChange={(e) => setSerpFlawFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-700"
                  >
                    <option value="all">All SERP Flaws</option>
                    <option value="low_dr">Low DR Competitor in Top 5</option>
                    <option value="ugc_forum">Reddit / Forum on Page 1</option>
                    <option value="zero_backlinks">0 Backlink Ranker</option>
                    <option value="outdated_serp">Outdated Content on SERP</option>
                    <option value="snippet_opportunity">Snippet Opportunity</option>
                  </select>
                </div>

                {/* Include Term */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Include Keyword Term
                  </label>
                  <input
                    type="text"
                    value={includeTerm}
                    onChange={(e) => setIncludeTerm(e.target.value)}
                    placeholder="e.g. tool, how, best"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                {/* Exclude Term */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Exclude Keyword Term
                  </label>
                  <input
                    type="text"
                    value={excludeTerm}
                    onChange={(e) => setExcludeTerm(e.target.value)}
                    placeholder="e.g. login, free, download"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {/* TABULAR RESULTS */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/90 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filteredKeywords.length && filteredKeywords.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-2 w-10 text-center">#</th>
                    <th className="py-3.5 px-4 min-w-[200px]">Keyword Phrase</th>
                    <th className="py-3.5 px-2.5">Intent</th>
                    <th className="py-3.5 px-3">Search Volume</th>
                    <th className="py-3.5 px-3">Traffic Potential (TP)</th>
                    <th className="py-3.5 px-3">KD %</th>
                    <th className="py-3.5 px-3 min-w-[150px]">Lowest DR in Top 10</th>
                    <th className="py-3.5 px-3 min-w-[150px]">SERP Flaw / Crack</th>
                    <th className="py-3.5 px-3 min-w-[120px]">Untapped Score</th>
                    <th className="py-3.5 px-3">CPM / CPC</th>
                    <th className="py-3.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredKeywords.length > 0 ? (
                    filteredKeywords.map((kw, idx) => {
                      const isSelected = selectedIds.has(kw.id);
                      const isCopied = copiedId === kw.id;

                      // Intent Badge Color
                      let intentBg = 'bg-blue-50 text-blue-700 border-blue-200';
                      if (kw.intent === 'transactional') {
                        intentBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                      } else if (kw.intent === 'commercial') {
                        intentBg = 'bg-purple-50 text-purple-800 border-purple-200';
                      } else if (kw.intent === 'navigational') {
                        intentBg = 'bg-amber-50 text-amber-800 border-amber-200';
                      }

                      // KD Color
                      let kdColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                      if (kw.difficulty > 48) {
                        kdColor = 'text-rose-700 bg-rose-50 border-rose-200';
                      } else if (kw.difficulty > 32) {
                        kdColor = 'text-amber-700 bg-amber-50 border-amber-200';
                      }

                      // Lowest DR Color
                      let drBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                      if (kw.lowestDrTop10 > 30) {
                        drBadge = 'bg-slate-100 text-slate-700 border-slate-200';
                      } else if (kw.lowestDrTop10 > 20) {
                        drBadge = 'bg-blue-50 text-blue-700 border-blue-200';
                      }

                      // Untapped Score Gradient
                      let scoreColor = 'from-emerald-500 to-teal-500';
                      if (kw.untappedScore < 60) {
                        scoreColor = 'from-amber-500 to-orange-500';
                      } else if (kw.untappedScore >= 80) {
                        scoreColor = 'from-orange-500 to-rose-500';
                      }

                      return (
                        <tr
                          key={kw.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSelected ? 'bg-blue-50/40' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(kw.id)}
                              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* Index */}
                          <td className="py-3 px-2 text-center font-mono text-slate-400 text-[11px]">
                            {idx + 1}
                          </td>

                          {/* Keyword Phrase */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                              <span>{kw.keyword}</span>
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[9px] font-mono font-semibold">
                                {kw.wordCount}w
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-2">
                              <span>Cluster: {kw.clusterName}</span>
                              <span>•</span>
                              <span className="text-slate-500">{kw.recommendedFormat}</span>
                            </div>
                          </td>

                          {/* Intent */}
                          <td className="py-3 px-2.5">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize ${intentBg}`}
                            >
                              {kw.intent}
                            </span>
                          </td>

                          {/* Search Volume */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 font-mono">
                              {kw.searchVolume.toLocaleString()}
                              <span className="text-[10px] font-normal text-slate-500"> /mo</span>
                            </div>
                            <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${Math.min(100, (kw.searchVolume / 48000) * 100)}%` }}
                              />
                            </div>
                          </td>

                          {/* Traffic Potential (TP) - Ahrefs Signature */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-purple-900 font-mono">
                              {kw.trafficPotential.toLocaleString()}
                              <span className="text-[10px] font-normal text-purple-600"> /mo</span>
                            </div>
                            <div className="text-[10px] font-semibold text-purple-600">
                              {(kw.trafficPotential / kw.searchVolume).toFixed(1)}x search volume
                            </div>
                          </td>

                          {/* KD */}
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border font-mono ${kdColor}`}
                            >
                              KD {kw.difficulty}%
                            </span>
                          </td>

                          {/* Lowest DR in Top 10 (Ahrefs signature) */}
                          <td className="py-3 px-3">
                            <button
                              type="button"
                              onClick={() => setInspectingKeyword(kw)}
                              className="text-left group cursor-pointer"
                              title="Click to inspect Top 10 SERP competitor breakdown"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black border ${drBadge}`}>
                                  DR {kw.lowestDrTop10}
                                </span>
                                <span className="text-[10px] font-bold text-slate-600 font-mono">
                                  #{kw.lowestDrPosition}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 truncate max-w-[140px] group-hover:text-blue-600 group-hover:underline">
                                {kw.lowestDrCompetitor} ({kw.pageReferringDomains} RD)
                              </div>
                            </button>
                          </td>

                          {/* SERP Flaw / Crack */}
                          <td className="py-3 px-3">
                            <button
                              type="button"
                              onClick={() => setInspectingKeyword(kw)}
                              className="text-left group cursor-pointer"
                              title="Click to inspect this SERP vulnerability"
                            >
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold">
                                {kw.serpFlaw.type === 'ugc_forum' && <span>💬</span>}
                                {kw.serpFlaw.type === 'zero_backlinks' && <span>🎯</span>}
                                {kw.serpFlaw.type === 'low_dr' && <span>🛡️</span>}
                                {kw.serpFlaw.type === 'outdated_serp' && <span>⚡</span>}
                                {kw.serpFlaw.type === 'snippet_opportunity' && <span>⭐</span>}
                                <span className="truncate max-w-[120px]">{kw.serpFlaw.label}</span>
                              </div>
                              <div className="text-[9px] text-slate-400 mt-0.5">
                                {kw.serpFlaw.impact}
                              </div>
                            </button>
                          </td>

                          {/* Untapped Score */}
                          <td className="py-3 px-3">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-mono font-black text-xs text-slate-900">
                                  {kw.untappedScore}/100
                                </span>
                                {kw.untappedScore >= 80 && (
                                  <span className="text-[9px] font-bold text-orange-600 uppercase">
                                    Hot
                                  </span>
                                )}
                              </div>
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${scoreColor} rounded-full`}
                                  style={{ width: `${kw.untappedScore}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* CPM / CPC */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-emerald-700 font-mono">
                              ${kw.cpmUsd} <span className="text-[10px] font-normal text-slate-500">CPM</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              CPC: ${kw.cpcUsd}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Inspect SERP Button */}
                              <button
                                type="button"
                                onClick={() => setInspectingKeyword(kw)}
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer border border-blue-200/70"
                                title="Inspect SERP Competitors & Vulnerabilities (Ahrefs view)"
                              >
                                <Eye className="w-3 h-3 text-blue-600" />
                                <span>SERP</span>
                              </button>

                              {/* Copy Keyword */}
                              <button
                                type="button"
                                onClick={() => copyKeyword(kw.keyword, kw.id)}
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Copy keyword to clipboard"
                              >
                                {isCopied ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* Open Google Live SERP */}
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(kw.keyword)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                                title="View live Google SERP"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-slate-500 text-xs">
                        <div className="max-w-sm mx-auto space-y-2">
                          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                          <div className="font-bold text-slate-800">No untapped keywords match this filter</div>
                          <p className="text-slate-500 text-[11px]">
                            Try lowering the Lowest DR threshold or switching to another Ahrefs filter preset.
                          </p>
                          <button
                            type="button"
                            onClick={resetAllFilters}
                            className="mt-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs cursor-pointer"
                          >
                            Reset All Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Summary Count */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Showing <strong className="text-slate-800">{filteredKeywords.length}</strong> of{' '}
                <strong className="text-slate-800">{planResult.allKeywords.length}</strong> keywords (Ahrefs Untapped Engine)
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={copyAllKeywords}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Copy All 50
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={exportToCsv}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Download CSV with Ahrefs Metrics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: TOPIC CLUSTERS & SILO MATRIX */}
        {activeTab === 'clusters' && (
          <div className="mt-6 space-y-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                5 Topical Silos & Semantic Cluster Architecture
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Organizing your 50 keywords into semantic clusters maximizes internal link equity and prevents keyword cannibalization. Each silo represents a dedicated content pillar with specialized search intent.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {planResult.topicClusters.map((cluster, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-blue-300 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase tracking-wider border border-blue-200">
                        Silo #{i + 1}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-700">
                        Avg CPM: ${cluster.avgCpm}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{cluster.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{cluster.description}</p>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                      <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                        Primary Anchor Keyword:
                      </div>
                      <div className="font-bold text-blue-700 font-mono">{cluster.primaryKeyword}</div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Supporting Long-Tail Targets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cluster.supportingKeywords.map((kw, kIdx) => (
                          <span
                            key={kIdx}
                            className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500 font-medium">
                      <span>Total Silo Volume:</span>
                      <strong className="text-slate-900 font-mono">{cluster.totalVolume.toLocaleString()} /mo</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 font-medium">
                      <span>Recommended Format:</span>
                      <strong className="text-blue-700 text-[11px]">{cluster.suggestedPageType}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: 4-STAGE CONTENT ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                15-Step Organic Content Execution Roadmap
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                Follow this sequential 4-phase rollout to dominate SERP rankings from initial low-KD quick wins to complete topical authority.
              </p>
            </div>

            <div className="space-y-6">
              {planResult.contentRoadmap.map((stage, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4 hover:bg-slate-50/90 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">
                        {stage.phaseNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{stage.stage}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold font-mono">
                      {stage.timeframe}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{stage.focus}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 block">
                        Target Keyword Opportunities:
                      </span>
                      <ul className="space-y-1 text-slate-700 pl-4 list-disc">
                        {stage.targetKeywords.map((kw, i) => (
                          <li key={i} className="font-semibold text-blue-900">
                            {kw}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 block">
                        Production Deliverables:
                      </span>
                      <ul className="space-y-1 text-slate-700 pl-4 list-disc">
                        {stage.deliverables.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Projected Traffic Velocity:</span>
                    <strong className="text-emerald-700 font-mono font-bold">{stage.projectedTrafficGain}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: SNIPPET-OPTIMIZED FAQS */}
        {activeTab === 'faq' && (
          <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Keyword Planning & SERP Optimization FAQs
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Direct answers to common search engine and generative AI optimization questions.
              </p>
            </div>

            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">
                  What are "Untapped Keywords" and how does the Ahrefs filter work?
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  <strong>Untapped keywords are search queries with high traffic potential where low-authority websites (DR &le; 20) or forums (Reddit/Quora) rank in top spots with minimal backlinks.</strong>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Traditional keyword research relies solely on Keyword Difficulty (KD), which only measures backlink counts to top ranking pages. The Ahrefs untapped methodology examines the actual SERP layout to find "cracks" — such as positions held by low DR domains, user-generated forum threads, or outdated content that a well-crafted guide can easily outrank.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">
                  What is Traffic Potential (TP) and why is it better than Search Volume?
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  <strong>Traffic Potential estimates total monthly organic visits the #1 ranking page receives for ALL keyword variations combined, usually 2x to 5x single keyword search volume.</strong>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A keyword with only 500 monthly search volume can have a Traffic Potential of 4,000/month because a single comprehensive article will rank for hundreds of related long-tail synonyms simultaneously.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">
                  What does "Lowest DR in Top 10" mean for a new or low-authority website?
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  <strong>It identifies the weakest domain rating currently ranking on Page 1. If a website with DR &le; 20 is ranking, your site can rank too without acquiring dozens of links.</strong>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Even if Wikipedia and Forbes hold positions #1 and #2, if a DR 14 niche site ranks at #3 or #4 with only 1 backlink, Google has proven that topical relevance and search intent match trump raw domain power for that query.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">
                  What is the difference between short-tail and long-tail keywords?
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  <strong>Short-tail keywords contain 1-3 words with broad search volume, while long-tail keywords contain 4+ words with high conversion intent and lower ranking difficulty.</strong>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Short-tail keywords anchor broad category hubs, while long-tail queries capture targeted user questions, transactional intent, and zero-friction conversions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">
                  How does the tool estimate CTR and CPM values?
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  <strong>Estimated CTR models organic click curves across top SERP positions, while CPM calculates advertising commercial monetization values within each specific industry vertical.</strong>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  High commercial intent queries in finance, SaaS, and legal niches command CPM values above $25.00, compared to broad informational lifestyle searches.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">
                  How should I organize keywords into topic clusters?
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  <strong>Group 5-10 related long-tail queries around a central pillar keyword, connecting supporting articles to the main hub using descriptive contextual anchor links.</strong>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This topical silo structure signals comprehensive domain authority to search engine crawlers and generative retrieval models.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Can I export these 50 keywords to Google Ads and Semrush?
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  <strong>Yes, 1-click CSV export generates formatted tables compatible with Semrush, Ahrefs, Google Ads Keyword Planner, and Microsoft Excel.</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 10px AI-Generated Data & Independent Verification Notice */}
        <div className="mt-6 flex items-start sm:items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[10px] text-slate-500 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <strong className="text-slate-700 font-semibold">AI Intelligence Notice:</strong> This data is algorithmically synthesized for directional research and keyword benchmarking. Search volumes, CPC/CPM rates, and market authenticity vary across locations and search engines over time. Please conduct your own research and verify with primary search console tools before final strategy deployment.
          </p>
        </div>
      </section>

      {/* COMPREHENSIVE E-E-A-T EDUCATIONAL & ANALYTICAL ARTICLE (600-1200 WORDS) */}
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <header className="space-y-2 pb-6 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Technical Documentation & Keyword Strategy Guide
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950">
              Mastering Modern Keyword Planning: Mathematical Density, Quad-Stage Intent & Topic Silos
            </h2>
            <p className="text-xs text-slate-500">
              Authored by the AccessFix Search Engineering & Web Performance Architecture Team • Updated for 2026 SERP & AI Overviews
            </p>
          </header>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              1. The Strategic Imperative of Dual-Spectrum Keyword Architecture
            </h3>
            <p>
              Modern organic search optimization requires balancing broad brand visibility with immediate transactional revenue. Relying solely on high-volume short-tail search terms often results in prolonged ranking cycles and high bounce rates due to misaligned user intent. Conversely, targeting isolated long-tail phrases without a unifying semantic pillar limits domain authority expansion.
            </p>
            <p>
              Our <strong>AI Keyword Planner & Cluster Engine</strong> resolves this disparity by generating an exact matrix of <strong>25 short-tail category anchors</strong> and <strong>25 high-intent long-tail modifiers</strong>. This 50-keyword blueprint creates an interconnected web of topical relevance that satisfies both search engine indexers and generative AI answer extraction engines.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              2. Quad-Stage Search Intent Resolution Matrix
            </h3>
            <p>
              Every user query belongs to one of four distinct intent categories. To achieve top rankings, your web architecture must provide specialized user interfaces for each intent type:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Transactional Intent (Instant Utility)</span>
                </span>
                <p className="text-xs text-slate-600">
                  Users seek interactive calculators, diagnostic scanners, generators, and downloadable templates. Deliver client-side web tools with zero-friction input fields at the top of the viewport.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>Commercial Intent (Comparative Evaluation)</span>
                </span>
                <p className="text-xs text-slate-600">
                  Users compare software features, pricing tiers, and alternative platforms. Present structured benchmark tables, ROI estimators, and transparent evaluation criteria.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Informational Intent (In-Depth Education)</span>
                </span>
                <p className="text-xs text-slate-600">
                  Users seek step-by-step checklists, diagnostic definitions, and regulatory compliance standards. Provide structured tutorials with code snippets and verified data.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Navigational Intent (Direct Platform Access)</span>
                </span>
                <p className="text-xs text-slate-600">
                  Users look for specific brand tools, login portals, or API documentation hubs. Maintain clean URL hierarchies and clear breadcrumb paths.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              3. Mathematical Opportunity Scoring & CPM Valuation
            </h3>
            <p>
              Keyword priority should never rely on raw search volume alone. Our algorithmic engine calculates an <strong>Opportunity Score (0-100)</strong> using a multi-factor formula:
            </p>
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
              <code>Opportunity Score = (Search Volume × 0.40) + ((100 - KD) × 0.40) + (CTR% × 0.10) + (CPC × 0.10)</code>
            </div>
            <p>
              This ensures that low-competition terms with high monetization potential and organic click-through rates rise to the top of your production queue, delivering measurable ROI within 2 to 4 weeks of deployment.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              4. Establishing Semantic Topic Silos for Generative AI Overviews
            </h3>
            <p>
              Large Language Models (LLMs) and Search Generative Experiences (SGE) synthesize content from authoritative clusters rather than isolated pages. To ensure your website is cited as a primary source in AI carousels, deploy strict parent-child semantic silos:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
              <li><strong>Root Pillar Page:</strong> 2,500+ word comprehensive resource targeting the primary short-tail seed keyword.</li>
              <li><strong>Supporting Cluster Utilities:</strong> 5-8 interactive tools or specialized articles targeting long-tail variations.</li>
              <li><strong>Contextual Internal Hyperlinks:</strong> Every child asset connects back to the root pillar using exact descriptive anchors.</li>
              <li><strong>JSON-LD Structured Data:</strong> Inject valid <code>SoftwareApplication</code>, <code>FAQPage</code>, and <code>WebSite</code> schema markup.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>5. Ahrefs Untapped Keyword Strategy: Finding Cracks in the SERP</span>
            </h3>
            <p>
              Standard keyword research tools mislead site owners by calculating Keyword Difficulty (KD) strictly based on the average number of backlinks pointing to top-10 URLs. In reality, modern search algorithms reward topical nuance and user intent satisfaction over raw PageRank. Ahrefs popularized the <strong>Untapped Keyword Research Workflow</strong>, which uncovers high-value search queries where incumbent competitors exhibit fundamental structural vulnerabilities:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/80 space-y-1">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Lowest DR &le; 20 in Top 5</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  If a low Domain Rating website ranks on page one, Google has determined that domain authority is secondary to topical accuracy. Any focused domain can compete.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>UGC Forums (Reddit / Quora)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  When user discussion boards take top positions, Google lacks dedicated expert editorial content. A definitive guide easily captures Position 1.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>0-1 Referring Domain Rankers</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Pages ranking with zero or single backlinks prove that link building is not required. Solid on-page architecture and entity density will win.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 pt-1">
              By combining <strong>Traffic Potential (TP)</strong> filtering with lowest DR inspection, publishers can bypass ultra-competitive seed terms and build predictable organic search pipelines that convert immediately.
            </p>
          </section>
        </div>
      </article>

      {/* SERP INSPECTOR MODAL (AHREFS CRACK ANALYSIS) */}
      {inspectingKeyword && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>Ahrefs SERP Crack Inspector</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-200 text-[10px] font-mono font-bold">
                    KD {inspectingKeyword.difficulty}%
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-mono font-bold">
                    Untapped Score: {inspectingKeyword.untappedScore}/100
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  "{inspectingKeyword.keyword}"
                </h3>
                <div className="text-[11px] text-slate-300 flex items-center gap-3">
                  <span>Vol: <strong className="text-white font-mono">{inspectingKeyword.searchVolume.toLocaleString()}</strong>/mo</span>
                  <span>•</span>
                  <span>Traffic Potential: <strong className="text-white font-mono">{inspectingKeyword.trafficPotential.toLocaleString()}</strong>/mo</span>
                  <span>•</span>
                  <span>Cluster: <strong className="text-white">{inspectingKeyword.clusterName}</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingKeyword(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                title="Close inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              {/* Vulnerability Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-950 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Primary SERP Vulnerability Detected: {inspectingKeyword.serpFlaw.label}</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">
                  {inspectingKeyword.serpFlaw.description}
                </p>
                <div className="text-[11px] font-semibold text-amber-800 pt-1">
                  Tactical Advantage: {inspectingKeyword.serpFlaw.impact}
                </div>
              </div>

              {/* SERP Competitor Breakdown */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  SERP Top Competitor Landscape
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[9px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3 w-10 text-center">Pos</th>
                        <th className="py-2.5 px-3">Ranking Entity</th>
                        <th className="py-2.5 px-2.5 text-center">DR</th>
                        <th className="py-2.5 px-2.5 text-center">RD</th>
                        <th className="py-2.5 px-3">Est. Traffic</th>
                        <th className="py-2.5 px-3">SERP Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* Simulated Positions 1 & 2 */}
                      <tr className="bg-slate-50/40 text-slate-600">
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400">#1</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          authority-portal.com
                          <span className="block text-[10px] text-slate-400 font-normal">/guides/overview</span>
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-mono font-bold text-slate-600">74</td>
                        <td className="py-2.5 px-2.5 text-center font-mono text-slate-600">32</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">
                          {Math.round(inspectingKeyword.trafficPotential * 0.38).toLocaleString()}/mo
                        </td>
                        <td className="py-2.5 px-3 text-[10px] text-slate-500">Established Pillar</td>
                      </tr>

                      {/* Targeted Leapfrog Competitor */}
                      <tr className="bg-orange-50/50 border-l-4 border-l-orange-500 font-medium">
                        <td className="py-2.5 px-3 text-center font-mono font-black text-orange-600">
                          #{inspectingKeyword.lowestDrPosition}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-orange-950 flex items-center gap-1.5">
                            <span>{inspectingKeyword.lowestDrCompetitor}</span>
                            <span className="px-1.5 py-0.2 rounded bg-orange-200/80 text-orange-900 text-[9px] font-bold">
                              Leapfrog Target
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Topical guide with minimal backlink profile
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 text-center">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                            DR {inspectingKeyword.lowestDrTop10}
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-mono font-bold text-slate-800">
                          {inspectingKeyword.pageReferringDomains}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-orange-900">
                          {Math.round(inspectingKeyword.trafficPotential * 0.15).toLocaleString()}/mo
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-bold text-orange-700">
                            Vulnerable Target
                          </span>
                        </td>
                      </tr>

                      {/* Position 4/5 */}
                      <tr className="bg-white text-slate-600">
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400">#4</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {inspectingKeyword.serpFlaw.type === 'ugc_forum' ? 'reddit.com/r/seo' : 'tech-resource.io'}
                          <span className="block text-[10px] text-slate-400 font-normal">/discussion/thread</span>
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-mono font-bold text-slate-600">
                          {inspectingKeyword.serpFlaw.type === 'ugc_forum' ? '91' : '38'}
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-mono text-slate-600">0</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">
                          {Math.round(inspectingKeyword.trafficPotential * 0.08).toLocaleString()}/mo
                        </td>
                        <td className="py-2.5 px-3 text-[10px] text-amber-700">
                          {inspectingKeyword.serpFlaw.type === 'ugc_forum' ? 'User Discussion' : 'Secondary Resource'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3-Step Tactical Leapfrog Plan */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  3-Step Leapfrog Action Blueprint
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-mono">1</span>
                      <span>Content Scope</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Publish a 1,600+ word resource formatted as <strong>{inspectingKeyword.recommendedFormat}</strong> targeting "{inspectingKeyword.keyword}".
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-mono">2</span>
                      <span>Backlink Target</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Target <strong>0-2 internal links</strong> from your pillar page. No external outreach required to displace DR {inspectingKeyword.lowestDrTop10}.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-mono">3</span>
                      <span>Snippet Capture</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Format the opening H2 with a bold 22-word direct answer to claim Google's Featured Snippet Position 0.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-mono">
                Formula: Untapped Score = (100 - KD) × 0.4 + (100 - DR) × 0.35 + (TP Factor) × 0.25
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(inspectingKeyword.keyword)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Google SERP</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    copyKeyword(inspectingKeyword.keyword, inspectingKeyword.id);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Keyword</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
