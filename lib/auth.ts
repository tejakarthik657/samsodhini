import { SignJWT, jwtVerify } from 'jose';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { query } from './db';
import { KITSW_BRANCHES, canonicalBranchCode } from './branches';

export const SESSION_COOKIE = 'sam_session';
export const ADMIN_EMAIL = 'tc.sac@kitsw.ac.in';
const SESSION_HOURS = 12;

export interface Session {
  sub: string;
  role: 'ADMIN' | 'ORGANIZER';
  branch: string | null;
}

/* ---------------------------------------------------------------- */
/* Password hashing                                                  */
/* ---------------------------------------------------------------- */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

/** Organizer starting password: the department code in lowercase, then @sumshodhini. */
export function organizerPasswordFor(code: string): string {
  return `${code.toLowerCase()}@sumshodhini`;
}

/* ---------------------------------------------------------------- */
/* Storage: accounts and the signing key both live in the database   */
/* ---------------------------------------------------------------- */

let ready: Promise<void> | null = null;

async function setup() {
  await query(`CREATE TABLE IF NOT EXISTS app_secrets (key TEXT PRIMARY KEY, value TEXT NOT NULL)`);
  await query(`CREATE TABLE IF NOT EXISTS auth_accounts (
    username TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    branch_code TEXT,
    password_hash TEXT NOT NULL,
    must_change BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);

  const have = await query(`SELECT 1 FROM auth_accounts LIMIT 1`);
  if (have.rowCount === 0) {
    // First run only. The admin starts with a random password that is printed once to the server log.
    const adminPassword = randomBytes(9).toString('base64url');
    await query(
      `INSERT INTO auth_accounts (username, role, branch_code, password_hash, must_change) VALUES ($1,'ADMIN',NULL,$2,true) ON CONFLICT DO NOTHING`,
      [ADMIN_EMAIL, hashPassword(adminPassword)]
    );
    for (const b of KITSW_BRANCHES) {
      await query(
        `INSERT INTO auth_accounts (username, role, branch_code, password_hash) VALUES ($1,'ORGANIZER',$2,$3) ON CONFLICT DO NOTHING`,
        [b.associationShort.toLowerCase().replace(/\s+/g, ''), b.code, hashPassword(organizerPasswordFor(b.code))]
      );
    }
    console.log(`\n[auth] Created accounts. Admin ${ADMIN_EMAIL} initial password: ${adminPassword}\n`);
  }
}

function ensureSetup() {
  if (!ready) ready = setup().catch((e) => { ready = null; throw e; });
  return ready;
}

let cachedKey: Uint8Array | null = null;

async function signingKey(): Promise<Uint8Array> {
  if (cachedKey) return cachedKey;
  await ensureSetup();
  let res = await query(`SELECT value FROM app_secrets WHERE key = 'jwt'`);
  if (res.rowCount === 0) {
    await query(`INSERT INTO app_secrets (key, value) VALUES ('jwt', $1) ON CONFLICT DO NOTHING`, [randomBytes(48).toString('hex')]);
    res = await query(`SELECT value FROM app_secrets WHERE key = 'jwt'`);
  }
  cachedKey = new TextEncoder().encode(res.rows[0].value);
  return cachedKey;
}

/* ---------------------------------------------------------------- */
/* Accounts                                                          */
/* ---------------------------------------------------------------- */

export interface Account { username: string; role: 'ADMIN' | 'ORGANIZER'; branch_code: string | null; password_hash: string; must_change: boolean }

export async function findAccount(identifier: string, branchCode?: string): Promise<Account | null> {
  await ensureSetup();
  const id = identifier.trim().toLowerCase();

  if (id === ADMIN_EMAIL) {
    const r = await query(`SELECT * FROM auth_accounts WHERE username = $1`, [ADMIN_EMAIL]);
    return r.rows[0] || null;
  }

  // Organizers can type the association (csea), the department (cse) or the old form (csea_cse).
  const code = canonicalBranchCode(branchCode);
  if (!code) return null;
  const info = KITSW_BRANCHES.find((b) => b.code === code);
  if (!info) return null;
  const accepted = [info.associationShort.toLowerCase().replace(/\s+/g, ''), info.defaultUsername.toLowerCase(), info.code.toLowerCase()];
  if (!accepted.includes(id)) return null;
  const r = await query(`SELECT * FROM auth_accounts WHERE role = 'ORGANIZER' AND branch_code = $1`, [info.code]);
  return r.rows[0] || null;
}

export async function setPassword(username: string, password: string) {
  await ensureSetup();
  await query(`UPDATE auth_accounts SET password_hash = $1, must_change = false, updated_at = now() WHERE username = $2`, [hashPassword(password), username]);
}

export async function resetOrganizerPassword(branchCode: string): Promise<boolean> {
  await ensureSetup();
  const r = await query(
    `UPDATE auth_accounts SET password_hash = $1, must_change = true, updated_at = now() WHERE role = 'ORGANIZER' AND branch_code = $2`,
    [hashPassword(organizerPasswordFor(branchCode)), canonicalBranchCode(branchCode)]
  );
  return (r.rowCount || 0) > 0;
}

/* ---------------------------------------------------------------- */
/* JWT sessions                                                      */
/* ---------------------------------------------------------------- */

export async function createSession(account: Account): Promise<string> {
  return new SignJWT({ role: account.role, branch: account.branch_code })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(account.username)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(await signingKey());
}

export function attachSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_HOURS * 3600,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
}

export async function getSession(req: NextRequest): Promise<Session | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, await signingKey(), { algorithms: ['HS256'] });
    return { sub: String(payload.sub), role: payload.role as Session['role'], branch: (payload.branch as string) || null };
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------- */
/* Route guards                                                      */
/* ---------------------------------------------------------------- */

function deny(status: 401 | 403, error: string) {
  return NextResponse.json({ success: false, error }, { status });
}

/** Any signed-in user. Returns the session, or a response to send back. */
export async function requireSession(req: NextRequest): Promise<Session | NextResponse> {
  const s = await getSession(req);
  return s || deny(401, 'Sign in to continue.');
}

export async function requireAdmin(req: NextRequest): Promise<Session | NextResponse> {
  const s = await getSession(req);
  if (!s) return deny(401, 'Sign in to continue.');
  if (s.role !== 'ADMIN') return deny(403, 'Only the festival admin can do this.');
  return s;
}

/** Admin for anything, organizers only for their own association. */
export async function requireBranch(req: NextRequest, branchCode: string | null | undefined): Promise<Session | NextResponse> {
  const s = await getSession(req);
  if (!s) return deny(401, 'Sign in to continue.');
  if (s.role === 'ADMIN') return s;
  if (!branchCode || canonicalBranchCode(branchCode) !== canonicalBranchCode(s.branch)) {
    return deny(403, 'You can only change your own association.');
  }
  return s;
}

export function isResponse(x: Session | NextResponse): x is NextResponse {
  return x instanceof NextResponse;
}
