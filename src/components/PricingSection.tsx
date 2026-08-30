import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, Zap, Building } from 'lucide-react';
import { PricingPlan } from '../types';

interface PricingSectionProps {
  onSelectPlan: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
  currentPlan?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  currentPlan = 'free',
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      description: 'Instant on-demand scans for single websites and personal blogs.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '5 On-Demand Scans per month',
        '40+ Automated WCAG 2.1 checks',
        'Plain-English AI issue summaries',
        'Basic HTML remediation snippets',
        'Export JSON audit results',
      ],
      popular: false,
      buttonText: currentPlan === 'free' ? 'Current Plan' : 'Get Started Free',
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Ideal for ecommerce stores, high-growth SaaS, and web consultants.',
      monthlyPrice: 29,
      yearlyPrice: 279,
      features: [
        '50 Scans per month',
        '5 Monitored Websites',
        'Automated Weekly Scheduled Scans',
        'Regression Email & Webhook Alerts',
        'Gemini 3.7 AI Multi-Framework Fixes (React, Shopify Liquid, WordPress PHP)',
        'Download Executive PDF Reports',
        'Issue Tracking Workflow (Fixed/Ignored)',
      ],
      popular: true,
      buttonText: currentPlan === 'pro' ? 'Current Plan' : 'Start 14-Day Pro Trial',
    },
    {
      id: 'agency',
      name: 'Agency & Enterprise',
      description: 'Scale accessibility retainers and white-label client reporting.',
      monthlyPrice: 99,
      yearlyPrice: 949,
      features: [
        'Unlimited Monthly Scans',
        '25 Monitored Client Domains',
        'Daily Automated Scheduled Auditing',
        'Custom Branded White-Label PDF Audits',
        'Client Management Hub',
        'Priority Gemini AI Queue',
        'Unlimited Team Seat Access',
        'Dedicated SLA & Email Support',
      ],
      popular: false,
      buttonText: currentPlan === 'agency' ? 'Current Plan' : 'Upgrade to Agency',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/60 to-[#f8fafc] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100/80 px-3.5 py-1 rounded-full border border-blue-200/60">
            Transparent Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Protect Your Business with Continuous Accessibility
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Start free with on-demand audits, or unlock automated weekly monitoring and white-label agency reports.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3 text-xs font-bold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-emerald-500 text-slate-950 text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            const isCurrent = currentPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl p-8 flex flex-col justify-between transition-all relative border ${
                  plan.popular
                    ? 'border-emerald-500 ring-4 ring-emerald-500/15 shadow-2xl shadow-emerald-500/10'
                    : 'border-slate-200 shadow-md hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed min-h-[32px]">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">${price}</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {plan.monthlyPrice === 0 ? '' : billingCycle === 'monthly' ? '/month' : '/year'}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                    <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                      Included Capabilities:
                    </div>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => onSelectPlan(plan.id, billingCycle)}
                    disabled={isCurrent}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                      isCurrent
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        : plan.popular
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{plan.buttonText}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
