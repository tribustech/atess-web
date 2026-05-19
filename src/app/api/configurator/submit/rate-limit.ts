const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, now: number = Date.now()): { ok: boolean } {
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (b.count >= LIMIT) return { ok: false };
  b.count += 1;
  return { ok: true };
}

export function __resetRateLimitForTests() {
  buckets.clear();
}
