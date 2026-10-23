import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
        ON UPPER(b.code) = UPPER(sb.branch_code) AND sb.edition_year = $1
    `;
    const params: any[] = [parseInt(year, 10)];

    if (branch && branch !== 'ALL') {
      params.push(branch.toUpperCase());
      sql += ` WHERE UPPER(b.code) = $${params.length}`;
    }

    sql += ` ORDER BY b.code ASC`;

    const res = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: res.rows,
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
    const {
      editionYear = 2026,
      branchCode,
      posterUrl,
      title,
      description = '',
      facultyAdvisor = '',
      studentPresident = '',
    } = body;

    if (!branchCode || !posterUrl) {
      return NextResponse.json(
        { success: false, error: 'Branch code and poster URL are required' },
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
