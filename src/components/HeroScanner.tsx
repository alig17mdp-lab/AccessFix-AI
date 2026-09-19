import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  Layers,
  Code,
  Zap,
  Activity,
  Search,
  FileText,
  Flame,
  Film,
} from 'lucide-react';
import { ScanResult, UnifiedHealthScan } from '../types';
import { executeUniversalHealthScan } from '../utils/clientHealthScanner';
import { SiteIntroVideoPlayer } from './SiteIntroVideoPlayer';

interface HeroScannerProps {
  onScanComplete: (result: ScanResult, unifiedResult?: UnifiedHealthScan) => void;
  onViewSample: () => void;
  onNavigate?: (route: string) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HeroScanner: React.FC<HeroScannerProps> = ({
  onScanComplete,
  onViewSample,
  onNavigate,
  isLoading,
  setIsLoading,
}) => {
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [scanStep, setScanStep] = useState<number>(0);

  const steps = [
    'Connecting to website host & verifying SSL...',
    'Crawling DOM structure & semantic hierarchy...',
    'Evaluating 40+ WCAG 2.1 AA accessibility rules...',
    'Auditing On-Page SEO, OpenGraph & Schema markup...',
    'Measuring Core Web Vitals & server response speed...',
    'Synthesizing Impact × Effort Priority Action Matrix...',
  ];

  const handleScanSubmit = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const target = (customUrl || url).trim();

    if (!target) {
      setErrorMessage('Please enter a website URL to begin the comprehensive health audit.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setScanStep(0);

    // Dynamic progress states
    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 550);

    try {
      // Execute robust real-time multi-pillar health scan (dual server + CORS proxy + client DOM engine)
      const unifiedResult = await executeUniversalHealthScan(target);

      clearInterval(stepInterval);
      setScanStep(steps.length - 1);

      setTimeout(() => {
        setIsLoading(false);
        onScanComplete(unifiedResult.accessibilityScan, unifiedResult);
      }, 350);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsLoading(false);
      setErrorMessage(
        err.message || 'Scan could not be completed. Please ensure the domain name is valid.'
      );
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-18 lg:pb-24 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/70 to-[#f8fafc] border-b border-slate-200/80">
      {/* Ambient background soft light spot */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-400/10 via-cyan-400/10 to-indigo-400/5 blur-3xl pointer-events-none rounded-full" />
      {/* Subtle Floating Ambient Badges (Kinetic Motion Accent) */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden xl:flex absolute left-8 top-28 items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a0f1d] text-white shadow-xl backdrop-blur-md border border-slate-800 text-[11px] font-semibold"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>WCAG 2.2 AAA Ready</span>
      </motion.div>

      {/* Floating Top-Right Bold Blinking Advertisement Card for Single-Answer Precision Optimizer */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden lg:flex absolute right-4 xl:right-10 top-16 z-30 max-w-xs xl:max-w-sm"
      >
        <div className="relative group p-[2px] rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all">
          <div className="bg-[#0b1329] border border-emerald-500/40 rounded-[22px] p-4 text-white space-y-2.5 backdrop-blur-xl">
            {/* Blinking Ad Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>HOT AD • NEW AEO TOOL</span>
              </div>
            </div>

            {/* Bold Headline & Catchphrase */}
            <div className="space-y-1">
              <div className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors leading-snug">
                Single-Answer Precision Optimizer:
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 block">
                  Snipe Google Position #0 in First 50 Words
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Audit opening 50 words, measure &lt;25 words answer density, and extract instant Google Featured Snippets.
              </p>
            </div>

            {/* CTA Button with Direct Internal Link */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={() => onNavigate?.('/tools/single-answer-precision-optimizer')}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span>Launch Snippet Sniper</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate?.('/blog/single-answer-precision-featured-snippet-aeo-guide')}
                title="Read Deep Technical Guide"
                className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-700 transition-all cursor-pointer"
              >
                Guide
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow badge (Screenshot 412 & 413 Intent Alignment) */}
          <div className="inline-flex items-center gap-2 bg-blue-50/90 text-blue-800 border border-blue-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>Free Website Analyzer &amp; SEO Audit Report Generator</span>
          </div>

          {/* Prominent Responsive Blinking Ad Banner for Mobile & Tablet */}
          <div className="lg:hidden mx-auto max-w-md p-[2px] rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 shadow-lg">
            <div className="bg-[#0b1329] rounded-[14px] p-3 text-white flex items-center justify-between gap-3 text-left">
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>HOT AD • NEW AEO TOOL</span>
                </div>
                <div className="text-xs font-black truncate text-white">
                  Single-Answer Precision Optimizer
                </div>
                <div className="text-[10px] text-slate-300 truncate">
                  Snipe Position 0 in First 50 Words
                </div>
              </div>
              <button
                onClick={() => onNavigate?.('/tools/single-answer-precision-optimizer')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer flex items-center gap-1"
              >
                <span>Launch</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Primary H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
            Audit My Site Free:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-cyan-600">
              Website Analyzer &amp; SEO Report Generator
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Run an instant 172-point site audit report. Detect WCAG 2.1 AA barriers, on-page SEO gaps, Core Web Vitals, and generate a free downloadable SEO audit report PDF in seconds.
          </p>

          {/* Targeted SERP Intent Badges (Multi-Country & Ahrefs/Semrush Inspired Colors) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
            {[
              { text: 'Website Analyzer Free', flag: '🇨🇭', color: 'bg-red-50/90 text-red-800 border-red-200 hover:bg-red-100' },
              { text: 'SEO Report Generator', flag: '🇯🇵', color: 'bg-emerald-50/90 text-emerald-800 border-emerald-200 hover:bg-emerald-100' },
              { text: 'Free SEO Audit Report PDF', flag: '🇬🇧', color: 'bg-blue-50/90 text-blue-800 border-blue-200 hover:bg-blue-100' },
              { text: 'Site Audit Report', flag: '🇺🇸', color: 'bg-amber-50/90 text-amber-900 border-amber-200 hover:bg-amber-100' },
              { text: 'Best Free Website Audit Tool', flag: '🇫🇷', color: 'bg-purple-50/90 text-purple-800 border-purple-200 hover:bg-purple-100' },
            ].map((badge) => (
              <span
                key={badge.text}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold shadow-2xs transition-colors cursor-default ${badge.color}`}
              >
                <span className="text-xs leading-none" role="img" aria-hidden="true">{badge.flag}</span>
                <span>{badge.text}</span>
              </span>
            ))}
          </div>

          {/* Main Input Form */}
          <div className="max-w-2xl mx-auto pt-2">
            <form
              onSubmit={handleScanSubmit}
              className="p-2 sm:p-2.5 rounded-2xl bg-white border-2 border-slate-200 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100/70 shadow-xl transition-all duration-200 flex flex-col sm:flex-row gap-2"
            >
              <div className="flex-1 flex items-center px-3.5 gap-2.5">
                <Globe className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  id="live-url-input"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter website URL (e.g. yoursite.com)"
                  disabled={isLoading}
                  className="w-full py-2.5 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-hidden focus:ring-0"
                  aria-label="Website address to scan"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#ff5a1f] via-orange-500 to-[#ff5a1f] hover:from-[#e04f1a] hover:to-orange-600 text-white font-black text-sm tracking-wide shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Auditing Website...</span>
                  </>
                ) : (
                  <>
                    <span>Run Free Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Error banner */}
            {errorMessage && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2.5 text-left animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Scanning Progress Overlay */}
            {isLoading && (
              <div className="mt-6 p-5 rounded-2xl bg-[#0a0f1d] text-white shadow-2xl text-left space-y-3 animate-in fade-in border border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-2 text-cyan-400">
                    <Activity className="w-4 h-4 animate-pulse" />
                    Live Audit in Progress
                  </span>
                  <span>Step {scanStep + 1} of {steps.length}</span>
                </div>

                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 rounded-full"
                    style={{ width: `${((scanStep + 1) / steps.length) * 100}%` }}
                  />
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {steps[scanStep]}
                </p>
              </div>
            )}

            {/* Quick Demo Links */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500 font-medium">
              <span>Try with popular demos:</span>
              <button
                type="button"
                onClick={() => handleScanSubmit(undefined, 'https://acme-store.example.com')}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                eCommerce Store
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleScanSubmit(undefined, 'https://saas-startup.example.com')}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                SaaS Startup
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleScanSubmit(undefined, 'https://local-clinic.example.com')}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Healthcare Clinic
              </button>
            </div>
          </div>

          {/* 10-Second High-Impact Site Intro Video Showcase (Rendered under Run Free Audit) */}
          <div className="pt-8 pb-4 max-w-4xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left px-1">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200">
                  <Film className="w-3.5 h-3.5 text-blue-600" />
                  <span>10-Second Platform Tour</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Experience AccessFix AI in 10 Seconds
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-sm font-medium">
                Live walkthrough of Vitals Audits, AI Crawler Governance, Untapped Keywords, and 1-Click Code Fixes.
              </p>
            </div>

            <SiteIntroVideoPlayer />
          </div>

          {/* Trust badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-100">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>WCAG 2.1 AA Standards</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
              <Search className="w-4 h-4 text-sky-600 shrink-0" />
              <span>SEO Audit Report Generator</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Core Web Vitals Metric</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Free Audit Report (PDF)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
