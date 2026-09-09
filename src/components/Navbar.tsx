import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ChevronDown,
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
} from 'lucide-react';
import { UserProfile } from '../types';

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
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
              <button
                onClick={() => navigateTo('/')}
                className={`transition-colors cursor-pointer ${
                  activeRoute === '/'
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                Scanner
              </button>

              {/* Free Tools Dropdown */}
              <div className="relative" ref={toolsRef}>
                <button
                  onClick={() => {
                    setToolsOpen(!toolsOpen);
                    setSolutionsOpen(false);
                  }}
                  aria-expanded={toolsOpen}
                  className={`flex items-center gap-1.5 py-2 transition-colors cursor-pointer ${
                    activeRoute.startsWith('/tools')
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  <Wrench className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  <span>Free Tools</span>
                  <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {toolsOpen && (
                  <div className="absolute top-full left-0 mt-1 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
                    {/* Featured Tool 1 */}
                    <button
                      type="button"
                      onClick={() => navigateTo('/tools/site-comparison')}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 text-left transition-all cursor-pointer group border border-cyan-200/80 mb-2 shadow-xs"
                    >
                      <div className="p-2 rounded-lg bg-cyan-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          Site Comparison Engine
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-cyan-600 text-white">NEW</span>
                        </div>
                        <div className="text-[11px] text-slate-600 truncate">Side-by-side technical & keyword audit</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {/* Featured Tool 2: AI Keyword Planner */}
                    <button
                      type="button"
                      onClick={() => navigateTo('/tools/keyword-planner')}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-left transition-all cursor-pointer group border border-blue-200/80 mb-2 shadow-xs"
                    >
                      <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          AI Keyword Planner & Clusters
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-600 text-white">NEW</span>
                        </div>
                        <div className="text-[11px] text-slate-600 truncate">25 short + 25 long-tail keywords with volume, CTR & CPM</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {/* Featured Tool 3: Domain Rating & Backlinks Checker */}
                    <button
                      type="button"
                      onClick={() => navigateTo('/tools/domain-rating-checker')}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-left transition-all cursor-pointer group border border-indigo-200/80 mb-2 shadow-xs"
                    >
                      <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          Domain Rating & Backlinks
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-600 text-white">NEW</span>
                        </div>
                        <div className="text-[11px] text-slate-600 truncate">DR, DA, referring domains, keywords & competitors</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {/* Featured Tool 4: XML Sitemap Audit & GSC Validator */}
                    <button
                      type="button"
                      onClick={() => navigateTo('/tools/sitemap-auditor')}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-left transition-all cursor-pointer group border border-teal-200/80 mb-2 shadow-xs"
                    >
                      <div className="p-2 rounded-lg bg-teal-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                        <FileCode className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          XML Sitemap Auditor
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-600 text-white">NEW</span>
                        </div>
                        <div className="text-[11px] text-slate-600 truncate">Audit URL/file, detect mistakes & download clean XML</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Accessibility Audit Utilities
                    </div>

                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => navigateTo('/tools/color-contrast-checker')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Palette className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Color Contrast Checker</div>
                          <div className="text-[11px] text-slate-500">Test WCAG 2.1 AA 4.5:1 ratio</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('/tools/alt-text-checker')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                          <Image className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">AI Alt Text Generator</div>
                          <div className="text-[11px] text-slate-500">Descriptive image alt tags</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('/tools/heading-checker')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Heading className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Heading Hierarchy Tree</div>
                          <div className="text-[11px] text-slate-500">Audit H1-H6 sequential levels</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('/tools/form-accessibility-checker')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <FormInput className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Form Accessibility Validator</div>
                          <div className="text-[11px] text-slate-500">Check labels, inputs & ARIA tags</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('/tools/keyboard-accessibility-checker')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Keyboard className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Keyboard Nav Simulator</div>
                          <div className="text-[11px] text-slate-500">Inspect focus rings & tab order</div>
                        </div>
                      </button>
                    </div>

                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
                      SEO & Growth Utilities
                    </div>

                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => navigateTo('/tools/meta-tag-optimizer')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Search className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Meta Tag Optimizer</div>
                          <div className="text-[11px] text-slate-500">High-CTR titles & descriptions</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('/tools/schema-generator')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <Code2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">JSON-LD Schema Builder</div>
                          <div className="text-[11px] text-slate-500">WebSite & FAQ structured data</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('/tools/keyword-explorer')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                          <Target className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Keyword Opportunity Finder</div>
                          <div className="text-[11px] text-slate-500">Low-competition search queries</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('/tools/content-brief')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">AI Content Brief Builder</div>
                          <div className="text-[11px] text-slate-500">Semantic outlines & target intent</div>
                        </div>
                      </button>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center px-1">
                      <button
                        type="button"
                        onClick={() => navigateTo('/tools')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All Free Tools Hub</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Solutions Dropdown */}
              <div className="relative" ref={solutionsRef}>
                <button
                  onClick={() => {
                    setSolutionsOpen(!solutionsOpen);
                    setToolsOpen(false);
                  }}
                  aria-expanded={solutionsOpen}
                  className={`flex items-center gap-1.5 py-2 transition-colors cursor-pointer ${
                    activeRoute === '/solutions' || activeRoute.startsWith('/for-') || activeRoute.includes('-checker')
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  <Layers className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  <span>Solutions</span>
                  <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {solutionsOpen && (
                  <div className="absolute top-full left-0 mt-1 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      By Platform & CMS
                    </div>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => navigateTo('/shopify-accessibility-checker')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Shopify Store Checker</div>
                          <div className="text-[11px] text-slate-500">Liquid templates, variants & checkout audits</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('/wordpress-accessibility-checker')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">WordPress & WooCommerce</div>
                          <div className="text-[11px] text-slate-500">Elementor, Divi & block theme remediation</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('/webflow-accessibility-checker')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Code2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Webflow Accessibility Test</div>
                          <div className="text-[11px] text-slate-500">Custom interactions & responsive layouts</div>
                        </div>
                      </button>
                    </div>

                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
                      By Target Audience
                    </div>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => navigateTo('/for-agencies')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <Briefcase className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">For Digital Agencies</div>
                          <div className="text-[11px] text-slate-500">White-label reports & multi-client retainers</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('/for-developers')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                          <Code2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">For Web Developers</div>
                          <div className="text-[11px] text-slate-500">Exact CSS selectors & React/JSX snippets</div>
                        </div>
                      </button>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center px-1">
                      <button
                        type="button"
                        onClick={() => navigateTo('/solutions')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Explore All Solutions</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigateTo('/pricing')}
                className={`transition-colors cursor-pointer ${
                  activeRoute === '/pricing'
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                Pricing
              </button>

              <button
                onClick={() => navigateTo('/blog')}
                className={`transition-colors cursor-pointer ${
                  activeRoute.startsWith('/blog')
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                Guides & Resources
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
                        alt={user.fullName}
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
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => navigateTo('/')}
              className="w-full text-left font-bold text-slate-800 p-2 rounded-lg hover:bg-slate-50 text-sm cursor-pointer"
            >
              Website Scanner
            </button>

            <div className="pl-2 space-y-1 border-l-2 border-blue-200">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Free Tools Suite</div>
              <button
                onClick={() => navigateTo('/tools/site-comparison')}
                className="block w-full text-left text-sm font-bold text-cyan-700 bg-cyan-50 p-2 rounded-lg hover:text-cyan-900 cursor-pointer"
              >
                📊 Site Comparison (NEW)
              </button>
              <button
                onClick={() => navigateTo('/tools/keyword-planner')}
                className="block w-full text-left text-sm font-bold text-blue-700 bg-blue-50 p-2 rounded-lg hover:text-blue-900 cursor-pointer"
              >
                ✨ AI Keyword Planner (NEW)
              </button>
              <button
                onClick={() => navigateTo('/tools/domain-rating-checker')}
                className="block w-full text-left text-sm font-bold text-indigo-700 bg-indigo-50 p-2 rounded-lg hover:text-indigo-900 cursor-pointer"
              >
                🌐 Domain Rating Checker (NEW)
              </button>
              <button
                onClick={() => navigateTo('/tools/sitemap-auditor')}
                className="block w-full text-left text-sm font-bold text-teal-700 bg-teal-50 p-2 rounded-lg hover:text-teal-900 cursor-pointer"
              >
                📑 XML Sitemap Auditor (NEW)
              </button>
              <button
                onClick={() => navigateTo('/tools/color-contrast-checker')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                Color Contrast Checker
              </button>
              <button
                onClick={() => navigateTo('/tools/alt-text-checker')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                AI Alt Text Generator
              </button>
              <button
                onClick={() => navigateTo('/tools/heading-checker')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                Heading Hierarchy Tree
              </button>
              <button
                onClick={() => navigateTo('/tools/form-accessibility-checker')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                Form Accessibility Validator
              </button>
              <button
                onClick={() => navigateTo('/tools/keyboard-accessibility-checker')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                Keyboard Nav Simulator
              </button>
              <button
                onClick={() => navigateTo('/tools/meta-tag-optimizer')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                Meta Tag Optimizer
              </button>
              <button
                onClick={() => navigateTo('/tools/schema-generator')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                JSON-LD Schema Builder
              </button>
              <button
                onClick={() => navigateTo('/tools/keyword-explorer')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                Keyword Opportunity Finder
              </button>
              <button
                onClick={() => navigateTo('/tools/content-brief')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                AI Content Brief Builder
              </button>
            </div>

            <div className="pl-2 space-y-1 border-l-2 border-emerald-200">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Solutions & Platforms</div>
              <button
                onClick={() => navigateTo('/solutions')}
                className="block w-full text-left text-sm font-bold text-blue-700 bg-blue-50 p-2 rounded-lg hover:text-blue-900 cursor-pointer"
              >
                ⚡ All Solutions Hub
              </button>
              <button
                onClick={() => navigateTo('/shopify-accessibility-checker')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                Shopify Accessibility
              </button>
              <button
                onClick={() => navigateTo('/wordpress-accessibility-checker')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                WordPress Accessibility
              </button>
              <button
                onClick={() => navigateTo('/webflow-accessibility-checker')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                Webflow Accessibility
              </button>
              <button
                onClick={() => navigateTo('/for-agencies')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                For Digital Agencies
              </button>
              <button
                onClick={() => navigateTo('/for-developers')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600 cursor-pointer"
              >
                For Web Developers
              </button>
            </div>

            <button
              onClick={() => navigateTo('/pricing')}
              className="w-full text-left font-bold text-slate-800 p-2 rounded-lg hover:bg-slate-50 text-sm cursor-pointer"
            >
              Pricing & Plans
            </button>
            <button
              onClick={() => navigateTo('/blog')}
              className="w-full text-left font-bold text-slate-800 p-2 rounded-lg hover:bg-slate-50 text-sm cursor-pointer"
            >
              Guides & Resource Hub
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

