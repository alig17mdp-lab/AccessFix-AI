import { ScanResult } from '../types';

/**
 * Trigger download of raw JSON scan report
 */
export function downloadJsonReport(scan: ScanResult): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scan, null, 2));
  const downloadAnchor = document.createElement('a');
  const domain = new URL(scan.targetUrl).hostname;
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `AccessFix-Audit-${domain}-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Generate and download CSV list of detected accessibility issues
 */
export function downloadCsvReport(scan: ScanResult): void {
  const headers = ['ID', 'Severity', 'Category', 'WCAG Criteria', 'Title', 'Affected Element', 'Status', 'Why It Matters'];
  const rows = scan.issues.map((issue) => [
    `"${issue.id}"`,
    `"${issue.severity.toUpperCase()}"`,
    `"${issue.category}"`,
    `"${issue.wcagCriteria.replace(/"/g, '""')}"`,
    `"${issue.title.replace(/"/g, '""')}"`,
    `"${issue.affectedElement.replace(/"/g, '""')}"`,
    `"${issue.status}"`,
    `"${issue.whyItMatters.replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  const domain = new URL(scan.targetUrl).hostname;
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `AccessFix-Issues-${domain}-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Copy formatted markdown executive summary to clipboard
 */
export function copyMarkdownReport(scan: ScanResult): string {
  const domain = new URL(scan.targetUrl).hostname;
  const md = `# AccessFix AI Accessibility Audit Report
**Target Domain:** ${scan.targetUrl}
**Overall Health Score:** ${scan.score}/100
**Scanned At:** ${new Date(scan.scannedAt).toLocaleDateString()}
**Total Issues Detected:** ${scan.issues.length}
- Critical: ${scan.summary.criticalCount}
- High Priority: ${scan.summary.highCount}
- Medium Priority: ${scan.summary.mediumCount}
- Low Priority: ${scan.summary.lowCount}

## Executive Summary
${scan.executiveSummary}

## Top Critical Issues
${scan.issues
  .filter((i) => i.severity === 'critical')
  .map(
    (i, idx) => `
### ${idx + 1}. ${i.title} (${i.wcagCriteria})
- **Affected Element:** \`${i.affectedElement}\`
- **Impact:** ${i.whyItMatters}
- **Recommended Fix:** ${i.recommendedFix}
`
  )
  .join('\n')}

---
*Notice: Automated testing identifies detectable programmatic barriers according to WCAG 2.1 AA benchmarks and does not constitute legal certification.*
`;
  return md;
}
