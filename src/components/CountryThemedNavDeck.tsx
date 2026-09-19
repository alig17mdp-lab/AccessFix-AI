import React from 'react';
import {
  Search,
  Wrench,
  Layers,
  CreditCard,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CountryNavButton {
  id: string;
  name: string;
  route: string;
  country: string;
  flag: string;
  themeName: string;
  headline: string;
  badgeText: string;
  statsText: string;
  icon: React.ComponentType<{ className?: string }>;
  // Distinct Country & Ahrefs/Semrush-inspired color tokens
  colorClasses: {
    baseCard: string;
    activeCard: string;
    hoverBorder: string;
    glowShadow: string;
    countryBadge: string;
    titleColor: string;
    activeTitleColor: string;
    iconBg: string;
    iconColor: string;
    accentBar: string;
  };
}

export const COUNTRY_NAV_BUTTONS: CountryNavButton[] = [
  {
    id: 'aeosniper',
    name: 'AEO Sniper',
    route: '/',
    country: 'United States',
    flag: '🇺🇸',
    themeName: 'Silicon Valley Emerald',
    headline: 'AEO Position #0 Sniper & Single-Answer Precision Engine',
    badgeText: 'Flagship AEO',
    statsText: 'Direct Snipe + GEO Grounding',
    icon: Search,
    colorClasses: {
      baseCard: 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/70 border-slate-200/90 hover:border-emerald-500/80',
      activeCard: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white border-emerald-500 shadow-xl shadow-emerald-500/25 ring-2 ring-emerald-400',
      hoverBorder: 'hover:border-emerald-500',
      glowShadow: 'hover:shadow-xl hover:shadow-emerald-500/20',
      countryBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-100',
      titleColor: 'text-slate-900 group-hover:text-emerald-600',
      activeTitleColor: 'text-white',
      iconBg: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
      iconColor: 'text-emerald-600',
      accentBar: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600',
    },
  },
  {
    id: 'scanner',
    name: '172-Pt Scanner',
    route: '/scanner',
    country: 'Switzerland',
    flag: '🇨🇭',
    themeName: 'Swiss Alpine Scarlet',
    headline: '172-Point Deep DOM Accessibility & SEO Audit Engine',
    badgeText: 'Deep Audit',
    statsText: '172 Rule Verification Engine',
    icon: Search,
    colorClasses: {
      baseCard: 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-red-50/70 border-slate-200/90 hover:border-red-500/80',
      activeCard: 'bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white border-red-500 shadow-xl shadow-red-500/25 ring-2 ring-red-400',
      hoverBorder: 'hover:border-red-500',
      glowShadow: 'hover:shadow-xl hover:shadow-red-500/20',
      countryBadge: 'bg-red-50 text-red-700 border-red-200 group-hover:bg-red-100',
      titleColor: 'text-slate-900 group-hover:text-red-600',
      activeTitleColor: 'text-white',
      iconBg: 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white',
      iconColor: 'text-red-600',
      accentBar: 'bg-gradient-to-r from-red-500 via-rose-500 to-red-600',
    },
  },
  {
    id: 'freetools',
    name: 'Free Tools',
    route: '/tools',
    country: 'Japan',
    flag: '🇯🇵',
    themeName: 'Tokyo Cyber Emerald',
    headline: '21+ Standalone SEO, GEO, AEO & CWV Audits',
    badgeText: '21+ Audits',
    statsText: '100% Free • No Login',
    icon: Wrench,
    colorClasses: {
      baseCard: 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/70 border-slate-200/90 hover:border-emerald-500/80',
      activeCard: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white border-emerald-500 shadow-xl shadow-emerald-500/25 ring-2 ring-emerald-400',
      hoverBorder: 'hover:border-emerald-500',
      glowShadow: 'hover:shadow-xl hover:shadow-emerald-500/20',
      countryBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-100',
      titleColor: 'text-slate-900 group-hover:text-emerald-600',
      activeTitleColor: 'text-white',
      iconBg: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
      iconColor: 'text-emerald-600',
      accentBar: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600',
    },
  },
  {
    id: 'solutions',
    name: 'Solutions',
    route: '/solutions',
    country: 'United Kingdom',
    flag: '🇬🇧',
    themeName: 'Sovereign Royal Azure',
    headline: 'Enterprise Platform Suites & CMS Workflows',
    badgeText: 'Enterprise',
    statsText: 'Shopify • Next • WordPress',
    icon: Layers,
    colorClasses: {
      baseCard: 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50/70 border-slate-200/90 hover:border-blue-600/80',
      activeCard: 'bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-800 text-white border-blue-500 shadow-xl shadow-blue-500/25 ring-2 ring-blue-400',
      hoverBorder: 'hover:border-blue-600',
      glowShadow: 'hover:shadow-xl hover:shadow-blue-500/20',
      countryBadge: 'bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-100',
      titleColor: 'text-slate-900 group-hover:text-blue-700',
      activeTitleColor: 'text-white',
      iconBg: 'bg-blue-100 text-blue-600 group-hover:bg-blue-700 group-hover:text-white',
      iconColor: 'text-blue-600',
      accentBar: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700',
    },
  },
  {
    id: 'guides',
    name: 'Guides',
    route: '/blog',
    country: 'France',
    flag: '🇫🇷',
    themeName: 'French Riviera Luxe',
    headline: 'E-E-A-T Masterclasses, AEO & Agentic Specs',
    badgeText: 'Knowledge Hub',
    statsText: '18+ Engineering Specs',
    icon: BookOpen,
    colorClasses: {
      baseCard: 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-purple-50/70 border-slate-200/90 hover:border-purple-500/80',
      activeCard: 'bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 text-white border-purple-500 shadow-xl shadow-purple-500/25 ring-2 ring-purple-400',
      hoverBorder: 'hover:border-purple-500',
      glowShadow: 'hover:shadow-xl hover:shadow-purple-500/20',
      countryBadge: 'bg-purple-50 text-purple-700 border-purple-200 group-hover:bg-purple-100',
      titleColor: 'text-slate-900 group-hover:text-purple-600',
      activeTitleColor: 'text-white',
      iconBg: 'bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white',
      iconColor: 'text-purple-700',
      accentBar: 'bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-600',
    },
  },
];

interface CountryThemedNavDeckProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  className?: string;
  variant?: 'hero-marquee' | 'standalone-suite' | 'compact-bar';
}

export const CountryThemedNavDeck: React.FC<CountryThemedNavDeckProps> = ({
  activeRoute,
  onNavigate,
  className = '',
  variant = 'standalone-suite',
}) => {
  return (
    <section
      id="country-navigation-command-deck"
      aria-label="Universal Command Navigation: Scanner, Free Tools, Solutions, Guides"
      className={`relative w-full ${className}`}
    >
      {/* Decorative ambient backdrop inspired by Ahrefs / Semrush multi-palette */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-4 w-72 h-72 bg-red-400/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 left-2/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 left-3/4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-4 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Ribbon with Ahrefs/Semrush aesthetic */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 ml-1">
              Global Command Suite • 5 Primary Gateways
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-wide">
              Tier-1 Country Palettes
            </span>
            <span>🇨🇭 🇯🇵 🇬🇧 🇺🇸 🇫🇷</span>
          </div>
        </div>

        {/* The 5 Massive Buttons (48px font size display scale) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {COUNTRY_NAV_BUTTONS.map((item) => {
            const Icon = item.icon;
            const isActive =
              (item.route === '/' && activeRoute === '/') ||
              (item.route === '/tools' && activeRoute.startsWith('/tools')) ||
              (item.route === '/solutions' &&
                (activeRoute === '/solutions' ||
                  activeRoute.startsWith('/for-') ||
                  activeRoute.includes('-checker'))) ||
              (item.route === '/blog' &&
                (activeRoute.startsWith('/blog') || activeRoute.startsWith('/category/')));

            return (
              <button
                key={item.id}
                id={`mega-nav-btn-${item.id}`}
                onClick={() => onNavigate(item.route)}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative flex flex-col justify-between text-left p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1 active:scale-[0.98] ${
                  isActive
                    ? item.colorClasses.activeCard
                    : `${item.colorClasses.baseCard} ${item.colorClasses.hoverBorder} ${item.colorClasses.glowShadow} shadow-xs`
                }`}
              >
                {/* Top Country Tag & Icon Pill */}
                <div className="flex items-center justify-between gap-2 w-full mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wide uppercase border transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white border-white/30 backdrop-blur-xs'
                        : item.colorClasses.countryBadge
                    }`}
                  >
                    <span className="text-sm leading-none" role="img" aria-label={item.country}>
                      {item.flag}
                    </span>
                    <span className="truncate">{item.country}</span>
                  </span>

                  <div
                    className={`p-2 rounded-xl transition-transform duration-200 group-hover:scale-110 shrink-0 ${
                      isActive ? 'bg-white/20 text-white backdrop-blur-xs' : item.colorClasses.iconBg
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                </div>

                {/* THE 48PX+ BOLD BUTTON TEXT (Exact user mandate: 48px or larger font size) */}
                <div className="my-1.5">
                  <div
                    className={`text-[40px] sm:text-[48px] xl:text-[52px] font-black tracking-tight leading-[1.02] uppercase select-none transition-colors drop-shadow-xs ${
                      isActive ? item.colorClasses.activeTitleColor : item.colorClasses.titleColor
                    }`}
                    style={{
                      fontFamily:
                        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    {item.name}
                  </div>
                </div>

                {/* Bottom Metadata & Intent Cue */}
                <div className="mt-3 pt-2.5 border-t border-current/10 flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span
                      className={`truncate ${
                        isActive ? 'text-white/90' : 'text-slate-600 group-hover:text-slate-900'
                      }`}
                    >
                      {item.statsText}
                    </span>
                    <ArrowUpRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'
                      }`}
                    />
                  </div>
                  <div
                    className={`text-[9px] uppercase tracking-wider font-extrabold ${
                      isActive ? 'text-white/80' : 'text-slate-600'
                    }`}
                  >
                    {item.themeName}
                  </div>
                </div>

                {/* Top Accent Strip indicator */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 transition-all ${
                    isActive ? 'bg-white/60' : item.colorClasses.accentBar
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
