import React from 'react';
import { AuthorProfile, BlogPost } from '../types';
import { ArrowLeft, Award, BookOpen, Clock, ArrowRight, ShieldCheck, Linkedin, Twitter, Github } from 'lucide-react';

interface AuthorProfileViewProps {
  author: AuthorProfile;
  articles: BlogPost[];
  onSelectArticle: (post: BlogPost) => void;
  onBack: () => void;
  onNavigate: (route: string) => void;
}

export const AuthorProfileView: React.FC<AuthorProfileViewProps> = ({
  author,
  articles,
  onSelectArticle,
  onBack,
  onNavigate,
}) => {
  const authorArticles = articles.filter((a) => a.author.slug === author.slug || a.author.id === author.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-in fade-in">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Base</span>
        </button>

        <div className="text-xs text-slate-500 font-medium">
          Verified Accessibility Contributor
        </div>
      </div>

      {/* Author Bio Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <img
            src={author.avatar}
            alt={`${author.name} - ${author.role} at AccessFix AI`}
            width={144}
            height={144}
            loading="eager"
            decoding="async"
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover ring-4 ring-emerald-500/20 shadow-md shrink-0"
          />

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {author.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Specialist</span>
              </span>
            </div>

            <p className="text-sm sm:text-base font-semibold text-slate-700">
              {author.role}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {author.bio}
            </p>

            {/* Credentials Pills */}
            {author.credentials && author.credentials.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {author.credentials.map((cred, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>{cred}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Social Links */}
            {author.socialLinks && (
              <div className="flex items-center gap-3 pt-2 text-xs font-bold text-slate-600">
                {author.socialLinks.linkedin && (
                  <a
                    href={author.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {author.socialLinks.twitter && (
                  <a
                    href={author.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-sky-500" />
                    <span>Twitter / X</span>
                  </a>
                )}
                {author.socialLinks.github && (
                  <a
                    href={author.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
                  >
                    <Github className="w-4 h-4 text-slate-800" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Articles Published Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span>Articles & Guides by {author.name} ({authorArticles.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorArticles.map((post) => (
            <article
              key={post.slug}
              onClick={() => onSelectArticle(post)}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {post.metaDescription}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Updated {post.updatedAt}</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
