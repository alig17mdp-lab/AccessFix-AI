import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { HeroScanner } from './components/HeroScanner';
import { ReportView } from './components/ReportView';
import { UnifiedHealthReportView } from './components/UnifiedHealthReportView';
import { DashboardView } from './components/DashboardView';
import { FreeToolsView } from './components/FreeToolsView';
import { SeoLandingPage } from './components/SeoLandingPage';
import { BlogView } from './components/BlogView';
import { BlogPostView } from './components/BlogPostView';
import { AuthorProfileView } from './components/AuthorProfileView';
import { PricingSection } from './components/PricingSection';
import { LegalPage } from './components/LegalPage';
import { AdminView } from './components/AdminView';
import { AuthModal } from './components/AuthModal';
import { SiteComparisonView } from './components/SiteComparisonView';
import { KeywordPlannerView } from './components/KeywordPlannerView';
import { KineticMotionExperience } from './components/KineticMotionExperience';
import { UserProfile, MonitoredWebsite, ScanResult, UnifiedHealthScan, BlogPost, ArticleCategory } from './types';
import { BLOG_POSTS } from './data/blogData';
import { AUTHORS } from './data/authorsData';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Award,
  Lock,
  ArrowRight,
  CheckCircle2,
  Code,
  Layers,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  const [activeRoute, setActiveRoute] = useState<string>('/');
  const [user, setUser] = useState<UserProfile | null>({
    id: 'usr_demo_123',
    email: 'alex.developer@accessfix.ai',
    fullName: 'Alex Morgan',
    role: 'admin',
    plan: 'pro',
    createdAt: new Date().toISOString(),
    scansThisMonth: 14,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  });

  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [currentUnifiedScan, setCurrentUnifiedScan] = useState<UnifiedHealthScan | null>(null);
  const [monitoredWebsites, setMonitoredWebsites] = useState<MonitoredWebsite[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedAuthorSlug, setSelectedAuthorSlug] = useState<string>('elena-rostova');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isHeroScanning, setIsHeroScanning] = useState<boolean>(false);

  // Auto-resolve post if activeRoute is /blog/:slug
  useEffect(() => {
    if (activeRoute.startsWith('/blog/') && activeRoute.length > 6) {
      const slug = activeRoute.replace('/blog/', '');
      const match = BLOG_POSTS.find((p) => p.slug === slug);
      if (match) {
        setSelectedPost(match);
      }
    }
  }, [activeRoute]);

  // Fetch initial monitored websites
  useEffect(() => {
    fetch('/api/websites')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMonitoredWebsites(data);
      })
      .catch(() => {});
  }, []);

  const handleNavigate = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScanComplete = (result: ScanResult, unifiedResult?: UnifiedHealthScan) => {
    setCurrentScan(result);
    if (unifiedResult) {
      setCurrentUnifiedScan(unifiedResult);
      setActiveRoute('/health-report');
    } else {
      setActiveRoute('/report');
    }
  };

  const handleRescanUrl = async (url: string) => {
    setIsHeroScanning(true);
    try {
      const res = await fetch('/api/health-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        const unifiedData = await res.json();
        setCurrentUnifiedScan(unifiedData);
        setCurrentScan(unifiedData.accessibilityScan);
        setActiveRoute('/health-report');
      } else {
        const fallbackRes = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        const data = await fallbackRes.json();
        setCurrentScan(data);
        setActiveRoute('/report');
      }
    } catch (e) {
      console.error('Rescan failed:', e);
    } finally {
      setIsHeroScanning(false);
    }
  };

  const handleAddWebsite = async (url: string, frequency: 'daily' | 'weekly' | 'monthly') => {
    const res = await fetch('/api/websites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, scanFrequency: frequency }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add website');
    }
    const newSite = await res.json();
    setMonitoredWebsites((prev) => [newSite, ...prev]);
  };

  const handleRescanWebsite = async (url: string) => {
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Rescan failed');
    }
    const result: ScanResult = await res.json();
    setMonitoredWebsites((prev) =>
      prev.map((w) =>
        w.url === url
          ? {
              ...w,
              lastScanScore: result.score,
              lastScannedAt: result.scannedAt,
              lastScanResult: result,
            }
          : w
      )
    );
  };

  const handleDeleteWebsite = async (id: string) => {
    await fetch(`/api/websites/${id}`, { method: 'DELETE' });
    setMonitoredWebsites((prev) => prev.filter((w) => w.id !== id));
  };

  const handleViewSampleReport = async () => {
    setIsHeroScanning(true);
    try {
      const res = await fetch('/api/health-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://acme-store.example.com' }),
      });
      if (res.ok) {
        const unifiedData = await res.json();
        setCurrentUnifiedScan(unifiedData);
        setCurrentScan(unifiedData.accessibilityScan);
        setActiveRoute('/health-report');
      } else {
        const fallback = await fetch('/api/scan/sample', { method: 'POST' });
        const data = await fallback.json();
        setCurrentScan(data);
        setActiveRoute('/report');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsHeroScanning(false);
    }
  };

  const handleSelectPlan = (planId: string, billingCycle: 'monthly' | 'yearly') => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setUser((prev) => (prev ? { ...prev, plan: planId as any } : null));
    alert(`Success! Your account has been upgraded to the ${planId.toUpperCase()} (${billingCycle}) tier.`);
    setActiveRoute('/dashboard');
  };

  // Derive current category if on /category/:category
  const activeCategoryParam = activeRoute.startsWith('/category/')
    ? (activeRoute.replace('/category/', '') as ArticleCategory)
    : 'all';

  // Derive author if on /authors/:author
  const activeAuthorProfile = activeRoute.startsWith('/authors/')
    ? AUTHORS[activeRoute.replace('/authors/', '')] || AUTHORS['elena-rostova']
    : AUTHORS[selectedAuthorSlug] || AUTHORS['elena-rostova'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Universal Navbar */}
      <Navbar
        user={user}
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        onOpenAuth={(mode = 'signin') => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onLogout={() => setUser(null)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* ROUTE 1: Home View */}
        {activeRoute === '/' && (
          <div>
            <HeroScanner
              onScanComplete={handleScanComplete}
              onViewSample={handleViewSampleReport}
              isLoading={isHeroScanning}
              setIsLoading={setIsHeroScanning}
            />

            {/* Why AccessFix AI Section */}
            <section className="py-20 bg-[#f8fafc] border-y border-slate-200/80 relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100/80 px-3.5 py-1 rounded-full border border-blue-200/60">
                    Complete Remediation Workflow
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    Beyond Simple Warnings: Actionable Code Fixes
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600">
                    Most checkers leave you with vague errors. AccessFix AI diagnoses the root cause, explains the impact on disabled users, and writes the code to fix it.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950">1. Instant 40+ Point Audit</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Evaluates color contrast, image alt attributes, keyboard traps, ARIA landmarks, form inputs, and document structure against WCAG 2.1 Level AA.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-100">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950">2. Plain-English Explanations</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Translates complex WCAG specifications into plain language so product managers and business owners understand the real-world impact.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                      <Code className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950">3. Drop-in Code Remediations</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Synthesizes corrected HTML, React JSX, WordPress PHP, and Shopify Liquid snippets ready to merge directly into your codebase.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Platform Integrations Strip */}
            <section className="py-16 bg-slate-900 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Universal Compatibility
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">
                  Works with Any Modern Web Architecture
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-slate-300">
                  <span className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                    Shopify & Liquid
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                    WordPress & WooCommerce
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                    React & Next.js
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                    Webflow & Framer
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                    Vue & Nuxt
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                    HTML5 & Tailwind
                  </span>
                </div>
              </div>
            </section>

            {/* Pricing Preview on Homepage */}
            <PricingSection
              onSelectPlan={handleSelectPlan}
              currentPlan={user?.plan || 'free'}
            />
          </div>
        )}

        {/* ROUTE 2A: Unified Multi-Pillar Health Report View */}
        {activeRoute === '/health-report' && currentUnifiedScan && (
          <UnifiedHealthReportView
            healthScan={currentUnifiedScan}
            scan={currentUnifiedScan}
            onBackToScan={() => setActiveRoute('/')}
            onAddToMonitoring={(url) => {
              handleAddWebsite(url, 'weekly');
              alert(`Added ${url} to your monitored websites dashboard!`);
              setActiveRoute('/dashboard');
            }}
            onOpenAuth={() => setAuthModalOpen(true)}
            onRescan={handleRescanUrl}
            onNavigate={handleNavigate}
            onNavigateToTool={(toolSlug) => handleNavigate(`/tools/${toolSlug}`)}
          />
        )}

        {/* ROUTE 2B: Deep-Dive Accessibility Scan Report View */}
        {activeRoute === '/report' && currentScan && (
          <ReportView
            scan={currentScan}
            onBackToScan={() => setActiveRoute('/')}
            onAddToMonitoring={(url) => {
              handleAddWebsite(url, 'weekly');
              alert(`Added ${url} to your monitored websites dashboard!`);
              setActiveRoute('/dashboard');
            }}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* ROUTE 3: SaaS Dashboard */}
        {activeRoute === '/dashboard' && user && (
          <DashboardView
            user={user}
            websites={monitoredWebsites}
            onAddWebsite={handleAddWebsite}
            onRescanWebsite={handleRescanWebsite}
            onDeleteWebsite={handleDeleteWebsite}
            onViewReport={(scan) => {
              setCurrentScan(scan);
              setActiveRoute('/report');
            }}
            onUpgradePlan={() => setActiveRoute('/pricing')}
            onNavigate={handleNavigate}
          />
        )}

        {/* ROUTE 4: Admin Telemetry & Content Hub */}
        {activeRoute === '/admin' && user && (
          <AdminView
            currentUser={user}
            onBack={() => setActiveRoute('/dashboard')}
            onSelectPost={(post) => {
              setSelectedPost(post);
              setActiveRoute(`/blog/${post.slug}`);
            }}
            onNavigate={handleNavigate}
          />
        )}

        {/* ROUTE 5: Pricing Page */}
        {activeRoute === '/pricing' && (
          <PricingSection
            onSelectPlan={handleSelectPlan}
            currentPlan={user?.plan || 'free'}
          />
        )}

        {/* ROUTE 6: Blog & Category Knowledge Hub */}
        {(activeRoute === '/blog' || activeRoute.startsWith('/category/')) && (
          <BlogView
            initialCategory={activeCategoryParam}
            onSelectPost={(post) => {
              setSelectedPost(post);
              setActiveRoute(`/blog/${post.slug}`);
            }}
            onSelectAuthor={(authorSlug) => {
              setSelectedAuthorSlug(authorSlug);
              setActiveRoute(`/authors/${authorSlug}`);
            }}
            onNavigate={handleNavigate}
          />
        )}

        {/* ROUTE 7: Detailed Blog Post View */}
        {activeRoute.startsWith('/blog/') && (
          <BlogPostView
            post={
              selectedPost ||
              BLOG_POSTS.find((p) => p.slug === activeRoute.replace('/blog/', '')) ||
              BLOG_POSTS[0]
            }
            onBack={() => setActiveRoute('/blog')}
            onSelectPost={(post) => {
              setSelectedPost(post);
              setActiveRoute(`/blog/${post.slug}`);
            }}
            onSelectAuthor={(authorSlug) => {
              setSelectedAuthorSlug(authorSlug);
              setActiveRoute(`/authors/${authorSlug}`);
            }}
            onNavigate={handleNavigate}
          />
        )}

        {/* ROUTE 8: Author Profile View */}
        {activeRoute.startsWith('/authors/') && activeAuthorProfile && (
          <AuthorProfileView
            author={activeAuthorProfile}
            articles={BLOG_POSTS}
            onSelectArticle={(post) => {
              setSelectedPost(post);
              setActiveRoute(`/blog/${post.slug}`);
            }}
            onBack={() => setActiveRoute('/blog')}
            onNavigate={handleNavigate}
          />
        )}

        {/* ROUTE 9: Site Comparison & Competitive Intelligence Engine */}
        {activeRoute === '/tools/site-comparison' && (
          <SiteComparisonView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10: World-Class AI Keyword Planner & Semantic Clusters */}
        {(activeRoute === '/tools/keyword-planner' || activeRoute === '/tools/keyword-planning') && (
          <KeywordPlannerView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 11: Free Tools Suite (Accessibility + SEO + Growth) */}
        {activeRoute.startsWith('/tools') &&
          activeRoute !== '/tools/site-comparison' &&
          activeRoute !== '/tools/keyword-planner' &&
          activeRoute !== '/tools/keyword-planning' && (
          <FreeToolsView
            initialTool={
              activeRoute === '/tools/alt-text-checker'
                ? 'alt-text'
                : activeRoute === '/tools/heading-checker'
                ? 'heading'
                : activeRoute === '/tools/form-accessibility-checker'
                ? 'form'
                : activeRoute === '/tools/keyboard-accessibility-checker'
                ? 'keyboard'
                : activeRoute === '/tools/meta-tag-optimizer'
                ? 'meta-tags'
                : activeRoute === '/tools/schema-generator'
                ? 'schema-builder'
                : activeRoute === '/tools/keyword-explorer'
                ? 'keywords'
                : activeRoute === '/tools/content-brief'
                ? 'content-brief'
                : 'contrast'
            }
            onNavigate={handleNavigate}
          />
        )}


        {/* ROUTE 10: Platform & Audience SEO Landing Pages */}
        {(activeRoute === '/solutions' ||
          activeRoute === '/accessibility-checker' ||
          activeRoute === '/ada-compliance-checker' ||
          activeRoute === '/wcag-checker' ||
          activeRoute === '/website-accessibility-test' ||
          activeRoute === '/accessibility-testing' ||
          activeRoute === '/shopify-accessibility-checker' ||
          activeRoute === '/wordpress-accessibility-checker' ||
          activeRoute === '/wix-accessibility-checker' ||
          activeRoute === '/webflow-accessibility-checker' ||
          activeRoute === '/for-agencies' ||
          activeRoute === '/for-developers' ||
          activeRoute === '/for-ecommerce' ||
          activeRoute === '/for-small-business') && (
          <SeoLandingPage
            slug={activeRoute === '/solutions' ? 'accessibility-checker' : activeRoute.replace('/', '')}
            onScanComplete={handleScanComplete}
            onNavigate={handleNavigate}
          />
        )}

        {/* ROUTE 11: Legal & Trust Pages */}
        {(activeRoute === '/privacy' ||
          activeRoute === '/terms' ||
          activeRoute === '/disclaimer' ||
          activeRoute === '/accessibility-statement' ||
          activeRoute === '/refund-policy' ||
          activeRoute === '/contact') && (
          <LegalPage section={activeRoute.replace('/', '') as any} />
        )}
      </main>

      {/* Ambient Quantum Kinetic Motion Experience (Cursor Synapse Halo, Particles, Holographic Radar) */}
      <KineticMotionExperience />

      {/* Floating Accessibility Preferences Toolbar */}
      <AccessibilityToolbar />

      {/* Universal Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(newUser) => {
          setUser(newUser);
          setActiveRoute('/dashboard');
        }}
      />
    </div>
  );
}

