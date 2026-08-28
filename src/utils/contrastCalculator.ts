export interface ContrastResult {
  ratio: number;
  formattedRatio: string;
  normalTextAA: boolean;
  normalTextAAA: boolean;
  largeTextAA: boolean;
  largeTextAAA: boolean;
  uiComponentAA: boolean;
  status: 'fail' | 'aa_pass' | 'aaa_pass';
  suggestedForeground?: string;
}

/**
 * Parse standard hex string (#fff, #ffffff) into {r, g, b}
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) return null;

  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Convert RGB numbers to standard hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Calculate WCAG relative luminance of an sRGB color component
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const transform = (val: number) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  const R = transform(r);
  const G = transform(g);
  const B = transform(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculate WCAG 2.1 Contrast Ratio between two hex colors
 */
export function calculateContrast(foregroundHex: string, backgroundHex: string): ContrastResult {
  const fg = hexToRgb(foregroundHex) || { r: 15, g: 23, b: 42 };
  const bg = hexToRgb(backgroundHex) || { r: 255, g: 255, b: 255 };

  const l1 = getRelativeLuminance(fg.r, fg.g, fg.b);
  const l2 = getRelativeLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  const formattedRatio = `${ratio.toFixed(2)}:1`;

  const normalTextAA = ratio >= 4.5;
  const normalTextAAA = ratio >= 7.0;
  const largeTextAA = ratio >= 3.0;
  const largeTextAAA = ratio >= 4.5;
  const uiComponentAA = ratio >= 3.0;

  const status = normalTextAAA ? 'aaa_pass' : normalTextAA ? 'aa_pass' : 'fail';

  // Calculate suggested compliant foreground color if failed
  let suggestedForeground: string | undefined = undefined;
  if (!normalTextAA) {
    const isBgDark = l2 < 0.5;
    if (isBgDark) {
      suggestedForeground = '#ffffff';
    } else {
      suggestedForeground = '#0f172a';
    }
  }

  return {
    ratio,
    formattedRatio,
    normalTextAA,
    normalTextAAA,
    largeTextAA,
    largeTextAAA,
    uiComponentAA,
    status,
    suggestedForeground,
  };
}
