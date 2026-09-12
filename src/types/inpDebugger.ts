export type MetricRating = 'good' | 'needs_improvement' | 'poor';

export interface WebVitalMetric {
  name: 'INP' | 'LCP' | 'CLS' | 'FID' | 'TTFB';
  value: number;
  unit: 'ms' | 's' | '';
  rating: MetricRating;
  thresholds: { good: number; poor: number };
  description: string;
}

export interface LongTaskDetail {
  id: string;
  source: string;
  durationMs: number;
  phase: 'input_delay' | 'processing_duration' | 'presentation_delay';
  culpritElement?: string;
  recommendation: string;
}

export interface InpAuditReport {
  url: string;
  overallVitalStatus: 'PASS' | 'FAIL';
  overallScore: number; // 0 - 100
  device: 'mobile' | 'desktop';
  metrics: WebVitalMetric[];
  longTasks: LongTaskDetail[];
  totalBlockingTimeMs: number;
  jsExecutionRemediation: string;
}
