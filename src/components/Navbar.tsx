import React, { useState } from 'react';
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

      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo matching Professional Polish design */}
            <button
              onClick={() => navigateTo('/')}
              aria-label="AccessFix AI Home"
              className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
                <div className="w-4 h-4 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="text-left">
                <span className="text-xl font-bold tracking-tight text-slate-800">
                  AccessFix <span className="text-blue-600">AI</span>
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
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
              <div className="relative">
                <button
                  onClick={() => {
                    setToolsOpen(!toolsOpen);
                    setSolutionsOpen(false);
                  }}
                  onBlur={() => setTimeout(() => setToolsOpen(false), 200)}
                  aria-expanded={toolsOpen}
                  className={`flex items-center gap-1 transition-colors cursor-pointer ${
                    activeRoute.startsWith('/tools')
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  <Wrench className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  <span>Free Tools</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                </button>

                {toolsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[80vh] overflow-y-auto">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Accessibility Tools
                    </div>
                    <button
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

                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
                      SEO & Growth Utilities
                    </div>
                    <button
                      onClick={() => navigateTo('/tools/site-comparison')}
                      className="w-full flex items-center gap-3 p-2 rounded-xl bg-cyan-50/70 hover:bg-cyan-100/80 text-left transition-colors cursor-pointer group border border-cyan-200/60"
                    >
                      <div className="p-1.5 rounded-lg bg-cyan-600 text-white transition-colors">
                        <BarChart3 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          Site Comparison
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-cyan-600 text-white">NEW</span>
                        </div>
                        <div className="text-[11px] text-slate-600">Competitive intelligence & gap analysis</div>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateTo('/tools/meta-tag-optimizer')}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Meta Tag Optimizer</div>
                        <div className="text-[11px] text-slate-500">High-CTR titles & descriptions</div>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateTo('/tools/schema-generator')}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Code2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">JSON-LD Schema Builder</div>
                        <div className="text-[11px] text-slate-500">WebSite & FAQ structured data</div>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateTo('/tools/keyword-explorer')}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Keyword Opportunity Finder</div>
                        <div className="text-[11px] text-slate-500">Low-competition search queries</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Solutions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setSolutionsOpen(!solutionsOpen);
                    setToolsOpen(false);
                  }}
                  onBlur={() => setTimeout(() => setSolutionsOpen(false), 200)}
                  aria-expanded={solutionsOpen}
                  className={`flex items-center gap-1 transition-colors cursor-pointer ${
                    activeRoute.startsWith('/for-') || activeRoute.includes('-checker')
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  <Layers className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  <span>Solutions</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                </button>

                {solutionsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 grid grid-cols-1 gap-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      By Platform
                    </div>
                    <button
                      onClick={() => navigateTo('/shopify-accessibility-checker')}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                      <div className="text-xs font-semibold text-slate-900">Shopify Store Checker</div>
                    </button>
                    <button
                      onClick={() => navigateTo('/wordpress-accessibility-checker')}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <Globe className="w-4 h-4 text-blue-600" />
                      <div className="text-xs font-semibold text-slate-900">WordPress & WooCommerce</div>
                    </button>

                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
                      By Audience
                    </div>
                    <button
                      onClick={() => navigateTo('/for-agencies')}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      <div className="text-xs font-semibold text-slate-900">For Digital Agencies</div>
                    </button>
                    <button
                      onClick={() => navigateTo('/for-developers')}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <Code2 className="w-4 h-4 text-blue-600" />
                      <div className="text-xs font-semibold text-slate-900">For Web Developers</div>
                    </button>
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

                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
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
                          onClick={() => navigateTo('/dashboard')}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 text-left"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>My Websites & Scans</span>
                        </button>
                        <button
                          onClick={() => navigateTo('/admin')}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 text-left"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Admin Portal</span>
                        </button>
                        <button
                          onClick={onLogout}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 text-xs font-semibold text-red-600 text-left"
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
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
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
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <button
              onClick={() => navigateTo('/')}
              className="w-full text-left font-bold text-slate-800 p-2 rounded-lg hover:bg-slate-50 text-sm"
            >
              Website Scanner
            </button>
            <div className="pl-2 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Free Tools</div>
              <button
                onClick={() => navigateTo('/tools/site-comparison')}
                className="block w-full text-left text-sm font-bold text-cyan-700 bg-cyan-50 p-1.5 rounded-lg hover:text-cyan-900"
              >
                📊 Site Comparison (NEW)
              </button>
              <button
                onClick={() => navigateTo('/tools/color-contrast-checker')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600"
              >
                Color Contrast Checker
              </button>
              <button
                onClick={() => navigateTo('/tools/alt-text-checker')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600"
              >
                AI Alt Text Generator
              </button>
              <button
                onClick={() => navigateTo('/tools/heading-checker')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600"
              >
                Heading Hierarchy Tree
              </button>
            </div>

            <div className="pl-2 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Solutions</div>
              <button
                onClick={() => navigateTo('/shopify-accessibility-checker')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600"
              >
                Shopify Accessibility
              </button>
              <button
                onClick={() => navigateTo('/wordpress-accessibility-checker')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600"
              >
                WordPress Accessibility
              </button>
              <button
                onClick={() => navigateTo('/for-agencies')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600"
              >
                For Agencies
              </button>
              <button
                onClick={() => navigateTo('/for-developers')}
                className="block w-full text-left text-sm text-slate-600 p-1.5 hover:text-blue-600"
              >
                For Developers
              </button>
            </div>

            <button
              onClick={() => navigateTo('/pricing')}
              className="w-full text-left font-bold text-slate-800 p-2 rounded-lg hover:bg-slate-50 text-sm"
            >
              Pricing & Plans
            </button>
            <button
              onClick={() => navigateTo('/blog')}
              className="w-full text-left font-bold text-slate-800 p-2 rounded-lg hover:bg-slate-50 text-sm"
            >
              Guides & Resource Hub
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => navigateTo('/dashboard')}
                    className="w-full py-2.5 text-center font-bold text-white bg-blue-600 rounded-xl"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full py-2 text-center text-xs font-semibold text-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAuth('signin')}
                    className="w-full py-2 text-center font-bold text-slate-700 bg-slate-100 rounded-xl"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="w-full py-2.5 text-center font-bold text-white bg-blue-600 rounded-xl"
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
