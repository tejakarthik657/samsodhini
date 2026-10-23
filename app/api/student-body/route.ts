import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireBranch, isResponse } from '@/lib/auth';
import { BRANCH_ALIASES, BRANCH_LOOKUP, KITSW_BRANCHES } from '@/lib/branches';

export const dynamic = 'force-dynamic';

// Cyber Security and the Student Activity Centre are not listed under Student Bodies.
const HIDDEN_STUDENT_BODIES = new Set(['CSC', 'SAC']);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year') || '2026';
    const branch = searchParams.get('branch');

    let sql = `
      SELECT 
        b.code as "branchCode",
        b.name as "branchName",
        b.association_name as "associationName",
        b.association_short as "associationShort",
        b.accent_color as "accentColor",
        b.bg_light_color as "bgLightColor",
        b.logo_url as "logoUrl",
        COALESCE(sb.poster_url, b.student_body_poster_url) as "posterUrl",
        COALESCE(sb.title, b.student_body_title, b.name || ' Student Executive Body') as "title",
        COALESCE(sb.description, b.student_body_description, b.description) as "description",
        COALESCE(sb.faculty_advisor, b.faculty_advisor) as "facultyAdvisor",
        COALESCE(sb.student_president, b.student_president) as "studentPresident",
        sb.id,
        $1::int as "editionYear"
      FROM branches b
      LEFT JOIN student_body_posters sb 
        ON (UPPER(b.code) = UPPER(sb.branch_code) OR (UPPER(b.code) = 'EVL' AND UPPER(sb.branch_code) = 'ECV')) AND sb.edition_year = $1
    `;
    const params: any[] = [parseInt(year, 10)];

    if (branch && branch !== 'ALL') {
      params.push(branch.toUpperCase());
      sql += ` WHERE UPPER(b.code) = $${params.length}`;
    }

    sql += ` ORDER BY b.code ASC`;

    const res = await query(sql, params);

    // ECI, EIE, CSD and CSO share their parent's association, so they get no card of their own.
    const rows = res.rows
      .filter((r: any, _i: number, all: any[]) => {
        const c = String(r.branchCode).toUpperCase();
        const parent = BRANCH_ALIASES[c];
        // Keep one alias row (EVL) as the parent's card when the parent has no row of its own.
        return !parent || (c === 'EVL' && !all.some((x: any) => String(x.branchCode).toUpperCase() === parent));
      })
      .map((r: any) => {
        const code = BRANCH_ALIASES[String(r.branchCode).toUpperCase()] || String(r.branchCode).toUpperCase();
        const info = BRANCH_LOOKUP[code];
        return info
          ? { ...r, branchCode: code, branchName: info.name, associationName: info.associationName, associationShort: info.associationShort }
          : r;
      });

    // Associations added after the branches table was seeded (I2RE, MBA) have no row there yet.
    if (!branch || branch === 'ALL') {
      const have = new Set(rows.map((r: any) => String(r.branchCode).toUpperCase()));
      for (const b of KITSW_BRANCHES) {
        if (have.has(b.code) || HIDDEN_STUDENT_BODIES.has(b.code)) continue;
        const sb = await query(
          `SELECT id, poster_url as "posterUrl", title, description, faculty_advisor as "facultyAdvisor", student_president as "studentPresident"
           FROM student_body_posters WHERE UPPER(branch_code) = $1 AND edition_year = $2`,
          [b.code, parseInt(year, 10)]
        );
        const r = sb.rows[0] || {};
        rows.push({
          branchCode: b.code,
          branchName: b.name,
          associationName: b.associationName,
          associationShort: b.associationShort,
          accentColor: b.accentColor,
          bgLightColor: b.bgLightColor,
          logoUrl: null,
          posterUrl: r.posterUrl || null,
          title: r.title || `${b.name} Student Executive Body`,
          description: r.description || null,
          facultyAdvisor: r.facultyAdvisor || null,
          studentPresident: r.studentPresident || null,
          id: r.id || null,
          editionYear: parseInt(year, 10),
        });
      }
    }

    const visible = rows.filter((r: any) => !HIDDEN_STUDENT_BODIES.has(String(r.branchCode).toUpperCase()));

    return NextResponse.json({
      success: true,
      data: visible,
      editionYear: parseInt(year, 10),
    });
  } catch (error: any) {
    console.error('Error fetching student body posters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve student body directory' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const guard = await requireBranch(req, body.branchCode);
    if (isResponse(guard)) return guard;
    const {
      editionYear = 2026,
      branchCode,
      posterUrl = '',
      title,
      description = '',
      facultyAdvisor = '',
      studentPresident = '',
    } = body;

    if (!branchCode) {
      return NextResponse.json(
        { success: false, error: 'Branch code is required' },
        { status: 400 }
      );
    }

    const code = branchCode.toUpperCase();
    const year = parseInt(editionYear, 10);
    const sbTitle = title || `${code} Executive Student Body`;

    // Upsert into student_body_posters
    const insertRes = await query(`
      INSERT INTO student_body_posters (
        edition_year,
        branch_code,
        poster_url,
        title,
        description,
        faculty_advisor,
        student_president
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (branch_code, edition_year) DO UPDATE SET
        poster_url = EXCLUDED.poster_url,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        faculty_advisor = EXCLUDED.faculty_advisor,
        student_president = EXCLUDED.student_president,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [year, code, posterUrl, sbTitle, description, facultyAdvisor, studentPresident]);

    // Also sync to branches table
    await query(`
      UPDATE branches 
      SET 
        student_body_poster_url = $1,
        student_body_title = $2,
        student_body_description = $3,
        faculty_advisor = COALESCE(NULLIF($4, ''), faculty_advisor),
        student_president = COALESCE(NULLIF($5, ''), student_president)
      WHERE UPPER(code) = $6
    `, [posterUrl, sbTitle, description, facultyAdvisor, studentPresident, code]);

    return NextResponse.json({
      success: true,
      data: insertRes.rows[0],
      message: `${code} Student Body Poster published successfully for Edition ${year}`,
    });
  } catch (error: any) {
    console.error('Error saving student body poster:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to archive student body poster' },
      { status: 500 }
    );
  }
}

// Removes only the uploaded poster; the title, advisor, president and description stay.
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = (searchParams.get('branch') || '').toUpperCase();
    const year = parseInt(searchParams.get('year') || '2026', 10);
    const guard = await requireBranch(req, branch);
    if (isResponse(guard)) return guard;

    if (!branch) {
      return NextResponse.json({ success: false, error: 'Branch code is required' }, { status: 400 });
    }

    await query(
      `UPDATE student_body_posters SET poster_url = '', updated_at = CURRENT_TIMESTAMP
       WHERE UPPER(branch_code) = $1 AND edition_year = $2`,
      [branch, year]
    );
    await query(`UPDATE branches SET student_body_poster_url = '' WHERE UPPER(code) = $1`, [branch]);

    return NextResponse.json({ success: true, message: `${branch} student body poster removed` });
  } catch (error: any) {
    console.error('Error removing student body poster:', error);
    return NextResponse.json({ success: false, error: 'Failed to remove student body poster' }, { status: 500 });
  }
}
