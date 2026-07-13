import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// FORMATTING UTILITIES
// ============================================

/**
 * Format price in Indonesian Rupiah
 */
export function formatPrice(
  amount: number,
  options?: { compact?: boolean; currency?: string }
): string {
  const currency = options?.currency ?? "IDR";

  if (options?.compact && amount >= 1_000_000) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatNumber(num?: number | string | null): string {
  if (num === undefined || num === null || Number.isNaN(Number(num))) return "0";
  const n = Number(num);
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}Jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}Rb`;
  return n.toString();
}

/**
 * Format weight in kg or grams
 */
export function formatWeight(grams: number): string {
  if (grams >= 1000) return `${(grams / 1000).toFixed(1)} kg`;
  return `${grams} g`;
}

/**
 * Format relative time in Indonesian
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffWeeks < 4) return `${diffWeeks} minggu lalu`;
  if (diffMonths < 12) return `${diffMonths} bulan lalu`;
  return `${Math.floor(diffMonths / 12)} tahun lalu`;
}

/**
 * Format date in Indonesian
 */
export function formatDate(
  dateString: string,
  options?: { short?: boolean }
): string {
  const date = new Date(dateString);
  if (options?.short) {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// ============================================
// STRING UTILITIES
// ============================================

/**
 * Create URL-safe slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// ============================================
// ARRAY UTILITIES
// ============================================

/**
 * Group array by key
 */
export function groupBy<T>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      return {
        ...groups,
        [groupKey]: [...(groups[groupKey] || []), item],
      };
    },
    {} as Record<string, T[]>
  );
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  return array.reduce<T[][]>((chunks, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!chunks[chunkIndex]) chunks[chunkIndex] = [];
    chunks[chunkIndex].push(item);
    return chunks;
  }, []);
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Check if string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string is a valid Indonesian phone number
 */
export function isValidPhone(phone: string): boolean {
  return /^(\+62|62|0)[0-9]{8,12}$/.test(phone.replace(/\s|-/g, ""));
}

/**
 * Format Indonesian phone number to WhatsApp format
 */
export function formatPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\s|-/g, "");
  if (cleaned.startsWith("0")) return "62" + cleaned.slice(1);
  if (cleaned.startsWith("+62")) return cleaned.slice(1);
  return cleaned;
}

// ============================================
// IMAGE UTILITIES
// ============================================

/**
 * Get placeholder blur data URL
 */
export function getBlurDataUrl(width = 8, height = 8): string {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <filter id="blur">
        <feGaussianBlur stdDeviation="2"/>
      </filter>
      <rect width="${width}" height="${height}" fill="#6B7C3D" filter="url(#blur)" opacity="0.1"/>
    </svg>`
  ).toString("base64")}`;
}

/**
 * Build Supabase Storage public URL
 */
export function buildStorageUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

// ============================================
// ENVIRONMENTAL UTILITIES
// ============================================

/**
 * Calculate CO2 trees equivalent
 */
export function co2ToTrees(co2Kg: number): number {
  // Average tree absorbs ~22kg CO2 per year
  return Math.round(co2Kg / 22);
}

/**
 * Format environmental impact
 */
export function formatImpact(
  value: number,
  unit: "kg" | "ton" | "liter"
): string {
  if (unit === "kg" && value >= 1000) {
    return `${(value / 1000).toFixed(1)} ton`;
  }
  return `${formatNumber(value)} ${unit}`;
}
