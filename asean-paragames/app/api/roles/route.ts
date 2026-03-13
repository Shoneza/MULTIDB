import { NextResponse,NextRequest } from 'next/server';
import pool from '../../../db';
import { db } from '@/app/lib/db/client';
import { usersRole } from '@/app/lib/db/schema';
import { eq } from 'drizzle-orm';
export async function POST(request: NextRequest) {
    try{
        const body = await request.json();
        const { athlete_id } = body;
        if (!athlete_id) {
            return NextResponse.json({ error: 'Missing athlete_id field' }, { status: 400 });
        }
        // const result = await pool.query('INSERT INTO user_role (athlete_id, role) VALUES ($1, $2) RETURNING *', [athlete_id, 'athlete']);
        const result = await db.insert(usersRole).values({userId: athlete_id, userRole: 'athlete'}).returning();
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error inserting user role:', error);
        return NextResponse.json({ error: 'Failed to assign role to athlete' }, { status: 500 });
    }
}
export async function GET(request: NextRequest) {
    try {
        const {searchParams} = new URL(request.url);
        const athleteId = searchParams.get('athleteId');
        if (!athleteId) {
            return NextResponse.json({ error: 'Missing athleteId parameter' }, { status: 400 });
        }
        // const result = await pool.query('SELECT role FROM user_role WHERE athlete_id = $1', [athleteId]);
        const result = await db.select({role: usersRole.userRole}).from(usersRole).where(eq(usersRole.userId, Number(athleteId)));
        if (result.length === 0) {
            return NextResponse.json({ error: 'No role found for the given athleteId' }, { status: 404 });
        }
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error fetching user role:', error);
        return NextResponse.json({ error: `Failed to fetch user role ${error} ` }, { status: 500 });
    }
}
