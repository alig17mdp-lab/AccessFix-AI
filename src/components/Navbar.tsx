import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Wrench,
  Sparkles,
  Layers,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Palette,
  Image,
  Heading,
  FormInput,
  Keyboard,
  Briefcase,
  Code2,
  ShoppingBag,
  Globe,
  BarChart3,
  Search,
  FileText,
  Target,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  FileCode,
  Network,
  Bot,
  Gauge,
  Clock,
} from 'lucide-react';
import { UserProfile } from '../types';
import { FREE_TOOLS_CATEGORIES, SOLUTIONS_CATEGORIES } from '../data/navCategoriesData';

interface NavbarProps {
  user: UserProfile | null;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeRoute,
  onNavigate,
  onOpenAuth,
  onLogout,
}) => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Category selections for dropdown master-detail navigation
  const [activeToolsCatId, setActiveToolsCatId] = useState<string>('technical-seo');
  const [activeSolutionsCatId, setActiveSolutionsCatId] = useState<string>('ai-solutions');

  // Mobile accordion states
  const [mobileExpandedToolsCat, setMobileExpandedToolsCat] = useState<string | null>('technical-seo');
  const [mobileExpandedSolutionsCat, setMobileExpandedSolutionsCat] = useState<string | null>('ai-solutions');

  const currentToolsCat =
    FREE_TOOLS_CATEGORIES.find((c) => c.id === activeToolsCatId) || FREE_TOOLS_CATEGORIES[0];
  const currentSolutionsCat =
    SOLUTIONS_CATEGORIES.find((c) => c.id === activeSolutionsCatId) || SOLUTIONS_CATEGORIES[0];

  const toolsRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const navigateTo = (route: string) => {
    onNavigate(route);
    setToolsOpen(false);
    setSolutionsOpen(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Skip Navigation Link for Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:shadow-xl focus:outline-none"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Back to Scanner Button */}
            <div className="flex items-center gap-2">
              {/* Back to Scanner Arrow Button */}
              <button
                id="header-back-to-scanner-btn"
                onClick={() => navigateTo('/')}
                title="Back to Scanner (Landing Page)"
                aria-label="Back to Scanner landing page"
                className={`group flex items-center justify-center w-8 h-8 rounded-lg border transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  activeRoute === '/'
                    ? 'bg-slate-100/70 text-slate-400 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                    : 'bg-white text-slate-700 border-slate-300/90 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400 shadow-xs active:scale-95'
                }`}
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* Logo */}
              <button
                onClick={() => navigateTo('/')}
                aria-label="AccessFix AI Home"
                className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg p-1 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-800 to-blue-600 flex items-center justify-center text-white shadow-xs group-hover:from-blue-900 group-hover:to-blue-700 transition-all">
                  <div className="w-4 h-4 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full"></div>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-xl font-extrabold tracking-tight text-slate-950">
                    AccessFix <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">AI</span>
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-3 text-sm font-semibold">
              {/* 1. Scanner - Switzerland (Swiss Precision Red) */}
              <button
                onClick={() => navigateTo('/')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-sm tracking-tight transition-all cursor-pointer ${
                  activeRoute === '/'
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/20 ring-2 ring-red-400'
                    : 'text-slate-800 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200'
                }`}
                title="Switzerland • Swiss Precision Red"
              >
                <span className="text-base leading-none" role="img" aria-label="Switzerland">🇨🇭</span>
                <span className="uppercase tracking-wide font-black">Scanner</span>
              </button>

              {/* 2. Free Tools - Japan (Tokyo Cyber Emerald) */}
              <div className="relative" ref={toolsRef}>
                <button
                  onClick={() => {
                    setToolsOpen(!toolsOpen);
                    setSolutionsOpen(false);
                  }}
                  aria-expanded={toolsOpen}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-sm tracking-tight transition-all cursor-pointer ${
                    activeRoute.startsWith('/tools')
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400'
                      : 'text-slate-800 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200'
                  }`}
                  title="Japan • Tokyo Cyber Emerald"
                >
                  <span className="text-base leading-none" role="img" aria-label="Japan">🇯🇵</span>
                  <span className="uppercase tracking-wide font-black">Free Tools</span>
                  <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {toolsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[720px] max-w-[94vw] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden flex flex-col h-[530px] max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex flex-row divide-x divide-slate-100 h-full min-h-0 overflow-hidden">
                      {/* Left Column: Categories List */}
                      <div className="w-64 bg-slate-50/75 p-2.5 flex flex-col justify-between shrink-0 overflow-y-auto h-full min-h-0">
                        <div>
                          <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Tool Categories
                          </div>
                          <div className="space-y-1 mt-1">
                            {FREE_TOOLS_CATEGORIES.map((cat) => {
                              const Icon = cat.icon;
                              const isSelected = activeToolsCatId === cat.id;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onMouseEnter={() => setActiveToolsCatId(cat.id)}
                                  onClick={() => setActiveToolsCatId(cat.id)}
                                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                                    isSelected
                                      ? 'bg-white shadow-xs border border-slate-200 text-blue-700 font-bold'
                                      : 'text-slate-700 hover:bg-white/80 hover:text-slate-900 border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                      className={`p-1.5 rounded-lg transition-colors ${
                                        isSelected
                                          ? 'bg-blue-600 text-white shadow-xs'
                                          : 'bg-slate-200/70 text-slate-600 group-hover:bg-slate-200'
                                      }`}
                                    >
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="truncate">
                                      <div className="text-xs font-semibold leading-tight">{cat.shortLabel}</div>
                                    </div>
                                  </div>
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 transition-transform ${
                                      isSelected
                                        ? 'text-blue-600 translate-x-0.5'
                                        : 'text-slate-600 group-hover:text-slate-600'
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Bottom Tools Hub Link */}
                        <div className="p-1 pt-2.5 border-t border-slate-200/60 mt-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setToolsOpen(false);
                              navigateTo('/tools');
                            }}
                            className="w-full text-left text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center justify-between p-1.5 rounded-lg hover:bg-blue-50/60 cursor-pointer transition-colors"
                          >
                            <span>Explore All 21+ Tools Hub</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Right Column: Tools inside the selected category */}
                      <div className="flex-1 p-3.5 bg-white flex flex-col min-h-0 h-full overflow-hidden">
                        {/* Category Header Banner */}
                        <div className="pb-2.5 mb-2 border-b border-slate-100 flex items-start justify-between gap-2 shrink-0">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-black text-slate-900">
                                {currentToolsCat.title}
                              </h4>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                                {currentToolsCat.tools.length} Tools
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                              {currentToolsCat.description}
                            </p>
                          </div>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                            Instant Run
                          </span>
                        </div>

                        {/* Tool list items with dedicated vertical scrolling */}
                        <div className="flex-1 overflow-y-auto pr-1.5 space-y-1 overscroll-contain min-h-0 divide-y divide-transparent">
                          {currentToolsCat.tools.map((tool) => {
                            const ToolIcon = tool.icon;
                            return (
                              <button
                                key={tool.id}
                                type="button"
                                onClick={() => {
                                  setToolsOpen(false);
                                  navigateTo(tool.route);
                                }}
                                className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-xl hover:bg-slate-50 text-left transition-all cursor-pointer group border border-transparent hover:border-slate-200/80"
                              >
                                <div
                                  className={`p-2 rounded-lg ${tool.iconBg} shrink-0 transition-transform group-hover:scale-105 shadow-2xs`}
                                >
                                  <ToolIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                    {tool.name}
                                  </span>
                                  {tool.badge && (
                                    <span
                                      className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                                        tool.badgeType === 'ai'
                                          ? 'bg-purple-600 text-white'
                                          : tool.badgeType === 'new'
                                          ? 'bg-emerald-600 text-white'
                                          : tool.badgeType === 'critical'
                                          ? 'bg-rose-600 text-white'
                                          : tool.badgeType === 'popular'
                                          ? 'bg-blue-600 text-white'
                                          : tool.badgeType === 'wcag'
                                          ? 'bg-indigo-600 text-white'
                                          : 'bg-slate-200 text-slate-700'
                                      }`}
                                    >
                                      {tool.badge}
                                    </span>
                                  )}
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-blue-600 shrink-0" />
                              </button>
                            );
                          })}
                        </div>

                        {/* Bottom Status strip */}
                        <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] px-1 text-slate-600 shrink-0">
                          <span>100% Client-Side Engine &bull; Zero Login Required</span>
                          <button
                            type="button"
                            onClick={() => {
                              setToolsOpen(false);
                              navigateTo('/tools');
                            }}
                            className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open Category Hub</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Solutions - United Kingdom (Sovereign Royal Azure) */}
              <div className="relative" ref={solutionsRef}>
                <button
                  onClick={() => {
                    setSolutionsOpen(!solutionsOpen);
                    setToolsOpen(false);
                  }}
                  aria-expanded={solutionsOpen}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-sm tracking-tight transition-all cursor-pointer ${
                    activeRoute === '/solutions' || activeRoute.startsWith('/for-') || activeRoute.includes('-checker')
                      ? 'bg-blue-700 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-400'
                      : 'text-slate-800 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-200'
                  }`}
                  title="United Kingdom • Sovereign Royal Azure"
                >
                  <span className="text-base leading-none" role="img" aria-label="United Kingdom">🇬🇧</span>
                  <span className="uppercase tracking-wide font-black">Solutions</span>
                  <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {solutionsOpen && (
                  <div className="absolute top-full -left-16 sm:-left-20 lg:-left-24 mt-2 w-[660px] max-w-[94vw] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden flex flex-col max-h-[min(620px,82vh)] animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex flex-row divide-x divide-slate-100 h-full min-h-0 overflow-hidden">
                      {/* Left Column: Solutions Categories List */}
                      <div className="w-56 bg-slate-50/75 p-2.5 flex flex-col justify-between shrink-0 overflow-y-auto">
                        <div>
                          <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Solution Suites
                          </div>
                          <div className="space-y-1 mt-1">
                            {SOLUTIONS_CATEGORIES.map((cat) => {
                              const Icon = cat.icon;
                              const isSelected = activeSolutionsCatId === cat.id;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onMouseEnter={() => setActiveSolutionsCatId(cat.id)}
                                  onClick={() => setActiveSolutionsCatId(cat.id)}
                                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                                    isSelected
                                      ? 'bg-white shadow-xs border border-slate-200 text-blue-700 font-bold'
                                      : 'text-slate-700 hover:bg-white/80 hover:text-slate-900 border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                      className={`p-1.5 rounded-lg transition-colors ${
                                        isSelected
                                          ? 'bg-blue-600 text-white shadow-xs'
                                          : 'bg-slate-200/70 text-slate-600 group-hover:bg-slate-200'
                                      }`}
                                    >
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="truncate">
                                      <div className="text-xs font-semibold leading-tight">{cat.shortLabel}</div>
                                    </div>
                                  </div>
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 transition-transform ${
                                      isSelected
                                        ? 'text-blue-600 translate-x-0.5'
                                        : 'text-slate-600 group-hover:text-slate-600'
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Bottom Solutions Hub Link */}
                        <div className="p-1 pt-2.5 border-t border-slate-200/60 mt-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSolutionsOpen(false);
                              navigateTo('/solutions');
                            }}
                            className="w-full text-left text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center justify-between p-1.5 rounded-lg hover:bg-blue-50/60 cursor-pointer transition-colors"
                          >
                            <span>Explore All Solutions Hub</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Right Column: Solutions inside the selected category */}
                      <div className="flex-1 p-3.5 bg-white flex flex-col justify-between min-h-0 overflow-hidden">
                        {/* Solutions Category Header Banner */}
                        <div className="pb-2.5 mb-2 border-b border-slate-100 flex items-start justify-between gap-2 shrink-0">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-black text-slate-900">
                                {currentSolutionsCat.title}
                              </h4>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                                {currentSolutionsCat.tools.length} Suites
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                              {currentSolutionsCat.description}
                            </p>
                          </div>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                            Enterprise Ready
                          </span>
                        </div>

                        {/* Solution items list with dedicated vertical scrolling */}
                        <div className="flex-1 overflow-y-auto pr-1.5 space-y-1 overscroll-contain divide-y divide-transparent">
                          {currentSolutionsCat.tools.map((item) => {
                            const ItemIcon = item.icon;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setSolutionsOpen(false);
                                  navigateTo(item.route);
                                }}
                                className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-xl hover:bg-slate-50 text-left transition-all cursor-pointer group border border-transparent hover:border-slate-200/80"
                              >
                                <div
                                  className={`p-2 rounded-lg ${item.iconBg} shrink-0 transition-transform group-hover:scale-105 shadow-2xs`}
                                >
                                  <ItemIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                    {item.name}
                                  </span>
                                  {item.badge && (
                                    <span
                                      className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                                        item.badgeType === 'ai'
                                          ? 'bg-purple-600 text-white'
                                          : item.badgeType === 'new'
                                          ? 'bg-emerald-600 text-white'
                                          : item.badgeType === 'popular'
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-slate-200 text-slate-700'
                                      }`}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-blue-600 shrink-0" />
                              </button>
                            );
                          })}
                        </div>

                        {/* Bottom Status strip */}
                        <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] px-1 text-slate-600 shrink-0">
                          <span>Framework Specific Audits &bull; Automated Remediations</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSolutionsOpen(false);
                              navigateTo('/solutions');
                            }}
                            className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                          >
                            <span>View All Solutions</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Pricing - United States (Silicon Valley Electric Gold) */}
              <button
                onClick={() => navigateTo('/pricing')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-sm tracking-tight transition-all cursor-pointer ${
                  activeRoute === '/pricing'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-300'
                    : 'text-slate-800 hover:text-amber-800 hover:bg-amber-50 border border-transparent hover:border-amber-200'
                }`}
                title="United States • Silicon Valley Electric Gold"
              >
                <span className="text-base leading-none" role="img" aria-label="United States">🇺🇸</span>
                <span className="uppercase tracking-wide font-black">Pricing</span>
              </button>

              {/* 5. Guides - France (French Riviera Luxe Violet) */}
              <button
                onClick={() => navigateTo('/blog')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-sm tracking-tight transition-all cursor-pointer ${
                  activeRoute.startsWith('/blog') || activeRoute.startsWith('/category/')
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 ring-2 ring-purple-400'
                    : 'text-slate-800 hover:text-purple-700 hover:bg-purple-50 border border-transparent hover:border-purple-200'
                }`}
                title="France • French Riviera Luxe"
              >
                <span className="text-base leading-none" role="img" aria-label="France">🇫🇷</span>
                <span className="uppercase tracking-wide font-black">Guides</span>
              </button>
            </nav>

            {/* Right Action Bar */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <button
                    onClick={() => navigateTo('/dashboard')}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-600" />
                    <span>Dashboard</span>
                  </button>

                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      aria-label="User profile menu"
                      className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <img
                        src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={user.fullName || 'User profile photo'}
                        width={32}
                        height={32}
                        loading="lazy"
                        decoding="async"
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                      />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                        <div className="p-2 border-b border-slate-100">
                          <div className="text-xs font-bold text-slate-900">{user.fullName}</div>
                          <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                          <div className="mt-1 inline-block text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                            {user.plan.toUpperCase()} Plan
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigateTo('/dashboard')}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 text-left cursor-pointer"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>My Websites & Scans</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo('/tools/site-comparison')}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-cyan-50 text-xs font-semibold text-cyan-800 text-left cursor-pointer"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Site Comparison</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo('/admin')}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 text-left cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Admin Portal</span>
                        </button>
                        <button
                          type="button"
                          onClick={onLogout}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 text-xs font-semibold text-red-600 text-left cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAuth('signin')}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 hover:from-blue-800 hover:to-blue-700 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
            {/* Quick 5-Country Command Strip for Mobile */}
            <div className="p-2 rounded-2xl bg-slate-100/80 border border-slate-200/80 space-y-1.5">
              <div className="px-1 text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>5 Global Gateways</span>
                <span>🇨🇭 🇯🇵 🇬🇧 🇺🇸 🇫🇷</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => navigateTo('/')}
                  className={`p-2 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition-all ${
                    activeRoute === '/'
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-red-300'
                  }`}
                >
                  <span className="text-base">🇨🇭</span>
                  <div className="truncate">
                    <div className="text-xs font-black leading-tight uppercase">Scanner</div>
                    <div className={`text-[9px] truncate ${activeRoute === '/' ? 'text-red-100' : 'text-slate-600'}`}>Swiss Precision</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('/tools')}
                  className={`p-2 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition-all ${
                    activeRoute.startsWith('/tools')
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <span className="text-base">🇯🇵</span>
                  <div className="truncate">
                    <div className="text-xs font-black leading-tight uppercase">Free Tools</div>
                    <div className={`text-[9px] truncate ${activeRoute.startsWith('/tools') ? 'text-emerald-100' : 'text-slate-600'}`}>Tokyo Emerald</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('/solutions')}
                  className={`p-2 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition-all ${
                    activeRoute === '/solutions'
                      ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-base">🇬🇧</span>
                  <div className="truncate">
                    <div className="text-xs font-black leading-tight uppercase">Solutions</div>
                    <div className={`text-[9px] truncate ${activeRoute === '/solutions' ? 'text-blue-100' : 'text-slate-600'}`}>Royal Azure</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('/pricing')}
                  className={`p-2 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition-all ${
                    activeRoute === '/pricing'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <span className="text-base">🇺🇸</span>
                  <div className="truncate">
                    <div className="text-xs font-black leading-tight uppercase">Pricing</div>
                    <div className={`text-[9px] truncate ${activeRoute === '/pricing' ? 'text-amber-950 font-bold' : 'text-slate-600'}`}>Silicon Gold</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('/blog')}
                  className={`col-span-2 p-2 rounded-xl text-left border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                    activeRoute.startsWith('/blog')
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">🇫🇷</span>
                    <div className="truncate">
                      <div className="text-xs font-black leading-tight uppercase">Guides &amp; Resources Hub</div>
                      <div className={`text-[9px] truncate ${activeRoute.startsWith('/blog') ? 'text-purple-100' : 'text-slate-600'}`}>French Riviera Luxe Violet</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />
                </button>
              </div>
            </div>

            {/* Free Tools Suite - Categorized Accordions */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/20 p-2.5 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" /> Free Tools by Category
                </span>
                <button
                  type="button"
                  onClick={() => navigateTo('/tools')}
                  className="text-[10px] font-bold text-blue-600 hover:underline"
                >
                  All Hub →
                </button>
              </div>

              <div className="space-y-1.5">
                {FREE_TOOLS_CATEGORIES.map((cat) => {
                  const CatIcon = cat.icon;
                  const isExpanded = mobileExpandedToolsCat === cat.id;
                  return (
                    <div key={cat.id} className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpandedToolsCat(isExpanded ? null : cat.id)
                        }
                        className="w-full flex items-center justify-between p-2.5 text-left cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-1 rounded-md bg-blue-50 text-blue-600 shrink-0">
                            <CatIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-slate-900 leading-tight">
                              {cat.shortLabel}
                            </div>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-600 transition-transform duration-200 shrink-0 ${
                            isExpanded ? 'rotate-180 text-blue-600' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="p-2 pt-0 space-y-1 bg-slate-50/50 border-t border-slate-100">
                          {cat.tools.map((tool) => {
                            const ToolIcon = tool.icon;
                            return (
                              <button
                                key={tool.id}
                                type="button"
                                onClick={() => navigateTo(tool.route)}
                                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white text-left transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                              >
                                <div className={`p-1.5 rounded-md ${tool.iconBg} shrink-0`}>
                                  <ToolIcon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                                  <span className="text-xs font-semibold text-slate-800 truncate">
                                    {tool.name}
                                  </span>
                                  {tool.badge && (
                                    <span
                                      className={`text-[8px] font-extrabold uppercase px-1 py-0.2 rounded shrink-0 ${
                                        tool.badgeType === 'ai'
                                          ? 'bg-purple-600 text-white'
                                          : tool.badgeType === 'new'
                                          ? 'bg-emerald-600 text-white'
                                          : tool.badgeType === 'critical'
                                          ? 'bg-rose-600 text-white'
                                          : 'bg-blue-600 text-white'
                                      }`}
                                    >
                                      {tool.badge}
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Solutions & Suites - Categorized Accordions */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-2.5 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Solutions & Suites
                </span>
                <button
                  type="button"
                  onClick={() => navigateTo('/solutions')}
                  className="text-[10px] font-bold text-emerald-700 hover:underline"
                >
                  All Hub →
                </button>
              </div>

              <div className="space-y-1.5">
                {SOLUTIONS_CATEGORIES.map((cat) => {
                  const CatIcon = cat.icon;
                  const isExpanded = mobileExpandedSolutionsCat === cat.id;
                  return (
                    <div key={cat.id} className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpandedSolutionsCat(isExpanded ? null : cat.id)
                        }
                        className="w-full flex items-center justify-between p-2.5 text-left cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 shrink-0">
                            <CatIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-slate-900 leading-tight">
                              {cat.shortLabel}
                            </div>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-600 transition-transform duration-200 shrink-0 ${
                            isExpanded ? 'rotate-180 text-emerald-600' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="p-2 pt-0 space-y-1 bg-slate-50/50 border-t border-slate-100">
                          {cat.tools.map((item) => {
                            const ItemIcon = item.icon;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => navigateTo(item.route)}
                                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white text-left transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                              >
                                <div className={`p-1.5 rounded-md ${item.iconBg} shrink-0`}>
                                  <ItemIcon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                                  <span className="text-xs font-semibold text-slate-800 truncate">
                                    {item.name}
                                  </span>
                                  {item.badge && (
                                    <span
                                      className={`text-[8px] font-extrabold uppercase px-1 py-0.2 rounded shrink-0 ${
                                        item.badgeType === 'ai'
                                          ? 'bg-purple-600 text-white'
                                          : item.badgeType === 'new'
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-slate-200 text-slate-700'
                                      }`}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => navigateTo('/pricing')}
              className={`w-full text-left font-black p-3 rounded-xl text-sm cursor-pointer border flex items-center justify-between transition-colors ${
                activeRoute === '/pricing'
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'text-slate-800 bg-amber-50/40 border-amber-200/80 hover:bg-amber-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🇺🇸</span>
                <span>Pricing &amp; Plans (US Silicon Gold)</span>
              </span>
              <span className="text-xs font-bold text-amber-700">From $0 →</span>
            </button>
            <button
              onClick={() => navigateTo('/blog')}
              className={`w-full text-left font-black p-3 rounded-xl text-sm cursor-pointer border flex items-center justify-between transition-colors ${
                activeRoute.startsWith('/blog') || activeRoute.startsWith('/category/')
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'text-slate-800 bg-purple-50/40 border-purple-200/80 hover:bg-purple-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🇫🇷</span>
                <span>Guides &amp; Resource Hub (French Riviera Luxe)</span>
              </span>
              <span className="text-xs font-bold text-purple-700">18+ Guides →</span>
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => navigateTo('/dashboard')}
                    className="w-full py-2.5 text-center font-bold text-white bg-blue-600 rounded-xl cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full py-2 text-center text-xs font-semibold text-red-600 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAuth('signin')}
                    className="w-full py-2 text-center font-bold text-slate-700 bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="w-full py-2.5 text-center font-bold text-white bg-blue-600 rounded-xl cursor-pointer"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

