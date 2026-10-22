import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get('branch');

    let sql = `
      SELECT 
        id, 
        pass_token as "passToken", 
        full_name as "fullName", 
        college, 
        roll_number as "rollNumber", 
        branch, 
        year_of_study as "yearOfStudy", 
        email, 
        phone, 
        team_name as "teamName", 
        target_title as "targetTitle", 
        target_type as "targetType", 
        payment_status as "paymentStatus", 
        created_at as "createdAt"
      FROM registrations
    `;

    const params: any[] = [];
    if (branch && branch !== 'ALL') {
      sql += ' WHERE branch = $1';
      params.push(branch);
    }
    sql += ' ORDER BY created_at DESC;';

    const res = await query(sql, params);

    return NextResponse.json({
      success: true,
      count: res.rows.length,
      data: res.rows,
    });
  } catch (error: any) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve registrations' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      college,
      rollNumber,
      branch,
      yearOfStudy,
      email,
      phone,
      teamName,
      targetId,
      targetTitle,
      targetType, // 'workshop' | 'event'
    } = body;

    if (!fullName || !email || !rollNumber) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and roll number are required' },
        { status: 400 }
      );
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const passToken = `SAM26-${branch || 'GEN'}-${randomDigits}`;
    const id = `reg-${Date.now()}`;

    // 1. Insert into registrations table
    const insertSql = `
      INSERT INTO registrations (
        id, pass_token, full_name, college, roll_number, branch, year_of_study,
        email, phone, team_name, target_title, target_type, payment_status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'VERIFIED'
      ) RETURNING *;
    `;

    const regResult = await query(insertSql, [
      id,
      passToken,
      fullName,
      college || 'KITSW',
      rollNumber,
      branch || 'CSE',
      yearOfStudy || '3rd Year B.Tech',
      email,
      phone || '',
      teamName || null,
      targetTitle || 'Samshodhani Pass',
      targetType || 'workshop',
    ]);

    // 2. Increment live attendee count on workshop or event if targetId provided
    if (targetType === 'workshop') {
      await query(
        `UPDATE workshops SET current_registered = current_registered + 1 WHERE id = $1 OR branch_code = $1;`,
        [targetId || branch]
      );
    } else if (targetType === 'event' && targetId) {
      await query(
        `UPDATE events SET current_registered = current_registered + 1 WHERE id = $1;`,
        [targetId]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Registration confirmed in Neon PostgreSQL database',
      passToken,
      registration: regResult.rows[0],
    });
  } catch (error: any) {
    console.error('Registration insertion error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed to save in database' },
      { status: 500 }
    );
  }
}
