import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(
      `SELECT year, name, theme, dates, is_active as "isActive", status, created_at as "createdAt"
       FROM editions
       ORDER BY year DESC`
    );

    let editions = res.rows;
    if (editions.length === 0) {
      // Fallback inaugural if empty
      await query(
        `INSERT INTO editions (year, name, theme, dates, is_active, status)
         VALUES (2026, 'Sumshodhini ''26', 'National Science & Technology Symposium', 'October 23–24, 2026', true, 'live')
         ON CONFLICT (year) DO NOTHING`
      );
      const reload = await query(
        `SELECT year, name, theme, dates, is_active as "isActive", status, created_at as "createdAt"
         FROM editions
         ORDER BY year DESC`
      );
      editions = reload.rows;
    }

    return NextResponse.json({
      success: true,
      data: editions,
      activeEdition: editions.find((e: any) => e.isActive) || editions[0]
    });
  } catch (error: any) {
    console.error('Error fetching editions:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { year, name, theme, dates, setActive } = body;

    if (!year) {
      return NextResponse.json({ success: false, error: 'Year is required' }, { status: 400 });
    }

    const edYear = parseInt(year, 10);
    const edName = name || `Sumshodhini '${String(edYear).slice(-2)}`;

    if (setActive) {
      // Archive previous live editions
      await query(
        `UPDATE editions SET is_active = false, status = 'archived' WHERE is_active = true`
      );
    }

    const insertRes = await query(
      `INSERT INTO editions (year, name, theme, dates, is_active, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (year) DO UPDATE SET
         name = EXCLUDED.name,
         theme = EXCLUDED.theme,
         dates = EXCLUDED.dates,
         is_active = EXCLUDED.is_active,
         status = EXCLUDED.status
       RETURNING year, name, theme, dates, is_active as "isActive", status`,
      [edYear, edName, theme || 'National Science & Technology Symposium', dates || '', !!setActive, setActive ? 'live' : 'upcoming']
    );

    return NextResponse.json({
      success: true,
      data: insertRes.rows[0],
      message: `Edition ${edYear} successfully initialized.`
    });
  } catch (error: any) {
    console.error('Error creating edition:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
