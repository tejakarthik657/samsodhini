import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id, delta, setCount } = body;

    if (!type || !id) {
      return NextResponse.json(
        { success: false, error: 'Type (workshop/event) and ID are required' },
        { status: 400 }
      );
    }

    let updatedCount = 0;
    let maxCap = 200;

    if (type === 'workshop') {
      let sql = '';
      let params: any[] = [];

      if (setCount !== undefined) {
        sql = `UPDATE workshops SET current_registered = GREATEST(0, LEAST(max_capacity, $1)), updated_at = NOW() WHERE id = $2 OR branch_code = $2 RETURNING current_registered, max_capacity;`;
        params = [setCount, id];
      } else {
        const step = delta || 1;
        sql = `UPDATE workshops SET current_registered = GREATEST(0, LEAST(max_capacity, current_registered + $1)), updated_at = NOW() WHERE id = $2 OR branch_code = $2 RETURNING current_registered, max_capacity;`;
        params = [step, id];
      }

      const res = await query(sql, params);
      if (res.rowCount === 0) {
        return NextResponse.json({ success: false, error: 'Workshop not found' }, { status: 404 });
      }
      updatedCount = res.rows[0].current_registered;
      maxCap = res.rows[0].max_capacity;
    } else {
      let sql = '';
      let params: any[] = [];

      if (setCount !== undefined) {
        sql = `UPDATE events SET current_registered = GREATEST(0, LEAST(max_slots, $1)), updated_at = NOW() WHERE id = $2 RETURNING current_registered, max_slots;`;
        params = [setCount, id];
      } else {
        const step = delta || 1;
        sql = `UPDATE events SET current_registered = GREATEST(0, LEAST(max_slots, current_registered + $1)), updated_at = NOW() WHERE id = $2 RETURNING current_registered, max_slots;`;
        params = [step, id];
      }

      const res = await query(sql, params);
      if (res.rowCount === 0) {
        return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
      }
      updatedCount = res.rows[0].current_registered;
      maxCap = res.rows[0].max_slots;
    }

    return NextResponse.json({
      success: true,
      message: 'Live count synced in Neon DB',
      currentRegistered: updatedCount,
      maxCapacity: maxCap,
    });
  } catch (error: any) {
    console.error('Error updating live telemetry in Neon DB:', error);
    return NextResponse.json(
      { success: false, error: 'Telemetry update failed' },
      { status: 500 }
    );
  }
}
