import { NextResponse,NextRequest } from 'next/server';
import pool from '../../../db';
import { db } from '@/app/lib/db/client';
import { medals } from '@/app/lib/db/schema';
import { eq } from 'drizzle-orm';
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId');
    try {
        if (competitionId) {
            const medalsData = await db.select().from(medals).where(eq(medals.competitionId, parseInt(competitionId)));
            return NextResponse.json(medalsData);
        }
    } catch (error) {
        console.error('Error fetching medals:', error);
        return NextResponse.json({ error: `Failed to fetch medals, error = ${error}` }, { status: 500 });
    }
}
export async function POST(request: NextRequest) {
    try {
        const { competition_id, athlete_id, medal_type } = await request.json();
        const query = 'INSERT INTO medals (competition_id, athlete_id, medal_type) VALUES ($1, $2, $3) RETURNING *';
        const values = [competition_id, athlete_id, medal_type];
        const result = await pool.query(query, values);
        return NextResponse.json(result.rows[0], { status: 201 });
    }
    catch (error) {
        console.error('Error inserting medal:', error);
    }
}
export async function DELETE(request: NextRequest) {
    try {
        const { competition_id, athlete_id } = await request.json();
        const query = 'DELETE FROM medals WHERE competition_id = $1 AND athlete_id = $2 RETURNING *';
        const values = [competition_id, athlete_id];
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Medal not found' }, { status: 404 });
        }
    } catch (error) {   
        console.error('Error deleting medal:', error);
    }
}
export async function PUT(request: NextRequest) {
    try {
        const { competition_id, athlete_id, medal_type } = await request.json();
        const query = 'UPDATE medals SET medal_type = $3 WHERE competition_id = $1 AND athlete_id = $2 RETURNING *';
        const values = [competition_id, athlete_id, medal_type];
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Medal not found' }, { status: 404 });
        }
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating medal:', error);
        return NextResponse.json({ error: `Failed to update medal, error = ${error}` }, { status: 500 });
    }
}
