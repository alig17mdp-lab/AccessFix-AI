import { SeoPageData } from '../types';

export const SEO_PAGES: Record<string, SeoPageData> = {
  'accessibility-checker': {
    slug: 'accessibility-checker',
    title: 'Free Website Accessibility Checker (WCAG & ADA Audit Tool)',
    metaDescription: 'Scan your website for critical accessibility barriers with our free web accessibility checker. Get actionable WCAG 2.1 fixes in seconds. Test free now.',
    h1: 'Automated Website Accessibility Checker',
    heroSubtitle: 'Identify accessibility violations, understand WCAG requirements, and remediate code faster with AI-powered developer fixes.',
    category: 'core',
    targetKeywords: ['website accessibility checker', 'web accessibility checker', 'check website accessibility', 'website accessibility test'],
    wcagRelevance: 'Evaluates WCAG 2.1 & 2.2 Level A, AA, and AAA criteria across 40+ automated inspection rules.',
    overviewContent: 'The AccessFix AI website accessibility checker audits web pages against internationally recognized accessibility benchmarks. In seconds, your site is inspected for missing image descriptions, low-contrast text, inaccessible form inputs, keyboard navigation traps, and broken heading hierarchies. Every report breaks down issues by severity, explaining both the business impact and exact developer fixes.',
    keyFeatures: [
      {
        title: 'Instant 40+ Point Automated Audit',
        description: 'Comprehensive DOM inspection testing ARIA attributes, semantic landmarks, text contrast ratios, and interactive controls.',
        iconName: 'ShieldCheck',
      },
      {
        title: 'Plain-English AI Explanations',
        description: 'Translates complex WCAG technical jargon into straightforward language that small business owners and content editors can understand.',
        iconName: 'Sparkles',
      },
      {
        title: 'Copy-Paste Code Remediations',
        description: 'Generates direct code fixes tailored for raw HTML, React/Next.js, WordPress themes, and Shopify Liquid templates.',
        iconName: 'Code',
      },
      {
        title: 'Continuous Background Monitoring',
        description: 'Runs scheduled weekly scans to alert your team the moment a theme update or blog post introduces new accessibility barriers.',
        iconName: 'Activity',
      },
    ],
    commonFailures: [
      {
        title: 'Missing Image Alternative Text (WCAG 1.1.1)',
        impact: 'Screen reader users cannot understand product photos, diagrams, or visual icons.',
        fix: 'Add descriptive alt="Detailed summary" or alt="" for decorative images.',
      },
      {
        title: 'Unlabelled Form Fields (WCAG 3.3.2)',
        impact: 'Assistive voice tools cannot announce input requirements, causing checkout abandonment.',
        fix: 'Link visible <label for="id"> tags directly to every form field.',
      },
      {
        title: 'Insufficient Color Contrast (WCAG 1.4.3)',
        impact: 'Low-vision visitors and mobile users in bright sunlight cannot read light gray text.',
        fix: 'Ensure at least a 4.5:1 contrast ratio for standard text against its background.',
      },
    ],
    faqs: [
      {
        question: 'Does this website accessibility checker certify full ADA compliance?',
        answer: 'No automated tool can certify 100% legal ADA compliance. Automated testing identifies roughly 30% to 50% of technical WCAG issues, while manual expert auditing and assistive technology testing cover experiential barriers.',
      },
      {
        question: 'How long does a website accessibility test take?',
        answer: 'Our cloud scanning engine analyzes your target URL in approximately 3 to 6 seconds, producing an interactive report with prioritized remediation steps.',
      },
      {
        question: 'Can I monitor multiple websites automatically?',
        answer: 'Yes. Pro and Agency subscriptions include automated scheduled scans (daily or weekly) with instant email alerts when accessibility scores shift.',
      },
    ],
    canonicalUrl: 'https://accessfix.ai/accessibility-checker',
  },
  'ada-compliance-checker': {
    slug: 'ada-compliance-checker',
    title: 'ADA Compliance Checker for Websites | Test ADA Website Risk',
    metaDescription: 'Audit your website for common ADA Title III accessibility barriers. Get prioritized WCAG 2.1 AA remediations and prevent legal risk. Run a free scan today.',
    h1: 'Website ADA Compliance Checker',
    heroSubtitle: 'Protect your brand from accessibility litigation by eliminating detectable digital barriers for visitors with disabilities.',
    category: 'core',
    targetKeywords: ['ADA compliance checker', 'ADA website checker', 'ADA accessibility testing', 'ADA website compliance test'],
    wcagRelevance: 'Maps digital barriers to US Department of Justice (DOJ) recommended WCAG 2.1 Level AA conformance standards.',
    overviewContent: 'Under Title III of the Americans with Disabilities Act (ADA), public-facing commercial websites are expected to be accessible to individuals with disabilities. AccessFix AI scans your website for the top technical violations that trigger digital accessibility lawsuits, including unlabelled buttons, missing alt text, keyboard navigation traps, and inaccessible checkout forms.',
    keyFeatures: [
      {
        title: 'DOJ & WCAG 2.1 AA Alignment',
        description: 'Tests against the technical standards cited in standard US federal court accessibility settlements.',
        iconName: 'Scale',
      },
      {
        title: 'Risk Severity Matrix',
        description: 'Ranks issues as Critical, High, Medium, or Low so your engineering team tackles high-exposure vulnerabilities first.',
        iconName: 'AlertTriangle',
      },
      {
        title: 'Executive PDF Audit Reports',
        description: 'Export professional documentation demonstrating proactive accessibility improvements for stakeholders and legal teams.',
        iconName: 'FileText',
      },
      {
        title: 'Platform-Specific Fixes',
        description: 'Get instructions for Shopify, WordPress, Webflow, Squarespace, and custom headless frontends.',
        iconName: 'Layers',
      },
    ],
    commonFailures: [
      {
        title: 'Missing Document Language (WCAG 3.1.1)',
        impact: 'Speech synthesizers default to incorrect language pronunciation dictionaries.',
        fix: 'Add lang="en" to the top-level <html> element.',
      },
      {
        title: 'Empty Interactive Links & Buttons (WCAG 4.1.2)',
        impact: 'Blind customers cannot navigate between pages or trigger shopping cart actions.',
        fix: 'Add visible text or aria-label attributes to all icon-only buttons.',
      },
      {
        title: 'Missing Keyboard Focus Indicators (WCAG 2.4.7)',
        impact: 'Keyboard-only navigators cannot see which element currently has active focus.',
        fix: 'Never suppress outline: none without providing an accessible high-contrast focus ring.',
      },
    ],
    faqs: [
      {
        question: 'What is the standard for website ADA compliance in 2026?',
        answer: 'The US Department of Justice and global courts overwhelmingly reference the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as the recognized technical standard for digital accessibility.',
      },
      {
        question: 'Do overlay widgets make a website ADA compliant?',
        answer: 'No. Automated accessibility overlay widgets frequently interfere with assistive screen readers and have been rejected in hundreds of US federal accessibility lawsuits. True compliance requires fixing the underlying source code.',
      },
    ],
    canonicalUrl: 'https://accessfix.ai/ada-compliance-checker',
  },
  'wcag-checker': {
    slug: 'wcag-checker',
    title: 'WCAG 2.1 & 2.2 Compliance Checker | Automated Accessibility Test',
    metaDescription: 'Validate your web markup against WCAG 2.1 and WCAG 2.2 AA standards. Identify non-conforming elements and generate developer fixes. Test for free.',
    h1: 'Online WCAG Compliance Checker',
    heroSubtitle: 'Automated conformance testing for WCAG 2.1 & WCAG 2.2 Level A, AA, and AAA criteria.',
    category: 'core',
    targetKeywords: ['WCAG checker', 'WCAG compliance checker', 'WCAG 2.1 checker', 'WCAG 2.2 audit tool'],
    wcagRelevance: 'Covers the four foundational WCAG principles: Perceivable, Operable, Understandable, and Robust (POUR).',
    overviewContent: 'The Web Content Accessibility Guidelines (WCAG) provide the worldwide gold standard for digital inclusion. AccessFix AI automates technical conformance verification across all four POUR pillars, identifying syntax errors, inaccessible contrast ratios, non-semantic headings, and unlabelled interactive components.',
    keyFeatures: [
      {
        title: 'POUR Principle Breakdown',
        description: 'Categorizes every violation across Perceivable, Operable, Understandable, and Robust standards.',
        iconName: 'CheckCircle2',
      },
      {
        title: 'Level A, AA, & AAA Filters',
        description: 'Filter your audit report by specific conformance tiers to target standard commercial AA or rigorous AAA requirements.',
        iconName: 'Filter',
      },
      {
        title: 'AI Code Refactoring',
        description: 'Receive corrected React JSX, HTML5, and CSS code snippets ready to merge into your repositories.',
        iconName: 'Terminal',
      },
      {
        title: 'Issue Status Workflow',
        description: 'Track fixes through Open, In Progress, Fixed, and Ignored statuses directly from your central dashboard.',
        iconName: 'CheckSquare',
      },
    ],
    commonFailures: [
      {
        title: 'Missing Table Header Scope (WCAG 1.3.1)',
        impact: 'Screen readers cannot associate tabular data cells with their respective column headings.',
        fix: 'Use <th> with scope="col" or scope="row" across all data tables.',
      },
      {
        title: 'Skipped Heading Levels (WCAG 1.3.1)',
        impact: 'Jumping from H1 straight to H3 or H4 creates confusion in document outline tools.',
        fix: 'Maintain linear sequential heading increments (H1 -> H2 -> H3).',
      },
    ],
    faqs: [
      {
        question: 'What is the difference between WCAG 2.1 and WCAG 2.2?',
        answer: 'WCAG 2.2 introduces additional success criteria focusing on cognitive disabilities and mobile touch targets, such as 2.5.8 Target Size (Minimum) and 3.3.7 Redundant Entry.',
      },
    ],
    canonicalUrl: 'https://accessfix.ai/wcag-checker',
  },
  'shopify-accessibility-checker': {
    slug: 'shopify-accessibility-checker',
    title: 'Shopify Accessibility Checker | Audit Store WCAG & ADA Compliance',
    metaDescription: 'Scan your Shopify store for accessibility errors. Fix missing product alt text, checkout barriers, and low-contrast buttons. Start free scan now.',
    h1: 'Shopify Store Accessibility Checker',
    heroSubtitle: 'Boost conversion rates and protect your ecommerce business from ADA litigation by making your Shopify store accessible to all shoppers.',
    category: 'platforms',
    targetKeywords: ['Shopify accessibility checker', 'Shopify ADA compliance', 'Shopify WCAG audit', 'accessible Shopify store'],
    wcagRelevance: 'Focuses on ecommerce accessibility: product grids, variant selectors, add-to-cart buttons, and cart drawers.',
    overviewContent: 'Ecommerce stores are among the most frequent targets of web accessibility lawsuits. When blind or motor-impaired shoppers cannot select product variants, view image galleries, or navigate the checkout drawer, you lose sales and face legal exposure. AccessFix AI scans your entire Shopify storefront and provides Liquid-ready code snippets to resolve accessibility barriers immediately.',
    keyFeatures: [
      {
        title: 'Cart Drawer & Modal Auditing',
        description: 'Identifies focus trapping and unlabelled buttons inside sliding cart drawers and promotion popups.',
        iconName: 'ShoppingBag',
      },
      {
        title: 'Product Variant Selector Verification',
        description: 'Ensures swatch buttons and dropdowns have accessible names and aria-selected state announcements.',
        iconName: 'Tag',
      },
      {
        title: 'Liquid Code Snippet Fixes',
        description: 'Get copy-paste Liquid template code to fix themes like Dawn, Prestige, Horizon, and custom builds.',
        iconName: 'Code',
      },
      {
        title: 'Automated Catalog Image Checks',
        description: 'Detects missing alternative text across thousands of catalog product images automatically.',
        iconName: 'Image',
      },
    ],
    commonFailures: [
      {
        title: 'Unlabelled Variant Swatches (WCAG 4.1.2)',
        impact: 'Shoppers using screen readers cannot tell which color or size option is currently selected.',
        fix: 'Add aria-label="{{ value }}" and aria-pressed="true" to swatch buttons.',
      },
      {
        title: 'Icon-Only Cart and Wishlist Buttons (WCAG 1.1.1)',
        impact: 'Assistive tools read out "Button" with no clue that it opens the cart or wishlist.',
        fix: 'Include visually hidden text or an explicit aria-label.',
      },
    ],
    faqs: [
      {
        question: 'Can I scan password-protected development Shopify stores?',
        answer: 'You can test development stores by either temporarily unlocking the storefront password or scanning staging preview URLs.',
      },
    ],
    canonicalUrl: 'https://accessfix.ai/shopify-accessibility-checker',
  },
  'wordpress-accessibility-checker': {
    slug: 'wordpress-accessibility-checker',
    title: 'WordPress Accessibility Checker | Audit WP Themes & Plugins',
    metaDescription: 'Audit your WordPress website for WCAG 2.1 & ADA compliance issues. Get actionable PHP and block theme remediations. Scan your WordPress site free.',
    h1: 'WordPress Website Accessibility Checker',
    heroSubtitle: 'Find and fix accessibility barriers across Elementor, Divi, Gutenberg block themes, and WooCommerce stores.',
    category: 'platforms',
    targetKeywords: ['WordPress accessibility checker', 'WordPress ADA compliance', 'WordPress WCAG plugin audit', 'Elementor accessibility test'],
    wcagRelevance: 'Audits WordPress theme templates, dynamic navigation menus, sidebar widgets, and comment forms.',
    overviewContent: 'Powering over 40% of the web, WordPress sites frequently inherit accessibility defects from third-party themes, sliders, page builders, and plugins. AccessFix AI audits your WordPress installation, isolating template-level problems from content editor oversights so you can apply clean PHP or Block Editor fixes quickly.',
    keyFeatures: [
      {
        title: 'Page Builder Compatibility',
        description: 'Tested against Elementor, Divi, Beaver Builder, and Gutenberg block editor outputs.',
        iconName: 'Layout',
      },
      {
        title: 'WooCommerce Store Audits',
        description: 'Ensures product pagination, filter widgets, and checkout forms are fully keyboard navigable.',
        iconName: 'ShoppingCart',
      },
      {
        title: 'Theme Template Fixes',
        description: 'Receive recommended updates for header.php, footer.php, and functions.php template files.',
        iconName: 'FileCode',
      },
      {
        title: 'Scheduled Monthly Scans',
        description: 'Keeps your site accessible as team members publish new blog posts and landing pages.',
        iconName: 'Clock',
      },
    ],
    commonFailures: [
      {
        title: 'Skipped Headings in Page Builder Sections (WCAG 1.3.1)',
        impact: 'Visual drag-and-drop modules frequently create heading tags purely for font size rather than hierarchy.',
        fix: 'Use correct H2/H3 tags and apply typography styling with theme CSS classes.',
      },
    ],
    faqs: [
      {
        question: 'Do WordPress accessibility plugins fix everything automatically?',
        answer: 'No. While helper plugins can adjust basic contrast or font size, they cannot add contextual alt text or rewrite broken DOM structures. Source code remediation is always required.',
      },
    ],
    canonicalUrl: 'https://accessfix.ai/wordpress-accessibility-checker',
  },
  'for-agencies': {
    slug: 'for-agencies',
    title: 'Accessibility Auditing Tool for Web Agencies | AccessFix AI',
    metaDescription: 'Scale website accessibility services across all client accounts. Generate branded white-label PDF audits and monitor 50+ sites. Start agency trial.',
    h1: 'Website Accessibility Platform for Agencies',
    heroSubtitle: 'Deliver lucrative accessibility audits, monthly compliance monitoring, and white-label reports to your web design and marketing clients.',
    category: 'audiences',
    targetKeywords: ['accessibility tool for agencies', 'agency accessibility audits', 'white label accessibility reports', 'client accessibility monitoring'],
    wcagRelevance: 'Empowers agencies to deliver professional WCAG 2.1 AA audits and recurring compliance retainers.',
    overviewContent: 'Digital agencies, web development shops, and SEO firms use AccessFix AI to expand their service offerings with high-margin accessibility retainers. Manage multiple client domains from a unified portal, generate branded white-label PDF audit reports, and receive automated notifications whenever client site changes introduce new accessibility barriers.',
    keyFeatures: [
      {
        title: 'Multi-Client Portfolio Hub',
        description: 'Organize dozens of client accounts, assigned domains, and compliance scores in a single high-performance dashboard.',
        iconName: 'Briefcase',
      },
      {
        title: 'Custom Branded PDF Reports',
        description: 'Export unbranded or custom agency-branded executive audit reports ready to present in client meetings.',
        iconName: 'Award',
      },
      {
        title: 'Developer-Ready Code Fixes',
        description: 'Empower your development team to knock out issues in minutes with generated React, HTML, and CMS code snippets.',
        iconName: 'Code2',
      },
      {
        title: 'Recurring Retainer Monitoring',
        description: 'Offer ongoing monthly accessibility maintenance contracts backed by automated scheduled scanning.',
        iconName: 'TrendingUp',
      },
    ],
    commonFailures: [
      {
        title: 'Client Content Team Alt Text Omissions (WCAG 1.1.1)',
        impact: 'Clients frequently upload new media without alternative text after site launch.',
        fix: 'Enable automated weekly scans to catch and report missing alt attributes immediately.',
      },
    ],
    faqs: [
      {
        question: 'Can I add my agency logo to exported PDF reports?',
        answer: 'Yes. The Agency plan allows you to upload your agency logo and customize company details across all exported client deliverables.',
      },
    ],
    canonicalUrl: 'https://accessfix.ai/for-agencies',
  },
  'for-developers': {
    slug: 'for-developers',
    title: 'Web Accessibility Testing Tool for Developers | AccessFix AI',
    metaDescription: 'Developer-first accessibility testing with precise DOM selectors, WCAG references, and copy-paste React/HTML code fixes. Test your web app free.',
    h1: 'Accessibility Scanner Built for Engineers',
    heroSubtitle: 'Catch accessibility violations in your DOM, inspect exact CSS selectors, and remediate with AI-generated component code.',
    category: 'audiences',
    targetKeywords: ['accessibility tool for developers', 'developer accessibility testing', 'DOM accessibility scanner', 'React accessibility tester'],
    wcagRelevance: 'Covers ARIA roles, tabindex management, keyboard event handling, and modern component architecture.',
    overviewContent: 'Engineers need actionable, high-precision diagnostics rather than vague compliance claims. AccessFix AI pinpoint exact HTML snippets, computed DOM selectors, and specific WCAG failure criteria. Our AI engine generates production-ready component code for React, Vue, Next.js, and raw HTML.',
    keyFeatures: [
      {
        title: 'Precise CSS Selectors & Snippets',
        description: 'Directly points to offending DOM elements and highlights invalid attributes for rapid debugging.',
        iconName: 'Crosshair',
      },
      {
        title: 'Component-Level Refactoring',
        description: 'Get drop-in replacement JSX and HTML snippets with correct ARIA roles and keyboard handlers.',
        iconName: 'Cpu',
      },
      {
        title: 'API & CI/CD Readiness',
        description: 'Architected to integrate with your continuous delivery pipeline and staging environments.',
        iconName: 'GitBranch',
      },
      {
        title: 'Zero False Positives Priority',
        description: 'Heuristics fine-tuned to eliminate noise and focus on real assistive technology barriers.',
        iconName: 'ShieldAlert',
      },
    ],
    commonFailures: [
      {
        title: 'Div Buttons Without Keyboard Triggers (WCAG 2.1.1)',
        impact: 'Non-mouse users cannot activate clickable <div> or <span> elements via the Enter or Space key.',
        fix: 'Use native <button> elements or add tabindex="0", role="button", and onKeyDown handlers.',
      },
    ],
    faqs: [
      {
        question: 'How do I handle custom modals and focus trapping?',
        answer: 'AccessFix AI flags missing aria-modal="true", unlabelled dialog headers, and missing initial focus targets.',
      },
    ],
    canonicalUrl: 'https://accessfix.ai/for-developers',
  },
};
