import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

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
        description
      FROM branches 
      ORDER BY code ASC
    `);

    return NextResponse.json({
      success: true,
      data: res.rows,
    });
  } catch (error: any) {
    console.error('Error fetching branches from Neon DB:', error);
    return NextResponse.json(
      { success: false, error: 'Database query failed' },
      { status: 500 }
    );
  }
}
