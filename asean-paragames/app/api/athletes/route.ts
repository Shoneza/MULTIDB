import { NextResponse,NextRequest } from 'next/server';
import {athletes} from '@/app/lib/db/schema'
import {db} from '@/app/lib/db/client' 
import { eq} from 'drizzle-orm';
import { ca } from 'zod/locales';
// export async function POST(request: NextRequest) {
//   const body = await request.json();
//   const action = body.action;
//   console.log('Body:',body)
//   if (action === 'register') {
//     const query = `
//     INSERT INTO athletes (
//       username, password, email
//     ) VALUES (
//       $1,$2,$3
//     )
//     RETURNING athlete_id
//     `;
//     const values = [
//       body.username,
//       body.password,
//       body.email
//     ];
//     try {
//       const result = await pool.query(query, values);
//       const athleteId = result.rows[0].athlete_id;
//       console.log('Registered athlete with ID:', athleteId);
//       return NextResponse.json({ success: true, userName: body.username,athleteId });
//     } catch (err) {
//       return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
//     }
    
//   }
  
//   return NextResponse.json({ error: "Invalid action" }, { status: 400 });
// }
// export async function GET(request:NextRequest) {
//   try {
//     const {searchParams} = new URL(request.url);
//     const disabilityType = searchParams.get('disabilityType');

//     const username = searchParams.get('username');
//     if (disabilityType) {
//       const result = await pool.query('SELECT * FROM athletes WHERE disability_type = $1', [disabilityType]);
//       return NextResponse.json(result.rows);
//     }
//     if (username) {
//       const result = await pool.query('SELECT * FROM athletes WHERE username = $1', [username]);
//       if (result.rows.length === 0) {
//         return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
//       }
//       return NextResponse.json(result.rows);
//     }
//     const result = await pool.query('SELECT * FROM athletes');
//     return NextResponse.json(result.rows);
//   } catch (err) {
//     return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
//   }
// }
// export async function PATCH(request:NextRequest) {
//   const body = await request.json();
//   const query = `
//     UPDATE athletes SET
//       national_id = $1,
//       name_en = $2,
//       surname_en = $3,
//       gender = $4,
//       religion = $5,
//       nationality = $6,
//       blood_type = $7,
//       team_name = $8,
//       is_wheelchair_dependant = $9,
//       weight = $10,
//       height = $11,
//       disability_type = $12
//     WHERE athlete_id = $13
//   `;
//   const athleteId = parseInt(body.athlete_id, 10);
//   const values = [
//     body.national_id,
//     body.name_en,
//     body.surname_en,
//     body.gender,
//     body.religion,
//     body.nationality,
//     body.bloodType,
//     body.team_name,
//     body.is_wheelchair_dependant,
//     body.weight,
//     body.height,
//     body.disability_type,
//     athleteId
//   ];
//   try {
//     console.log('Body:', body);
//     console.log('Values:', values);
//     const result = await pool.query(query, values);
//     if (result.rowCount === 0) {
//       return NextResponse.json({ error: `Athlete with ID ${athleteId} not found` }, { status: 422 });
//     }
//     return NextResponse.json({ success: true });
//   } catch (err) {
//     return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
//   }


      
// }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const action = body.action;
  if (action === 'register') {
    try {
      const created = await db.insert(athletes).values({
        username: body.username,
        password: body.password,
        email: body.email
      })
      .returning({athleteId: athletes.athleteId, 
        username: athletes.username});
      return NextResponse.json({ success: true, userName: created[0].username, athleteId: created[0].athleteId });
      } catch (err) {
      return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
    } 
  } 
  
}
export async function GET(request:NextRequest) {
  try{
    const {searchParams} = new URL(request.url);
    const disabilityType = searchParams.get('disabilityType');
    const username = searchParams.get('username');
    if (disabilityType) {
      const result = await db.select().from(athletes).where(eq(athletes.disabilityType, disabilityType));
      return NextResponse.json(result);
    }
    if (username) {
      const result = await db
        .select()
        .from(athletes)
        .where(eq(athletes.username, username));
      if (result.length === 0) {
        return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
      }
      return NextResponse.json(result);
    }
    const result = await db.select().from(athletes);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
        { error: err instanceof Error ? err.message : "Unknown error" },
        { status: 500 }
      );
  }
}
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const athleteId = parseInt(body.athlete_id, 10);

  try {
    if (isNaN(athleteId)) {
      return NextResponse.json({ error: "Invalid athlete_id" }, { status: 400 });
    }
    const result = await db
      .update(athletes)
      .set({
        nationalId: body.national_id,
        nameEn: body.name_en,
        surnameEn: body.surname_en,
        gender: body.gender,
        religion: body.religion,
        nationality: body.nationality,
        bloodType: body.bloodType,
        teamName: body.team_name,
        isWheelchairDependant: body.is_wheelchair_dependant,
        weight: body.weight,
        height: body.height,
        disabilityType: body.disability_type,
      })
      .where(eq(athletes.athleteId, athleteId));

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: `Athlete ${athleteId} not found` },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}