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
         VALUES (2026, 'Sumshodhini ''26', 'National Science & Technology Symposium', 'October 30–31, 2026', true, 'live')
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
      [edYear, edName, theme || 'National Science & Technology Symposium', dates || 'October 30–31, 2026', !!setActive, setActive ? 'live' : 'upcoming']
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

// PATCH to allow changing dates, theme, or name dynamically anytime
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { year, dates, theme, name, setActive } = body;

    if (!year) {
      return NextResponse.json({ success: false, error: 'Edition year is required' }, { status: 400 });
    }

    const edYear = parseInt(year, 10);

    if (setActive) {
      await query(`UPDATE editions SET is_active = false, status = 'archived' WHERE is_active = true`);
    }

    const updateRes = await query(
      `UPDATE editions
       SET 
         dates = COALESCE($1, dates),
         theme = COALESCE($2, theme),
         name = COALESCE($3, name),
         is_active = CASE WHEN $4::boolean IS NOT NULL THEN $4::boolean ELSE is_active END,
         status = CASE WHEN $4::boolean = true THEN 'live' ELSE status END
       WHERE year = $5
       RETURNING year, name, theme, dates, is_active as "isActive", status`,
      [dates || null, theme || null, name || null, setActive !== undefined ? !!setActive : null, edYear]
    );

    if (updateRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: `Edition ${edYear} not found` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updateRes.rows[0],
      message: `Edition ${edYear} dates and details updated successfully.`
    });
  } catch (error: any) {
    console.error('Error updating edition:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
