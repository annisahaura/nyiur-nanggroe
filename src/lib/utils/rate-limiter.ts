// Simple in-memory rate limiter for serverless environment helpers
// In production with high scalability, swap this out for Redis (ioredis + @upstash/ratelimit)

interface RateLimitStore {
  [key: string]: {
    tokens: number;
    lastRefill: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitOptions {
  limit: number;      // Maximum tokens
  interval: number;   // Time window in ms
}

export function rateLimit(ip: string, options: RateLimitOptions): { success: boolean; limit: number; remaining: number } {
  const { limit, interval } = options;
  const now = Date.now();

  if (!store[ip]) {
    store[ip] = {
      tokens: limit,
      lastRefill: now,
    };
  }

  const client = store[ip];
  const elapsed = now - client.lastRefill;
  
  // Refill tokens proportionally to elapsed time
  const tokensToAdd = Math.floor(elapsed / (interval / limit));
  if (tokensToAdd > 0) {
    client.tokens = Math.min(limit, client.tokens + tokensToAdd);
    client.lastRefill = now;
  }

  if (client.tokens > 0) {
    client.tokens -= 1;
    return {
      success: true,
      limit,
      remaining: client.tokens,
    };
  }

  return {
    success: false,
    limit,
    remaining: 0,
  };
}
