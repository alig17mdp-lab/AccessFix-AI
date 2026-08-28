import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Scale,
  Activity,
  Code,
  FileText,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { SEO_PAGES } from '../data/seoPagesData';
import { ScanResult } from '../types';

interface SeoLandingPageProps {
  slug: string;
  onScanComplete: (result: ScanResult) => void;
  onNavigate: (route: string) => void;
}

export const SeoLandingPage: React.FC<SeoLandingPageProps> = ({
  slug,
  onScanComplete,
  onNavigate,
}) => {
  const pageData = SEO_PAGES[slug] || SEO_PAGES['accessibility-checker'];
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(0);

  useEffect(() => {
    document.title = pageData.title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', pageData.metaDescription);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageData.canonicalUrl);

    // JSON-LD structured data
    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: 'AccessFix AI ' + pageData.h1,
          operatingSystem: 'All',
          applicationCategory: 'DeveloperApplication',
          description: pageData.metaDescription,
          url: pageData.canonicalUrl,
          offers: {
            '@type': 'Offer',
            price: '0.00',
            priceCurrency: 'USD',
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: pageData.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        },
      ],
    };

    let script = document.getElementById('json-ld-seo-schema') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'json-ld-seo-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemaData);

    return () => {
      // Clean up title on unmount if needed
    };
  }, [pageData]);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        onScanComplete(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-200">
      {/* Top Viewport: Interactive Scanner satisfying Dual Search Intent */}
      <section className="bg-gradient-to-b from-emerald-50/60 via-white to-white pt-12 pb-16 border-b border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-100/90 text-emerald-900 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{pageData.wcagRelevance}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            {pageData.h1}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {pageData.heroSubtitle}
          </p>

          {/* Quick Scanner Box */}
          <form
            onSubmit={handleScanSubmit}
            className="max-w-2xl mx-auto bg-white p-2.5 rounded-2xl shadow-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2 focus-within:ring-4 focus-within:ring-emerald-500/20 focus-within:border-emerald-500"
          >
            <input
              type="text"
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full text-sm font-medium px-4 py-2 text-slate-900 outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Activity className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <span>Audit Website Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Main Informational Content (High E-E-A-T) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Overview Module */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            How AccessFix AI Validates Your Digital Accessibility
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {pageData.overviewContent}
          </p>
        </section>

        {/* Key Features Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Core Auditing Capabilities & Developer Remediation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pageData.keyFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2"
              >
                <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{feat.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Common Failures Table / List */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Top Detected Violations & Immediate Source Code Fixes
          </h2>
          <div className="space-y-4">
            {pageData.commonFailures.map((failure, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2"
              >
                <h3 className="text-sm font-bold text-slate-900">{failure.title}</h3>
                <div className="text-xs text-slate-600">
                  <strong>User Impact:</strong> {failure.impact}
                </div>
                <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 font-mono">
                  <strong>Fix:</strong> {failure.fix}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Answer-Engine Snippet Optimized FAQs */}
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions (Answer Engine Optimized)
            </h2>
            <p className="text-xs text-slate-500">
              Clear, direct answers for web developers, compliance officers, and business owners.
            </p>
          </div>

          <div className="space-y-3">
            {pageData.faqs.map((faq, idx) => {
              const isExpanded = expandedFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setExpandedFaqIdx(isExpanded ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/70"
                  >
                    <h3 className="text-sm font-bold text-slate-900 pr-4">{faq.question}</h3>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 text-center space-y-4">
          <h3 className="text-2xl font-black">Audit Your Website Accessibility Free</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Get instant WCAG 2.1 diagnostics and developer-ready code fixes in under 10 seconds.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg cursor-pointer"
          >
            Start Free Website Audit
          </button>
        </div>
      </div>
    </div>
  );
};
