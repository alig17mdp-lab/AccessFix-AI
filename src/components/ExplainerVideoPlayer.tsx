import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowRight,
  Terminal,
  Code2,
  Layers,
  Lock,
  Coins,
  Glasses,
  Move3d,
  DollarSign,
  Box,
  Network,
  FileCode,
  Bot,
  Building2,
  Mic,
  ShieldAlert,
} from 'lucide-react';

export interface VideoChapter {
  startSec: number;
  endSec: number;
  label: string;
  badge: string;
  badgeColor: string;
  headline: string;
  subtext: string;
  codeSnippet?: string;
  metricLabel?: string;
  metricValue?: string;
}

export interface VideoKeywordData {
  primaryKeyword: string;
  seedKeyword: string;
  shortTailVariants: string[];
  longTailVariants: string[];
  untappedKeywords: string[];
  problemSummary: string;
  solutionSummary: string;
  actionGuide: string[];
}

interface ExplainerVideoPlayerProps {
  toolType: 'mcp' | 'c2pa' | 'x402' | 'spatial' | 'geo' | 'aitxt' | 'aisearch' | 'voiceschema' | 'brandkg' | 'disavow';
  title: string;
  subtitle: string;
  chapters: VideoChapter[];
  keywords: VideoKeywordData;
  accentColor: 'indigo' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'rose';
}

export const ExplainerVideoPlayer: React.FC<ExplainerVideoPlayerProps> = ({
  toolType,
  title,
  subtitle,
  chapters,
  keywords,
  accentColor,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'transcript'>('overview');
  
  const timerRef = useRef<number | null>(null);
  const TOTAL_DURATION = 10.0; // 10.0 seconds strict duration

  // Web Audio chime generator for interactive polish
  const playAudioCue = (frequency: number, type: OscillatorType = 'sine', duration: number = 0.15) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 50;
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + (intervalMs / 1000) * playbackSpeed;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            playAudioCue(659.25, 'triangle', 0.25); // completion chime
            return TOTAL_DURATION;
          }
          return next;
        });
      }, intervalMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, isMuted]);

  const togglePlay = () => {
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
      setIsPlaying(true);
      playAudioCue(440, 'sine', 0.1);
    } else {
      setIsPlaying(!isPlaying);
      playAudioCue(isPlaying ? 330 : 523.25, 'sine', 0.1);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    playAudioCue(587.33, 'sine', 0.15);
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(Math.min(Math.max(newTime, 0), TOTAL_DURATION));
    playAudioCue(440, 'sine', 0.05);
  };

  // Active chapter determination
  const currentChapterIndex = chapters.findIndex(
    (c) => currentTime >= c.startSec && currentTime < c.endSec
  );
  const activeChapter = chapters[currentChapterIndex !== -1 ? currentChapterIndex : chapters.length - 1];

  const progressPercent = (currentTime / TOTAL_DURATION) * 100;
  const isIndigo = accentColor === 'indigo';
  const isEmerald = accentColor === 'emerald';
  const isAmber = accentColor === 'amber';
  const isPurple = accentColor === 'purple';
  const isCyan = accentColor === 'cyan';
  const isRose = accentColor === 'rose';

  const getAccentBtnActive = () => {
    if (isIndigo) return 'bg-indigo-600 text-white shadow-sm';
    if (isEmerald) return 'bg-emerald-600 text-white shadow-sm';
    if (isAmber) return 'bg-amber-600 text-white shadow-sm';
    if (isPurple) return 'bg-purple-600 text-white shadow-sm';
    if (isCyan) return 'bg-cyan-600 text-white shadow-sm';
    return 'bg-rose-600 text-white shadow-sm';
  };

  const getAccentGlow = () => {
    if (isIndigo) return 'bg-indigo-500/20';
    if (isEmerald) return 'bg-emerald-500/20';
    if (isAmber) return 'bg-amber-500/20';
    if (isPurple) return 'bg-purple-500/20';
    if (isCyan) return 'bg-cyan-500/20';
    return 'bg-rose-500/20';
  };

  const getAccentBadge = () => {
    if (isIndigo) return 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300';
    if (isEmerald) return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300';
    if (isAmber) return 'bg-amber-500/20 border-amber-500/40 text-amber-300';
    if (isPurple) return 'bg-purple-500/20 border-purple-500/40 text-purple-300';
    if (isCyan) return 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300';
    return 'bg-rose-500/20 border-rose-500/40 text-rose-300';
  };

  const getProgressBarColor = () => {
    if (currentTime < 3.5) return 'bg-rose-500';
    if (currentTime < 7.0) {
      if (isIndigo) return 'bg-indigo-500';
      if (isEmerald) return 'bg-emerald-500';
      if (isAmber) return 'bg-amber-500';
      if (isPurple) return 'bg-purple-500';
      if (isCyan) return 'bg-cyan-500';
      return 'bg-rose-500';
    }
    return 'bg-teal-400';
  };

  const getPlayBtnStyle = () => {
    if (isPlaying) return 'bg-slate-800 hover:bg-slate-700 text-slate-200';
    if (isIndigo) return 'bg-indigo-600 hover:bg-indigo-500';
    if (isEmerald) return 'bg-emerald-600 hover:bg-emerald-500';
    if (isAmber) return 'bg-amber-600 hover:bg-amber-500';
    if (isPurple) return 'bg-purple-600 hover:bg-purple-500';
    if (isCyan) return 'bg-cyan-600 hover:bg-cyan-500';
    return 'bg-rose-600 hover:bg-rose-500';
  };

  const getTabActiveStyle = (tab: 'overview' | 'keywords' | 'transcript') => {
    if (activeTab !== tab) return 'text-slate-400 hover:text-slate-200 hover:bg-slate-900';
    if (isIndigo) return 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40';
    if (isEmerald) return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    if (isAmber) return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
    if (isPurple) return 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
    if (isCyan) return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
    return 'bg-rose-500/20 text-rose-300 border border-rose-500/40';
  };

  return (
    <section className="mb-10 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden">
      {/* Video Player Header Bar */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>10-Sec Interactive Masterclass</span>
          </div>
          <h2 className="text-xs sm:text-sm font-semibold text-white tracking-tight">
            {title}
          </h2>
        </div>

        {/* Quick Chapter Navigation Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {chapters.map((chap, idx) => {
            const isChapActive = currentChapterIndex === idx;
            return (
              <button
                key={chap.label}
                onClick={() => handleSeek(chap.startSec)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  isChapActive
                    ? getAccentBtnActive()
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{`0:0${chap.startSec}`}</span>
                <span className="hidden sm:inline">{chap.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 16:9 Interactive Kinetic Stage */}
      <div className="relative aspect-video max-h-[380px] w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between p-5 sm:p-7 overflow-hidden select-none">
        {/* Background Decorative Grid and Glowing Orbs */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div
          className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            currentTime < 3.5
              ? 'bg-rose-500/15'
              : currentTime < 7.0
              ? getAccentGlow()
              : 'bg-teal-500/20'
          }`}
        ></div>

        {/* Top Overlay: Stage Timecode & Category Pill */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border shadow-sm ${activeChapter.badgeColor}`}
            >
              {activeChapter.badge}
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
              00:{currentTime < 10 ? `0${Math.floor(currentTime)}` : '10'} / 00:10
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono">
            {toolType === 'mcp' && (
              <span className="flex items-center gap-1.5 text-indigo-300">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Protocol: MCP v2026.1</span>
              </span>
            )}
            {toolType === 'c2pa' && (
              <span className="flex items-center gap-1.5 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Standard: C2PA v2.1 (ES256)</span>
              </span>
            )}
            {toolType === 'x402' && (
              <span className="flex items-center gap-1.5 text-amber-300">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Protocol: HTTP 402 / x402 Micropayments</span>
              </span>
            )}
            {toolType === 'spatial' && (
              <span className="flex items-center gap-1.5 text-purple-300">
                <Glasses className="w-3.5 h-3.5 text-purple-400" />
                <span>Standard: W3C WebSpatial & WebXR 3D</span>
              </span>
            )}
            {toolType === 'geo' && (
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                <span>Standard: ISO 24617 / Schema.org Graph</span>
              </span>
            )}
            {toolType === 'aitxt' && (
              <span className="flex items-center gap-1.5 text-rose-300">
                <FileCode className="w-3.5 h-3.5 text-rose-400" />
                <span>Protocol: ai.txt / W3C Machine Permissions</span>
              </span>
            )}
            {toolType === 'aisearch' && (
              <span className="flex items-center gap-1.5 text-indigo-300">
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                <span>Standard: RAG Cross-Encoder / Top-3 Citations</span>
              </span>
            )}
            {toolType === 'voiceschema' && (
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Standard: Schema.org SpeakableSpecification</span>
              </span>
            )}
            {toolType === 'brandkg' && (
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Standard: ISO 24617 / Wikidata Knowledge Graph</span>
              </span>
            )}
            {toolType === 'disavow' && (
              <span className="flex items-center gap-1.5 text-rose-300">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Standard: Google Search Console Disavow Protocol</span>
              </span>
            )}
          </div>
        </div>

        {/* Center Stage: Dynamic Animated Problem/Solution Canvas */}
        <div className="relative z-10 my-auto py-2">
          {currentTime < 3.5 ? (
            /* STAGE 1: THE PROBLEM (0:00 - 0:03.5) */
            <div className="max-w-2xl mx-auto text-center space-y-3 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                <span>The Invisible Problem</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                {activeChapter.headline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                {activeChapter.subtext}
              </p>

              {/* Animated Failure Diagnostic Box */}
              <div className="bg-slate-950/90 border border-rose-500/30 rounded-xl p-3 max-w-lg mx-auto font-mono text-left text-[11px] sm:text-xs text-rose-300/90 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2 overflow-hidden truncate">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                  <span className="truncate">{activeChapter.codeSnippet}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-bold shrink-0 text-[10px]">
                  REJECTED
                </span>
              </div>
            </div>
          ) : currentTime < 7.0 ? (
            /* STAGE 2: THE SOLUTION (0:03.5 - 0:07.0) */
            <div className="max-w-2xl mx-auto text-center space-y-3 animate-fadeIn">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getAccentBadge()}`}
              >
                <Zap className="w-3.5 h-3.5 animate-pulse" />
                <span>The Automated Solution</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                {activeChapter.headline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                {activeChapter.subtext}
              </p>

              {/* Animated Active Synthesis Box */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 max-w-lg mx-auto font-mono text-left text-[11px] sm:text-xs text-slate-200 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2 overflow-hidden truncate">
                  {toolType === 'mcp' && <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                  {toolType === 'c2pa' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  {toolType === 'x402' && <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  {toolType === 'spatial' && <Move3d className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                  {toolType === 'geo' && <Network className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  {toolType === 'aitxt' && <FileCode className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                  {toolType === 'aisearch' && <Bot className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                  {toolType === 'voiceschema' && <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  {toolType === 'brandkg' && <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  {toolType === 'disavow' && <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                  <span
                    className={`truncate font-medium ${
                      isIndigo
                        ? 'text-emerald-400'
                        : isEmerald
                        ? 'text-emerald-400'
                        : isAmber
                        ? 'text-amber-300'
                        : isPurple
                        ? 'text-purple-300'
                        : isCyan
                        ? 'text-cyan-300'
                        : 'text-rose-300'
                    }`}
                  >
                    {activeChapter.codeSnippet}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 pl-2">
                  {toolType === 'x402'
                    ? '28ms Settled'
                    : toolType === 'spatial'
                    ? 'WebXR 60fps'
                    : toolType === 'geo'
                    ? 'Triples Verified'
                    : toolType === 'aitxt'
                    ? 'Directives Live'
                    : toolType === 'aisearch'
                    ? 'Top-3 Sourced'
                    : toolType === 'voiceschema'
                    ? 'TTS Speakable'
                    : toolType === 'brandkg'
                    ? 'Wikidata QID Grounded'
                    : toolType === 'disavow'
                    ? 'Google Disavow Formatted'
                    : 'sub-120ms'}
                </span>
              </div>
            </div>
          ) : (
            /* STAGE 3: THE RESULT & ONE-CLICK EXPORT (0:07.0 - 0:10.0) */
            <div className="max-w-2xl mx-auto text-center space-y-3 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Verified Compliance Ready</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                {activeChapter.headline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                {activeChapter.subtext}
              </p>

              {/* Outcome Badge Strip */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-teal-500/40 text-teal-300 text-xs font-bold font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>{activeChapter.metricLabel}: {activeChapter.metricValue}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono">
                  <Code2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>1-Click Production Download</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Stage Controls Bar */}
        <div className="relative z-10 space-y-2 pt-2">
          {/* Interactive Progress Bar Scrubber with Chapter Dividers */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = clickX / rect.width;
              handleSeek(ratio * TOTAL_DURATION);
            }}
            className="group relative h-2.5 w-full bg-slate-950/80 rounded-full overflow-hidden cursor-pointer border border-slate-800"
          >
            {/* Filled Progress Bar */}
            <div
              className={`h-full transition-all duration-100 ease-linear rounded-full ${getProgressBarColor()}`}
              style={{ width: `${progressPercent}%` }}
            ></div>

            {/* Chapter Break Markers */}
            <div className="absolute top-0 bottom-0 left-[35%] w-0.5 bg-slate-700/80 pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 left-[70%] w-0.5 bg-slate-700/80 pointer-events-none"></div>
          </div>

          {/* Control Buttons Strip */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className={`p-2 rounded-lg font-bold text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5 ${getPlayBtnStyle()}`}
                title={isPlaying ? 'Pause Video' : 'Play 10s Video'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play Video'}</span>
              </button>

              <button
                onClick={handleRestart}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Restart from beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Cues' : 'Mute Cues'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                {currentTime.toFixed(1)}s / 10.0s
              </span>
            </div>

            {/* Playback Speed Pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950/70 p-0.5 rounded-lg border border-slate-800">
                {[1, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      playbackSpeed === spd
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KEYWORD-BASED DESCRIPTION & PROBLEM-SOLUTION BREAKDOWN DIRECTLY UNDER VIDEO */}
      <div className="p-5 sm:p-6 bg-slate-950 border-t border-slate-800/80">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800/80 mb-5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${getTabActiveStyle('overview')}`}
          >
            Problem & Solution Overview
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${getTabActiveStyle('keywords')}`}
          >
            Target Keyword Density Matrix
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${getTabActiveStyle('transcript')}`}
          >
            10-Sec Video Script
          </button>
        </div>

        {/* Tab 1: Problem & Solution Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Problem Column */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wide">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>The Critical Failure (0:00 – 0:03)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {keywords.problemSummary}
                </p>
              </div>

              {/* Solution Column */}
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  isIndigo
                    ? 'bg-indigo-950/20 border-indigo-500/20'
                    : isEmerald
                    ? 'bg-emerald-950/20 border-emerald-500/20'
                    : isAmber
                    ? 'bg-amber-950/20 border-amber-500/20'
                    : 'bg-purple-950/20 border-purple-500/20'
                }`}
              >
                <div
                  className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wide ${
                    isIndigo
                      ? 'text-indigo-400'
                      : isEmerald
                      ? 'text-emerald-400'
                      : isAmber
                      ? 'text-amber-400'
                      : 'text-purple-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>The Engineered Solution (0:04 – 0:10)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {keywords.solutionSummary}
                </p>
              </div>
            </div>

            {/* Step-by-Step Action Guide */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-200 mb-2.5 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span>Three-Step Execution Workflow (How to Use This Tool):</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {keywords.actionGuide.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1"
                  >
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">
                      STEP 0{idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Target Keyword Density Matrix */}
        {activeTab === 'keywords' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              This interactive video and utility are mathematically calibrated for the following semantic search terms to capture both human and autonomous agent search engine volume:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Seed Keyword */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Seed Entity Phrase
                </span>
                <span className="inline-block px-2.5 py-1 rounded-md bg-slate-800 text-white font-mono text-xs font-semibold">
                  {keywords.seedKeyword}
                </span>
              </div>

              {/* Primary Target Keyword */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Primary Target (1.4% Density)
                </span>
                <span
                  className={`inline-block px-2.5 py-1 rounded-md font-mono text-xs font-semibold ${
                    isIndigo
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      : isEmerald
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : isAmber
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-purple-950 text-purple-300 border border-purple-800'
                  }`}
                >
                  {keywords.primaryKeyword}
                </span>
              </div>

              {/* Short-Tail Variants */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Short-Tail Variants
                </span>
                <div className="flex flex-wrap gap-1">
                  {keywords.shortTailVariants.map((st) => (
                    <span
                      key={st}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              {/* Long-Tail Variants */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Long-Tail User Intent
                </span>
                <div className="flex flex-wrap gap-1">
                  {keywords.longTailVariants.map((lt) => (
                    <span
                      key={lt}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono"
                    >
                      {lt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Untapped Low-Volume / High-Potential Keywords */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-amber-500/20 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>2026–2035 Untapped High-Growth Keywords (Low Competition / High Future Yield)</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {keywords.untappedKeywords.map((uk) => (
                  <span
                    key={uk}
                    className="px-2.5 py-1 rounded-md bg-amber-950/40 text-amber-200 border border-amber-500/30 text-xs font-mono font-medium"
                  >
                    {uk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 10-Sec Video Script */}
        {activeTab === 'transcript' && (
          <div className="space-y-3">
            <div className="space-y-2">
              {chapters.map((chap, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSeek(chap.startSec)}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-4 cursor-pointer transition-all ${
                    currentChapterIndex === idx
                      ? isIndigo
                        ? 'bg-indigo-950/40 border-indigo-500/50'
                        : isEmerald
                        ? 'bg-emerald-950/40 border-emerald-500/50'
                        : isAmber
                        ? 'bg-amber-950/40 border-amber-500/50'
                        : 'bg-purple-950/40 border-purple-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {`0:0${chap.startSec} – 0:0${chap.endSec}`}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${chap.badgeColor}`}>
                        {chap.badge}
                      </span>
                      <h4 className="text-xs font-bold text-white">{chap.headline}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-6">{chap.subtext}</p>
                  </div>
                  <button className="text-xs text-slate-400 hover:text-white shrink-0 mt-1">
                    Jump to time
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
