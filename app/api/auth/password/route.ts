import { NextRequest, NextResponse } from 'next/server';
import { requireSession, isResponse, findAccount, verifyPassword, setPassword, resetOrganizerPassword, requireAdmin } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

// Change your own password.
export async function POST(req: NextRequest) {
  const s = await requireSession(req);
  if (isResponse(s)) return s;
  const { currentPassword, newPassword } = await req.json();

  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return NextResponse.json({ success: false, error: 'Use at least 8 characters for the new password.' }, { status: 400 });
  }
  const account = await findAccount(s.sub, s.branch || undefined);
  if (!account || !verifyPassword(String(currentPassword || ''), account.password_hash)) {
    return NextResponse.json({ success: false, error: 'Your current password is not right.' }, { status: 401 });
  }
  await setPassword(account.username, newPassword);
  return NextResponse.json({ success: true, message: 'Password updated.' });
}

// Admin only: put an association's password back to its starting value.
export async function DELETE(req: NextRequest) {
  const s = await requireAdmin(req);
  if (isResponse(s)) return s;
  const branch = new URL(req.url).searchParams.get('branch');
  if (!branch) return NextResponse.json({ success: false, error: 'Choose an association.' }, { status: 400 });
  const ok = await resetOrganizerPassword(branch);
  return NextResponse.json(ok ? { success: true, message: `${branch} password reset to its starting value.` } : { success: false, error: 'No such association.' }, { status: ok ? 200 : 404 });
}
