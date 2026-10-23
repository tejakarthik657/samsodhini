import { createHmac, timingSafeEqual } from 'crypto';

/** The one account that can manage every branch's content and the festival-wide settings. */
export const ADMIN_EMAIL = 'tc.sac@kitsw.ac.in';

export function isAdminEmail(value?: string | null): boolean {
  return (value || '').trim().toLowerCase() === ADMIN_EMAIL;
}

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

function secret(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function sign(payload: string, key: string): string {
  return createHmac('sha256', key).update(payload).digest('hex');
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Issues a short-lived token the browser sends back on admin-only requests. */
export function issueAdminToken(): string | null {
  const key = secret();
  if (!key) return null;
  const expires = String(Date.now() + TOKEN_TTL_MS);
  return `${expires}.${sign(`admin:${expires}`, key)}`;
}

export function verifyAdminToken(token?: string | null): boolean {
  const key = secret();
  if (!key || !token) return false;
  const [expires, sig] = token.split('.');
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  return safeEqual(sig, sign(`admin:${expires}`, key));
}

/** Organizer password rule: the department code in lowercase, then "@sumshodhini" (for example cse@sumshodhini). */
export function organizerPasswordFor(branchCode: string): string {
  return `${branchCode.toLowerCase()}@sumshodhini`;
}
