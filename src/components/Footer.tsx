import React from 'react';
import { ShieldCheck, Mail, Globe, CheckCircle2, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const navigateTo = (route: string) => {
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Disclaimer Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-14 flex flex-col md:flex-row items-start md:items-center gap-4 text-xs">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-slate-200">
              Important Legal & Automated Auditing Notice
            </div>
            <p className="text-slate-400 leading-relaxed">
              AccessFix AI provides automated website accessibility diagnostic testing, WCAG 2.1 rule evaluation, and AI-assisted code remediation suggestions. Automated testing identifies common programmatic barriers but does not constitute legal advice, formal certification, or an absolute guarantee of ADA Title III or Section 508 legal immunity.
            </p>
          </div>
        </div>

        {/* 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                Access<span className="text-emerald-400">Fix</span> AI
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated website accessibility auditing, plain-English AI explanations, and production-ready code fixes for high-growth businesses.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>WCAG 2.1 & 2.2 AA Aligned</span>
            </div>
          </div>

          {/* Col 2: Core Checkers */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Core Checkers
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('/accessibility-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Website Accessibility Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/ada-compliance-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  ADA Compliance Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/wcag-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  WCAG 2.1 Compliance Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/website-accessibility-test')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Website Accessibility Test
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/accessibility-testing')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Accessibility Testing Tool
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Free Utility Tools */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Free Utilities
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('/tools/single-answer-precision-optimizer')}
                  className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Single-Answer Precision (HOT)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/touch-target-size-calculator')}
                  className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <span>WCAG 2.2 Touch Target Calc (NEW)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/site-comparison')}
                  className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors text-left flex items-center gap-1"
                >
                  <span>Site Comparison (NEW)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/keyword-planner')}
                  className="text-blue-400 font-semibold hover:text-blue-300 transition-colors text-left flex items-center gap-1"
                >
                  <span>AI Keyword Planner (NEW)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/domain-rating-checker')}
                  className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors text-left flex items-center gap-1"
                >
                  <span>Domain Rating Checker (NEW)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/sitemap-auditor')}
                  className="text-teal-400 font-semibold hover:text-teal-300 transition-colors text-left flex items-center gap-1"
                >
                  <span>XML Sitemap Auditor (NEW)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/indexation-fixer')}
                  className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors text-left flex items-center gap-1"
                >
                  <span>GSC Indexation Fixer (NEW)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/robots-txt-validator')}
                  className="text-sky-400 font-semibold hover:text-sky-300 transition-colors text-left flex items-center gap-1"
                >
                  <span>Robots.txt Validator (NEW)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/internal-link-analyzer')}
                  className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors text-left flex items-center gap-1"
                >
                  <span>Internal Link Analyzer (NEW)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/aeo-checker')}
                  className="text-purple-400 font-semibold hover:text-purple-300 transition-colors text-left flex items-center gap-1"
                >
                  <span>AEO Readiness Checker (NEW)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/inp-debugger')}
                  className="text-amber-400 font-semibold hover:text-amber-300 transition-colors text-left flex items-center gap-1"
                >
                  <span>Core Web Vitals INP Debugger (NEW)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/color-contrast-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Color Contrast Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/alt-text-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  AI Alt Text Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/heading-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Heading Hierarchy Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/form-accessibility-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Form Accessibility Validator
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/tools/keyboard-accessibility-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Keyboard Nav Simulator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Checkers */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platforms & CMS
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('/shopify-accessibility-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Shopify Store Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/wordpress-accessibility-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  WordPress Theme Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/wix-accessibility-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Wix Accessibility Test
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/webflow-accessibility-checker')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Webflow Accessibility Test
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/for-agencies')}
                  className="hover:text-emerald-400 transition-colors text-left font-semibold text-slate-300"
                >
                  Agency White-Label Audits
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Trust */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Trust & Legal
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('/accessibility-statement')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Accessibility Statement
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/privacy')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/terms')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/disclaimer')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Legal Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/refund-policy')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/contact')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Support & Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} AccessFix AI Technologies Inc. All rights reserved. English (US).
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>support@accessfix.ai</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>US, UK, CA, AU & Worldwide</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
