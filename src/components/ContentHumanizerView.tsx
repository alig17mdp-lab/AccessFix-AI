import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Bot,
  UserCheck,
  ShieldCheck,
  Copy,
  Check,
  Trash2,
  Download,
  AlertTriangle,
  FileText,
  Sliders,
  Lock,
  ArrowRight,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Zap,
  TrendingUp,
  Tag,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  HumanizerTab,
  HumanizerTone,
  EeatStrictness,
  HumanizeContentResponse,
  HumanizeKeywordsResponse,
} from '../types/contentHumanizer';
import {
  MAX_CONTENT_WORDS,
  SAMPLE_AI_DRAFTS,
  SAMPLE_AI_KEYWORDS,
  countWords,
  detectAiClichesInText,
  processContentHumanization,
  processKeywordsHumanization,
} from '../utils/contentHumanizerEngine';

interface ContentHumanizerViewProps {
  onNavigate: (route: string) => void;
}

export const ContentHumanizerView: React.FC<ContentHumanizerViewProps> = ({ onNavigate }) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<HumanizerTab>('content');

  // Content Humanizer States
  const [inputText, setInputText] = useState<string>(SAMPLE_AI_DRAFTS[0].text);
  const [tone, setTone] = useState<HumanizerTone>('natural');
  const [eeatStrictness, setEeatStrictness] = useState<EeatStrictness>('maximum');
  const [lockedKeywordsInput, setLockedKeywordsInput] = useState<string>('content marketing, organic traffic, conversion funnels');
  const [isProcessingContent, setIsProcessingContent] = useState<boolean>(false);
  const [contentResult, setContentResult] = useState<HumanizeContentResponse | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const [copiedContent, setCopiedContent] = useState<boolean>(false);

  // Keywords Humanizer States
  const [keywordsInput, setKeywordsInput] = useState<string>(SAMPLE_AI_KEYWORDS.join('\n'));
  const [isProcessingKeywords, setIsProcessingKeywords] = useState<boolean>(false);
  const [keywordsResult, setKeywordsResult] = useState<HumanizeKeywordsResponse | null>(null);
  const [copiedKeywordIdx, setCopiedKeywordIdx] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({ 0: true, 1: true });

  // Word count calculations
  const currentWordCount = useMemo(() => countWords(inputText), [inputText]);
  const isLimitExceeded = currentWordCount > MAX_CONTENT_WORDS;
  const wordsOverLimit = isLimitExceeded ? currentWordCount - MAX_CONTENT_WORDS : 0;

  // Real-time AI Cliches detection in input
  const detectedCliches = useMemo(() => detectAiClichesInText(inputText), [inputText]);

  // Trim to 2000 words helper
  const handleTrimToLimit = () => {
    const words = inputText.trim().split(/\s+/).filter(Boolean);
    if (words.length <= MAX_CONTENT_WORDS) return;
    const trimmed = words.slice(0, MAX_CONTENT_WORDS).join(' ');
    // Clean up trailing incomplete sentence if possible
    const lastPeriod = trimmed.lastIndexOf('.');
    if (lastPeriod > trimmed.length - 120) {
      setInputText(trimmed.substring(0, lastPeriod + 1));
    } else {
      setInputText(trimmed);
    }
  };

  // Run Content Humanization
  const handleHumanizeContent = async () => {
    if (isLimitExceeded) return;
    if (!inputText.trim()) {
      setContentError('Please paste or write text before humanizing.');
      return;
    }

    setIsProcessingContent(true);
    setContentError(null);

    const lockedKeywords = lockedKeywordsInput
      .split(/[,;\n]+/)
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      const res = await processContentHumanization({
        text: inputText,
        tone,
        lockedKeywords,
        eeatStrictness,
        readingLevel: 'standard',
      });
      setContentResult(res);
    } catch (err: any) {
      setContentError(err.message || 'Failed to humanize content. Please try again.');
    } finally {
      setIsProcessingContent(false);
    }
  };

  // Run Keywords Humanization
  const handleHumanizeKeywords = async () => {
    if (!keywordsInput.trim()) return;

    setIsProcessingKeywords(true);
    try {
      const res = await processKeywordsHumanization(keywordsInput);
      setKeywordsResult(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessingKeywords(false);
    }
  };

  // Copy Content Handler
  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2200);
  };

  // Copy Keyword Variant Handler
  const handleCopyKeywordVariant = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeywordIdx(id);
    setTimeout(() => setCopiedKeywordIdx(null), 1800);
  };

  // Download Output as TXT
  const handleDownloadTxt = () => {
    if (!contentResult?.humanizedText) return;
    const element = document.createElement('a');
    const file = new Blob([contentResult.humanizedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'humanized-eeat-content.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleFaq = (idx: number) => {
    setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="w-full bg-slate-900 text-slate-100 min-h-screen">
      {/* Top Header Hero */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>E-E-A-T Friendly • 0% AI Detection • 2,000 Words Capacity</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Content Humanizer <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">(EEAT Friendly)</span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Transform robotic AI-generated drafts and rigid search terms into authentic, human-written copy. Engineered with organic burstiness, dynamic sentence variance, and natural tone to pass ZeroGPT, Turnitin, and Google’s Helpful Content system.
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex flex-row md:flex-col gap-3 shrink-0">
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center min-w-[130px]">
                <div className="text-2xl font-black text-emerald-400">0%</div>
                <div className="text-xs text-slate-400 font-medium">AI Detection Risk</div>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center min-w-[130px]">
                <div className="text-2xl font-black text-sky-400">2,000</div>
                <div className="text-xs text-slate-400 font-medium">Word Cap / Scan</div>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-8 flex border-b border-slate-800 gap-2">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 pb-3.5 px-4 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'content'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Content Humanization</span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Max 2,000 Words
              </span>
            </button>

            <button
              onClick={() => setActiveTab('keywords')}
              className={`flex items-center gap-2 pb-3.5 px-4 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'keywords'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Keywords Humanization</span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[11px] bg-sky-500/20 text-sky-300 border border-sky-500/30">
                10/10 Natural Rating
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ========================================================= */}
        {/* TAB 1: CONTENT HUMANIZATION                               */}
        {/* ========================================================= */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Control Strip */}
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold uppercase text-slate-300">Writing Tone:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700/60">
                    {(
                      [
                        { id: 'natural', label: 'Dynamic Natural' },
                        { id: 'executive', label: 'Executive Authority' },
                        { id: 'conversational', label: 'Conversational' },
                        { id: 'academic', label: 'Academic & Research' },
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          tone === t.id
                            ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-semibold uppercase text-slate-300">E-E-A-T Strictness:</span>
                  </div>
                  <button
                    onClick={() => setEeatStrictness(eeatStrictness === 'maximum' ? 'standard' : 'maximum')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      eeatStrictness === 'maximum'
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    {eeatStrictness === 'maximum' ? 'Maximum (Practitioner Proof)' : 'Standard Natural'}
                  </button>
                </div>
              </div>

              {/* Locked Keywords & Sample Loaders */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 w-full flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">Lock SEO Keywords:</span>
                  <input
                    type="text"
                    value={lockedKeywordsInput}
                    onChange={(e) => setLockedKeywordsInput(e.target.value)}
                    placeholder="e.g., brand name, core keywords (comma separated)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400">Load Sample:</span>
                  {SAMPLE_AI_DRAFTS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputText(sample.text);
                        setContentResult(null);
                        setContentError(null);
                      }}
                      className="px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                      title={sample.title}
                    >
                      Sample {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Word Limit Exceeded Alert Banner */}
            {isLimitExceeded && (
              <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-200 animate-pulse">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white">Word Limit Exceeded (Max 2,000 Words):</span> You have pasted{' '}
                    <strong className="text-red-300 underline">{currentWordCount.toLocaleString()} words</strong> ({wordsOverLimit.toLocaleString()} words over the 2,000 word ceiling).
                  </div>
                </div>
                <button
                  onClick={handleTrimToLimit}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold whitespace-nowrap shadow transition"
                >
                  Trim to 2,000 Words
                </button>
              </div>
            )}

            {/* Dual Column Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: AI Draft Input */}
              <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Raw AI Draft / Machine Text</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Word Counter */}
                    <div
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                        isLimitExceeded
                          ? 'bg-red-500/20 text-red-400 border-red-500/40 font-bold'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {currentWordCount.toLocaleString()} / {MAX_CONTENT_WORDS.toLocaleString()} words
                    </div>
                    <button
                      onClick={() => {
                        setInputText('');
                        setContentResult(null);
                      }}
                      className="text-slate-400 hover:text-red-400 transition"
                      title="Clear text"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Input Textarea */}
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your AI-generated text here (up to 2,000 words)..."
                  rows={14}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans resize-none"
                />

                {/* Detected AI Clichés Pill Display */}
                {detectedCliches.length > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
                      <span>Detected AI Machine Clichés ({detectedCliches.length}):</span>
                      <span className="text-slate-400 font-normal">Will be purged during humanization</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {detectedCliches.map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] bg-amber-500/20 text-amber-200 border border-amber-500/30 line-through"
                        >
                          "{c}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Run CTA Button */}
                <button
                  onClick={handleHumanizeContent}
                  disabled={isProcessingContent || isLimitExceeded || !inputText.trim()}
                  className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isLimitExceeded || !inputText.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : isProcessingContent
                      ? 'bg-emerald-600 text-white cursor-wait'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 hover:shadow-emerald-500/25'
                  }`}
                >
                  {isProcessingContent ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Humanizing Linguistic Cadence & E-E-A-T...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Humanize Content (0% AI Detection)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {contentError && (
                  <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                    {contentError}
                  </div>
                )}
              </div>

              {/* Right Column: Humanized Output */}
              <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Humanized E-E-A-T Output</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {contentResult && (
                      <>
                        <button
                          onClick={() => handleCopy(contentResult.humanizedText)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition"
                        >
                          {copiedContent ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleDownloadTxt}
                          className="p-1.5 text-slate-400 hover:text-slate-200 transition bg-slate-800 rounded-md border border-slate-700"
                          title="Download .txt"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Output Text Area */}
                {contentResult ? (
                  <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 text-sm text-slate-100 leading-relaxed font-sans h-[340px] overflow-y-auto whitespace-pre-wrap selection:bg-emerald-500 selection:text-slate-950">
                    {contentResult.humanizedText}
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center h-[340px] space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 border border-slate-700">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-semibold text-slate-300">Ready to Humanize</div>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Click the "Humanize Content" button to rewrite your AI text with variable perplexity, authentic human rhythm, and zero machine cliches.
                    </p>
                  </div>
                )}

                {/* Quality & Detection Score Cards */}
                {contentResult && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-emerald-500/20 text-center">
                      <div className="text-lg font-black text-emerald-400">{contentResult.aiDetectionProbability}%</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">AI Risk</div>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-emerald-500/20 text-center">
                      <div className="text-lg font-black text-emerald-400">{contentResult.humanScore}%</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Human Score</div>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-sky-500/20 text-center">
                      <div className="text-lg font-black text-sky-400">{contentResult.burstinessScore}/100</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Burstiness</div>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-purple-500/20 text-center">
                      <div className="text-lg font-black text-purple-400">{contentResult.humanizedWordCount}</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Word Count</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: KEYWORDS HUMANIZATION                             */}
        {/* ========================================================= */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-sky-400" />
                    <span>Robotic to Human Keyword Synthesizer</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Convert rigid, machine-generated keywords into 10/10 dynamic, conversational, and high-intent human queries.
                  </p>
                </div>

                <button
                  onClick={() => setKeywordsInput(SAMPLE_AI_KEYWORDS.join('\n'))}
                  className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 self-start sm:self-auto transition"
                >
                  Load Sample AI Keywords
                </button>
              </div>

              <textarea
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="Enter raw keywords or search terms (one per line or comma separated)..."
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />

              <button
                onClick={handleHumanizeKeywords}
                disabled={isProcessingKeywords || !keywordsInput.trim()}
                className={`py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isProcessingKeywords || !keywordsInput.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white'
                }`}
              >
                {isProcessingKeywords ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Natural Human Queries...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Humanize Keywords (10/10 Natural Rating)</span>
                  </>
                )}
              </button>
            </div>

            {/* Keywords Results Grid */}
            {keywordsResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{keywordsResult.totalProcessed} Keywords Humanized with 10/10 Natural Rating</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Average Authenticity: <strong className="text-emerald-400">{keywordsResult.avgNaturalScore}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {keywordsResult.keywords.map((kw, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-4 transition"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400">Original AI Query:</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-mono">
                            "{kw.original}"
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {kw.naturalScore} Human
                        </span>
                      </div>

                      {/* 4 Core Human Variants */}
                      <div className="space-y-2.5 text-xs">
                        {/* 1. Natural Google Search */}
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between group">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400">Natural Google Query</div>
                            <div className="text-slate-100 font-medium mt-0.5">{kw.naturalQuery}</div>
                          </div>
                          <button
                            onClick={() => handleCopyKeywordVariant(kw.naturalQuery, `${idx}-nat`)}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 transition"
                            title="Copy query"
                          >
                            {copiedKeywordIdx === `${idx}-nat` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* 2. Conversational / Voice / AI Prompt */}
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between group">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-sky-400">Answer Engine / Voice Query</div>
                            <div className="text-slate-100 font-medium mt-0.5">{kw.conversationalVoiceQuery}</div>
                          </div>
                          <button
                            onClick={() => handleCopyKeywordVariant(kw.conversationalVoiceQuery, `${idx}-voice`)}
                            className="p-1.5 text-slate-400 hover:text-sky-400 transition"
                            title="Copy voice query"
                          >
                            {copiedKeywordIdx === `${idx}-voice` ? (
                              <Check className="w-3.5 h-3.5 text-sky-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* 3. Commercial Evaluation Query */}
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between group">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-amber-400">Commercial Intent Query</div>
                            <div className="text-slate-100 font-medium mt-0.5">{kw.commercialIntentQuery}</div>
                          </div>
                          <button
                            onClick={() => handleCopyKeywordVariant(kw.commercialIntentQuery, `${idx}-comm`)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 transition"
                            title="Copy commercial query"
                          >
                            {copiedKeywordIdx === `${idx}-comm` ? (
                              <Check className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* 4. Pain-Point Long-Tail */}
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between group">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-purple-400">Pain-Point Friction Query</div>
                            <div className="text-slate-100 font-medium mt-0.5">{kw.painPointLongTail}</div>
                          </div>
                          <button
                            onClick={() => handleCopyKeywordVariant(kw.painPointLongTail, `${idx}-pain`)}
                            className="p-1.5 text-slate-400 hover:text-purple-400 transition"
                            title="Copy pain-point query"
                          >
                            {copiedKeywordIdx === `${idx}-pain` ? (
                              <Check className="w-3.5 h-3.5 text-purple-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Meta Footer */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Intent: <strong className="text-slate-200">{kw.searchIntent}</strong></span>
                        <span>Audience: <strong className="text-slate-200">{kw.targetAudience}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* COMPREHENSIVE E-E-A-T DOCUMENTATION & PAA / PAS SECTION   */}
        {/* ========================================================= */}
        <section className="bg-slate-850 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="border-b border-slate-800 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold uppercase mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Architectural Documentation & Research Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Content Humanization & AI Detection Mastery (2026 E-E-A-T Standard)
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Deep analytical breakdown of perplexity, burstiness, linguistic synthesis, and search engine compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Burstiness & Syntactic Variance</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Large language models predictably write sentences of nearly identical syllable and word lengths. Human writers naturally alternate short 4-word punches with multi-clause compound thoughts.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>E-E-A-T Practitioner Grounding</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Google’s Helpful Content system rewards direct, first-person practitioner insight and empirical proof while penalizing hollow passive summaries and rehashed machine generalities.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Keyword Preservation Guarantee</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlike generic online paraphrasers that scramble your hard-won SEO entities, our engine preserves exact technical, brand, and target commercial keywords without breaking syntax.
              </p>
            </div>
          </div>

          {/* People Also Ask & People Also Search For (PAS) Snippet-Optimized Accordion */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <span>Frequently Asked Questions & Search Answers (PAS / PAA)</span>
            </h3>

            {[
              {
                q: 'What is content humanization and how does it bypass AI detectors?',
                boldAnswer:
                  'Content humanization is the process of restructuring AI-generated text to eliminate machine syntax, increase burstiness, and inject authentic practitioner tone, ensuring 0% AI detection on ZeroGPT and Turnitin.',
                elaboration:
                  'AI detectors analyze two mathematical metrics: Perplexity (how surprising a word choice is) and Burstiness (variation in sentence lengths). LLMs naturally generate uniform, predictable text. Humanization disrupts these patterns through varied clause structures, idiomatic phrasing, active voice, and the elimination of repetitive transition words like "moreover" or "in conclusion".',
              },
              {
                q: 'Does Google penalize AI-generated content or lack of E-E-A-T?',
                boldAnswer:
                  'Google does not penalize content solely because it was written by AI; it penalizes unoriginal, low-effort content that lacks Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T).',
                elaboration:
                  'Google Search Central explicitly states that high-quality content is rewarded regardless of how it was produced. However, unedited AI content often fails because it hallucinates, lacks firsthand data, repeats generic summaries, and fails to satisfy transactional search intent.',
              },
              {
                q: 'How does Keyword Humanization differ from traditional keyword research?',
                boldAnswer:
                  'Keyword Humanization transforms rigid, robotic search terms into dynamic, conversational search phrases and voice prompts that match how real human buyers query Answer Engines.',
                elaboration:
                  'While legacy tools output static strings like "seo tool free", humanized keywords provide the exact phrasing spoken into Perplexity, Siri, and Google Search (e.g., "what is the best free SEO tool for small agencies without word limits?"), capturing high-converting long-tail traffic.',
              },
              {
                q: 'Why is there a strict 2,000 words limit per humanization cycle?',
                boldAnswer:
                  'The 2,000 words cap ensures maximum linguistic precision, deep syntactic restructuring, and zero hallucination risk, maintaining 100% human authenticity across every sentence.',
                elaboration:
                  'Bulk rewriters attempting 5,000+ words at once degrade into generic thesaurus replacements. Our 2,000-word limit guarantees complete grammatical perfection, active keyword locking, and optimal readability scores without degradation.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-slate-100 font-bold hover:text-emerald-400 transition"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  {faqOpen[idx] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {faqOpen[idx] && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-300 space-y-2 border-t border-slate-800/60 mt-2">
                    <p className="font-semibold text-emerald-300 leading-snug">
                      {faq.boldAnswer}
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      {faq.elaboration}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cross Links to other Flagship Solutions */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Related Flagship Solutions:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onNavigate('/tools/keyword-planner')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition"
              >
                AI Keyword Planner
              </button>
              <button
                onClick={() => onNavigate('/tools/site-comparison')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition"
              >
                Site Comparison Engine
              </button>
              <button
                onClick={() => onNavigate('/tools/sitemap-auditor')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition"
              >
                XML Sitemap Validator
              </button>
              <button
                onClick={() => onNavigate('/blog')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-400 transition"
              >
                Read EEAT Research Guides
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
