import React, { useState } from 'react';
import {
  Gauge,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Download,
  Zap,
  ArrowRight,
  Sparkles,
  Smartphone,
  Laptop,
  Clock,
  Terminal,
  Search,
  RefreshCw,
} from 'lucide-react';
import {
  InpAuditReport,
} from '../types/inpDebugger';
import {
  auditInpAndCoreWebVitals,
  INP_PRESET_SCENARIOS,
} from '../utils/inpDebuggerEngine';

interface InpPerformanceDebuggerProps {
  onNavigate: (route: string) => void;
}

export const InpPerformanceDebugger: React.FC<InpPerformanceDebuggerProps> = ({ onNavigate }) => {
  const [targetUrl, setTargetUrl] = useState<string>('https://myshopify-store.com/cart');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [report, setReport] = useState<InpAuditReport>(() =>
    auditInpAndCoreWebVitals('https://myshopify-store.com/cart', 'mobile')
  );

  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    setIsAuditing(true);
    setTimeout(() => {
      const newReport = auditInpAndCoreWebVitals(targetUrl, device);
      setReport(newReport);
      setIsAuditing(false);
    }, 750);
  };

  const handleSelectPreset = (url: string) => {
    setTargetUrl(url);
    setIsAuditing(true);
    setTimeout(() => {
      const newReport = auditInpAndCoreWebVitals(url, device);
      setReport(newReport);
      setIsAuditing(false);
    }, 400);
  };

  const handleDeviceToggle = (newDevice: 'mobile' | 'desktop') => {
    setDevice(newDevice);
    setIsAuditing(true);
    setTimeout(() => {
      const newReport = auditInpAndCoreWebVitals(targetUrl, newDevice);
      setReport(newReport);
      setIsAuditing(false);
    }, 300);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const inpMetric = report.metrics.find((m) => m.name === 'INP');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'Core Web Vitals & Real-Time INP (Interaction to Next Paint) Debugger',
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'All',
                description:
                  'Free online Google Core Web Vitals diagnostic tool. Debug Interaction to Next Paint (INP) latency, identify main-thread blocking scripts, and optimize JavaScript event loop timing.',
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
                    name: 'What is a good Interaction to Next Paint (INP) score in Google Core Web Vitals?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'An INP score of 200 milliseconds or lower indicates good responsiveness, while scores above 500 milliseconds require immediate JavaScript optimization.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do you fix high INP in React and JavaScript applications?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yield control back to the main thread using scheduler.yield() or setTimeout(0), debounce input handlers, and offload analytics tracking to requestIdleCallback.',
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />

      {/* Hero Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Gauge className="w-3.5 h-3.5" />
              Core Web Vitals & INP Diagnostic Lab
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Google Chrome UX Report (CrUX) Specification
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Core Web Vitals & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">Real-Time INP Debugger</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Diagnose your website's <strong>Interaction to Next Paint (INP)</strong> score. Uncover script execution bottlenecks, trace main-thread blocking tasks, and receive copy-paste JavaScript yield snippets to pass Google's Core Web Vitals assessment.
          </p>
        </div>
      </header>

      {/* Main Interactive Tool Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Preset Selector */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Quick Benchmark Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {INP_PRESET_SCENARIOS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset.url)}
                className="text-left p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all text-xs group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {preset.label}
                </div>
                <div className="text-slate-400 text-[11px] line-clamp-2 mt-1">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar with Mobile/Desktop Toggle */}
        <form onSubmit={handleRunAudit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => handleDeviceToggle('mobile')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  device === 'mobile'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (4G / Slow CPU)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeviceToggle('desktop')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  device === 'desktop'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>

            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com/page-to-test"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isAuditing}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Measuring Latency...</span>
                </>
              ) : (
                <>
                  <Gauge className="w-4 h-4" />
                  <span>Measure INP & Vitals</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Top Hero Vital Card: INP */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Interaction to Next Paint (INP) Status • {device.toUpperCase()}
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span
                  className={`text-5xl font-extrabold ${
                    inpMetric?.rating === 'good'
                      ? 'text-emerald-400'
                      : inpMetric?.rating === 'needs_improvement'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {inpMetric?.value} ms
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    inpMetric?.rating === 'good'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : inpMetric?.rating === 'needs_improvement'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {inpMetric?.rating.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Core Web Vitals Assessment</div>
              <div
                className={`text-2xl font-black mt-0.5 ${
                  report.overallVitalStatus === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {report.overallVitalStatus}ED
              </div>
            </div>
          </div>

          {/* Core Web Vitals Grid (LCP, CLS, TTFB) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {report.metrics
              .filter((m) => m.name !== 'INP')
              .map((m) => (
                <div key={m.name} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium flex justify-between">
                    <span>{m.name}</span>
                    <span
                      className={`font-semibold uppercase text-[10px] ${
                        m.rating === 'good' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {m.rating.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {m.value} {m.unit}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{m.description}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Long Tasks & Main Thread Bottlenecks */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
          <div className="text-sm font-semibold text-white mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Main Thread Long Tasks & Event Execution Choke Points</span>
            </div>
            <span className="text-xs text-slate-400">
              Total Blocking Time: <strong>{report.totalBlockingTimeMs}ms</strong>
            </span>
          </div>

          <div className="space-y-3">
            {report.longTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-slate-200 font-semibold">{task.source}</span>
                  <span className="font-mono text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-950/40 border border-rose-900/40">
                    {task.durationMs}ms delay
                  </span>
                </div>
                {task.culpritElement && (
                  <div className="text-slate-400">
                    Trigger Element: <code className="text-indigo-300 font-mono">{task.culpritElement}</code>
                  </div>
                )}
                <div className="text-indigo-300 font-medium flex items-center gap-1.5 pt-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{task.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copy-Paste JS Remediation Code Snippet */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-12">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-white">
                Main-Thread Yield Remediation Snippet (scheduler.yield / requestAnimationFrame)
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(report.jsExecutionRemediation, 'copy_js')}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {copiedId === 'copy_js' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copy Fix Snippet</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 rounded-xl text-indigo-200 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
            {report.jsExecutionRemediation}
          </pre>
        </div>

        {/* Dual Search Intent Viewport Architecture - SEO Guide & FAQs */}
        <section className="pt-10 border-t border-slate-800 text-slate-300">
          <div className="max-w-4xl mx-auto space-y-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                What Is Interaction to Next Paint (INP) and Why Did Google Replace FID?
              </h2>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base">
                In March 2024, Google officially replaced First Input Delay (FID) with <strong>Interaction to Next Paint (INP)</strong> as an official Core Web Vital ranking factor. While FID only measured the response time of the very first click on a page, INP measures the latency of <em>every single interaction</em> (clicks, taps, and keypresses) throughout the entire user session, reporting the 98th percentile worst interaction latency.
              </p>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base mt-3">
                Websites failing INP typically suffer from heavy third-party tracking scripts, large unoptimized React re-renders, or event handlers that block the browser's main thread from rendering the next visual frame. Combining INP debugging with our <button onClick={() => onNavigate('/tools/site-comparison')} className="text-indigo-400 underline hover:text-indigo-300">competitor site comparison engine</button> allows you to benchmark your speed directly against top-ranking industry rivals.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Frequently Asked Questions About Core Web Vitals & INP Optimization
              </h2>

              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    What is a good Interaction to Next Paint (INP) score in Google Core Web Vitals?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    An INP score of 200 milliseconds or lower indicates good responsiveness, while scores above 500 milliseconds require immediate JavaScript optimization.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Pages with INP between 200ms and 500ms receive a "Needs Improvement" rating in Google Search Console, which can impede search ranking competitiveness on mobile devices.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    How do you fix high INP in React and JavaScript applications?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    Yield control back to the main thread using scheduler.yield() or setTimeout(0), debounce input handlers, and offload analytics tracking to requestIdleCallback.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Breaking up long tasks into smaller sub-50ms chunks allows the browser to present visual feedback immediately to the user before completing background state calculations.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    Do third-party tag managers affect INP?
                  </h3>
                  <p className="text-slate-200 font-bold mb-2 text-sm">
                    Yes, synchronous tracking pixels, session replay tools, and live chat widgets often monopolize the main thread during user interactions.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Audit tags inside Google Tag Manager to ensure events fire asynchronously or utilize Web Workers (e.g., via Partytown) to isolate third-party scripts from the main UI thread.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
