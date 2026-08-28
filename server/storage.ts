import {
  MonitoredWebsite,
  ScanResult,
  UserProfile,
  AgencyClient,
  MonitoringAlert,
  PricingPlan,
  AccessibilityIssue,
  IssueStatus,
  SiteComparisonResult,
} from '../src/types';

// In-memory data structures with robust persistence simulation
export class StorageService {
  private users: Map<string, UserProfile> = new Map();
  private websites: Map<string, MonitoredWebsite> = new Map();
  private scans: Map<string, ScanResult> = new Map();
  private comparisons: Map<string, SiteComparisonResult> = new Map();
  private clients: Map<string, AgencyClient> = new Map();
  private alerts: MonitoringAlert[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Default demo user profile
    const defaultUser: UserProfile = {
      id: 'usr_demo_accessfix',
      email: 'alex.rivera@acmebrand.com',
      fullName: 'Alex Rivera',
      companyName: 'Acme Digital Agency',
      role: 'agency_admin',
      plan: 'pro',
      scansUsedThisMonth: 14,
      scansLimit: 250,
      websitesCount: 3,
      websitesLimit: 10,
      createdAt: '2026-01-15T10:00:00.000Z',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    this.users.set(defaultUser.id, defaultUser);

    // Default monitored websites
    const sites: MonitoredWebsite[] = [
      {
        id: 'web_1',
        url: 'https://acme-store.example.com',
        name: 'Acme Flagship Ecommerce',
        platform: 'shopify',
        monitoringFrequency: 'daily',
        lastScanDate: new Date(Date.now() - 3600000 * 6).toISOString(),
        lastScore: 84,
        previousScore: 78,
        criticalIssuesCount: 1,
        highIssuesCount: 3,
        status: 'healthy',
        autoAlertsEnabled: true,
        alertEmail: 'dev@acmebrand.com',
        clientId: 'client_1',
      },
      {
        id: 'web_2',
        url: 'https://pulse-saas.example.io',
        name: 'Pulse Analytics App',
        platform: 'custom',
        monitoringFrequency: 'weekly',
        lastScanDate: new Date(Date.now() - 3600000 * 28).toISOString(),
        lastScore: 92,
        previousScore: 89,
        criticalIssuesCount: 0,
        highIssuesCount: 1,
        status: 'healthy',
        autoAlertsEnabled: true,
        alertEmail: 'alex.rivera@acmebrand.com',
        clientId: 'client_2',
      },
      {
        id: 'web_3',
        url: 'https://citybistro.example.org',
        name: 'City Bistro Portal',
        platform: 'wordpress',
        monitoringFrequency: 'monthly',
        lastScanDate: new Date(Date.now() - 3600000 * 72).toISOString(),
        lastScore: 68,
        previousScore: 72,
        criticalIssuesCount: 4,
        highIssuesCount: 7,
        status: 'critical',
        autoAlertsEnabled: true,
        alertEmail: 'manager@citybistro.org',
        clientId: 'client_1',
      },
    ];

    sites.forEach((s) => this.websites.set(s.id, s));

    // Default agency clients
    const initialClients: AgencyClient[] = [
      {
        id: 'client_1',
        name: 'Sarah Chen',
        company: 'Vanguard Retail Brands',
        email: 'sarah@vanguardbrands.com',
        websitesCount: 2,
        averageScore: 76,
        activeIssues: 15,
        createdDate: '2026-02-01',
        notes: 'Needs quarterly accessibility audit reports for board review.',
      },
      {
        id: 'client_2',
        name: 'Marcus Vance',
        company: 'Pulse Enterprise Software',
        email: 'marcus@pulsesoftware.io',
        websitesCount: 1,
        averageScore: 92,
        activeIssues: 1,
        createdDate: '2026-03-10',
        notes: 'SOC2 & WCAG AA continuous verification requested.',
      },
    ];

    initialClients.forEach((c) => this.clients.set(c.id, c));

    // Default monitoring alerts
    this.alerts = [
      {
        id: 'alert_1',
        websiteId: 'web_3',
        websiteUrl: 'https://citybistro.example.org',
        date: new Date(Date.now() - 3600000 * 2).toISOString(),
        type: 'score_drop',
        title: 'Accessibility Score Dropped 4 Points',
        description: 'New unlabelled modal form detected after recent theme release.',
        scoreChange: -4,
        read: false,
      },
      {
        id: 'alert_2',
        websiteId: 'web_1',
        websiteUrl: 'https://acme-store.example.com',
        date: new Date(Date.now() - 3600000 * 18).toISOString(),
        type: 'fixed_issue',
        title: '2 Critical Image alt Issues Resolved',
        description: 'Automated re-scan confirmed hero banner alt attributes are now active.',
        scoreChange: +6,
        read: true,
      },
    ];
  }

  // User methods
  getUser(id: string = 'usr_demo_accessfix'): UserProfile {
    return this.users.get(id) || this.users.values().next().value;
  }

  updateUserPlan(userId: string, plan: 'free' | 'pro' | 'agency'): UserProfile {
    const user = this.getUser(userId);
    user.plan = plan;
    user.scansLimit = plan === 'agency' ? 2000 : plan === 'pro' ? 250 : 5;
    user.websitesLimit = plan === 'agency' ? 50 : plan === 'pro' ? 10 : 1;
    this.users.set(user.id, user);
    return user;
  }

  // Website methods
  getWebsites(): MonitoredWebsite[] {
    return Array.from(this.websites.values());
  }

  addWebsite(site: Omit<MonitoredWebsite, 'id' | 'lastScanDate' | 'lastScore' | 'criticalIssuesCount' | 'highIssuesCount' | 'status'>): MonitoredWebsite {
    const newSite: MonitoredWebsite = {
      ...site,
      id: `web_${Date.now()}`,
      lastScanDate: new Date().toISOString(),
      lastScore: 80,
      criticalIssuesCount: 0,
      highIssuesCount: 2,
      status: 'healthy',
    };
    this.websites.set(newSite.id, newSite);
    return newSite;
  }

  removeWebsite(id: string): boolean {
    return this.websites.delete(id);
  }

  updateWebsiteScanStats(id: string, score: number, criticalCount: number, highCount: number): void {
    const site = this.websites.get(id);
    if (site) {
      site.previousScore = site.lastScore;
      site.lastScore = score;
      site.criticalIssuesCount = criticalCount;
      site.highIssuesCount = highCount;
      site.lastScanDate = new Date().toISOString();
      site.status = criticalCount > 2 ? 'critical' : highCount > 4 ? 'warning' : 'healthy';
      this.websites.set(id, site);
    }
  }

  // Scan storage
  saveScan(scan: ScanResult): void {
    this.scans.set(scan.id, scan);
  }

  getScan(id: string): ScanResult | undefined {
    return this.scans.get(id);
  }

  // Site Comparison Storage
  saveComparison(comparison: SiteComparisonResult): void {
    this.comparisons.set(comparison.id, comparison);
  }

  getComparison(id: string): SiteComparisonResult | undefined {
    return this.comparisons.get(id);
  }

  updateIssueStatus(scanId: string, issueId: string, status: IssueStatus): boolean {
    const scan = this.scans.get(scanId);
    if (!scan) return false;

    const issue = scan.issues.find((i) => i.id === issueId);
    if (issue) {
      issue.status = status;
      return true;
    }
    return false;
  }

  // Agency client methods
  getClients(): AgencyClient[] {
    return Array.from(this.clients.values());
  }

  addClient(client: Omit<AgencyClient, 'id' | 'createdDate' | 'websitesCount' | 'averageScore' | 'activeIssues'>): AgencyClient {
    const newClient: AgencyClient = {
      ...client,
      id: `client_${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      websitesCount: 0,
      averageScore: 85,
      activeIssues: 0,
    };
    this.clients.set(newClient.id, newClient);
    return newClient;
  }

  // Monitoring alerts
  getAlerts(): MonitoringAlert[] {
    return this.alerts;
  }

  markAlertRead(id: string): void {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) alert.read = true;
  }

  addAlert(alert: Omit<MonitoringAlert, 'id' | 'date' | 'read'>): MonitoringAlert {
    const newAlert: MonitoringAlert = {
      ...alert,
      id: `alert_${Date.now()}`,
      date: new Date().toISOString(),
      read: false,
    };
    this.alerts.unshift(newAlert);
    return newAlert;
  }

  // Centralized Pricing Plans configuration
  getPricingPlans(): PricingPlan[] {
    return [
      {
        id: 'free',
        name: 'Free Starter',
        priceMonthly: 0,
        priceYearly: 0,
        tagline: 'Essential automated testing for individual site owners.',
        features: [
          '5 On-Demand URL Scans / month',
          'Core WCAG 2.1 AA Checklist',
          'Full Accessibility Score Breakdown',
          'Instant HTML/CSS Technical Fixes',
          'Single Monitored Website',
          'Community Documentation Access',
        ],
        limits: {
          scansPerMonth: 5,
          monitoredWebsites: 1,
          aiFixesPerMonth: 5,
          whiteLabelReports: false,
          scheduledMonitoring: 'None',
          teamMembers: 1,
        },
        ctaText: 'Start Free Scan',
      },
      {
        id: 'pro',
        name: 'Professional',
        priceMonthly: 29,
        priceYearly: 290,
        tagline: 'Continuous monitoring & AI remediations for growing businesses.',
        badge: 'Most Popular',
        popular: true,
        features: [
          '250 Scans / month across any domain',
          'Weekly Automated Background Monitoring',
          'Gemini 3 AI Plain-English Fix Explanations',
          'One-Click React, WordPress & Shopify Code Generation',
          'Instant Score Change & Issue Alerts',
          'Unlimited Downloadable PDF Audit Reports',
          'Up to 10 Monitored Websites',
          'Priority Developer Email Support',
        ],
        limits: {
          scansPerMonth: 250,
          monitoredWebsites: 10,
          aiFixesPerMonth: 'Unlimited',
          whiteLabelReports: false,
          scheduledMonitoring: 'Weekly/Monthly',
          teamMembers: 3,
        },
        ctaText: 'Upgrade to Pro',
      },
      {
        id: 'agency',
        name: 'Agency & Enterprise',
        priceMonthly: 119,
        priceYearly: 1190,
        tagline: 'Multi-client portal, white-label reports, and daily deep audits.',
        badge: 'Agencies & Teams',
        features: [
          '2,000 Scans / month with API access',
          'Daily Automated Monitoring & Instant Alerts',
          'Dedicated Multi-Client Portal & Management',
          'Custom White-Label Branded PDF & Web Reports',
          'Unlimited Monitored Websites (50+ sites)',
          'Custom WCAG AAA & Section 508 Policy Checks',
          'Multi-user Team Roles & Permissions',
          'Dedicated Accessibility Specialist Onboarding',
        ],
        limits: {
          scansPerMonth: 2000,
          monitoredWebsites: 50,
          aiFixesPerMonth: 'Unlimited',
          whiteLabelReports: true,
          scheduledMonitoring: 'Daily/Weekly/Monthly',
          teamMembers: 15,
        },
        ctaText: 'Get Agency Access',
      },
    ];
  }
}

export const storage = new StorageService();
