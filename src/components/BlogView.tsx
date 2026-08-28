import React, { useState, useMemo } from 'react';
import { BlogPost, ArticleCategory, ArticleContentType } from '../types';
import { BLOG_POSTS } from '../data/blogData';
import { CATEGORIES_CONFIG } from '../data/categoriesData';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Scale,
  Code,
  ShoppingBag,
  Terminal,
  Filter,
  Layers,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface BlogViewProps {
  onSelectPost: (post: BlogPost) => void;
  onSelectAuthor: (authorSlug: string) => void;
  onNavigate: (route: string) => void;
  initialCategory?: ArticleCategory | 'all';
}

const CATEGORY_TABS: { id: ArticleCategory | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'All Guides', icon: BookOpen },
  { id: 'accessibility', label: 'Accessibility', icon: ShieldCheck },
  { id: 'wcag', label: 'WCAG Standards', icon: FileCheck },
  { id: 'ada', label: 'ADA Compliance', icon: Scale },
  { id: 'testing', label: 'Testing & Audits', icon: CheckCircle2 },
  { id: 'fixes', label: 'Code Fixes', icon: Code },
  { id: 'ecommerce', label: 'Ecommerce', icon: ShoppingBag },
  { id: 'development', label: 'Dev Systems', icon: Terminal },
];

const CONTENT_TYPE_FILTERS: { id: ArticleContentType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Formats' },
  { id: 'educational', label: 'Educational Guides' },
  { id: 'problem_solution', label: 'Problem / Solution' },
  { id: 'testing_guide', label: 'Testing Guides' },
  { id: 'checklist', label: 'Checklists' },
  { id: 'platform_content', label: 'Platform Guides' },
  { id: 'commercial_comparison', label: 'Comparisons' },
];

export const BlogView: React.FC<BlogViewProps> = ({
  onSelectPost,
  onSelectAuthor,
  onNavigate,
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>(initialCategory);
  const [selectedContentType, setSelectedContentType] = useState<ArticleContentType | 'all'>('all');
  const [search, setSearch] = useState<string>('');

  // Synchronize category if prop changes
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      // Category filter
      if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }
      // Content type filter
      if (selectedContentType !== 'all' && post.contentType !== selectedContentType) {
        return false;
      }
      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const inTitle = post.title.toLowerCase().includes(q);
        const inDesc = post.metaDescription.toLowerCase().includes(q);
        const inKey = post.primaryKeyword.toLowerCase().includes(q);
        const inSecondaries = post.secondaryKeywords.some((k) => k.toLowerCase().includes(q));
        const inEntities = post.semanticEntities.some((e) => e.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inKey && !inSecondaries && !inEntities) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedContentType, search]);

  const featuredPillarPost = useMemo(() => {
    return BLOG_POSTS.find((p) => p.slug === 'complete-website-accessibility-guide') || BLOG_POSTS[0];
  }, []);

  const activeCategoryInfo = selectedCategory !== 'all' ? CATEGORIES_CONFIG[selectedCategory] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-in fade-in">
      {/* Category or Main Header */}
      {activeCategoryInfo ? (
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-md relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              <span>Category Hub</span>
              <span>•</span>
              <span>{activeCategoryInfo.name}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {activeCategoryInfo.headline}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {activeCategoryInfo.description}
            </p>

            {/* Popular Topics in Category */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Core Focus Areas:</span>
              {activeCategoryInfo.popularTopics.map((topic, idx) => (
                <span
                  key={idx}
                  className="bg-slate-800 text-slate-200 px-3 py-1 rounded-lg border border-slate-700 font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Accessibility & Compliance Knowledge Base</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            WCAG 2.2 & ADA Compliance Guides
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Authoritative, developer-grade guides, WCAG 2.2 checklists, and ADA compliance blueprints designed to help engineering teams build and maintain accessible web applications.
          </p>
        </div>
      )}

      {/* Featured Pillar Article Spotlight (Visible on 'All' tab when not searching) */}
      {selectedCategory === 'all' && selectedContentType === 'all' && !search.trim() && featuredPillarPost && (
        <div
          onClick={() => onSelectPost(featuredPillarPost)}
          className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl hover:border-emerald-500/50 transition-all cursor-pointer mb-14 group relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-emerald-500 text-slate-950 font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Featured Pillar Guide
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{featuredPillarPost.readTime}</span>
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">Updated {featuredPillarPost.updatedAt}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight group-hover:text-emerald-400 transition-colors leading-tight">
                {featuredPillarPost.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                {featuredPillarPost.quickAnswer}
              </p>

              {/* Key Takeaways Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                {featuredPillarPost.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                  <div key={i} className="flex items-start gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-200 line-clamp-2">{takeaway}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAuthor(featuredPillarPost.author.slug);
                  }}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={featuredPillarPost.author.avatar}
                    alt={featuredPillarPost.author.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-white">{featuredPillarPost.author.name}</div>
                    <div className="text-slate-400 text-[11px]">{featuredPillarPost.author.role}</div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Read Complete Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <img
                  src={featuredPillarPost.featuredImage.url}
                  alt={featuredPillarPost.featuredImage.alt}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 right-3 text-[11px] text-slate-300 bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-800">
                  {featuredPillarPost.featuredImage.caption}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Navigation Taxonomy Tabs */}
      <div className="mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id);
                  if (tab.id === 'all') {
                    onNavigate('/blog');
                  } else {
                    onNavigate(`/category/${tab.id}`);
                  }
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar: Format Chips + Instant Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {CONTENT_TYPE_FILTERS.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedContentType(type.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                selectedContentType === type.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides, WCAG rules, topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-2xs"
          />
        </div>
      </div>

      {/* Posts Results Count & Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>Showing {filteredPosts.length} Articles & Architectural Guides</span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-emerald-700 hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No guides matching your criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or reset the category and format filters to view all available resources.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedContentType('all');
                setSearch('');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              return (
                <article
                  key={post.slug}
                  onClick={() => onSelectPost(post)}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Featured Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {post.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md capitalize">
                          {post.contentType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{post.readTime}</span>
                        </span>
                        <span>•</span>
                        <span>{post.wordCount} words</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">
                          Score: {post.qualityScore.total}/100
                        </span>
                      </div>

                      <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
                        {post.title}
                      </h2>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {post.metaDescription}
                      </p>

                      {/* Tool Callout Pill */}
                      {post.targetTool && (
                        <div className="pt-2">
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            <span>Includes: {post.targetTool.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer with Author */}
                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAuthor(post.author.slug);
                      }}
                      className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="text-[11px]">
                        <div className="font-bold text-slate-900 leading-tight">{post.author.name}</div>
                        <div className="text-slate-400 text-[10px]">{post.updatedAt}</div>
                      </div>
                    </div>

                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Conversion Banner */}
      <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated Code Remediation Engine</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight">
            Scan Your Website for WCAG Violations in Seconds
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Detect color contrast failures, missing image alt tags, empty buttons, and form labels with instant production-ready code fixes.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/accessibility-checker')}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer shrink-0"
        >
          Run Free Accessibility Scan
        </button>
      </div>
    </div>
  );
};
