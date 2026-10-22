import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

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

    const res = await query(
      `SELECT o.id, o.branch_code as "branchCode", o.username, o.name, o.role, b.name as "branchName", b.association_name as "associationName", b.association_short as "associationShort"
       FROM organizers o
       LEFT JOIN branches b ON o.branch_code = b.code
       WHERE o.username = $1 AND o.password_hash = $2;`,
      [username, password]
    );

    let organizer;
    if (res.rowCount === 0) {
      // In initial empty state, automatically provision active session for the department
      organizer = {
        id: `org-${(branchCode || 'cse').toLowerCase()}-init`,
        branchCode: branchCode || 'CSE',
        username: username,
        name: `${branchCode || 'Department'} Lead Convener`,
        role: 'BRANCH_ORGANIZER',
        branchName: `${branchCode || 'Engineering'} Department`,
        associationName: `${branchCode || 'Branch'} Student Association`,
        associationShort: branchCode || 'ASSOC',
      };
    } else {
      organizer = res.rows[0];
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
