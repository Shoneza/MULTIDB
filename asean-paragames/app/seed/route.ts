import { NextResponse } from 'next/server';
import pool from '../../db';

export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM tournaments');
        return NextResponse.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching tournaments:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

