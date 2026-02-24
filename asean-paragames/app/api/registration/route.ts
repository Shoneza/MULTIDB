import { NextResponse,NextRequest } from 'next/server';
import pool from '../../../db';
import { cacheTag } from 'next/cache';
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { athlete_id, registered_sport_id } = body;
        if (!athlete_id || !registered_sport_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const result = await pool.query(`
            INSERT INTO registration (athlete_id, registered_sport_id)
            VALUES ($1, $2)
            ON CONFLICT (athlete_id, registered_sport_id) DO NOTHING
            `,[athlete_id,registered_sport_id] )
        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Athlete already registered for this sport' }, { status: 200 });
        }
        return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
    }
    catch {
        return NextResponse.json({ error: 'Failed to register athlete' }, { status: 500 });
    }
}
export async function GET(request: NextRequest) {
    try {
        const {searchParams} = new URL(request.url);
        const athleteId = searchParams.get('athleteId');
        const disabilityType = searchParams.get('disabilityType');
        const gender = searchParams.get('gender');
        const sportId = searchParams.get('sportId');
        
        if (!sportId) {
            return NextResponse.json({ error: 'Missing sportId parameter' }, { status: 400 });
        }
        const values: (string | number)[] = [sportId];
        const conditions: string[] = ['r.registered_sport_id = $1'];

        if (athleteId) {
            values.push(athleteId);
            conditions.push(`r.athlete_id = $${values.length}`);
        }
        if (gender) {
            values.push(gender);
            conditions.push(`a.gender = $${values.length}`);
        }
        if (disabilityType) {
            values.push(disabilityType);
            conditions.push(`a.disability_type = $${values.length}`);
        }

        const query = `
        SELECT
            r.registration_id,
            r.registered_sport_id,
            a.athlete_id,
            a.name_en,
            a.surname_en,
            a.gender
            a.disability_type
        FROM registration r
        INNER JOIN athletes a ON r.athlete_id = a.athlete_id
        WHERE ${conditions.join(' AND ')}
        ORDER BY r.registration_id
        `;
        const result = await pool.query(query, values);
        return NextResponse.json(result.rows, { status: 200 } );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch registrations' },
            { status: 500 }
        );
    }
}