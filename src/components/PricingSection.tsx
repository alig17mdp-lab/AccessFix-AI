import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, Zap, Building, Lock, Clock, Users, Share2, UserCheck, UserPlus, CheckCircle2 } from 'lucide-react';
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
      teamSeats: 1,
      features: [
        '5 On-Demand Scans per month',
        'Single User Account',
        '40+ Automated WCAG 2.1 checks',
        'Plain-English AI issue summaries',
        'Basic HTML remediation snippets',
        'Export JSON audit results',
      ],
      popular: false,
      isComingSoon: false,
      buttonText: currentPlan === 'free' ? 'Current Active Plan' : 'Get Started Free',
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Ideal for ecommerce stores, high-growth SaaS, and web consultants.',
      monthlyPrice: 9,
      yearlyPrice: 89,
      teamSeats: 1,
      features: [
        '50 Scans per month',
        '5 Monitored Websites',
        'Single User License',
        'Automated Weekly Scheduled Scans',
        'Regression Email & Webhook Alerts',
        'Gemini 3.7 AI Multi-Framework Fixes (React, Shopify Liquid, WordPress PHP)',
        'Download Executive PDF Reports',
        'Issue Tracking Workflow (Fixed/Ignored)',
      ],
      popular: true,
      isComingSoon: true,
      buttonText: 'Start 14-Day Pro Trial',
    },
    {
      id: 'agency',
      name: 'Agency & Enterprise',
      description: 'Scale accessibility retainers, client domains, and collaborative auditing with 5 team seats.',
      monthlyPrice: 49,
      yearlyPrice: 469,
      teamSeats: 5,
      features: [
        '5 Team Members Included (Multi-User Sharing System)',
        'Role-Based Access Control (Admin, Auditor, Viewer)',
        'Unlimited Monthly Scans (Shared Quota)',
        '25 Monitored Client Domains',
        'Daily Automated Scheduled Auditing',
        'Custom Branded White-Label PDF Audits',
        'Client Management Hub & Team Activity Logs',
        'Priority Gemini AI Queue',
        'Dedicated SLA & Priority Support',
      ],
      popular: false,
      isComingSoon: true,
      buttonText: 'Upgrade to Agency & Enterprise',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/60 to-[#f8fafc] border-t border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100/80 px-3.5 py-1 rounded-full border border-blue-200/60">
            Transparent Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Snipe Position #0 &amp; Automate Site Audits
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Start free with on-demand audits &amp; single-answer precision checks, or unlock automated weekly monitoring, white-label agency reports, and 5-member team sharing.
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative">
          {plans.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            const isCurrent = currentPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl p-8 flex flex-col justify-between transition-all relative border overflow-hidden ${
                  plan.isComingSoon
                    ? 'border-amber-300/70 bg-gradient-to-b from-amber-50/20 via-white to-white shadow-md'
                    : plan.popular
                    ? 'border-blue-600 ring-4 ring-blue-600/15 shadow-2xl shadow-blue-600/10'
                    : 'border-slate-200 shadow-md hover:shadow-xl'
                }`}
              >
                {/* Diagonal Slanted "COMING SOON" Ribbon Banner on Card Top-Right */}
                {plan.isComingSoon && (
                  <div className="absolute -top-10 -right-10 w-36 h-36 overflow-hidden pointer-events-none z-30">
                    <div className="absolute transform rotate-45 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-[9px] tracking-widest uppercase py-1.5 right-[-32px] top-[32px] w-[160px] text-center shadow-lg border-y border-white/30">
                      COMING SOON
                    </div>
                  </div>
                )}

                {/* Top Center Badge */}
                {plan.isComingSoon ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-amber-300/50 z-20 whitespace-nowrap">
                    <Clock className="w-3 h-3 text-amber-100 animate-pulse" />
                    <span>COMING SOON</span>
                  </div>
                ) : plan.popular ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-700 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular Choice</span>
                  </div>
                ) : null}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-950">{plan.name}</h3>
                      {plan.isComingSoon && (
                        <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed min-h-[32px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* 5 Team Members Callout Pill for Agency & Enterprise */}
                  {plan.id === 'agency' && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-3 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>5 Team Members</span>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-blue-600 text-white rounded">Sharing System</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                          Multi-user team sharing with role-based access for your whole agency.
                        </p>
                      </div>
                    </div>
                  )}

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
                          <span className={feat.includes('5 Team Members') ? 'font-bold text-slate-900' : ''}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  {plan.isComingSoon ? (
                    /* Inactive / Disabled Unclickable Button for Pro and Enterprise */
                    <button
                      type="button"
                      disabled={true}
                      aria-disabled="true"
                      className="w-full py-3.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none flex items-center justify-center gap-2 select-none pointer-events-none"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>COMING SOON ({plan.buttonText})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectPlan(plan.id, billingCycle)}
                      disabled={isCurrent}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                          : 'bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white'
                      }`}
                    >
                      <span>{plan.buttonText}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dedicated Section: Agency & Enterprise Team Sharing System */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-lg relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-50/80 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-black uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Agency & Enterprise Sharing System</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Collaborative 5-Member Team Workspace
              </h3>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                The Agency & Enterprise plan includes a built-in multi-user sharing system designed for agencies, engineering teams, and compliance consultants. Invite up to 5 team members to co-manage client domains, share unlimited scanning quotas, and collaborate on accessibility remediation.
              </p>
            </div>

            {/* Visual Seat Quota Callout */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0 shadow-md border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-inner">
                5
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wide text-blue-300">Team Seats Included</div>
                <div className="text-sm font-bold text-white">Multi-User Sharing System</div>
                <div className="text-[11px] text-slate-400">Included in the $49/mo Agency plan</div>
              </div>
            </div>
          </div>

          {/* 4 Feature Pillars of the Sharing System */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-700 border border-blue-200/80 flex items-center justify-center shadow-xs">
                <Share2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Shared Quotas & Domains</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                All 5 members share the 25 monitored client domains and unlimited on-demand audits. No individual licenses or per-seat surcharges required.
              </p>
            </div>

            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100/80 text-indigo-700 border border-indigo-200/80 flex items-center justify-center shadow-xs">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Role-Based Access Control</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assign roles per member: <strong>Admin</strong> (billing & domain settings), <strong>Auditor</strong> (run scans & AI code fixes), and <strong>Viewer</strong> (client-ready reports).
              </p>
            </div>

            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shadow-xs">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Client Hub & White-Label</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Co-manage client portfolios, share custom-branded PDF compliance certificates with agency branding, and present remediation reports directly to clients.
              </p>
            </div>

            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-700 border border-amber-200/80 flex items-center justify-center shadow-xs">
                <UserPlus className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Instant Email Invites</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamlessly invite developers, content editors, or external clients via email. Reassign seats, revoke access, or update permissions anytime in 1 click.
              </p>
            </div>
          </div>

          {/* Interactive Visual Team Role Breakdown Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 rounded-2xl p-5 border border-slate-200/60">
            <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Team Member Roles in the 5-Seat Sharing System:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-xs">
                <div className="font-bold text-blue-700 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Account Owner & Admin</span>
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Full control over billing, 25 client domains, team seat invites, and workspace-wide settings.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-xs">
                <div className="font-bold text-indigo-700 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Technical Auditor / Dev</span>
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Executes scheduled & on-demand audits, triggers Gemini AI code fixes, and tracks resolved WCAG issues.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-xs">
                <div className="font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Client / Stakeholder Viewer</span>
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Read-only access to view live compliance scores, track audit progress, and download branded PDF reports.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
