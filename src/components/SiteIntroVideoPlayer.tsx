import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  ShieldCheck,
  Bot,
  Search,
  Code2,
  Download,
  Film,
  CheckCircle2,
  Activity,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  FileCheck,
} from 'lucide-react';

interface Scene {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  category: string;
  description: string;
  accentColor: string;
  glowColor: string;
  metrics: { label: string; value: string; trend?: string }[];
  bgImage: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

const TOTAL_DURATION = 10.0; // 10 seconds intro reel

const SCENES: Scene[] = [
  {
    id: 1,
    category: 'PHASE 01 // 0.0s - 2.5s',
    title: 'Instant 40+ Point Architecture & Vitals Audit',
    subtitle: 'Real-Time DOM Diagnostics & Core Web Vitals Telemetry',
    badge: 'AUTOMATED ENGINE SCAN',
    description:
      'Scanning DOM nodes, Core Web Vitals (LCP, INP, CLS), color contrast, and heading hierarchies in under 1.8 seconds.',
    accentColor: '#0ea5e9', // Sky Blue
    glowColor: 'rgba(14, 165, 233, 0.35)',
    metrics: [
      { label: 'Health Score', value: '98/100', trend: '+14%' },
      { label: 'LCP Speed', value: '1.1s', trend: 'Good' },
      { label: 'INP Latency', value: '42ms', trend: 'Fast' },
      { label: 'WCAG AA', value: '100% Pass', trend: 'Compliant' },
    ],
    bgImage:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    icon: Activity,
    tags: ['Core Web Vitals', 'LCP < 2.5s', 'INP < 200ms', 'WCAG 2.2 AA'],
  },
  {
    id: 2,
    category: 'PHASE 02 // 2.5s - 5.0s',
    title: 'AI Crawler & Robots.txt Governance',
    subtitle: 'Bot Protection & LLM Indexation Management',
    badge: 'AI CRAWLER CONTROLLER',
    description:
      'Simulate and regulate GPTBot, ClaudeBot, Googlebot, and Perplexity under official RFC 9309 crawler standards.',
    accentColor: '#10b981', // Emerald
    glowColor: 'rgba(16, 185, 129, 0.35)',
    metrics: [
      { label: 'Bots Tracked', value: '18 Active', trend: 'Protected' },
      { label: 'RFC 9309', value: 'Valid', trend: '100%' },
      { label: 'Crawl Budget', value: '+45%', trend: 'Optimized' },
      { label: 'Cloudflare Bot', value: 'Synced', trend: 'Secure' },
    ],
    bgImage:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    icon: Bot,
    tags: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Robots.txt RFC 9309'],
  },
  {
    id: 3,
    category: 'PHASE 03 // 5.0s - 7.5s',
    title: 'Untapped Keywords & Opportunity Matrix',
    subtitle: 'Ahrefs-Grade Commercial Intent Keyword Intelligence',
    badge: 'UNTAPPED KEYWORD LAB',
    description:
      'Filter high search volume, low competition queries with high purchase intent that your direct market competitors missed.',
    accentColor: '#8b5cf6', // Violet
    glowColor: 'rgba(139, 92, 246, 0.35)',
    metrics: [
      { label: 'Untapped Queries', value: '2,480+', trend: 'Discovered' },
      { label: 'Avg Keyword Diff', value: 'KD 18', trend: 'Very Easy' },
      { label: 'Total Volume', value: '142K/mo', trend: 'High Growth' },
      { label: 'Commercial Intent', value: '78%', trend: 'High CTR' },
    ],
    bgImage:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    icon: TrendingUp,
    tags: ['Ahrefs-Grade Filters', 'Zero-KD Targets', 'Long-Tail Clusters', 'SERP Gap'],
  },
  {
    id: 4,
    category: 'PHASE 04 // 7.5s - 10.0s',
    title: 'Automated Code Fixes & 1-Click Reports',
    subtitle: 'Engineered TSX/HTML Snippets & Executive PDF Exports',
    badge: '1-CLICK REMEDIATION',
    description:
      'Instantly copy drop-in code fixes, inject Schema.org JSON-LD structured data, and download client-ready compliance reports.',
    accentColor: '#3b82f6', // Blue
    glowColor: 'rgba(59, 130, 246, 0.35)',
    metrics: [
      { label: 'Remediation', value: 'Instant', trend: 'Auto' },
      { label: 'Schema Types', value: '14 Models', trend: 'JSON-LD' },
      { label: 'Export Formats', value: 'PDF / JSON', trend: 'Ready' },
      { label: 'Dev Effort', value: '-85%', trend: 'Saved' },
    ],
    bgImage:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    icon: Code2,
    tags: ['Copy-Paste TSX', 'JSON-LD Schema', 'PDF Reports', 'Zero Dev Debt'],
  },
];

export const SiteIntroVideoPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Derive current scene index (0 to 3) based on 2.5s per scene
  const sceneDuration = TOTAL_DURATION / SCENES.length;
  const currentSceneIndex = Math.min(
    Math.floor(currentTime / sceneDuration),
    SCENES.length - 1
  );
  const currentScene = SCENES[currentSceneIndex];
  const sceneProgress = (currentTime % sceneDuration) / sceneDuration;

  // Sound Synthesizer via Web Audio API for cinematic UI sound design
  const playSoundEffect = useCallback(
    (type: 'whoosh' | 'chime' | 'pulse') => {
      if (isMuted) return;
      try {
        if (!audioContextRef.current) {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AudioCtx) {
            audioContextRef.current = new AudioCtx();
          }
        }
        const ctx = audioContextRef.current;
        if (!ctx) return;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        if (type === 'whoosh') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'chime') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
        } else {
          // pulse
          osc.type = 'sine';
          osc.frequency.setValueAtTime(80, now);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
        }
      } catch {
        // audio gracefully ignored if autoplay blocked
      }
    },
    [isMuted]
  );

  // Handle scene change sound triggers
  const prevSceneRef = useRef<number>(0);
  useEffect(() => {
    if (prevSceneRef.current !== currentSceneIndex) {
      prevSceneRef.current = currentSceneIndex;
      playSoundEffect('whoosh');
    }
  }, [currentSceneIndex, playSoundEffect]);

  // Main playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSec = ((timestamp - lastTimestampRef.current) / 1000) * playbackSpeed;
      lastTimestampRef.current = timestamp;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;
        if (next >= TOTAL_DURATION) {
          // Seamless 10-second loop
          return 0;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // High-DPI Canvas Rendering: Visualizer waves, animated digital particles, and HUD grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particleFrame: number;
    let tick = 0;

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; alpha: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.0015,
        speedY: (Math.random() - 0.5) * 0.0015,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    const render = () => {
      tick++;
      const width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 800);
      const height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 450);

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle isometric grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40 * window.devicePixelRatio;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw animated radar beam originating from center-right
      const centerX = width * 0.75;
      const centerY = height * 0.5;
      const angle = (tick * 0.03) % (Math.PI * 2);
      const radarRadius = Math.min(width, height) * 0.35;

      const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radarRadius);
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      gradient.addColorStop(0.7, 'rgba(14, 165, 233, 0.05)');
      gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radarRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Sweep line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * radarRadius,
        centerY + Math.sin(angle) * radarRadius
      );
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 3. Audio visualizer wave bar at bottom
      const bars = 48;
      const barWidth = (width * 0.5) / bars;
      const startX = width * 0.05;
      const baseY = height * 0.92;

      for (let i = 0; i < bars; i++) {
        const freq = Math.sin(tick * 0.08 + i * 0.25) * 0.5 + 0.5;
        const barHeight = (freq * 22 + 4) * window.devicePixelRatio;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(16, 185, 129, 0.7)';
        ctx.fillRect(startX + i * (barWidth + 2), baseY - barHeight, barWidth, barHeight);
      }

      // 4. Floating glowing particles
      particles.forEach((p) => {
        p.x = (p.x + p.speedX + 1) % 1;
        p.y = (p.y + p.speedY + 1) % 1;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.size * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 211, 252, ${p.alpha})`;
        ctx.fill();
      });

      particleFrame = requestAnimationFrame(render);
    };

    particleFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(particleFrame);
  }, []);

  // Format timecode: 00:04.2 / 00:10.0
  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const decis = Math.floor((seconds % 1) * 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${decis}`;
  };

  // Frame calculation for 60fps
  const currentFrame = Math.floor(currentTime * 60);
  const totalFrames = Math.floor(TOTAL_DURATION * 60);

  // Jump to specific scene
  const jumpToScene = (index: number) => {
    setCurrentTime(index * sceneDuration);
    playSoundEffect('whoosh');
  };

  // Fullscreen toggle
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

  // Export 10-second video simulation & download package
  const handleExportVideo = () => {
    setIsExporting(true);
    setExportProgress(10);
    const interval = setInterval(() => {
      setExportProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            // Trigger automatic metadata download/alert
            const videoData = {
              title: 'AccessFix AI - 10 Second Master Intro Reel',
              duration: '10.00s',
              fps: 60,
              resolution: '1920x1080 Full HD',
              scenes: SCENES.map((s) => ({
                id: s.id,
                timeRange: s.category,
                title: s.title,
                badge: s.badge,
              })),
              generatedAt: new Date().toISOString(),
            };
            const blob = new Blob([JSON.stringify(videoData, null, 2)], {
              type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'accessfix-intro-video-manifest.json';
            a.click();
            URL.revokeObjectURL(url);
          }, 400);
          return 100;
        }
        return p + 18;
      });
    }, 150);
  };

  const IconComponent = currentScene.icon;

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl transition-all duration-300 group"
      style={{
        boxShadow: `0 25px 50px -12px ${currentScene.glowColor}, 0 0 35px ${currentScene.glowColor}`,
      }}
    >
      {/* Top Professional Video Director Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-800/80 flex items-center justify-between z-20 relative text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-mono text-white font-black tracking-wider uppercase flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-blue-400" />
            <span>10S OFFICIAL INTRO REEL</span>
          </span>
          <span className="hidden sm:inline-block text-slate-500">•</span>
          <span className="hidden sm:inline-block font-mono text-[11px] text-slate-400">
            FHD 60FPS • PRO-RES 422
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Chapter Pills */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            {SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => jumpToScene(idx)}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  currentSceneIndex === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>

          <span className="font-mono text-[11px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-md">
            TIMECODE: {formatTimecode(currentTime)}
          </span>
        </div>
      </div>

      {/* Main Video Viewport (16:9 Aspect Ratio Container) */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#070b14] flex items-center justify-center">
        {/* Animated Background Canvas for Particles, Grid, Radar */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
        />

        {/* Dynamic Scene Background with Subtle Ken-Burns Zoom Effect */}
        <div
          key={currentScene.id}
          className="absolute inset-0 z-1 bg-cover bg-center transition-all duration-1000 transform scale-105 opacity-25 mix-blend-luminosity"
          style={{
            backgroundImage: `url(${currentScene.bgImage})`,
          }}
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 z-2 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-2 bg-radial from-transparent via-slate-950/30 to-slate-950/90 pointer-events-none" />

        {/* Video HUD Overlays */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex flex-wrap items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase border text-white shadow-lg flex items-center gap-1.5 backdrop-blur-md"
            style={{
              backgroundColor: `${currentScene.accentColor}25`,
              borderColor: currentScene.accentColor,
            }}
          >
            <IconComponent className="w-3.5 h-3.5" />
            <span>{currentScene.badge}</span>
          </span>

          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-slate-900/80 border border-slate-800">
            {currentScene.category}
          </span>
        </div>

        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 hidden sm:flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-400 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-lg">
            FRAME: {currentFrame} / {totalFrames}
          </span>
        </div>

        {/* Dynamic Center Visual Content Area */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl mb-1">
            <IconComponent
              className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-500 transform hover:scale-110"
              style={{ color: currentScene.accentColor }}
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {currentScene.title}
            </h3>
            <p
              className="text-xs sm:text-base font-bold transition-colors"
              style={{ color: currentScene.accentColor }}
            >
              {currentScene.subtitle}
            </p>
          </div>

          {/* Real-Time Telemetry / Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-xl mx-auto">
            {currentScene.metrics.map((m, i) => (
              <div
                key={i}
                className="bg-slate-900/85 backdrop-blur-md border border-slate-800/90 rounded-xl p-2 sm:p-2.5 text-center transform transition-all hover:border-slate-700"
              >
                <div className="text-[10px] text-slate-400 font-medium truncate">{m.label}</div>
                <div className="text-sm sm:text-base font-black text-white">{m.value}</div>
                {m.trend && (
                  <div
                    className="text-[9px] font-mono font-bold"
                    style={{ color: currentScene.accentColor }}
                  >
                    {m.trend}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Subtitle / Closed Caption (CC) Overlay */}
          {showCaptions && (
            <div className="pt-2">
              <div className="inline-block bg-black/80 backdrop-blur-md border border-slate-800/80 px-4 py-1.5 rounded-xl text-xs sm:text-sm text-slate-200 font-medium shadow-xl max-w-lg mx-auto">
                <span className="text-cyan-400 font-bold mr-1.5">CC:</span>
                {currentScene.description}
              </div>
            </div>
          )}
        </div>

        {/* Big Center Play/Pause Touch Overlay */}
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            playSoundEffect('pulse');
          }}
          aria-label={isPlaying ? 'Pause Intro Video' : 'Play Intro Video'}
          className={`absolute z-20 p-4 rounded-full bg-slate-900/70 border border-white/20 text-white backdrop-blur-md hover:bg-blue-600 transition-all duration-200 cursor-pointer ${
            isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100 scale-110'
          }`}
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
      </div>

      {/* Interactive Video Scrubber & Timeline Bar */}
      <div className="bg-slate-900/95 border-t border-slate-800/80 px-4 sm:px-6 py-3 space-y-2 relative z-20">
        {/* Timeline Slider with 4 Scene Chapter Notches */}
        <div className="relative w-full h-3 bg-slate-800 rounded-full cursor-pointer overflow-hidden flex items-center">
          {/* Chapter background markers */}
          <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
            <div className="border-r border-slate-700/60" />
            <div className="border-r border-slate-700/60" />
            <div className="border-r border-slate-700/60" />
            <div />
          </div>

          {/* Active progress fill */}
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-500 transition-all duration-75 relative rounded-full"
            style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-lg" />
          </div>

          {/* Native clickable range input */}
          <input
            type="range"
            min="0"
            max={TOTAL_DURATION}
            step="0.05"
            value={currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Seek Video Timeline"
          />
        </div>

        {/* Video Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                playSoundEffect('pulse');
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            {/* Restart Button */}
            <button
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(true);
                playSoundEffect('whoosh');
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Restart 10s Reel"
              aria-label="Restart 10s Reel"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Sound Mute/Unmute */}
            <button
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (!nextMuted) playSoundEffect('chime');
              }}
              className={`p-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
                isMuted
                  ? 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  : 'bg-blue-600/30 border border-blue-500 text-blue-400 font-bold'
              }`}
              title={isMuted ? 'Unmute Cinematic Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio On'}</span>
            </button>

            {/* Subtitles CC Toggle */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`px-2.5 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-colors cursor-pointer ${
                showCaptions
                  ? 'bg-emerald-950/60 border border-emerald-600 text-emerald-400'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle Captions"
            >
              CC
            </button>

            {/* Speed Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-xl text-[11px]">
              {[0.5, 1, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                    playbackSpeed === speed
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Export / Download Video Simulation */}
            <button
              onClick={handleExportVideo}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-all cursor-pointer disabled:opacity-50"
              title="Export 10-Second Reel Manifest"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>{isExporting ? `Exporting ${exportProgress}%` : 'Download Reel'}</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Toggle Fullscreen"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
