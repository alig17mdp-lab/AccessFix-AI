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
import { LegalPage } from './components/LegalPage';
import { AdminView } from './components/AdminView';
import { AuthModal } from './components/AuthModal';
import { SiteComparisonView } from './components/SiteComparisonView';
import { KeywordPlannerView } from './components/KeywordPlannerView';
import { DomainRatingChecker } from './components/DomainRatingChecker';
import { SitemapAuditorView } from './components/SitemapAuditorView';
import { GscIndexationFixer } from './components/GscIndexationFixer';
import { RobotsTxtValidator } from './components/RobotsTxtValidator';
import { InternalLinkAnalyzer } from './components/InternalLinkAnalyzer';
import { AeoAuditorView } from './components/AeoAuditorView';
import { GeoAuditorView } from './components/GeoAuditorView';
import { InpPerformanceDebugger } from './components/InpPerformanceDebugger';
import { ContentHumanizerView } from './components/ContentHumanizerView';
import { McpAgentGeneratorView } from './components/McpAgentGeneratorView';
import { C2paProvenanceView } from './components/C2paProvenanceView';
import { X402MicropaymentsView } from './components/X402MicropaymentsView';
import { SpatialSeoSynthesizerView } from './components/SpatialSeoSynthesizerView';
import { GeoCitationStudioView } from './components/GeoCitationStudioView';
import { AgenticGovernanceView } from './components/AgenticGovernanceView';
import { AiSearchCitationSimulatorView } from './components/AiSearchCitationSimulatorView';
import { ConversationalSchemaGeneratorView } from './components/ConversationalSchemaGeneratorView';
import { BrandKnowledgeGraphGeneratorView } from './components/BrandKnowledgeGraphGeneratorView';
import { BacklinkAuditDisavowView } from './components/BacklinkAuditDisavowView';
import { SingleAnswerPrecisionOptimizer } from './components/SingleAnswerPrecisionOptimizer';
import { TouchTargetSizeCalculator } from './components/TouchTargetSizeCalculator';
import { KineticMotionExperience } from './components/KineticMotionExperience';
import { UserProfile, MonitoredWebsite, ScanResult, UnifiedHealthScan, BlogPost, ArticleCategory, AuditHistoryItem } from './types';
import { BLOG_POSTS } from './data/blogData';
import { AUTHORS } from './data/authorsData';
import { executeUniversalHealthScan, executeUniversalAccessibilityScan } from './utils/clientHealthScanner';
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
  Clock,
  Activity,
  Download,
} from 'lucide-react';

export default function App() {
  const [activeRoute, setActiveRoute] = useState<string>('/');
  // Default to logged out state as requested: "hr user ko log outed web mily"
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('auditsnipe_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [currentUnifiedScan, setCurrentUnifiedScan] = useState<UnifiedHealthScan | null>(null);
  const [monitoredWebsites, setMonitoredWebsites] = useState<MonitoredWebsite[]>([]);
  const [auditHistory, setAuditHistory] = useState<AuditHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('auditsnipe_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedAuthorSlug, setSelectedAuthorSlug] = useState<string>('elena-rostova');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isHeroScanning, setIsHeroScanning] = useState<boolean>(false);

  // Auto-resolve post if activeRoute is /blog/:slug or /guides/:slug
  useEffect(() => {
    let slug = '';
    if (activeRoute.startsWith('/blog/') && activeRoute.length > 6) {
      slug = activeRoute.replace('/blog/', '');
    } else if (activeRoute.startsWith('/guides/') && activeRoute.length > 8) {
      slug = activeRoute.replace('/guides/', '');
    }

    if (slug) {
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

  const handleAuthSuccess = (authedUser: UserProfile) => {
    setUser(authedUser);
    try {
      localStorage.setItem('auditsnipe_user', JSON.stringify(authedUser));
    } catch (e) {
      console.error(e);
    }
    setAuthModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } catch {}
    setUser(null);
    try {
      localStorage.removeItem('auditsnipe_user');
    } catch {}
    if (activeRoute === '/admin' || activeRoute === '/dashboard') {
      setActiveRoute('/');
    }
  };

  const handleScanComplete = (result: ScanResult, unifiedResult?: UnifiedHealthScan) => {
    setCurrentScan(result);

    // Save scan to Pro audit history
    const targetUrl = result.targetUrl || 'https://audited-site.com';
    let domain = targetUrl;
    try {
      domain = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`).hostname;
    } catch {
      domain = targetUrl;
    }

    const historyItem: AuditHistoryItem = {
      id: 'scan_' + Date.now(),
      url: targetUrl,
      domain: domain,
      timestamp: new Date().toISOString(),
      score: unifiedResult ? unifiedResult.overallScore : result.score,
      criticalIssues: result.summary.criticalCount,
      highIssues: result.summary.highCount,
      wcagPassed: result.score >= 90 && result.summary.criticalCount === 0,
      type: unifiedResult ? 'unified_health' : 'accessibility',
      result: result,
      unifiedResult: unifiedResult,
    };

    setAuditHistory((prev) => {
      const updated = [historyItem, ...prev];
      try {
        localStorage.setItem('auditsnipe_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });

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
      const unifiedData = await executeUniversalHealthScan(url);
      setCurrentUnifiedScan(unifiedData);
      setCurrentScan(unifiedData.accessibilityScan);
      setActiveRoute('/health-report');
    } catch (e) {
      console.error('Rescan failed:', e);
    } finally {
      setIsHeroScanning(false);
    }
  };

  const handleAddWebsite = async (url: string, frequency: 'daily' | 'weekly' | 'monthly') => {
    try {
      const res = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, scanFrequency: frequency }),
      });
      if (res.ok) {
        const newSite = await res.json();
        setMonitoredWebsites((prev) => [newSite, ...prev]);
        return;
      }
    } catch {
      // Fallback local persistence
    }
    
    // Client-side addition fallback
    const scan = await executeUniversalAccessibilityScan(url);
    const newSite: MonitoredWebsite = {
      id: `site_${Date.now()}`,
      url,
      domain: new URL(url.startsWith('http') ? url : `https://${url}`).hostname,
      name: new URL(url.startsWith('http') ? url : `https://${url}`).hostname,
      monitoringFrequency: frequency,
      lastScanScore: scan.score,
      lastScannedAt: new Date().toISOString(),
      status: scan.score > 80 ? 'healthy' : scan.score > 60 ? 'warning' : 'critical',
      lastScanResult: scan,
    };
    setMonitoredWebsites((prev) => [newSite, ...prev]);
  };

  const handleRescanWebsite = async (url: string) => {
    try {
      const result = await executeUniversalAccessibilityScan(url);
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
    } catch (err) {
      console.error('Rescan failed', err);
    }
  };

  const handleDeleteWebsite = async (id: string) => {
    try {
      await fetch(`/api/websites/${id}`, { method: 'DELETE' });
    } catch {}
    setMonitoredWebsites((prev) => prev.filter((w) => w.id !== id));
  };

  const handleViewSampleReport = async () => {
    setIsHeroScanning(true);
    try {
      const unifiedData = await executeUniversalHealthScan('https://www.calculator.net');
      setCurrentUnifiedScan(unifiedData);
      setCurrentScan(unifiedData.accessibilityScan);
      setActiveRoute('/health-report');
    } catch (e) {
      console.error(e);
    } finally {
      setIsHeroScanning(false);
    }
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
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* ROUTE 1: Home View - Flagship Single-Answer Precision Optimizer + 172-Point Scanner */}
        {activeRoute === '/' && (
          <div>
            {/* Primary Viewport Flagship: Single-Answer Precision & AEO Snippet Sniper */}
            <section id="aeo-snippet-sniper-flagship">
              <SingleAnswerPrecisionOptimizer
                onNavigate={handleNavigate}
                isHomeFlagship={true}
                onSwitchToScanner={() => {
                  const el = document.getElementById('full-platform-scanner-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />
            </section>

            {/* Platform Full Health, Accessibility & SEO Scanner */}
            <section id="full-platform-scanner-section" className="border-t-2 border-slate-200/90 relative">
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 py-3 px-4 text-center text-white text-xs font-black tracking-wide flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                <span>ACCESSIBILITY &amp; SEO SCANNER ENGINE &bull; 172-POINT DEEP DOM AUDIT</span>
              </div>
              <HeroScanner
                onScanComplete={handleScanComplete}
                onViewSample={handleViewSampleReport}
                onNavigate={handleNavigate}
                isLoading={isHeroScanning}
                setIsLoading={setIsHeroScanning}
              />
            </section>

            {/* Why AuditSnipe AI Section - Multi-Color Ahrefs & Semrush Aesthetic */}
            <section className="py-20 bg-[#f8fafc] border-y border-slate-200/80 relative overflow-hidden">
              {/* Subtle ambient colored lighting */}
              <div className="absolute top-10 left-10 w-96 h-96 bg-red-400/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-xs inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff5a1f] animate-ping" />
                    <span>Complete Remediation Workflow • Ahrefs &amp; Semrush Inspired Engine</span>
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    Beyond Simple Warnings: Actionable Code Fixes &amp; AEO Precision
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 font-medium">
                    Most checkers leave you with vague errors. AuditSnipe AI diagnoses the root cause, snipes competitor featured snippets with Single-Answer Precision, and writes production-ready code to fix it.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Card 1 - Swiss Precision & Ahrefs Safety Orange */}
                  <div className="group bg-white border-2 border-slate-200/90 hover:border-red-500/80 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-600" />
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/30 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        🇨🇭 Swiss Precision
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-950 group-hover:text-red-600 transition-colors">1. Instant 40+ Point Audit</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      Evaluates color contrast, image alt attributes, keyboard traps, ARIA landmarks, form inputs, and document structure against WCAG 2.1 Level AA.
                    </p>
                  </div>

                  {/* Card 2 - Semrush Cyber Violet & Paris Couture */}
                  <div className="group bg-white border-2 border-slate-200/90 hover:border-purple-500/80 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600" />
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        🇫🇷 Riviera Violet
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-950 group-hover:text-purple-600 transition-colors">2. Plain-English Explanations</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      Translates complex WCAG specifications into plain language so product managers and business owners understand the real-world impact.
                    </p>
                  </div>

                  {/* Card 3 - Tokyo Cyber Emerald */}
                  <div className="group bg-white border-2 border-slate-200/90 hover:border-emerald-500/80 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                        <Code className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        🇯🇵 Tokyo Emerald
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-950 group-hover:text-emerald-600 transition-colors">3. Drop-in Code Remediations</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      Synthesizes corrected HTML, React JSX, WordPress PHP, and Shopify Liquid snippets ready to merge directly into your codebase.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Platform Integrations Strip - Vibrant Multi-Color Badges */}
            <section className="py-16 bg-[#0a0f1d] text-white border-y border-slate-800 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-4 py-1.5 rounded-full">
                  Universal Compatibility Engine
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Works Seamlessly with Any Modern Web Architecture
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 text-sm font-bold">
                  <span className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 shadow-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Shopify &amp; Liquid</span>
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-blue-950/80 border border-blue-600/50 text-blue-300 shadow-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>WordPress &amp; WooCommerce</span>
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-600/50 text-cyan-300 shadow-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>React &amp; Next.js</span>
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-indigo-950/80 border border-indigo-600/50 text-indigo-300 shadow-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>Webflow &amp; Framer</span>
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-teal-950/80 border border-teal-600/50 text-teal-300 shadow-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <span>Vue &amp; Nuxt</span>
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-300 shadow-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>HTML5 &amp; Tailwind</span>
                  </span>
                </div>
              </div>
            </section>
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
        {activeRoute === '/health-report' && !currentUnifiedScan && (
          <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Universal Website Health &amp; Compliance Audit</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
              No audit report is currently loaded in your session. Launch a live scan or explore our instant sample audit report.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handleViewSampleReport}
                disabled={isHeroScanning}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isHeroScanning ? 'Analyzing Website...' : 'Load Live Sample Audit (calculator.net)'}
              </button>
              <button
                onClick={() => setActiveRoute('/')}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                Scan My Own Domain
              </button>
            </div>
          </div>
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

        {/* ROUTE 3: SaaS Executive Pro Dashboard */}
        {activeRoute === '/dashboard' && (
          user ? (
            <DashboardView
              user={user}
              websites={monitoredWebsites}
              auditHistory={auditHistory}
              onAddWebsite={handleAddWebsite}
              onRescanWebsite={handleRescanWebsite}
              onDeleteWebsite={handleDeleteWebsite}
              onViewReport={(scan) => {
                setCurrentScan(scan);
                setActiveRoute('/report');
              }}
              onUpgradePlan={() => {}}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8 animate-in fade-in duration-200">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Executive Pro Command Center</span>
              </div>

              <div className="space-y-4 max-w-2xl mx-auto">
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  Sign In to Access Your Pro Dashboard
                </h1>
                <p className="text-base text-slate-600 leading-relaxed">
                  Log in with your username and password to unlock continuous website monitoring, audit history archives, AEO answer vaults, and 1-click executive compliance PDF exports.
                </p>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Audit Scan History</h3>
                  <p className="text-xs text-slate-500">Every audit logged with timestamp, barrier severity, and 1-click re-test.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Continuous Monitoring</h3>
                  <p className="text-xs text-slate-500">Automated daily/weekly cadence scans alerting on accessibility score drops.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                    <Download className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Executive PDF Hub</h3>
                  <p className="text-xs text-slate-500">Export board-ready VPAT statements and developer remediation tickets.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Sign In with Username &amp; Password
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Create Account (4 Compulsory Fields)
                </button>
              </div>
            </div>
          )
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

        {/* ROUTE 6: Blog & Category Knowledge Hub */}
        {(activeRoute === '/blog' || activeRoute === '/guides' || activeRoute.startsWith('/category/')) && (
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
        {(activeRoute.startsWith('/blog/') || activeRoute.startsWith('/guides/')) && (
          <BlogPostView
            post={
              selectedPost ||
              BLOG_POSTS.find(
                (p) =>
                  p.slug === activeRoute.replace('/blog/', '').replace('/guides/', '')
              ) ||
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

        {/* ROUTE 10.5: Flagship Domain Rating & Authority Checker */}
        {(activeRoute === '/tools/domain-rating-checker' ||
          activeRoute === '/tools/domain-rating' ||
          activeRoute === '/tools/domain-authority-checker' ||
          activeRoute === '/tools/backlink-checker') && (
          <DomainRatingChecker onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.6: Flagship XML Sitemap Audit & GSC Validator */}
        {(activeRoute === '/tools/sitemap-auditor' ||
          activeRoute === '/tools/sitemap-audit' ||
          activeRoute === '/tools/sitemap-validator' ||
          activeRoute === '/tools/sitemap-checker' ||
          activeRoute === '/tools/sitemap') && (
          <SitemapAuditorView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.7: Flagship Google Search Console Indexation Fixer */}
        {(activeRoute === '/tools/indexation-fixer' ||
          activeRoute === '/tools/gsc-indexation' ||
          activeRoute === '/tools/gsc-index-fixer' ||
          activeRoute === '/tools/discovered-not-indexed-fixer') && (
          <GscIndexationFixer onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.8: Flagship Robots.txt Validator & AI Crawl Simulator */}
        {(activeRoute === '/tools/robots-txt-validator' ||
          activeRoute === '/tools/robots-validator' ||
          activeRoute === '/tools/robots-txt' ||
          activeRoute === '/tools/ai-crawl-simulator') && (
          <RobotsTxtValidator onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.9: Flagship Internal Link Equity & PageRank Silo Analyzer */}
        {(activeRoute === '/tools/internal-link-analyzer' ||
          activeRoute === '/tools/internal-links' ||
          activeRoute === '/tools/internal-link-equity' ||
          activeRoute === '/tools/pagerank-analyzer') && (
          <InternalLinkAnalyzer onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.10: Flagship AEO Auditor & Answer Engine Optimization */}
        {(activeRoute === '/tools/aeo-auditor' ||
          activeRoute === '/tools/aeo-checker' ||
          activeRoute === '/tools/aeo-readiness' ||
          activeRoute === '/tools/ai-overviews-optimizer' ||
          activeRoute === '/tools/answer-engine-optimization' ||
          activeRoute === '/solutions/aeo-auditor' ||
          activeRoute === '/aeo-auditor') && (
          <AeoAuditorView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.10b: Flagship GEO Auditor & Generative Citability Intelligence */}
        {(activeRoute === '/tools/geo-auditor' ||
          activeRoute === '/tools/geo-checker' ||
          activeRoute === '/tools/geo-readiness' ||
          activeRoute === '/tools/generative-engine-optimization' ||
          activeRoute === '/solutions/geo-auditor' ||
          activeRoute === '/solutions/geo-checker' ||
          activeRoute === '/geo-auditor') && (
          <GeoAuditorView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.11: Flagship Core Web Vitals & Real-Time INP Debugger */}
        {(activeRoute === '/tools/inp-debugger' ||
          activeRoute === '/tools/inp-checker' ||
          activeRoute === '/tools/core-web-vitals-inp' ||
          activeRoute === '/tools/interaction-to-next-paint') && (
          <InpPerformanceDebugger onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.12: Flagship Content Humanizer (EEAT Friendly) */}
        {(activeRoute === '/tools/content-humanizer' ||
          activeRoute === '/solutions/content-humanizer' ||
          activeRoute === '/tools/content-humanization' ||
          activeRoute === '/solutions/content-humanization' ||
          activeRoute === '/tools/ai-humanizer' ||
          activeRoute === '/solutions/ai-humanizer' ||
          activeRoute === '/content-humanizer') && (
          <ContentHumanizerView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.13: Model Context Protocol (MCP) & AI Agent Manifest Generator */}
        {(activeRoute === '/tools/mcp-agent-manifest-generator' ||
          activeRoute === '/tools/mcp-generator' ||
          activeRoute === '/tools/agent-manifest-builder' ||
          activeRoute === '/tools/model-context-protocol') && (
          <McpAgentGeneratorView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.14: C2PA Metadata & Content Provenance Studio */}
        {(activeRoute === '/tools/c2pa-provenance-validator' ||
          activeRoute === '/tools/c2pa-checker' ||
          activeRoute === '/tools/content-credentials' ||
          activeRoute === '/tools/ai-provenance-validator') && (
          <C2paProvenanceView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.15: HTTP 402 & x402 AI Agent Micropayments Generator */}
        {(activeRoute === '/tools/x402-agent-micropayments' ||
          activeRoute === '/tools/x402-generator' ||
          activeRoute === '/tools/agent-paywall-builder' ||
          activeRoute === '/tools/http-402-generator') && (
          <X402MicropaymentsView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.16: WebSpatial & 3D WebXR Semantic Anchor Synthesizer */}
        {(activeRoute === '/tools/spatial-seo-webxr-synthesizer' ||
          activeRoute === '/tools/spatial-seo-generator' ||
          activeRoute === '/tools/webxr-schema-builder' ||
          activeRoute === '/tools/spatial-anchor-generator') && (
          <SpatialSeoSynthesizerView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.17: GEO & LLM Citation Grounding Studio */}
        {(activeRoute === '/tools/geo-citation-grounding-studio' ||
          activeRoute === '/tools/geo-citation-optimizer' ||
          activeRoute === '/tools/geo-grounding-studio' ||
          activeRoute === '/tools/llm-citation-generator') && (
          <GeoCitationStudioView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.18: Agentic Governance & ai.txt Manifest Builder */}
        {(activeRoute === '/tools/ai-txt-agentic-governance-builder' ||
          activeRoute === '/tools/ai-txt-generator' ||
          activeRoute === '/tools/agentic-governance' ||
          activeRoute === '/tools/ai-bot-firewall') && (
          <AgenticGovernanceView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.19: AI Search Citation & Voice Query Simulator */}
        {(activeRoute === '/tools/ai-search-citation-simulator' ||
          activeRoute === '/tools/ai-search-simulator' ||
          activeRoute === '/tools/voice-query-simulator' ||
          activeRoute === '/tools/ai-overview-predictor') && (
          <AiSearchCitationSimulatorView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.20: Problem-to-Solution Conversational Schema Generator */}
        {(activeRoute === '/tools/conversational-schema-generator' ||
          activeRoute === '/tools/voice-schema-generator' ||
          activeRoute === '/tools/speakable-schema-builder' ||
          activeRoute === '/tools/conversational-faq-builder') && (
          <ConversationalSchemaGeneratorView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.21: Brand Knowledge Graph & Wikidata Entity Bridge */}
        {(activeRoute === '/tools/brand-knowledge-graph-generator' ||
          activeRoute === '/tools/brand-knowledge-graph' ||
          activeRoute === '/tools/wikidata-entity-bridge' ||
          activeRoute === '/tools/brand-schema-generator') && (
          <BrandKnowledgeGraphGeneratorView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.22: Backlink Crawler & Google Disavow Generator */}
        {(activeRoute === '/tools/backlink-audit-disavow-generator' ||
          activeRoute === '/tools/backlink-audit-disavow' ||
          activeRoute === '/tools/toxic-backlink-analyzer' ||
          activeRoute === '/tools/google-disavow-generator' ||
          activeRoute === '/tools/backlink-finder') && (
          <BacklinkAuditDisavowView onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.23: Single-Answer Precision Optimizer (Featured Snippet Sniper) */}
        {(activeRoute === '/tools/single-answer-precision-optimizer' ||
          activeRoute === '/tools/single-answer-precision' ||
          activeRoute === '/tools/featured-snippet-sniper' ||
          activeRoute === '/tools/position-0-optimizer' ||
          activeRoute === '/single-answer-precision-optimizer') && (
          <SingleAnswerPrecisionOptimizer onNavigate={handleNavigate} />
        )}

        {/* ROUTE 10.24: WCAG 2.2 Touch Target Size & Spacing Calculator */}
        {(activeRoute === '/tools/touch-target-size-calculator' ||
          activeRoute === '/tools/target-size-calculator' ||
          activeRoute === '/tools/touch-target-calculator' ||
          activeRoute === '/tools/wcag-touch-target' ||
          activeRoute === '/tools/touch-target') && (
          <TouchTargetSizeCalculator onNavigate={handleNavigate} />
        )}

        {/* ROUTE 11: Free Tools Suite (Accessibility + SEO + Growth) */}
        {activeRoute.startsWith('/tools') &&
          activeRoute !== '/tools/single-answer-precision-optimizer' &&
          activeRoute !== '/tools/single-answer-precision' &&
          activeRoute !== '/tools/featured-snippet-sniper' &&
          activeRoute !== '/tools/position-0-optimizer' &&
          activeRoute !== '/tools/touch-target-size-calculator' &&
          activeRoute !== '/tools/target-size-calculator' &&
          activeRoute !== '/tools/touch-target-calculator' &&
          activeRoute !== '/tools/wcag-touch-target' &&
          activeRoute !== '/tools/touch-target' &&
          activeRoute !== '/tools/site-comparison' &&
          activeRoute !== '/tools/keyword-planner' &&
          activeRoute !== '/tools/keyword-planning' &&
          activeRoute !== '/tools/domain-rating-checker' &&
          activeRoute !== '/tools/domain-rating' &&
          activeRoute !== '/tools/domain-authority-checker' &&
          activeRoute !== '/tools/backlink-checker' &&
          activeRoute !== '/tools/sitemap-auditor' &&
          activeRoute !== '/tools/sitemap-audit' &&
          activeRoute !== '/tools/sitemap-validator' &&
          activeRoute !== '/tools/sitemap-checker' &&
          activeRoute !== '/tools/sitemap' &&
          activeRoute !== '/tools/indexation-fixer' &&
          activeRoute !== '/tools/gsc-indexation' &&
          activeRoute !== '/tools/gsc-index-fixer' &&
          activeRoute !== '/tools/discovered-not-indexed-fixer' &&
          activeRoute !== '/tools/robots-txt-validator' &&
          activeRoute !== '/tools/robots-validator' &&
          activeRoute !== '/tools/robots-txt' &&
          activeRoute !== '/tools/ai-crawl-simulator' &&
          activeRoute !== '/tools/internal-link-analyzer' &&
          activeRoute !== '/tools/internal-links' &&
          activeRoute !== '/tools/internal-link-equity' &&
          activeRoute !== '/tools/pagerank-analyzer' &&
          activeRoute !== '/tools/aeo-auditor' &&
          activeRoute !== '/tools/aeo-checker' &&
          activeRoute !== '/tools/aeo-readiness' &&
          activeRoute !== '/tools/ai-overviews-optimizer' &&
          activeRoute !== '/tools/answer-engine-optimization' &&
          activeRoute !== '/tools/geo-auditor' &&
          activeRoute !== '/tools/geo-checker' &&
          activeRoute !== '/tools/geo-readiness' &&
          activeRoute !== '/tools/generative-engine-optimization' &&
          activeRoute !== '/tools/inp-debugger' &&
          activeRoute !== '/tools/inp-checker' &&
          activeRoute !== '/tools/core-web-vitals-inp' &&
          activeRoute !== '/tools/interaction-to-next-paint' &&
          activeRoute !== '/tools/content-humanizer' &&
          activeRoute !== '/tools/content-humanization' &&
          activeRoute !== '/tools/ai-humanizer' &&
          activeRoute !== '/tools/mcp-agent-manifest-generator' &&
          activeRoute !== '/tools/mcp-generator' &&
          activeRoute !== '/tools/agent-manifest-builder' &&
          activeRoute !== '/tools/model-context-protocol' &&
          activeRoute !== '/tools/c2pa-provenance-validator' &&
          activeRoute !== '/tools/c2pa-checker' &&
          activeRoute !== '/tools/content-credentials' &&
          activeRoute !== '/tools/ai-provenance-validator' &&
          activeRoute !== '/tools/x402-agent-micropayments' &&
          activeRoute !== '/tools/x402-generator' &&
          activeRoute !== '/tools/agent-paywall-builder' &&
          activeRoute !== '/tools/http-402-generator' &&
          activeRoute !== '/tools/spatial-seo-webxr-synthesizer' &&
          activeRoute !== '/tools/spatial-seo-generator' &&
          activeRoute !== '/tools/webxr-schema-builder' &&
          activeRoute !== '/tools/spatial-anchor-generator' &&
          activeRoute !== '/tools/geo-citation-grounding-studio' &&
          activeRoute !== '/tools/geo-citation-optimizer' &&
          activeRoute !== '/tools/geo-grounding-studio' &&
          activeRoute !== '/tools/llm-citation-generator' &&
          activeRoute !== '/tools/ai-txt-agentic-governance-builder' &&
          activeRoute !== '/tools/ai-txt-generator' &&
          activeRoute !== '/tools/agentic-governance' &&
          activeRoute !== '/tools/ai-bot-firewall' &&
          activeRoute !== '/tools/ai-search-citation-simulator' &&
          activeRoute !== '/tools/ai-search-simulator' &&
          activeRoute !== '/tools/voice-query-simulator' &&
          activeRoute !== '/tools/ai-overview-predictor' &&
          activeRoute !== '/tools/conversational-schema-generator' &&
          activeRoute !== '/tools/voice-schema-generator' &&
          activeRoute !== '/tools/speakable-schema-builder' &&
          activeRoute !== '/tools/conversational-faq-builder' &&
          activeRoute !== '/tools/brand-knowledge-graph-generator' &&
          activeRoute !== '/tools/brand-knowledge-graph' &&
          activeRoute !== '/tools/wikidata-entity-bridge' &&
          activeRoute !== '/tools/brand-schema-generator' &&
          activeRoute !== '/tools/backlink-audit-disavow-generator' &&
          activeRoute !== '/tools/backlink-audit-disavow' &&
          activeRoute !== '/tools/toxic-backlink-analyzer' &&
          activeRoute !== '/tools/google-disavow-generator' &&
          activeRoute !== '/tools/backlink-finder' && (
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
          handleAuthSuccess(newUser);
          setActiveRoute('/dashboard');
        }}
      />
    </div>
  );
}

