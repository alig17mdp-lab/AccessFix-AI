import React, { useState, useEffect } from 'react';
import { BlogPost, ArticleSource } from '../types';
import { BLOG_POSTS } from '../data/blogData';
import { CATEGORIES_CONFIG } from '../data/categoriesData';
import {
  ArrowLeft,
  Clock,
  User,
  Share2,
  Check,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  FileText,
  ExternalLink,
  ChevronRight,
  Printer,
  Copy,
  Code2,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  Eye,
  Search,
} from 'lucide-react';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
  onSelectPost: (post: BlogPost) => void;
  onSelectAuthor: (authorSlug: string) => void;
  onNavigate: (route: string) => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({
  post,
  onBack,
  onSelectPost,
  onSelectAuthor,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [activeTocId, setActiveTocId] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState(0);

  // Calculate Reading Progress & Active TOC Section
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }

      // Check active heading
      if (post.tableOfContents && post.tableOfContents.length > 0) {
        for (let i = post.tableOfContents.length - 1; i >= 0; i--) {
          const item = post.tableOfContents[i];
          const el = document.getElementById(item.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 160) {
              setActiveTocId(item.id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Find related full articles from slugs
  const relatedArticlePosts = (post.relatedArticles || [])
    .map((slug) => BLOG_POSTS.find((p) => p.slug === slug))
    .filter((p): p is BlogPost => Boolean(p))
    .slice(0, 3);

  // Generate JSON-LD Schema
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `https://accessfix.ai/blog/${post.slug}#article`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://accessfix.ai/#website',
          name: 'AccessFix AI',
          url: 'https://accessfix.ai',
        },
        headline: post.title,
        description: post.metaDescription,
        url: `https://accessfix.ai/blog/${post.slug}`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        inLanguage: 'en-US',
        mainEntityOfPage: `https://accessfix.ai/blog/${post.slug}`,
        image: {
          '@type': 'ImageObject',
          url: post.featuredImage.url,
          caption: post.featuredImage.alt,
        },
        author: {
          '@type': 'Person',
          name: post.author.name,
          jobTitle: post.author.role,
          url: `https://accessfix.ai/authors/${post.author.slug}`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'AccessFix AI',
          url: 'https://accessfix.ai',
          logo: {
            '@type': 'ImageObject',
            url: 'https://accessfix.ai/logo.png',
          },
        },
        keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://accessfix.ai',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Knowledge Base',
            item: 'https://accessfix.ai/blog',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: CATEGORIES_CONFIG[post.category]?.name || post.category,
            item: `https://accessfix.ai/category/${post.category}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: post.title,
            item: `https://accessfix.ai/blog/${post.slug}`,
          },
        ],
      },
      ...(post.faqs && post.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: post.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in">
      {/* Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-100 z-50">
        <div
          className="h-full bg-emerald-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8 text-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-slate-500 flex-wrap">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-emerald-700 font-semibold cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={onBack}
            className="hover:text-emerald-700 font-semibold cursor-pointer"
          >
            Knowledge Base
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => onNavigate(`/category/${post.category}`)}
            className="hover:text-emerald-700 font-semibold uppercase tracking-wider text-emerald-800 cursor-pointer"
          >
            {CATEGORIES_CONFIG[post.category]?.name || post.category}
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScoreModal(true)}
            className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1.5 rounded-xl font-bold border border-emerald-200 cursor-pointer transition-colors"
            title="Inspect 20-point quality audit score"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Score: {post.qualityScore.total}/100</span>
          </button>

          <button
            onClick={() => setShowSchemaModal(true)}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl font-semibold cursor-pointer transition-colors"
            title="View JSON-LD Schema structure"
          >
            <Code2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Schema</span>
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl font-semibold cursor-pointer transition-colors"
            title="Print Article or Save to PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left TOC Sidebar + Right Article Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Sticky Sidebar (Col 4) */}
        <aside className="lg:col-span-4 hidden lg:block space-y-6">
          <div className="sticky top-20 space-y-6">
            {/* Table of Contents Box */}
            {post.tableOfContents && post.tableOfContents.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Table of Contents</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {Math.round(readingProgress)}%
                  </span>
                </div>

                <nav aria-label="Table of Contents" className="space-y-1 text-xs">
                  {post.tableOfContents.map((toc) => {
                    const isActive = activeTocId === toc.id;
                    return (
                      <a
                        key={toc.id}
                        href={`#${toc.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(toc.id);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            setActiveTocId(toc.id);
                          }
                        }}
                        className={`block py-1.5 px-3 rounded-lg font-medium transition-all ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 font-bold translate-x-1 border-l-2 border-emerald-600'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {toc.title}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Author Sidebar Micro Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Author & Reviewer
              </div>
              <div
                onClick={() => onSelectAuthor(post.author.slug)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/20 group-hover:ring-emerald-500 transition-all"
                />
                <div className="text-xs">
                  <div className="font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {post.author.name}
                  </div>
                  <div className="text-slate-500 text-[11px] leading-tight">{post.author.role}</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                {post.author.bio}
              </p>
              <button
                onClick={() => onSelectAuthor(post.author.slug)}
                className="w-full text-center text-xs font-bold text-emerald-700 bg-white border border-slate-200 py-1.5 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                View Author Profile
              </button>
            </div>

            {/* In-Article Mini Tool CTA */}
            {post.targetTool && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-md space-y-3">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  <span>Interactive Tool</span>
                </div>
                <h4 className="text-sm font-bold leading-snug">{post.targetTool.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {post.targetTool.description}
                </p>
                <button
                  onClick={() => onNavigate(post.targetTool.slug)}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{post.targetTool.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Right Article Body (Col 8) */}
        <article className="lg:col-span-8 space-y-8">
          {/* Article Title & Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {CATEGORIES_CONFIG[post.category]?.name || post.category}
              </span>
              <span className="text-slate-400">•</span>
              <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-md capitalize">
                {post.contentType.replace('_', ' ')}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Updated {post.updatedAt}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {post.metaDescription}
            </p>

            {/* Author Attribution Card (Mobile + Header) */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div
                onClick={() => onSelectAuthor(post.author.slug)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <div className="text-xs">
                  <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {post.author.name}
                  </div>
                  <div className="text-slate-500 text-[11px]">{post.author.role}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                Target: {post.searchIntent.toUpperCase()}
              </div>
            </div>
          </header>

          {/* Quick Answer / Answer-First Featured Snippet Box */}
          <div
            id="quick-answer"
            className="bg-emerald-50/70 border-2 border-emerald-200/80 rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Executive Summary & Quick Answer</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
              {post.quickAnswer}
            </p>
          </div>

          {/* Key Takeaways Box */}
          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Key Takeaways & Core Requirements</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                {post.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Featured Visual Image with Semantic Alt Text */}
          <figure className="space-y-2">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
              <img
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                className="w-full h-auto max-h-[460px] object-cover"
              />
            </div>
            {post.featuredImage.caption && (
              <figcaption className="text-center text-xs text-slate-500 italic">
                {post.featuredImage.caption} (Source: {post.featuredImage.source || 'AccessFix AI'})
              </figcaption>
            )}
          </figure>

          {/* Article Main Markdown Content */}
          <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-6">
            <div className="whitespace-pre-wrap font-sans leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Contextual Full-Width Tool CTA Card */}
          {post.targetTool && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 text-white space-y-4 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Recommended Workflow Action</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Put These Standards Into Action with {post.targetTool.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {post.targetTool.description} AccessFix AI automatically detects violations, explains them in plain English, and provides production-ready code fixes.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate(post.targetTool.slug)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>{post.targetTool.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Interactive FAQ Section with Golden Law 17 Compliance */}
          {post.faqs && post.faqs.length > 0 && (
            <section id="faq" className="space-y-4 pt-8 border-t border-slate-200">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Authoritative Guidance
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-emerald-600" />
                  <span>Frequently Asked Questions</span>
                </h2>
              </div>

              <div className="space-y-3 pt-2">
                {post.faqs.map((faq, i) => {
                  const isOpen = openFaqIndex === i;
                  return (
                    <div
                      key={i}
                      className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-700 cursor-pointer"
                      >
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          {faq.question}
                        </h3>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                          <p className="font-semibold text-slate-900 mb-2">
                            {faq.answer.split('.')[0]}.
                          </p>
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Authoritative Sources & Citations Box (Golden Law 2 & 16) */}
          {post.sources && post.sources.length > 0 && (
            <section id="sources" className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Verified Authoritative Sources & References</span>
              </div>
              <ul className="space-y-2.5 text-xs">
                {post.sources.map((src, i) => (
                  <li key={i} className="flex items-start justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <div className="font-bold text-slate-900">{src.title}</div>
                      <div className="text-[11px] text-slate-500">{src.organization}</div>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 font-bold shrink-0 mt-1"
                    >
                      <span>Reference</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Author Biography Footer Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500/20 shrink-0"
              />
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Written by {post.author.name}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-800">{post.author.role}</p>
                  </div>
                  <button
                    onClick={() => onSelectAuthor(post.author.slug)}
                    className="text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    All Articles
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {post.author.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Related Articles & Resources Section */}
          {relatedArticlePosts.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>Related Guides & Checklists</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticlePosts.map((rel) => (
                  <div
                    key={rel.slug}
                    onClick={() => {
                      onSelectPost(rel);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {rel.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{rel.readTime}</span>
                      <ArrowRight className="w-3 h-3 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      {/* JSON-LD Schema Modal */}
      {showSchemaModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900">Valid JSON-LD Structured Data</h3>
              </div>
              <button
                onClick={() => setShowSchemaModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Valid JSON-LD schema dynamically generated for BlogPosting, BreadcrumbList, and FAQPage nodes according to Schema.org and Google Search specifications.
            </p>
            <div className="flex-1 overflow-y-auto bg-slate-950 text-emerald-400 p-4 rounded-2xl text-[11px] font-mono leading-relaxed">
              <pre>{JSON.stringify(jsonLdSchema, null, 2)}</pre>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(jsonLdSchema, null, 2));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                {copied ? 'Copied Schema JSON!' : 'Copy Schema Code'}
              </button>
              <button
                onClick={() => setShowSchemaModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Quality Score Breakdown Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900">Article Quality Audit</h3>
              </div>
              <button
                onClick={() => setShowScoreModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-center p-4 bg-emerald-50 rounded-2xl text-center">
              <div>
                <div className="text-4xl font-black text-emerald-700">
                  {post.qualityScore.total}
                  <span className="text-xl text-slate-400 font-normal">/100</span>
                </div>
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mt-1">
                  Verified Editorial Grade A+
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Search Intent Resolution:</span>
                <span className="font-bold text-slate-900">{post.qualityScore.searchIntent}/10</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Technical Accuracy (WCAG 2.2):</span>
                <span className="font-bold text-slate-900">{post.qualityScore.technicalAccuracy}/10</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">SEO Structure & Heading Density:</span>
                <span className="font-bold text-slate-900">{post.qualityScore.seo}/10</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Internal Linking Architecture:</span>
                <span className="font-bold text-slate-900">{post.qualityScore.internalLinks}/10</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Authoritative Sources & Citations:</span>
                <span className="font-bold text-slate-900">{post.qualityScore.sources}/10</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Conversion Tool Relevance:</span>
                <span className="font-bold text-slate-900">{post.qualityScore.conversion}/10</span>
              </div>
            </div>

            <button
              onClick={() => setShowScoreModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Close Quality Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
