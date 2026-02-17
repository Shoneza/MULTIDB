import { NextResponse } from 'next/server';
import pool from '../../../db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM sports');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sports' }, { status: 500 });
  }
}