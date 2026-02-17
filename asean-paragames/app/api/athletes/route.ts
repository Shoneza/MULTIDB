import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const client = new Client({
    user: "postgres",
    password: "1234",
    host: "localhost",
    port: 5432,
    database: "postgres",
  });
  await client.connect();

  const query = `
    INSERT INTO athletes (
      username, password, email, national_id, name_en, surname_en, gender, religion, nationality, blood_type, team_name,is_wheelchair_dependant, weight, height
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
    )
  `;
  const values = [
    data.username,
    data.password,
    data.email,
    data.national_id,
    data.name_en,
    data.surname_en,
    data.gender,
    data.religion,
    data.nationality,
    data.bloodType,
    data.team_name,
    data.is_wheelchair_dependant,
    data.weight,
    data.height,
    
  ];

  try {
    await client.query(query, values);
    await client.end();
    return NextResponse.json({ success: true });
  } catch (err) {
    await client.end();
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}