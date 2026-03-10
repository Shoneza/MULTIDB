import { NextResponse,NextRequest } from 'next/server';
import pool from '../../../db';

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const competitionID = searchParams.get('competitionId');
    if (competitionID) {
        const result = await pool.query('SELECT * FROM competitions WHERE competition_id = $1', [competitionID]);
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
        }
        return NextResponse.json(result.rows[0], { status: 200 });
      }
    const result = await pool.query('SELECT * FROM competitions');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch competitions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action,competitionName,sportID,gender, schedule } = body;
    if (action == 'add') {
      const result = await pool.query(
        `INSERT INTO competitions (competition_id,competition_name, sport_id,gender, date_time)
        VALUES (DEFAULT,$1, $2, $3, $4) RETURNING *`,
        [ competitionName,sportID, gender, schedule]
      );
      return NextResponse.json(result.rows[0]);
    }
    if (action == 'update') {
      const { competitionId, status } = body;
      if (!competitionId || typeof status !== 'boolean') {
        return NextResponse.json({ error: 'competitionId and boolean status are required' }, { status: 400 });
      }
      await pool.query(
        'UPDATE competitions SET is_finished = $1 WHERE competition_id = $2',
        [status, competitionId]
      );
      return NextResponse.json({ success: true });
    }

    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add tournament' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { competitionId } = await request.json();
    if (!competitionId) {
      return NextResponse.json({ error: 'competitionId is required' }, { status: 400 });
    }
    // First, delete participations
    await pool.query('DELETE FROM participations WHERE competition_id = $1', [competitionId]);
    // Then delete competition
    const result = await pool.query('DELETE FROM competitions WHERE competition_id = $1 RETURNING *', [competitionId]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete competition' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { competitionId, status } = body;
    if (!competitionId || typeof status !== 'boolean') {
      return NextResponse.json({ error: 'competitionId and boolean status are required' }, { status: 400 });
    }
    await pool.query(
      'UPDATE competitions SET status = $1 WHERE competition_id = $2',
      [status, competitionId]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /api/competitions error', error);
    return NextResponse.json({ error: 'Failed to update tournament status' }, { status: 500 });
  }
}