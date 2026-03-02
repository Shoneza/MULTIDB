import { NextResponse,NextRequest } from 'next/server';
import pool from '../../../db';
export async function POST(request: NextRequest) {
  const body = await request.json();

  const query = `
    INSERT INTO athletes (
      username, password, email, national_id, name_en, surname_en, gender, religion, nationality, blood_type, team_name,is_wheelchair_dependant, weight, height
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
    )
  `;
  const values = [
    body.username,
    body.password,
    body.email,
    body.national_id,
    body.name_en,
    body.surname_en,
    body.gender,
    body.religion,
    body.nationality,
    body.bloodType,
    body.team_name,
    body.is_wheelchair_dependant,
    body.weight,
    body.height,
    body.disability_type
  ];

  try {
    // await client.query(query, values);
    // await client.end();
    const result = await pool.query(query, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
export async function GET(request:NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const disabilityType = searchParams.get('disabilityType');
    const username = searchParams.get('username');
    if (disabilityType) {
      const result = await pool.query('SELECT * FROM athletes WHERE disability_type = $1', [disabilityType]);
      return NextResponse.json(result.rows);
    }
    if (username) {
      const result = await pool.query('SELECT * FROM athletes WHERE username = $1', [username]);
      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
      }
      return NextResponse.json(result.rows);
    }
    const result = await pool.query('SELECT * FROM athletes');
    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}