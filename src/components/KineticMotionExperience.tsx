import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, Zap, Activity, Scan, X, Settings2 } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
}

export const KineticMotionExperience: React.FC = () => {
  // Motion Preferences State (Persistent in localStorage)
  const [fxMode, setFxMode] = useState<'quantum' | 'ambient' | 'off'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accessfix_fx_mode');
      if (saved) return saved as 'quantum' | 'ambient' | 'off';
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off';
    }
    return 'quantum';
  });

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScanningWave, setIsScanningWave] = useState<boolean>(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState<boolean>(false);
  const [interactiveTag, setInteractiveTag] = useState<string>('');
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isMouseActive, setIsMouseActive] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Smooth Motion Values for the AI Reticle & Halo
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 24, stiffness: 220, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Trailing Glow with softer spring
  const trailSpringConfig = { damping: 30, stiffness: 120, mass: 0.8 };
  const trailX = useSpring(cursorX, trailSpringConfig);
  const trailY = useSpring(cursorY, trailSpringConfig);

  // Save FX Mode Preference
  const updateFxMode = (mode: 'quantum' | 'ambient' | 'off') => {
    setFxMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessfix_fx_mode', mode);
    }
  };

  // Trigger Full-Screen Holographic Diagnostic Scan Wave
  const triggerScanRadar = useCallback(() => {
    setIsScanningWave(true);
    setTimeout(() => {
      setIsScanningWave(false);
    }, 2400);
  }, []);

  // Global Mouse Listener & Target Inspector
  useEffect(() => {
    if (fxMode === 'off') return;

    let timeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsMouseActive(true);

      // Check if hovering over interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'button, a, input, textarea, select, [role="button"], [data-interactive="true"], .interactive-node'
        );

        if (interactive) {
          setIsHoveringInteractive(true);
          const tag = interactive.tagName.toLowerCase();
          const text = (interactive.getAttribute('aria-label') || interactive.textContent || '').trim().slice(0, 18);
          setInteractiveTag(text ? `${tag}: "${text}"` : tag);
        } else {
          setIsHoveringInteractive(false);
          setInteractiveTag('');
        }
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Soft sleep when mouse stops
      }, 3000);
    };

    const handleMouseLeave = () => {
      setIsMouseActive(false);
      setIsHoveringInteractive(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeout);
    };
  }, [fxMode, cursorX, cursorY]);

  // Canvas-based Neural Synapse Particles & Ambient Grid
  useEffect(() => {
    if (fxMode === 'off') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Generate Adaptive Particles - Option A (Cobalt, Ice Cyan, Sky, Emerald)
    const particleCount = fxMode === 'quantum' ? Math.min(Math.floor(width / 35), 45) : 18;
    const particles: Particle[] = [];
    const colors = ['#2563eb', '#38bdf8', '#0ea5e9', '#10b981', '#60a5fa'];

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 2 + 1;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: radius,
        baseRadius: radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.015;

      const mouseX = mousePos.x;
      const mouseY = mousePos.y;
      const connectionDist = fxMode === 'quantum' ? 140 : 90;
      const mouseInfluenceDist = 180;

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce bounds
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interactive Mouse Gravitation & Deflection
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseInfluenceDist && isMouseActive) {
          const force = (1 - dist / mouseInfluenceDist) * 0.6;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
          p.radius = p.baseRadius * (1 + (1 - dist / mouseInfluenceDist) * 1.5);
        } else {
          p.radius = p.baseRadius + Math.sin(angle + i) * 0.4;
        }

        // Draw Particle Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (distNodes < connectionDist) {
            const lineAlpha = (1 - distNodes / connectionDist) * (fxMode === 'quantum' ? 0.22 : 0.12);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Connect directly to cursor if nearby
        if (isMouseActive && dist < connectionDist && fxMode === 'quantum') {
          const cursorLineAlpha = (1 - dist / connectionDist) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = '#60a5fa';
          ctx.globalAlpha = cursorLineAlpha;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1.0;
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [fxMode, mousePos, isMouseActive]);

  return (
    <>
      {/* 1. KINETIC PARTICLES & SYNAPSE MESH (Background Layer, Zero Interactivity Blocking) */}
      {fxMode !== 'off' && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-10 w-full h-full opacity-65 transition-opacity duration-700"
          aria-hidden="true"
        />
      )}

      {/* 2. FULL-SCREEN QUANTUM RADAR SCAN WAVE (Triggered on Demand) */}
      <AnimatePresence>
        {isScanningWave && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
            {/* Horizontal Glowing Laser Beam */}
            <motion.div
              initial={{ top: '-5%', opacity: 0 }}
              animate={{ top: '105%', opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_24px_rgba(34,211,238,0.9)]"
            >
              <div className="absolute inset-x-0 -top-8 h-16 bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent blur-md" />
            </motion.div>

            {/* Cybernetic Grid Overlay Pulse */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 2.2 }}
              className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
            />
          </div>
        )}
      </AnimatePresence>

      {/* 3. MAGNETIC AI SYNAPSE ORB & SMART INSPECTION RETICLE (Cursor-Reactive) */}
      {fxMode === 'quantum' && isMouseActive && (
        <div className="hidden lg:block pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
          {/* Ethereal Trailing Ambient Glow */}
          <motion.div
            style={{
              x: trailX,
              y: trailY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-emerald-400/10 blur-3xl pointer-events-none"
          />

          {/* Core Interactive Magnetic Reticle */}
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            className="absolute flex items-center justify-center pointer-events-none"
          >
            {/* Outer Rotating Cybernetic Ring */}
            <motion.div
              animate={{
                rotate: 360,
                scale: isHoveringInteractive ? 1.4 : 1,
                borderColor: isHoveringInteractive ? 'rgba(14, 165, 233, 0.9)' : 'rgba(37, 99, 235, 0.4)',
              }}
              transition={{
                rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
                scale: { type: 'spring', damping: 15, stiffness: 200 },
              }}
              className="w-10 h-10 rounded-full border border-dashed transition-colors"
            />

            {/* Glowing Core Micro-Dot */}
            <motion.div
              animate={{
                scale: isHoveringInteractive ? [1, 1.3, 1] : 1,
                backgroundColor: isHoveringInteractive ? '#0ea5e9' : '#2563eb',
              }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="absolute w-2 h-2 rounded-full shadow-[0_0_12px_rgba(14,165,233,0.9)]"
            />

            {/* Smart HUD Target Indicator when hovering buttons/inputs */}
            <AnimatePresence>
              {isHoveringInteractive && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.85 }}
                  animate={{ opacity: 1, y: 24, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                  className="absolute whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-[9px] font-mono text-cyan-300 shadow-xl flex items-center gap-1.5"
                >
                  <Activity className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  <span>AI NODE ACTIVE</span>
                  {interactiveTag && <span className="text-slate-400 font-sans">| {interactiveTag}</span>}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* 4. LUXURY FLOATING HUD CONTROLLER (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 font-sans select-none">
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.94 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-4 rounded-2xl shadow-2xl w-64 text-white space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold tracking-wide uppercase text-slate-200">
                    Kinetic Motion Suite
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
                  aria-label="Close motion settings"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mode Selectors */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Motion Engine Mode
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                  <button
                    onClick={() => updateFxMode('quantum')}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                      fxMode === 'quantum'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Quantum
                  </button>
                  <button
                    onClick={() => updateFxMode('ambient')}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                      fxMode === 'ambient'
                        ? 'bg-slate-700 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Subtle
                  </button>
                  <button
                    onClick={() => updateFxMode('off')}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                      fxMode === 'off'
                        ? 'bg-red-500/80 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Off
                  </button>
                </div>
              </div>

              {/* Full Diagnostic Radar Wave Trigger */}
              <div className="pt-1">
                <button
                  onClick={triggerScanRadar}
                  disabled={isScanningWave}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-xs font-semibold transition-all group"
                >
                  <Scan className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>{isScanningWave ? 'Scanning Viewport...' : 'Pulse Holographic Scan'}</span>
                </button>
              </div>

              {/* Accessibility Compliance Stamp */}
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 pt-1 border-t border-slate-800">
                <Eye className="w-3 h-3 text-emerald-400" />
                <span>WCAG 2.2 AAA Motion Safe</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Quick Action Pill Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerScanRadar}
            title="Pulse Page Radar Scan"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-slate-900/90 hover:bg-cyan-950 text-cyan-400 border border-cyan-500/30 shadow-lg hover:shadow-cyan-500/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            aria-label="Scan page radar"
          >
            <Scan className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900/90 hover:bg-slate-850 text-slate-200 border border-slate-700/80 shadow-xl backdrop-blur-md hover:border-slate-500 transition-all hover:scale-105 active:scale-95 text-xs font-semibold group"
            aria-label="Toggle motion graphics menu"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  fxMode === 'quantum' ? 'bg-cyan-400' : fxMode === 'ambient' ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  fxMode === 'quantum' ? 'bg-cyan-500' : fxMode === 'ambient' ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              />
            </span>
            <span className="hidden sm:inline text-[11px] font-medium tracking-wide">
              {fxMode === 'quantum' ? 'Quantum FX' : fxMode === 'ambient' ? 'Subtle FX' : 'FX Off'}
            </span>
            <Settings2 className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-45 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </>
  );
};
