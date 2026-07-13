/**
 * Google Analytics and Vercel Analytics wrapper.
 * Safely handles server vs client contexts and integrates seamlessly with GA4.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

// Initialize Google Analytics pageview
export function pageview(url: string) {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

// Track generic custom events
export interface EventProps {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export function event({ action, category, label, value, ...rest }: EventProps) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...rest,
    });
  }
  
  // Log event in development console
  if (process.env.NODE_ENV === "development") {
    console.log(`[ANALYTICS EVENT]`, { action, category, label, value, ...rest });
  }
}
