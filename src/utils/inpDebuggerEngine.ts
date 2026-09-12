import {
  InpAuditReport,
  LongTaskDetail,
  WebVitalMetric,
} from '../types/inpDebugger';

export const INP_PRESET_SCENARIOS = [
  {
    label: 'Heavy E-Commerce Store (Severe INP & JS Thread Choke)',
    url: 'https://myshopify-store.com/cart',
    description: 'Cart drawer triggers 620ms of main-thread JavaScript execution from tracking pixels and DOM re-renders.',
  },
  {
    label: 'Heavy React SPA (Unoptimized State Rendering)',
    url: 'https://saasapp.io/dashboard/analytics',
    description: 'Filtering large tables locks the main thread for 340ms, resulting in perceptible click lag on mobile.',
  },
  {
    label: 'Optimized Lightweight Architecture (All Vitals Green)',
    url: 'https://accessfix.ai/tools/site-comparison',
    description: 'Pristine sub-50ms interaction latency with zero layout shift and deferred non-critical tracking.',
  },
];

export function auditInpAndCoreWebVitals(
  rawUrl: string,
  device: 'mobile' | 'desktop' = 'mobile'
): InpAuditReport {
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  const lower = url.toLowerCase();

  let inpValue = 85;
  let lcpValue = 1.8;
  let clsValue = 0.02;
  let ttfbValue = 180;
  let longTasks: LongTaskDetail[] = [];
  let jsRemediation = `// Performance is optimal. Continue monitoring user interaction latencies.`;

  if (lower.includes('cart') || lower.includes('shopify') || lower.includes('store') || lower.includes('heavy')) {
    // Poor INP scenario
    inpValue = device === 'mobile' ? 620 : 380;
    lcpValue = 3.6;
    clsValue = 0.18;
    ttfbValue = 640;

    longTasks = [
      {
        id: 'lt_1',
        source: 'gtm.js & analytics_pixel_bundle.min.js',
        durationMs: 290,
        phase: 'processing_duration',
        culpritElement: '<button id="checkout-drawer-btn">',
        recommendation: 'Offload analytics beacon dispatch to requestIdleCallback() or Web Workers.',
      },
      {
        id: 'lt_2',
        source: 'vendor-react-dom.production.min.js',
        durationMs: 210,
        phase: 'presentation_delay',
        culpritElement: '<div class="cart-items-list">',
        recommendation: 'Break up massive DOM re-renders by yielding to the main thread with scheduler.yield().',
      },
    ];

    jsRemediation = `// Remediate INP by yielding main thread before DOM mutation
async function handleCartInteraction(event) {
  // 1. Give immediate visual feedback to user
  event.target.classList.add('loading-pulse');

  // 2. Yield control back to the browser to render the next frame
  if ('scheduler' in window && 'yield' in window.scheduler) {
    await window.scheduler.yield();
  } else {
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  // 3. Execute heavy calculations or state updates
  recalculateCartTotal();
}`;
  } else if (lower.includes('dashboard') || lower.includes('spa') || lower.includes('react')) {
    // Moderate INP
    inpValue = device === 'mobile' ? 340 : 190;
    lcpValue = 2.7;
    clsValue = 0.08;
    ttfbValue = 320;

    longTasks = [
      {
        id: 'lt_spa_1',
        source: 'charts-bundle.js (D3 Data Re-calculation)',
        durationMs: 180,
        phase: 'processing_duration',
        culpritElement: '<input type="range" id="filter-slider">',
        recommendation: 'Debounce slider input handlers and use useDeferredValue() in React.',
      },
    ];

    jsRemediation = `// Use React 18 useTransition or requestAnimationFrame for heavy filters
import { useTransition } from 'react';

function AnalyticsFilters() {
  const [isPending, startTransition] = useTransition();

  const onFilterChange = (val) => {
    startTransition(() => {
      // Non-blocking filter state update
      applyHeavyTableFilters(val);
    });
  };
}`;
  } else {
    // Pristine performance
    inpValue = device === 'mobile' ? 65 : 35;
    lcpValue = 1.4;
    clsValue = 0.01;
    ttfbValue = 120;

    longTasks = [
      {
        id: 'lt_ok',
        source: 'main-app.js',
        durationMs: 25,
        phase: 'processing_duration',
        recommendation: 'Task completed within budget (<50ms).',
      },
    ];
  }

  const metrics: WebVitalMetric[] = [
    {
      name: 'INP',
      value: inpValue,
      unit: 'ms',
      rating: inpValue <= 200 ? 'good' : inpValue <= 500 ? 'needs_improvement' : 'poor',
      thresholds: { good: 200, poor: 500 },
      description: 'Interaction to Next Paint: Measures latency of all click, tap, and keyboard interactions.',
    },
    {
      name: 'LCP',
      value: lcpValue,
      unit: 's',
      rating: lcpValue <= 2.5 ? 'good' : lcpValue <= 4.0 ? 'needs_improvement' : 'poor',
      thresholds: { good: 2.5, poor: 4.0 },
      description: 'Largest Contentful Paint: Time until main viewport hero element is rendered.',
    },
    {
      name: 'CLS',
      value: clsValue,
      unit: '',
      rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs_improvement' : 'poor',
      thresholds: { good: 0.1, poor: 0.25 },
      description: 'Cumulative Layout Shift: Quantifies unexpected visual displacement of page elements.',
    },
    {
      name: 'TTFB',
      value: ttfbValue,
      unit: 'ms',
      rating: ttfbValue <= 800 ? 'good' : 'poor',
      thresholds: { good: 800, poor: 1800 },
      description: 'Time to First Byte: Latency of initial server response.',
    },
  ];

  const hasPoorMetric = metrics.some((m) => m.rating === 'poor');
  const overallVitalStatus: 'PASS' | 'FAIL' = hasPoorMetric ? 'FAIL' : 'PASS';

  let score = 100;
  if (inpValue > 200) score -= (inpValue - 200) / 10;
  if (lcpValue > 2.5) score -= (lcpValue - 2.5) * 15;
  if (clsValue > 0.1) score -= (clsValue - 0.1) * 200;
  const overallScore = Math.max(15, Math.min(100, Math.round(score)));

  const totalBlockingTimeMs = longTasks.reduce((acc, curr) => acc + curr.durationMs, 0);

  return {
    url,
    overallVitalStatus,
    overallScore,
    device,
    metrics,
    longTasks,
    totalBlockingTimeMs,
    jsExecutionRemediation: jsRemediation,
  };
}
