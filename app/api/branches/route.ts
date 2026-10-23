import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { requireBranch, isResponse } from '../../../lib/auth';
import { BRANCH_ALIASES, BRANCH_LOOKUP } from '../../../lib/branches';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        id, 
        code, 
        name, 
        short_name as "shortName", 
        association_name as "associationName", 
        association_short as "associationShort", 
        icon_name as "iconName", 
        faculty_advisor as "facultyAdvisor", 
        student_president as "studentPresident", 
        contact_email as "contactEmail", 
        contact_phone as "contactPhone", 
        accent_color as "accentColor", 
        bg_light_color as "bgLightColor", 
        logo_url as "logoUrl",
        student_body_poster_url as "studentBodyPosterUrl",
        student_body_title as "studentBodyTitle",
        student_body_description as "studentBodyDescription",
        description
      FROM branches 
      ORDER BY code ASC
    `);

    const rows = res.rows
      .filter((r: any, _i: number, all: any[]) => {
        const c = String(r.code).toUpperCase();
        const parent = BRANCH_ALIASES[c];
        // Keep one alias row (EVL) as the parent's card when the parent has no row of its own.
        return !parent || (c === 'EVL' && !all.some((x: any) => String(x.code).toUpperCase() === parent));
      })
      .map((r: any) => {
        const code = BRANCH_ALIASES[String(r.code).toUpperCase()] || String(r.code).toUpperCase();
        const info = BRANCH_LOOKUP[code];
        return info
          ? { ...r, code, name: info.name, shortName: info.shortName, associationName: info.associationName, associationShort: info.associationShort }
          : r;
      });

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { success: false, error: 'Database query failed' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      branchCode, 
      logoUrl, 
      studentBodyPosterUrl, 
      studentBodyTitle, 
      studentBodyDescription,
      facultyAdvisor,
      studentPresident,
      editionYear = 2026
    } = body;

    if (!branchCode) {
      return NextResponse.json(
        { success: false, error: 'Branch code is required' },
        { status: 400 }
      );
    }

    const guard = await requireBranch(req, branchCode);
    if (isResponse(guard)) return guard;

    const code = branchCode.toUpperCase();

    const updateRes = await query(`
      UPDATE branches 
      SET 
        logo_url = COALESCE($1, logo_url),
        student_body_poster_url = COALESCE($2, student_body_poster_url),
        student_body_title = COALESCE($3, student_body_title),
        student_body_description = COALESCE($4, student_body_description),
        faculty_advisor = COALESCE($5, faculty_advisor),
        student_president = COALESCE($6, student_president),
        updated_at = CURRENT_TIMESTAMP
      WHERE UPPER(code) = $7
      RETURNING 
        code,
        name,
        association_name as "associationName",
        logo_url as "logoUrl",
        student_body_poster_url as "studentBodyPosterUrl",
        student_body_title as "studentBodyTitle",
        faculty_advisor as "facultyAdvisor",
        student_president as "studentPresident"
    `, [
      logoUrl !== undefined ? logoUrl : null,
      studentBodyPosterUrl !== undefined ? studentBodyPosterUrl : null,
      studentBodyTitle !== undefined ? studentBodyTitle : null,
      studentBodyDescription !== undefined ? studentBodyDescription : null,
      facultyAdvisor !== undefined ? facultyAdvisor : null,
      studentPresident !== undefined ? studentPresident : null,
      code
    ]);

    if (updateRes.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: `Branch ${code} not found` },
        { status: 404 }
      );
    }

    // Also persist into student_body_posters if student body poster is updated
    if (studentBodyPosterUrl) {
      await query(`
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
      `, [
        parseInt(editionYear, 10),
        code,
        studentBodyPosterUrl,
        studentBodyTitle || `${code} Executive Student Body`,
        studentBodyDescription || '',
        facultyAdvisor || '',
        studentPresident || ''
      ]);
    }

    return NextResponse.json({
      success: true,
      data: updateRes.rows[0],
      message: `Branch ${code} visual assets and student body details updated successfully.`
    });
  } catch (error: any) {
    console.error('Error updating branch assets:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update branch assets' },
      { status: 500 }
    );
  }
}
