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
} from 'lucide-react';
import { ScanResult, UnifiedHealthScan } from '../types';
import { executeUniversalHealthScan } from '../utils/clientHealthScanner';

interface HeroScannerProps {
  onScanComplete: (result: ScanResult, unifiedResult?: UnifiedHealthScan) => void;
  onViewSample: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HeroScanner: React.FC<HeroScannerProps> = ({
  onScanComplete,
  onViewSample,
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

      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, -1.5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="hidden xl:flex absolute right-8 top-32 items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a0f1d] text-cyan-300 shadow-xl backdrop-blur-md border border-slate-800 text-[11px] font-semibold"
      >
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span>Core Web Vitals &lt; 0.8s</span>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50/90 text-blue-800 border border-blue-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>AI Website Health & Growth Platform</span>
          </div>

          {/* Primary H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
            Scan Your Website for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-cyan-600">
              Accessibility, SEO & Speed
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Automated audits for WCAG 2.1 AA barriers, On-Page SEO gaps, Core Web Vitals, and content quality. Get prioritized AI developer fixes in under 30 seconds.
          </p>

          {/* Main Input Form */}
          <div className="max-w-2xl mx-auto pt-2">
            <form
              onSubmit={handleScanSubmit}
              className="p-2 sm:p-2.5 rounded-2xl bg-white border-2 border-slate-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100/70 shadow-xl transition-all duration-200 flex flex-col sm:flex-row gap-2"
            >
              <div className="flex-1 flex items-center px-3.5 gap-2.5">
                <Globe className="w-5 h-5 text-slate-400 shrink-0" />
                <input
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
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
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

          {/* Trust badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-100">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>WCAG 2.1 AA Standards</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
              <Search className="w-4 h-4 text-sky-600 shrink-0" />
              <span>On-Page SEO Diagnostics</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Core Web Vitals Metric</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
              <Flame className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Impact × Effort Matrix</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
