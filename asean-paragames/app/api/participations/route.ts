import { NextResponse,NextRequest } from 'next/server';
import pool from '../../../db';
export async function GET(request: NextRequest) {
  try {
    // const body = await request.json();
    // const { action, competitionId} = body;
    const {searchParams} = new URL(request.url);
    const competitionId = searchParams.get('competitionId');
    if (competitionId) {
        const result = await pool.query(
            `SELECT
                p.competition_id,
                p.athlete_id,
                a.name_en,
                a.surname_en,
                a.nationality,
                p.attempt_number,
                p.score,
                p.best_score,
                m.medal_type AS medal
            FROM participations p
            JOIN athletes a ON a.athlete_id = p.athlete_id
            LEFT JOIN medals m ON m.competition_id = p.competition_id AND m.athlete_id = p.athlete_id
            WHERE p.competition_id = $1
            ORDER BY p.athlete_id, p.attempt_number
            `,
            [parseInt(competitionId)]
        );
        return NextResponse.json(result.rows);
    }
    
    const result = await pool.query(`SELECT * FROM participations ORDER BY competition_id, athlete_id, attempt_number`);
    
    return NextResponse.json(result.rows);
  }
  catch (error) {
    return NextResponse.json({ error: `Failed to fetch participations ${error}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, competition_id, athlete_id, score } = body;

        if (!action || !competition_id || !athlete_id) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        if (action === 'register') {
            const result = await pool.query(`
                INSERT INTO participations (competition_id, athlete_id, attempt_number, score)
                SELECT $1, $2, 1, NULL
                WHERE NOT EXISTS (
                SELECT 1 FROM participations WHERE competition_id = $1 AND athlete_id = $2
                )
                RETURNING *
                `,
                [parseInt(competition_id), athlete_id]
            );

            if (result.rows.length === 0) {
                return NextResponse.json({ message: 'Athlete already registered' }, { status: 200 });
            }
            return NextResponse.json(result.rows[0], { status: 201 });
        }
        if (action === 'add_attempt') {
           const result = await pool.query(
                `
                WITH next_attempt AS (
                SELECT COALESCE(MAX(attempt_number), 0) + 1 AS attempt_no
                FROM participations
                WHERE competition_id = $1 AND athlete_id = $2
                )
                INSERT INTO participations (competition_id, athlete_id, attempt_number, score)
                SELECT $1, $2, attempt_no, $3
                FROM next_attempt
                RETURNING *
                `,
                [parseInt(competition_id), athlete_id, score ?? null]
            );

            return NextResponse.json(result.rows[0], { status: 201 });
        }
        if (action === 'delete') {
            const result = await pool.query('DELETE FROM participations WHERE competition_id = $1 AND athlete_id = $2 RETURNING *', [parseInt(competition_id), athlete_id]);
            if (result.rowCount === 0) {
                return NextResponse.json({ error: 'Participation not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true });
        }
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    catch (error) {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { competition_id, athlete_id, attempt_number, score, best_score, medal } = body;

        // Medal update (only attempt_number = 1)
        if (medal !== undefined) {
            if (!competition_id || !athlete_id) {
                return NextResponse.json({ error: 'Missing required fields for medal' }, { status: 400 });
            }
            const result = await pool.query(
                `UPDATE participations
                 SET medal = $3
                 WHERE competition_id = $1 AND athlete_id = $2 AND attempt_number = 1
                 RETURNING *;`,
                [parseInt(competition_id), athlete_id, medal]
            );
            if (result.rowCount === 0) {
                return NextResponse.json({ error: 'Participation not found' }, { status: 404 });
            }
            return NextResponse.json(result.rows[0]);
        }

        // Attempt update
        if (!competition_id || !athlete_id || !attempt_number) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const result = await pool.query(
            `
            WITH updated_attempt AS (
                UPDATE participations
                SET score = $4, best_score = $5
                WHERE competition_id = $1 
                    AND athlete_id = $2 
                    AND attempt_number = $3
                RETURNING competition_id, athlete_id,  best_score
            )
            UPDATE participations p
            SET best_score = ua.best_score
            FROM updated_attempt ua
            WHERE p.competition_id = ua.competition_id
                AND p.athlete_id = ua.athlete_id
            RETURNING *;
            `,
            [parseInt(competition_id), athlete_id, attempt_number, score, best_score]
        );
        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
        }
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update score/medal' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
  try {
    const { competition_id, athlete_id } = await request.json();
    if (!competition_id || !athlete_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const result = await pool.query('DELETE FROM participations WHERE competition_id = $1 AND athlete_id = $2 RETURNING *', [parseInt(competition_id), athlete_id]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Participation not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove athlete' }, { status: 500 });
  }
}