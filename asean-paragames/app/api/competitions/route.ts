import { NextResponse,NextRequest } from 'next/server';
import pool from '../../../db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM competitions');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch competitions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { competitionName,sportID,gender, schedule } = body;
    const result = await pool.query(
      `INSERT INTO competitions (competition_id,competition_name, sport_id,gender, date_time)
       VALUES (DEFAULT,$1, $2, $3, $4) RETURNING *`,
      [ competitionName,sportID, gender, schedule]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add tournament' }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Tournament ID is required' }, { status: 400 });
    }
    await pool.query('DELETE FROM competitions WHERE competition_id = $1', [id]);
    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tournament' }, { status: 500 });
  }
}