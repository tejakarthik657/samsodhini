import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        year, 
        theme, 
        dates, 
        total_attendees as "totalAttendees", 
        total_events as "totalEvents", 
        total_workshops as "totalWorkshops", 
        prize_money_disbursed as "prizeMoneyDisbursed", 
        highlights, 
        souvenir_pdf_url as "souvenirPdfUrl", 
        cover_image as "coverImage", 
        gallery_preview as "galleryPreview", 
        chief_guest_name as "chiefGuestName", 
        chief_guest_title as "chiefGuestTitle"
      FROM legacy_editions 
      ORDER BY year DESC
    `);

    const editions = res.rows.map((row) => ({
      year: row.year,
      theme: row.theme,
      dates: row.dates,
      totalAttendees: row.totalAttendees,
      totalEvents: row.totalEvents,
      totalWorkshops: row.totalWorkshops,
      prizeMoneyDisbursed: row.prizeMoneyDisbursed,
      highlights: Array.isArray(row.highlights) ? row.highlights : [],
      souvenirPdfUrl: row.souvenirPdfUrl,
      coverImage: row.coverImage,
      galleryPreview: Array.isArray(row.galleryPreview) ? row.galleryPreview : [],
      chiefGuest: {
        name: row.chiefGuestName,
        title: row.chiefGuestTitle,
      },
    }));

    return NextResponse.json({
      success: true,
      data: editions,
    });
  } catch (error: any) {
    console.error('Error fetching legacy archives from Neon DB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch legacy editions' },
      { status: 500 }
    );
  }
}
