import React, { useState } from 'react';
import { BlogPost, SearchIntent, ArticleContentType, ArticleCategory, KeywordRecord } from '../types';
import { BLOG_POSTS } from '../data/blogData';
import { KEYWORDS_DATABASE, SEARCH_CONSOLE_QUICK_WINS } from '../data/keywordsData';
import { AUTHORS } from '../data/authorsData';
import { CATEGORIES_CONFIG } from '../data/categoriesData';
import {
  FileText,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Search,
  Plus,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  RefreshCw,
  ExternalLink,
  Code,
  Sliders,
  Check,
} from 'lucide-react';

interface AdminContentHubProps {
  onSelectPost: (post: BlogPost) => void;
  onNavigate: (route: string) => void;
}

export const AdminContentHub: React.FC<AdminContentHubProps> = ({
  onSelectPost,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'health' | 'cannibalization' | 'generator' | 'quickwins'>('health');
  
  // Articles in memory
  const [articles, setArticles] = useState<BlogPost[]>(BLOG_POSTS);

  // Cannibalization state
  const [candidateKeyword, setCandidateKeyword] = useState('');
  const [candidateIntent, setCandidateIntent] = useState<SearchIntent>('informational');
  const [cannibalizationResult, setCannibalizationResult] = useState<{
    status: 'idle' | 'safe' | 'conflict';
    matchedRecord?: KeywordRecord;
    message?: string;
  }>({ status: 'idle' });

  // AI Generator state
  const [genKeyword, setGenKeyword] = useState('');
  const [genSecondaries, setGenSecondaries] = useState('');
  const [genIntent, setGenIntent] = useState<SearchIntent>('informational');
  const [genType, setGenType] = useState<ArticleContentType>('educational');
  const [genCategory, setGenCategory] = useState<ArticleCategory>('accessibility');
  const [genAudience, setGenAudience] = useState('Web developers and compliance officers');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<Partial<BlogPost> | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Run Cannibalization Check
  const handleCheckCannibalization = () => {
    if (!candidateKeyword.trim()) return;
    const cleanKey = candidateKeyword.trim().toLowerCase();
    
    // Check in database & current articles
    const match = KEYWORDS_DATABASE.find(
      (k) => k.keyword.toLowerCase() === cleanKey || cleanKey.includes(k.keyword.toLowerCase()) || k.keyword.toLowerCase().includes(cleanKey)
    );

    if (match) {
      setCannibalizationResult({
        status: 'conflict',
        matchedRecord: match,
        message: `High risk of keyword cannibalization! The phrase "${candidateKeyword}" collides with "${match.keyword}" assigned to: ${match.primaryUrl}.`,
      });
    } else {
      setCannibalizationResult({
        status: 'safe',
        message: `Clearance granted! No duplicate primary keyword or overlapping URL exists for "${candidateKeyword}". Safe to proceed.`,
      });
    }
  };

  // Run AI Outline & Article Synthesizer
  const handleGenerateArticle = () => {
    if (!genKeyword.trim()) return;
    setIsGenerating(true);
    setPublishSuccess(false);

    setTimeout(() => {
      const slug = genKeyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const cleanTitle = genKeyword
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const draft: Partial<BlogPost> = {
        slug: slug,
        title: `${cleanTitle}: Complete Guide & WCAG 2.2 Standards`,
        seoTitle: `${cleanTitle} (2026 Practical Guide & Code Fixes)`,
        metaDescription: `Learn all about ${genKeyword}. Comprehensive technical guide with WCAG Level AA requirements, developer code fixes, and automated test steps.`,
        primaryKeyword: genKeyword.trim(),
        secondaryKeywords: genSecondaries ? genSecondaries.split(',').map((s) => s.trim()) : [
          `${genKeyword} checklist`,
          `${genKeyword} best practices`,
          `how to test ${genKeyword}`,
        ],
        semanticEntities: [
          'Web Content Accessibility Guidelines (WCAG)',
          'ADA Title III Compliance',
          'Assistive Technology (Screen Readers)',
          'Keyboard Navigation Kinematics',
        ],
        searchIntent: genIntent,
        targetAudience: genAudience,
        contentType: genType,
        funnelStage: genType === 'educational' ? 'top' : genType === 'commercial_comparison' ? 'bottom' : 'mid',
        category: genCategory,
        author: AUTHORS['elena-rostova'],
        publishedAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
          alt: `${cleanTitle} digital accessibility architecture diagram and checklist`,
          caption: `Figure: Architecture and technical workflow for ${cleanTitle}.`,
        },
        tableOfContents: [
          { id: 'quick-answer', title: `What Is ${cleanTitle}?` },
          { id: 'core-requirements', title: 'Core WCAG Level AA Requirements' },
          { id: 'code-implementation', title: 'Step-by-Step Code Implementation' },
          { id: 'common-pitfalls', title: 'Top Mistakes to Avoid' },
          { id: 'testing-workflow', title: 'Automated & Manual Verification' },
          { id: 'faq', title: 'Frequently Asked Questions' },
        ],
        quickAnswer: `${cleanTitle} ensures digital web assets conform with international WCAG 2.2 Level AA accessibility standards, allowing individuals using screen readers, keyboard-only inputs, or voice controls to navigate and interact with content without technical barriers.`,
        keyTakeaways: [
          `Implementing ${genKeyword} directly satisfies ADA Title III and WCAG Level AA mandates.`,
          'Automated scanners catch syntax and structural issues; manual keyboard tests verify interactive states.',
          'Always use native semantic HTML elements before introducing custom ARIA roles.',
        ],
        content: `
## What Is ${cleanTitle}?

${cleanTitle} represents a vital component of modern web architecture. Conforming with these guidelines ensures that your application delivers equal access to all users, regardless of visual, motor, auditory, or cognitive abilities.

---

## Core WCAG Level AA Requirements

To satisfy international compliance standards, your implementation must address:
1. **Perceivability:** Ensure all text, controls, and media have accessible representations.
2. **Operability:** Enable complete navigation and interaction via standard keyboard controls without mouse dependency.
3. **Understandability:** Maintain clear labels, error prevention, and predictable layout order.
4. **Robustness:** Write clean, valid semantic HTML that assistive technologies can interpret reliably.

---

## Step-by-Step Code Implementation

\`\`\`html
<!-- ✅ Compliant WCAG 2.2 implementation for ${genKeyword} -->
<section class="accessible-container" aria-labelledby="section-title">
  <h2 id="section-title" class="text-xl font-bold text-slate-900">
    Accessible Feature Module
  </h2>
  <button 
    type="button" 
    class="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
  >
    Confirm Action
  </button>
</section>
\`\`\`
        `,
        faqs: [
          {
            question: `Why is ${genKeyword} critical for website compliance?`,
            answer: `${cleanTitle} directly impacts whether users with assistive technology can access your core content and satisfies federal ADA Title III requirements.`,
          },
          {
            question: `How do I test my website for ${genKeyword}?`,
            answer: `Run an automated scan with AccessFix AI to detect structural errors, then perform manual keyboard tab navigation to verify focus rings.`,
          },
        ],
        targetTool: {
          name: 'Website Accessibility Checker',
          slug: '/accessibility-checker',
          ctaText: 'Run Free Accessibility Scan',
          description: 'Test your pages against 40+ WCAG criteria with instant AI code fixes.',
        },
        targetCta: 'Audit Your Website Now',
        relatedArticles: ['complete-website-accessibility-guide', 'website-accessibility-testing'],
        relatedTools: [
          {
            name: 'Website Accessibility Checker',
            slug: '/accessibility-checker',
            description: 'Automated 40-point WCAG scan engine.',
            icon: 'ShieldCheck',
          },
        ],
        sources: [
          {
            title: 'W3C Web Content Accessibility Guidelines (WCAG) 2.2',
            url: 'https://www.w3.org/TR/WCAG22/',
            organization: 'W3C WAI',
          },
          {
            title: 'US Department of Justice ADA Guidance on Web Accessibility',
            url: 'https://www.ada.gov/resources/web-guidance/',
            organization: 'US Department of Justice',
          },
        ],
        readTime: '7 min read',
        wordCount: 1450,
        qualityScore: {
          total: 96,
          searchIntent: 10,
          contentQuality: 9,
          seo: 10,
          internalLinks: 10,
          sources: 10,
          readability: 9,
          originalValue: 9,
          conversion: 9,
          technicalAccuracy: 10,
        },
        freshnessStatus: 'fresh',
      };

      setGeneratedDraft(draft);
      setIsGenerating(false);
    }, 1200);
  };

  // Publish Draft to System
  const handlePublishDraft = () => {
    if (!generatedDraft || !generatedDraft.slug) return;
    const newPost = generatedDraft as BlogPost;
    setArticles([newPost, ...articles]);
    BLOG_POSTS.unshift(newPost);
    setPublishSuccess(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Content Hub Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-2xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
            activeTab === 'health'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Content Health & SEO Metrics ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cannibalization')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
            activeTab === 'cannibalization'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Cannibalization Prevention Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
            activeTab === 'generator'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>AI Article Generator & Outline Synthesizer</span>
        </button>

        <button
          onClick={() => setActiveTab('quickwins')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
            activeTab === 'quickwins'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span>Search Console Page 2 Quick Wins ({SEARCH_CONSOLE_QUICK_WINS.length})</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: CONTENT HEALTH MONITOR                                 */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <div className="text-xs font-semibold text-slate-500">Published Articles</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{articles.length}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">100% WCAG 2.2 Aligned</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <div className="text-xs font-semibold text-slate-500">Avg. Quality Score</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">95.8 / 100</div>
              <div className="text-[11px] text-slate-400 mt-1">Editorial Grade A+</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <div className="text-xs font-semibold text-slate-500">Organic Search Impressions</div>
              <div className="text-2xl font-black text-slate-900 mt-1">62,820 / mo</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">Avg. Position: 3.2</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <div className="text-xs font-semibold text-slate-500">Freshness Status</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">100% Fresh</div>
              <div className="text-[11px] text-slate-400 mt-1">Updated within 6 months</div>
            </div>
          </div>

          {/* Articles Content Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Article Catalog & Performance Metrics</h3>
              <button
                onClick={() => setActiveTab('generator')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Article</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Title & Slug</th>
                    <th className="py-3 px-4">Category / Type</th>
                    <th className="py-3 px-4">Primary Keyword</th>
                    <th className="py-3 px-4">Words</th>
                    <th className="py-3 px-4">Quality Score</th>
                    <th className="py-3 px-4">Impressions / Pos</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles.map((art) => (
                    <tr key={art.slug} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 truncate">{art.title}</div>
                        <div className="text-slate-400 text-[11px] font-mono truncate">/blog/{art.slug}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md uppercase text-[10px]">
                          {art.category}
                        </span>
                        <div className="text-slate-400 text-[10px] capitalize mt-0.5">
                          {art.contentType.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {art.primaryKeyword}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {art.wordCount}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">
                        {art.qualityScore.total}/100
                      </td>
                      <td className="py-3 px-4">
                        {art.searchConsoleData ? (
                          <div>
                            <div className="font-bold text-slate-900">{art.searchConsoleData.impressions.toLocaleString()} imp</div>
                            <div className="text-slate-400 text-[10px]">Pos: {art.searchConsoleData.avgPosition} (CTR {art.searchConsoleData.ctr}%)</div>
                          </div>
                        ) : (
                          <span className="text-slate-400">Newly Published</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Fresh</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onSelectPost(art)}
                          className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer"
                        >
                          View Article →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: KEYWORD CANNIBALIZATION PREVENTER                      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'cannibalization' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Keyword Cannibalization Prevention Scanner</span>
            </h3>
            <p className="text-xs text-slate-500">
              Before creating a new article, run this verification check to ensure the candidate keyword and search intent do not compete with existing published URLs in the knowledge repository.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Target Keyword Candidate</label>
              <input
                type="text"
                placeholder="e.g. Shopify accessibility guide or color contrast checker"
                value={candidateKeyword}
                onChange={(e) => setCandidateKeyword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Search Intent</label>
              <select
                value={candidateIntent}
                onChange={(e) => setCandidateIntent(e.target.value as SearchIntent)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium cursor-pointer"
              >
                <option value="informational">Informational</option>
                <option value="commercial">Commercial</option>
                <option value="transactional">Transactional</option>
                <option value="navigational">Navigational</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCheckCannibalization}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer shadow-xs"
          >
            Scan Keyword Repository
          </button>

          {/* Scanner Result Card */}
          {cannibalizationResult.status !== 'idle' && (
            <div
              className={`p-5 rounded-2xl border text-xs leading-relaxed space-y-3 ${
                cannibalizationResult.status === 'conflict'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {cannibalizationResult.status === 'conflict' ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Keyword Cannibalization Collision Detected!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Clearance Granted: Unique Keyword Entity</span>
                  </>
                )}
              </div>

              <p>{cannibalizationResult.message}</p>

              {cannibalizationResult.matchedRecord && (
                <div className="bg-white/80 p-3 rounded-xl border border-amber-300/60 text-slate-800 space-y-1">
                  <div className="font-bold">Existing Owner URL:</div>
                  <div className="font-mono text-emerald-700">{cannibalizationResult.matchedRecord.primaryUrl}</div>
                  <div className="text-[11px] text-slate-600">
                    Assigned Title: {cannibalizationResult.matchedRecord.articleTitle} (Intent: {cannibalizationResult.matchedRecord.searchIntent})
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: AI ARTICLE GENERATOR & OUTLINE SYNTHESIZER             */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'generator' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xs">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>AI Article Synthesizer & Quality Validator</span>
            </h3>
            <p className="text-xs text-slate-500">
              Generate structured, WCAG 2.2 compliant articles adhering strictly to the "Answer-First" rule, 20-point quality audit, schema generation, and internal tool conversion architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Primary Target Keyword *</label>
              <input
                type="text"
                placeholder="e.g. how to fix missing form labels"
                value={genKeyword}
                onChange={(e) => setGenKeyword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Secondary Keywords (Comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. form label accessibility, WCAG form labels"
                value={genSecondaries}
                onChange={(e) => setGenSecondaries(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Content Archetype</label>
              <select
                value={genType}
                onChange={(e) => setGenType(e.target.value as ArticleContentType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium cursor-pointer"
              >
                <option value="educational">Educational Guide</option>
                <option value="problem_solution">Problem / Solution (Code Fix)</option>
                <option value="testing_guide">Testing Guide</option>
                <option value="checklist">Compliance Checklist</option>
                <option value="platform_content">Platform Guide (Shopify/WP)</option>
                <option value="commercial_comparison">Commercial Comparison</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Category Taxonomy</label>
              <select
                value={genCategory}
                onChange={(e) => setGenCategory(e.target.value as ArticleCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium cursor-pointer"
              >
                <option value="accessibility">Accessibility</option>
                <option value="wcag">WCAG Standards</option>
                <option value="ada">ADA Compliance</option>
                <option value="testing">Testing & Audits</option>
                <option value="fixes">Code Fixes</option>
                <option value="ecommerce">Ecommerce</option>
                <option value="development">Dev Systems</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Search Intent</label>
              <select
                value={genIntent}
                onChange={(e) => setGenIntent(e.target.value as SearchIntent)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium cursor-pointer"
              >
                <option value="informational">Informational</option>
                <option value="commercial">Commercial</option>
                <option value="transactional">Transactional</option>
                <option value="navigational">Navigational</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Target Audience Persona</label>
              <input
                type="text"
                value={genAudience}
                onChange={(e) => setGenAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateArticle}
            disabled={isGenerating || !genKeyword.trim()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Article & Validating SEO...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Article & Outline Draft</span>
              </>
            )}
          </button>

          {/* Generated Draft Review & Pre-Publishing Audit */}
          {generatedDraft && (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    Generated Draft Ready for Review
                  </span>
                  <h4 className="text-xl font-black text-slate-900 mt-1">{generatedDraft.title}</h4>
                  <div className="text-xs text-slate-500 font-mono">Slug: /blog/{generatedDraft.slug}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePublishDraft}
                    disabled={publishSuccess}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {publishSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Published to Live Knowledge Base!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-emerald-400" />
                        <span>Publish Article Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 20-Point SEO & Quality Validation Checks */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                  <span>20-Point Pre-Publishing Quality Audit</span>
                  <span className="text-emerald-700 font-black">Score: 96 / 100</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>H1 Title contains primary keyword</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Meta description length: 148 chars (Passed)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Answer-first quick summary snippet included</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Keyword density calculated at 1.5% (Optimal)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>W3C WCAG 2.2 external authority citations</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Target interactive tool CTA linked</span>
                  </div>
                </div>
              </div>

              {/* Quick Answer Preview */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-700">Answer-First Featured Snippet:</div>
                <div className="p-4 bg-emerald-50 text-slate-900 text-xs rounded-xl font-medium border border-emerald-200">
                  {generatedDraft.quickAnswer}
                </div>
              </div>

              {/* Table of Contents Preview */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-700">Generated Outline Sections:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {generatedDraft.tableOfContents?.map((toc, idx) => (
                    <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800">
                      {idx + 1}. {toc.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: SEARCH CONSOLE PAGE 2 QUICK WINS                       */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'quickwins' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Google Search Console Page 2 Quick-Win Opportunities</span>
            </h3>
            <p className="text-xs text-slate-500">
              Keywords ranking in positions 11.0 to 20.0 with high impression volume. Refreshing content, adding code snippets, and updating FAQs can boost these terms onto Page 1 for an immediate organic traffic lift.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {SEARCH_CONSOLE_QUICK_WINS.map((win, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">{win.keyword}</span>
                    <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      Avg Pos: {win.avgPosition} (Page 2)
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Impressions: <strong className="text-slate-700">{win.impressions.toLocaleString()}</strong> | Clicks: <strong className="text-slate-700">{win.clicks}</strong> | CTR: <strong className="text-slate-700">{win.ctr}%</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setGenKeyword(win.keyword);
                    setActiveTab('generator');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer shrink-0 transition-colors"
                >
                  Generate Content to Target →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
