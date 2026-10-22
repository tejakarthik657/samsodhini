import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get('branch');
    const slug = searchParams.get('slug');
    const year = searchParams.get('year');

    let sql = `
      SELECT 
        w.id,
        w.slug,
        w.edition_year as "editionYear",
        w.branch_code as "branch",
        w.title,
        w.tagline,
        w.description,
        w.poster_url as "posterUrl",
        w.year_lead_name as "yearLeadName",
        w.year_lead_year as "yearLeadYear",
        w.year_lead_phone as "yearLeadPhone",
        w.year_lead_email as "yearLeadEmail",
        w.year_lead_avatar as "yearLeadAvatar",
        w.resource_person_name as "resourcePersonName",
        w.resource_person_designation as "resourcePersonDesignation",
        w.resource_person_company as "resourcePersonCompany",
        w.resource_person_bio as "resourcePersonBio",
        w.resource_person_avatar as "resourcePersonAvatar",
        w.resource_person_linkedin as "resourcePersonLinkedin",
        w.resource_person_topics as "resourcePersonTopics",
        w.dates,
        w.time,
        w.venue,
        w.fees,
        w.max_capacity as "maxCapacity",
        w.current_registered as "currentRegistered",
        w.live_status as "liveStatus",
        w.prerequisites,
        w.takeaways,
        w.syllabus,
        w.registration_url as "registrationUrl",
        w.google_form_url as "googleFormUrl",
        w.report_pdf_url as "reportPdfUrl",
        b.association_name as "associationName",
        b.association_short as "associationShort",
        b.accent_color as "accentColor",
        b.bg_light_color as "bgLightColor"
      FROM workshops w
      LEFT JOIN branches b ON w.branch_code = b.code
    `;

    const params: any[] = [];
    const conditions: string[] = [];

    if (branch && branch !== 'ALL') {
      params.push(branch);
      conditions.push(`w.branch_code = $${params.length}`);
    }

    if (slug) {
      params.push(slug);
      conditions.push(`w.slug = $${params.length}`);
    }

    if (year && year !== 'ALL') {
      params.push(parseInt(year, 10));
      conditions.push(`w.edition_year = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    sql += ` ORDER BY w.branch_code ASC`;

    const res = await query(sql, params);

    // Format output to match client Workshop structure
    const workshops = res.rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      branch: row.branch,
      title: row.title,
      tagline: row.tagline,
      description: row.description,
      posterUrl: row.posterUrl,
      leadCoordinator: {
        name: row.yearLeadName,
        role: row.yearLeadYear,
        phone: row.yearLeadPhone,
        email: row.yearLeadEmail,
        avatar: row.yearLeadAvatar,
      },
      yearLead: {
        name: row.yearLeadName,
        year: row.yearLeadYear,
        role: row.yearLeadYear,
        phone: row.yearLeadPhone,
        email: row.yearLeadEmail,
        avatar: row.yearLeadAvatar,
      },
      resourcePerson: {
        name: row.resourcePersonName,
        designation: row.resourcePersonDesignation,
        company: row.resourcePersonCompany,
        bio: row.resourcePersonBio,
        avatar: row.resourcePersonAvatar,
        linkedin: row.resourcePersonLinkedin,
        topics: Array.isArray(row.resourcePersonTopics) ? row.resourcePersonTopics : [],
      },
      dates: row.dates,
      time: row.time,
      venue: row.venue,
      fees: row.fees,
      maxCapacity: row.maxCapacity,
      currentRegistered: row.currentRegistered,
      liveStatus: row.liveStatus,
      prerequisites: Array.isArray(row.prerequisites) ? row.prerequisites : [],
      takeaways: Array.isArray(row.takeaways) ? row.takeaways : [],
      syllabus: Array.isArray(row.syllabus) ? row.syllabus : [],
      registrationUrl: row.registrationUrl,
      googleFormUrl: row.googleFormUrl,
      reportPdfUrl: row.reportPdfUrl,
      isFlagship: true as const,
      editionYear: row.editionYear || 2026,
      associationName: row.associationName,
      associationShort: row.associationShort,
      accentColor: row.accentColor,
      bgLightColor: row.bgLightColor,
    }));

    return NextResponse.json({
      success: true,
      count: workshops.length,
      data: workshops,
    });
  } catch (error: any) {
    console.error('Error fetching workshops from Neon DB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch workshops' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      branchCode,
      editionYear: rawEditionYear,
      title,
      tagline,
      description,
      posterUrl,
      yearLeadName,
      yearLeadPhone,
      yearLeadEmail,
      yearLeadRole,
      resourcePersonName,
      resourcePersonDesignation,
      resourcePersonCompany,
      resourcePersonBio,
      resourcePersonAvatar,
      resourcePersonLinkedin,
      resourcePersonTopics,
      dates,
      time,
      venue,
      fees,
      maxCapacity,
      prerequisites,
      takeaways,
      syllabus,
      registrationUrl,
      googleFormUrl,
      reportPdfUrl,
    } = body;

    const editionYear = rawEditionYear ? parseInt(rawEditionYear, 10) : 2026;

    if (!branchCode || !title) {
      return NextResponse.json(
        { success: false, error: 'Branch code and title are required' },
        { status: 400 }
      );
    }

    const checkRes = await query(
      'SELECT id FROM workshops WHERE branch_code = $1 AND (edition_year = $2 OR edition_year IS NULL)',
      [branchCode, editionYear]
    );

    let res;
    if (checkRes.rowCount && checkRes.rowCount > 0) {
      const updateSql = `
        UPDATE workshops
        SET 
          title = COALESCE($1, title),
          tagline = COALESCE($2, tagline),
          description = COALESCE($3, description),
          poster_url = COALESCE($4, poster_url),
          resource_person_name = COALESCE($5, resource_person_name),
          resource_person_designation = COALESCE($6, resource_person_designation),
          resource_person_company = COALESCE($7, resource_person_company),
          resource_person_bio = COALESCE($8, resource_person_bio),
          resource_person_avatar = COALESCE($9, resource_person_avatar),
          resource_person_linkedin = COALESCE($10, resource_person_linkedin),
          resource_person_topics = COALESCE($11, resource_person_topics),
          dates = COALESCE($12, dates),
          time = COALESCE($13, time),
          venue = COALESCE($14, venue),
          fees = COALESCE($15, fees),
          max_capacity = COALESCE($16, max_capacity),
          year_lead_name = COALESCE($17, year_lead_name),
          year_lead_phone = COALESCE($18, year_lead_phone),
          year_lead_email = COALESCE($19, year_lead_email),
          prerequisites = COALESCE($20, prerequisites),
          takeaways = COALESCE($21, takeaways),
          syllabus = COALESCE($22, syllabus),
          registration_url = COALESCE($23, registration_url),
          google_form_url = COALESCE($24, google_form_url),
          report_pdf_url = COALESCE($25, report_pdf_url),
          updated_at = NOW()
        WHERE branch_code = $26
        RETURNING *;
      `;
      res = await query(updateSql, [
        title,
        tagline,
        description,
        posterUrl,
        resourcePersonName,
        resourcePersonDesignation,
        resourcePersonCompany,
        resourcePersonBio,
        resourcePersonAvatar,
        resourcePersonLinkedin,
        resourcePersonTopics ? JSON.stringify(resourcePersonTopics) : null,
        dates,
        time,
        venue,
        fees,
        maxCapacity ? parseInt(maxCapacity, 10) : null,
        yearLeadName,
        yearLeadPhone,
        yearLeadEmail,
        prerequisites ? JSON.stringify(prerequisites) : null,
        takeaways ? JSON.stringify(takeaways) : null,
        syllabus ? JSON.stringify(syllabus) : null,
        registrationUrl,
        googleFormUrl,
        reportPdfUrl,
        branchCode,
      ]);
    } else {
      const id = `ws-${branchCode.toLowerCase()}-${Date.now().toString().slice(-4)}`;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const insertSql = `
        INSERT INTO workshops (
          id, slug, branch_code, title, tagline, description, poster_url,
          year_lead_name, year_lead_year, year_lead_phone, year_lead_email, year_lead_avatar,
          resource_person_name, resource_person_designation, resource_person_company,
          resource_person_bio, resource_person_avatar, resource_person_linkedin, resource_person_topics,
          dates, time, venue, fees, max_capacity, current_registered,
          prerequisites, takeaways, syllabus, registration_url, google_form_url, report_pdf_url,
          edition_year
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12,
          $13, $14, $15,
          $16, $17, $18, $19,
          $20, $21, $22, $23, $24, $25,
          $26, $27, $28, $29, $30, $31,
          $32
        ) RETURNING *;
      `;
      res = await query(insertSql, [
        id,
        slug,
        branchCode,
        title,
        tagline || 'Hands-on Flagship Technical Workshop',
        description || '',
        posterUrl || '',
        yearLeadName || 'Lead Student Convener',
        yearLeadRole || 'Lead Student Convener',
        yearLeadPhone || '',
        yearLeadEmail || '',
        '',
        resourcePersonName || 'Industry Keynote Speaker',
        resourcePersonDesignation || 'Principal Specialist',
        resourcePersonCompany || 'Leading Technology Enterprise',
        resourcePersonBio || 'Distinguished domain expert and technology researcher.',
        resourcePersonAvatar || '',
        resourcePersonLinkedin || '',
        JSON.stringify(resourcePersonTopics || []),
        dates || 'Day 1 & Day 2',
        time || '09:30 AM - 04:30 PM',
        venue || 'Campus Central Laboratory',
        fees || 'INR 350',
        maxCapacity ? parseInt(maxCapacity, 10) : 200,
        0,
        JSON.stringify(prerequisites || []),
        JSON.stringify(takeaways || []),
        JSON.stringify(syllabus || []),
        registrationUrl || 'https://forms.gle/samshodhani',
        googleFormUrl || '',
        reportPdfUrl || '',
        editionYear,
      ]);
    }

    return NextResponse.json({
      success: true,
      message: `Workshop for ${branchCode} saved successfully in central database`,
      data: res.rows[0],
    });
  } catch (error: any) {
    console.error('Error saving workshop in Neon DB:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save workshop' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, currentRegistered, liveStatus } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Workshop ID is required' }, { status: 400 });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (currentRegistered !== undefined) {
      params.push(parseInt(currentRegistered, 10));
      updates.push(`current_registered = $${params.length}`);
    }

    if (liveStatus !== undefined) {
      params.push(liveStatus);
      updates.push(`live_status = $${params.length}`);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields provided to update' }, { status: 400 });
    }

    params.push(id);
    const sql = `UPDATE workshops SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`;
    const res = await query(sql, params);

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Workshop not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Workshop updated successfully',
      data: res.rows[0],
    });
  } catch (error: any) {
    console.error('Error updating workshop:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update workshop' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Workshop ID is required' }, { status: 400 });
    }

    await query('DELETE FROM workshops WHERE id = $1', [id]);
    return NextResponse.json({
      success: true,
      message: 'Workshop removed from institutional database',
    });
  } catch (error: any) {
    console.error('Error deleting workshop:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete workshop' }, { status: 500 });
  }
}
