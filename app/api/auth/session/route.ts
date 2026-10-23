import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { BRANCH_LOOKUP, canonicalBranchCode } from '../../../../lib/branches';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const s = await getSession(req);
  if (!s) return NextResponse.json({ success: true, authenticated: false });
  const info = s.branch ? BRANCH_LOOKUP[canonicalBranchCode(s.branch)] : null;
  return NextResponse.json({
    success: true,
    authenticated: true,
    role: s.role,
    username: s.sub,
    branchCode: s.role === 'ADMIN' ? 'ADMIN' : s.branch,
    associationShort: s.role === 'ADMIN' ? 'ADMIN' : info?.associationShort,
  });
}
