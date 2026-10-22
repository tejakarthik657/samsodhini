import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        id, 
        time, 
        title, 
        type, 
        branch_code as "branch", 
        venue, 
        day, 
        speaker_or_lead as "speakerOrLead"
      FROM schedule_items 
      ORDER BY day ASC, id ASC
    `);

    return NextResponse.json({
      success: true,
      data: res.rows,
    });
  } catch (error: any) {
    console.error('Error fetching schedule from Neon DB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}
