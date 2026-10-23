import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get('branch');
    const category = searchParams.get('category');
    const day = searchParams.get('day');
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const year = searchParams.get('year');

    let sql = `
      SELECT 
        e.id,
        e.slug,
        e.edition_year as "editionYear",
        e.branch_code as "branch",
        e.title,
        e.category,
        e.tagline,
        e.description,
        e.poster_url as "posterUrl",
        e.junior_coordinators as "juniorCoordinators",
        e.venue,
        e.day,
        e.time,
        e.prize_pool_first as "prizePoolFirst",
        e.prize_pool_second as "prizePoolSecond",
        e.prize_pool_third as "prizePoolThird",
        e.prize_pool_total as "prizePoolTotal",
        e.team_size as "teamSize",
        e.current_registered as "currentRegistered",
        e.max_slots as "maxSlots",
        e.status,
        e.rules,
        e.rounds,
        e.registration_url as "registrationUrl",
        b.association_name as "associationName",
        b.association_short as "associationShort",
        b.accent_color as "accentColor",
        b.bg_light_color as "bgLightColor",
        b.logo_url as "branchLogo"
      FROM events e
      LEFT JOIN branches b ON e.branch_code = b.code
    `;

    const params: any[] = [];
    const conditions: string[] = [];

    if (id) {
      params.push(id);
      conditions.push(`e.id = $${params.length}`);
    }

    if (slug) {
      params.push(slug);
      conditions.push(`e.slug = $${params.length}`);
    }

    if (branch && branch !== 'ALL') {
      params.push(branch);
      conditions.push(`e.branch_code = $${params.length}`);
    }

    if (category && category !== 'ALL') {
      params.push(category);
      conditions.push(`e.category = $${params.length}`);
    }

    if (day && day !== 'ALL') {
      params.push(day);
      conditions.push(`e.day = $${params.length}`);
    }

    if (year && year !== 'ALL') {
      params.push(parseInt(year, 10));
      conditions.push(`e.edition_year = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    sql += ` ORDER BY e.created_at ASC`;

    const res = await query(sql, params);

    const events = res.rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      branch: row.branch,
      title: row.title,
      category: row.category,
      tagline: row.tagline,
      description: row.description,
      posterUrl: row.posterUrl,
      juniorCoordinators: Array.isArray(row.juniorCoordinators) ? row.juniorCoordinators : [],
      coordinators: Array.isArray(row.juniorCoordinators) ? row.juniorCoordinators : [],
      venue: row.venue,
      day: row.day,
      time: row.time,
      prizePool: {
        first: row.prizePoolFirst || 'INR 10,000',
        second: row.prizePoolSecond || 'INR 5,000',
        third: row.prizePoolThird || undefined,
        total: row.prizePoolTotal || 'INR 15,000',
      },
      prizePoolFirst: row.prizePoolFirst,
      prizePoolSecond: row.prizePoolSecond,
      prizePoolThird: row.prizePoolThird,
      prizePoolTotal: row.prizePoolTotal,
      teamSize: row.teamSize,
      currentRegistered: row.currentRegistered || 0,
      maxSlots: row.maxSlots || 100,
      status: row.status || 'OPEN',
      rules: Array.isArray(row.rules) ? row.rules : [],
      rounds: Array.isArray(row.rounds) ? row.rounds : [],
      registrationUrl: row.registrationUrl || 'https://forms.gle/samshodhani',
      editionYear: row.editionYear || 2026,
      associationName: row.associationName,
      associationShort: row.associationShort,
      accentColor: row.accentColor,
      bgLightColor: row.bgLightColor,
      branchLogo: row.branchLogo || null,
    }));

    return NextResponse.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error: any) {
    console.error('Error fetching events from Neon DB:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id: existingId,
      branchCode,
      editionYear: rawEditionYear,
      title,
      category,
      tagline,
      description,
      posterUrl,
      venue,
      day,
      time,
      prizePoolTotal,
      prizePoolFirst,
      prizePoolSecond,
      prizePoolThird,
      teamSize,
      maxSlots,
      currentRegistered,
      status,
      registrationUrl,
      juniorCoordinators,
      coordinators,
      rules,
      rounds,
    } = body;

    const editionYear = rawEditionYear ? parseInt(rawEditionYear, 10) : 2026;

    if (!branchCode || !title) {
      return NextResponse.json(
        { success: false, error: 'Branch code and title are required' },
        { status: 400 }
      );
    }

    const coordsData = juniorCoordinators || coordinators || [];
    const rulesData = rules || [];
    const roundsData = rounds || [];

    // Check if event with existingId exists
    let existingRow = null;
    if (existingId) {
      const checkRes = await query('SELECT id FROM events WHERE id = $1', [existingId]);
      if (checkRes.rows.length > 0) {
        existingRow = checkRes.rows[0];
      }
    }

    let res;
    if (existingRow) {
      // UPDATE
      const updateSql = `
        UPDATE events SET
          branch_code = $1,
          title = $2,
          category = $3,
          tagline = $4,
          description = $5,
          poster_url = $6,
          venue = $7,
          day = $8,
          time = $9,
          prize_pool_first = $10,
          prize_pool_second = $11,
          prize_pool_third = $12,
          prize_pool_total = $13,
          team_size = $14,
          max_slots = $15,
          current_registered = $16,
          status = $17,
          registration_url = $18,
          junior_coordinators = $19,
          rules = $20,
          rounds = $21,
          updated_at = NOW()
        WHERE id = $22
        RETURNING *;
      `;

      res = await query(updateSql, [
        branchCode,
        title,
        category || 'Coding',
        tagline || '',
        description || '',
        posterUrl || '',
        venue || 'Campus Lab',
        day || 'Day 2',
        time || '10:00 AM - 01:00 PM',
        prizePoolFirst || 'INR 10,000',
        prizePoolSecond || 'INR 5,000',
        prizePoolThird || null,
        prizePoolTotal || 'INR 15,000',
        teamSize || '1 to 2 Members',
        maxSlots ? parseInt(maxSlots, 10) : 100,
        currentRegistered ? parseInt(currentRegistered, 10) : 0,
        status || 'OPEN',
        registrationUrl || 'https://forms.gle/samshodhani',
        JSON.stringify(coordsData),
        JSON.stringify(rulesData),
        JSON.stringify(roundsData),
        existingId,
      ]);
    } else {
      // INSERT
      const id = existingId || `ev-${branchCode.toLowerCase()}-${Date.now().toString().slice(-4)}`;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const insertSql = `
        INSERT INTO events (
          id, slug, branch_code, title, category, tagline, description, poster_url,
          venue, day, time, prize_pool_first, prize_pool_second, prize_pool_third,
          prize_pool_total, team_size, max_slots, current_registered, status,
          registration_url, junior_coordinators, rules, rounds,
          edition_year
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19,
          $20, $21, $22, $23,
          $24
        ) RETURNING *;
      `;

      res = await query(insertSql, [
        id,
        slug,
        branchCode,
        title,
        category || 'Coding',
        tagline || '',
        description || '',
        posterUrl || '',
        venue || 'Campus Lab',
        day || 'Day 2',
        time || '10:00 AM - 01:00 PM',
        prizePoolFirst || 'INR 10,000',
        prizePoolSecond || 'INR 5,000',
        prizePoolThird || null,
        prizePoolTotal || 'INR 15,000',
        teamSize || '1 to 2 Members',
        maxSlots ? parseInt(maxSlots, 10) : 100,
        currentRegistered ? parseInt(currentRegistered, 10) : 0,
        status || 'OPEN',
        registrationUrl || 'https://forms.gle/samshodhani',
        JSON.stringify(coordsData),
        JSON.stringify(rulesData),
        JSON.stringify(roundsData),
        editionYear,
      ]);
    }

    return NextResponse.json({
      success: true,
      message: 'Event published successfully to central database',
      data: res.rows[0],
    });
  } catch (error: any) {
    console.error('Error inserting/updating event into Neon DB:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save event' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, currentRegistered, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (currentRegistered !== undefined) {
      params.push(parseInt(currentRegistered, 10));
      updates.push(`current_registered = $${params.length}`);
    }

    if (status !== undefined) {
      params.push(status);
      updates.push(`status = $${params.length}`);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields provided to update' }, { status: 400 });
    }

    params.push(id);
    const sql = `UPDATE events SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`;
    const res = await query(sql, params);

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Event status updated successfully',
      data: res.rows[0],
    });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    await query('DELETE FROM events WHERE id = $1', [id]);
    return NextResponse.json({
      success: true,
      message: 'Event removed from institutional database',
    });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete event' }, { status: 500 });
  }
}
