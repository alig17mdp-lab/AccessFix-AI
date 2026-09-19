import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, FileText, CheckCircle2, Send } from 'lucide-react';

interface LegalPageProps {
  section: 'privacy' | 'terms' | 'disclaimer' | 'accessibility-statement' | 'refund-policy' | 'contact';
}

export const LegalPage: React.FC<LegalPageProps> = ({ section }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 animate-in fade-in">
      {/* Contact View */}
      {section === 'contact' ? (
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Customer Support & Inquiries
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Get in Touch with AuditSnipe AI
            </h1>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Our engineering, AEO research, and site audit technical support teams typically respond within 2 to 4 business hours.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl max-w-2xl mx-auto">
            {contactSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
                <p className="text-xs text-slate-600">
                  Thank you for reaching out. A dedicated accessibility specialist will contact you at {contactEmail} shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message or Query</label>
                  <textarea
                    rows={5}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can we assist with your accessibility auditing, custom enterprise integrations, or agency accounts?"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      ) : section === 'disclaimer' ? (
        <div className="space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <span className="text-xs font-bold uppercase text-emerald-700">Legal Architecture</span>
            <h1 className="text-3xl font-black text-slate-900">Legal & Automated Testing Disclaimer</h1>
            <p className="text-slate-500 text-xs">Last Updated: August 2026</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>Core Operational Disclaimer</span>
            </div>
            <p className="text-xs leading-relaxed">
              AccessFix AI provides automated software diagnostics and artificial intelligence-assisted code remediation suggestions based upon the Web Content Accessibility Guidelines (WCAG 2.1 / 2.2). Automated testing inspects programmatic Document Object Model (DOM) attributes and detectable code patterns. 
            </p>
          </div>

          <h2 className="text-lg font-bold text-slate-900 pt-4">1. No Legal Advice or Legal Guarantee</h2>
          <p>
            The scores, summaries, suggestions, and reports produced by AccessFix AI are for informational, diagnostic, and software development purposes only. AccessFix AI does NOT provide legal advice, formal compliance certification, or any guarantee against lawsuits, demand letters, or regulatory penalties under Title III of the Americans with Disabilities Act (ADA), Section 508 of the Rehabilitation Act, the European Accessibility Act (EAA), or equivalent state, federal, or international statutes.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-4">2. Limitations of Automated Web Accessibility Testing</h2>
          <p>
            Industry consensus confirms that automated testing tools can detect approximately 30% to 50% of technical WCAG success criteria violations. Crucial usability factors—including the qualitative contextual accuracy of image descriptions, logical keyboard reading orders through dynamic widgets, audio/video synchronization, and authentic screen reader comprehension—require periodic manual testing and evaluation by certified human accessibility specialists and native assistive technology users.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-4">3. Customer Remediation Responsibility</h2>
          <p>
            Users are solely responsible for reviewing, testing, verifying, and deploying any code snippets or recommendations generated by AccessFix AI within their own staging and production environments.
          </p>
        </div>
      ) : section === 'accessibility-statement' ? (
        <div className="space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <span className="text-xs font-bold uppercase text-emerald-700">Commitment to Inclusion</span>
            <h1 className="text-3xl font-black text-slate-900">AccessFix AI Accessibility Statement</h1>
            <p className="text-slate-500 text-xs">Last Updated: August 2026</p>
          </div>

          <p>
            AccessFix AI is committed to ensuring that our digital tools, dashboards, documentation, and web experiences are accessible to everyone, including individuals with disabilities. We strive to conform our digital products with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA benchmarks.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-4">Measures to Support Accessibility</h2>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>We integrate automated accessibility audits into our continuous integration pipelines.</li>
            <li>We enforce high-contrast text ratios (≥ 4.5:1 for normal text and ≥ 3.0:1 for UI elements).</li>
            <li>We maintain explicit keyboard navigation paths, visible focus rings, and skip-to-content links.</li>
            <li>We provide a built-in user preference toolbar allowing typography scaling and high contrast switching.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 pt-4">Feedback & Contact</h2>
          <p>
            We welcome your feedback on the accessibility and AEO precision of AuditSnipe AI. If you encounter any barriers on our platform, please email us at <strong className="text-slate-900">support@auditsnipe.com</strong>.
          </p>
        </div>
      ) : section === 'privacy' ? (
        <div className="space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <span className="text-xs font-bold uppercase text-emerald-700">Data Protection</span>
            <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
            <p className="text-slate-500 text-xs">Last Updated: September 2026</p>
          </div>

          <p>
            At AuditSnipe AI Technologies Inc. (formerly AccessFix AI, "AuditSnipe AI"), we take data security and user privacy seriously. This Privacy Policy details how we collect, process, and safeguard information when you use our AEO snippet sniper, site audit suite, and SaaS platform.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-4">1. Data We Collect</h2>
          <p>
            When you perform an automated audit or AEO snippet benchmark, our server fetches public HTML markup from the requested target URL. We do not store or inspect private backend databases or non-public administrative credentials. For registered users, we store your account email, name, subscription tier, and list of monitored domains.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-4">2. Use of Gemini AI & Language Models</h2>
          <p>
            HTML DOM snippets sent to Google Gemini 3.7 are used exclusively to synthesize technical code fixes, single-answer precision recommendations, and plain-English summaries. Customer data is not used to train public foundation models without consent.
          </p>
        </div>
      ) : (
        <div className="space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <span className="text-xs font-bold uppercase text-emerald-700">Legal Agreement</span>
            <h1 className="text-3xl font-black text-slate-900">Terms of Service</h1>
            <p className="text-slate-500 text-xs">Last Updated: September 2026</p>
          </div>

          <p>
            By accessing or using AuditSnipe AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not access or use our services.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-4">1. Authorized Target Scanning</h2>
          <p>
            You agree to only scan websites that you own, operate, or have explicit authorization to inspect. AuditSnipe AI prohibits any scanning intended to disrupt, overload, or harm third-party web infrastructure.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-4">2. Subscriptions and Refunds</h2>
          <p>
            Paid subscriptions (Pro and Agency) are billed on a recurring monthly or annual basis. We provide a 14-day money-back guarantee for all annual subscription upgrades upon request.
          </p>
        </div>
      )}
    </div>
  );
};
