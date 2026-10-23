import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { ADMIN_EMAIL, isAdminEmail, issueAdminToken, safeEqual, organizerPasswordFor } from '../../../../lib/admin';
import { BRANCH_LOOKUP, canonicalBranchCode } from '../../../../lib/branches';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { branchCode, username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // The festival admin signs in with their college email and a password kept in the server environment.
    if (isAdminEmail(username)) {
      const expected = process.env.ADMIN_PASSWORD;
      if (!expected) {
        return NextResponse.json(
          { success: false, error: 'Admin sign-in is not set up yet. Add ADMIN_PASSWORD to the server environment.' },
          { status: 503 }
        );
      }
      if (!safeEqual(String(password), expected)) {
        return NextResponse.json({ success: false, error: 'That email or password is not right.' }, { status: 401 });
      }
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        adminToken: issueAdminToken(),
        organizer: {
          id: 'admin',
          branchCode: 'ADMIN',
          username: ADMIN_EMAIL,
          name: 'Festival Admin',
          role: 'ADMIN',
          branchName: 'All departments',
          associationName: 'Festival administration',
          associationShort: 'ADMIN',
        },
      });
    }

    const res = await query(
      `SELECT o.id, o.branch_code as "branchCode", o.username, o.name, o.role, b.name as "branchName", b.association_name as "associationName", b.association_short as "associationShort"
       FROM organizers o
       LEFT JOIN branches b ON o.branch_code = b.code
       WHERE o.username = $1 AND o.password_hash = $2;`,
      [username, password]
    );

    let organizer;
    if (res.rowCount && res.rowCount > 0) {
      organizer = res.rows[0];
    } else {
      // Association accounts: username is the association short name (csea) or its full form (csea_cse),
      // and the password is the department code followed by @sumshodhini.
      const code = canonicalBranchCode(branchCode) || '';
      const info = BRANCH_LOOKUP[code];
      const user = String(username).trim().toLowerCase();
      const userOk = !!info && (user === info.associationShort.toLowerCase().replace(/\s+/g, '') || user === info.defaultUsername.toLowerCase() || user === info.code.toLowerCase());
      const passOk = !!info && safeEqual(String(password).trim().toLowerCase(), organizerPasswordFor(info.code));

      if (!info || !userOk || !passOk) {
        return NextResponse.json(
          { success: false, error: 'That username or password is not right. Check the association you picked.' },
          { status: 401 }
        );
      }

      organizer = {
        id: `org-${info.code.toLowerCase()}`,
        branchCode: info.code,
        username: info.defaultUsername,
        name: `${info.associationShort} Convener`,
        role: 'BRANCH_ORGANIZER',
        branchName: info.name,
        associationName: info.associationName,
        associationShort: info.associationShort,
      };
    }

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      organizer: {
        id: organizer.id,
        branchCode: organizer.branchCode,
        username: organizer.username,
        name: organizer.name,
        role: organizer.role,
        branchName: organizer.branchName,
        associationName: organizer.associationName,
        associationShort: organizer.associationShort,
      },
    });
  } catch (error: any) {
    console.error('Organizer login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication service error' },
      { status: 500 }
    );
  }
}
