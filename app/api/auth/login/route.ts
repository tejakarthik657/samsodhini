import { NextRequest, NextResponse } from 'next/server';
import { findAccount, verifyPassword, createSession, attachSessionCookie } from '../../../../lib/auth';
import { BRANCH_LOOKUP, canonicalBranchCode } from '../../../../lib/branches';

export const dynamic = 'force-dynamic';

// Five wrong attempts per user and address, then a 15 minute pause.
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;

function limited(key: string) {
  const a = attempts.get(key);
  if (!a) return false;
  if (Date.now() - a.first > WINDOW_MS) { attempts.delete(key); return false; }
  return a.count >= MAX_FAILS;
}
function fail(key: string) {
  const a = attempts.get(key);
  if (!a || Date.now() - a.first > WINDOW_MS) attempts.set(key, { count: 1, first: Date.now() });
  else a.count += 1;
}

export async function POST(req: NextRequest) {
  try {
    const { branchCode, username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Enter your username and password.' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const key = `${ip}|${String(username).toLowerCase()}`;
    if (limited(key)) {
      return NextResponse.json({ success: false, error: 'Too many attempts. Wait 15 minutes and try again.' }, { status: 429 });
    }

    const account = await findAccount(String(username), branchCode);
    if (!account || !verifyPassword(String(password), account.password_hash)) {
      fail(key);
      return NextResponse.json({ success: false, error: 'That username or password is not right.' }, { status: 401 });
    }
    attempts.delete(key);

    const token = await createSession(account);
    const isAdmin = account.role === 'ADMIN';
    const info = account.branch_code ? BRANCH_LOOKUP[canonicalBranchCode(account.branch_code)] : null;

    const res = NextResponse.json({
      success: true,
      mustChangePassword: account.must_change,
      organizer: {
        id: account.username,
        branchCode: isAdmin ? 'ADMIN' : account.branch_code,
        username: account.username,
        name: isAdmin ? 'Festival Admin' : `${info?.associationShort} Convener`,
        role: account.role,
        branchName: isAdmin ? 'All departments' : info?.name,
        associationName: isAdmin ? 'Festival administration' : info?.associationName,
        associationShort: isAdmin ? 'ADMIN' : info?.associationShort,
      },
    });
    attachSessionCookie(res, token);
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Sign-in is unavailable right now. Try again shortly.' }, { status: 500 });
  }
}
