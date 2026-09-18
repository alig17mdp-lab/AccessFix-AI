import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Target,
  Search,
  Zap,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface VideoScene {
  id: number;
  timeRange: string;
  phaseLabel: string;
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  accentColor: string;
  bgGradient: string;
  radarStatus: string;
  simulationStep: 'radar' | 'precision' | 'position0';
}

const TOTAL_DURATION = 10.0;

const SCENES: VideoScene[] = [
  {
    id: 1,
    timeRange: '0.0s – 3.5s',
    phaseLabel: 'PHASE 01 // FIRST-50-WORDS RADAR',
    title: '50-Word Boundary Scan & Ingestion',
    subtitle: 'Googlebot indexes the opening 50 words to evaluate snippet eligibility',
    metric: '48 Words',
    metricLabel: 'Opening Window',
    accentColor: '#38bdf8', // Sky
    bgGradient: 'from-sky-950 via-slate-900 to-indigo-950',
    radarStatus: 'Scanning DOM Opening Nodes...',
    simulationStep: 'radar',
  },
  {
    id: 2,
    timeRange: '3.5s – 7.0s',
    phaseLabel: 'PHASE 02 // SINGLE-ANSWER PRECISION',
    title: '< 25 Words Direct Answer Verification',
    subtitle: 'Algorithm flags excessive fluff; verifies bold anchor + factual clarity',
    metric: '21 Words',
    metricLabel: 'Answer Precision (<25 Max)',
    accentColor: '#10b981', // Emerald
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    radarStatus: 'Validating Factual Truth Density...',
    simulationStep: 'precision',
  },
  {
    id: 3,
    timeRange: '7.0s – 10.0s',
    phaseLabel: 'PHASE 03 // POSITION 0 SNIPER',
    title: 'Featured Snippet & AI Overview Snipe',
    subtitle: 'Page catapulted to Google Position 0 with Micro-Table + Speakable Schema',
    metric: 'Pos #0',
    metricLabel: 'Featured Snippet Won',
    accentColor: '#f59e0b', // Amber
    bgGradient: 'from-amber-950 via-slate-900 to-orange-950',
    radarStatus: 'Catapulting to Page 1 Snippet #0!',
    simulationStep: 'position0',
  },
];

export const SingleAnswerVideoExplainer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Derive active scene
  const currentSceneIndex =
    currentTime < 3.5 ? 0 : currentTime < 7.0 ? 1 : 2;
  const currentScene = SCENES[currentSceneIndex];

  // Web Audio tone generator for tech cues
  const playTechBeep = (freq: number) => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio fallback
    }
  };

  // Playhead loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.1;
        if (next >= TOTAL_DURATION) {
          playTechBeep(640);
          return 0; // Seamless loop
        }
        // Scene switch beeps
        if (Math.abs(next - 3.5) < 0.1) playTechBeep(520);
        if (Math.abs(next - 7.0) < 0.1) playTechBeep(780);
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isMuted]);

  const togglePlay = () => setIsPlaying((p) => !p);
  const toggleMute = () => setIsMuted((m) => !m);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const progressPercent = Math.min(100, (currentTime / TOTAL_DURATION) * 100);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-950 text-white shadow-2xl transition-all select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full aspect-video min-h-[360px]'
      }`}
    >
      {/* Background Dynamic Gradients & Scanlines */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentScene.bgGradient} transition-all duration-700 opacity-90`}
      />
      {/* High-tech Radar Gridlines */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)]"
        style={{ backgroundSize: '24px 24px' }}
      />
      {/* Scanning Horizontal Laser Beam */}
      <div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse pointer-events-none transition-all duration-300"
        style={{ top: `${(currentTime * 10) % 100}%` }}
      />

      {/* Top HUD Header Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-5 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/80 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            10s Reel
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-[10px] sm:text-xs font-mono font-bold">
            {currentScene.phaseLabel}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Cinematic Visual Stage */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 py-16 z-10">
        <div className="max-w-xl space-y-3">
          {/* Phase Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 border border-slate-700/80 backdrop-blur-md text-[11px] font-mono text-cyan-300 font-bold">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>{currentScene.radarStatus}</span>
          </div>

          {/* Scene Title */}
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            {currentScene.title}
          </h3>

          {/* Scene Subtitle */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-lg">
            {currentScene.subtitle}
          </p>

          {/* Interactive Visual Demonstration Card */}
          <div className="pt-2">
            {currentScene.simulationStep === 'radar' && (
              <div className="bg-slate-900/90 border border-sky-500/40 rounded-2xl p-4 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-sky-400">
                  <span>[RADAR: 50-WORD VIEWPORT SCAN]</span>
                  <span className="text-white font-bold">Word 0 → 50</span>
                </div>
                <p className="text-xs text-slate-300 font-serif leading-relaxed line-clamp-2">
                  <span className="font-bold text-sky-300 bg-sky-950/70 px-1 rounded">
                    WCAG 2.2 Level AA mandates
                  </span>{' '}
                  a minimum 4.5:1 contrast ratio for regular body text, ensuring disabled users can read web copy effortlessly...
                </p>
                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Target Entity Detected in Opening 12 Words</span>
                </div>
              </div>
            )}

            {currentScene.simulationStep === 'precision' && (
              <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span>[PRECISION TEST: &lt; 25 WORDS CRITERIA]</span>
                  <span className="text-emerald-300 font-bold font-mono">21 / 25 Words (PASS)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white leading-snug">
                  <strong className="text-emerald-300">Single-Answer Precision</strong> delivers the core factual definition in under 25 words with an immediate bold anchor for Googlebot ingestion.
                </div>
                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>0% Boilerplate Fluff Detected • 100% Snippet Ready</span>
                </div>
              </div>
            )}

            {currentScene.simulationStep === 'position0' && (
              <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
                  <span>[SERP RESULT: FEATURED SNIPPET #0 WON]</span>
                  <span className="text-amber-300 font-bold font-mono">Page 1 • Position 0</span>
                </div>
                <div className="bg-black/60 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>accessfix.ai &gt; blog &gt; single-answer-precision</span>
                  </div>
                  <div className="text-xs font-bold text-sky-400 leading-snug">
                    Featured Snippet from the Web
                  </div>
                  <div className="text-[11px] text-slate-200 leading-tight">
                    <strong>Single-Answer Precision</strong> is an AEO strategy positioning a &lt;25-word direct answer in the first 50 words...
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Metric Float Widget */}
        <div className="hidden md:flex absolute right-8 bottom-20 flex-col items-center justify-center p-4 rounded-2xl bg-black/70 border border-slate-700/80 backdrop-blur-md space-y-1 text-center min-w-[140px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {currentScene.metricLabel}
          </span>
          <span
            className="text-2xl lg:text-3xl font-black"
            style={{ color: currentScene.accentColor }}
          >
            {currentScene.metric}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>Optimal Range</span>
          </div>
        </div>
      </div>

      {/* Bottom Timeline & Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-2">
        {/* Scrubber Bar */}
        <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden relative cursor-pointer">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: currentScene.accentColor,
            }}
          />
        </div>

        {/* Control Buttons & Timestamps */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-7 h-7 rounded-full bg-white text-slate-950 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
            </button>
            <button
              onClick={() => setCurrentTime(0)}
              className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              title="Restart 10s Video"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <span className="font-mono text-[11px] text-slate-300">
              00:{currentTime < 10 ? `0${currentTime.toFixed(1)}` : currentTime.toFixed(1)} / 00:10.0
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>AEO / GEO ALGORITHM SPEED</span>
            <span className="text-emerald-400 font-bold">• 100% AUTOMATED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
