/**
 * Simple in-memory server cache helper.
 * Can be swapped with Redis for multi-instance scaling in production.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const cacheStore = new Map<string, CacheEntry<any>>();

export function getCache<T>(key: string): T | null {
  const entry = cacheStore.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key);
    return null;
  }

  return entry.value;
}

export function setCache<T>(key: string, value: T, ttlSeconds: number): void {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  cacheStore.set(key, { value, expiresAt });
}

export function deleteCache(key: string): void {
  cacheStore.delete(key);
}

export function clearCache(): void {
  cacheStore.clear();
}
