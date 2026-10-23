import { NextRequest, NextResponse } from 'next/server';
import { requireBranch, requireAdmin, requireSession, isResponse } from '../../../lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year') || '2026';
    const branch = searchParams.get('branch');
    const itemType = searchParams.get('type');
    const itemId = searchParams.get('itemId');

    let sql = `
      SELECT 
        id,
        edition_year as "editionYear",
        branch_code as "branchCode",
        item_type as "itemType",
        item_id as "itemId",
        item_title as "itemTitle",
        image_url as "imageUrl",
        caption,
        created_at as "createdAt"
      FROM event_gallery
      WHERE edition_year = $1
    `;
    const params: any[] = [parseInt(year, 10)];

    if (branch && branch !== 'ALL') {
      params.push(branch.toUpperCase());
      sql += ` AND UPPER(branch_code) = $${params.length}`;
    }

    if (itemType && itemType !== 'ALL') {
      params.push(itemType.toLowerCase());
      sql += ` AND LOWER(item_type) = $${params.length}`;
    }

    if (itemId) {
      params.push(itemId);
      sql += ` AND item_id = $${params.length}`;
    }

    sql += ` ORDER BY created_at DESC`;

    const res = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: res.rows || [],
      count: res.rowCount || 0,
    });
  } catch (error: any) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve symposium gallery' },
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
      itemType, // 'workshop' or 'event'
      itemId,
      itemTitle,
      imageUrl,
      caption = '',
    } = body;

    if (!branchCode || !itemType || !itemId || !imageUrl || !itemTitle) {
      return NextResponse.json(
        { success: false, error: 'Missing required media parameters (branchCode, itemType, itemId, itemTitle, imageUrl)' },
        { status: 400 }
      );
    }

    // Enforce 12-image limit per workshop or event
    const countCheck = await query(
      `SELECT COUNT(*)::int as count FROM event_gallery WHERE item_id = $1`,
      [itemId]
    );

    const currentCount = countCheck.rows[0]?.count || 0;
    if (currentCount >= 12) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum 12 photos reached for "${itemTitle}". Please remove an existing image before adding another.`,
        },
        { status: 400 }
      );
    }

    const insertSql = `
      INSERT INTO event_gallery (
        edition_year,
        branch_code,
        item_type,
        item_id,
        item_title,
        image_url,
        caption
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id,
        edition_year as "editionYear",
        branch_code as "branchCode",
        item_type as "itemType",
        item_id as "itemId",
        item_title as "itemTitle",
        image_url as "imageUrl",
        caption,
        created_at as "createdAt"
    `;

    const res = await query(insertSql, [
      parseInt(editionYear, 10),
      branchCode.toUpperCase(),
      itemType.toLowerCase(),
      itemId,
      itemTitle,
      imageUrl,
      caption,
    ]);

    return NextResponse.json({
      success: true,
      data: res.rows[0],
      currentCount: currentCount + 1,
      remainingSlots: 12 - (currentCount + 1),
      message: 'Photo archived to symposium gallery successfully',
    });
  } catch (error: any) {
    console.error('Error saving gallery item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to archive media item' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Photo ID is required for removal' },
        { status: 400 }
      );
    }

    const owner = await query('SELECT branch_code FROM event_gallery WHERE id = $1', [id]);
    const guard = await requireBranch(req, owner.rows[0]?.branch_code);
    if (isResponse(guard)) return guard;

    const res = await query(
      `DELETE FROM event_gallery WHERE id = $1 RETURNING id, item_id as "itemId"`,
      [parseInt(id, 10)]
    );

    if (res.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Gallery photo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Photo successfully removed from symposium gallery',
      deletedId: id,
    });
  } catch (error: any) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
