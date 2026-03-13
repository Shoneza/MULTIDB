import { NextResponse, NextRequest } from "next/server";
import pool from '../../../db';
import { db } from "@/app/lib/db/client";
import { registrations, athletes, sports } from "@/app/lib/db/schema";
import { eq, and } from "drizzle-orm";
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { athlete_id, registered_sport_id } = body;
        if (!athlete_id || !registered_sport_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        console.log(`Attempting to register athlete ${athlete_id} for sport ${registered_sport_id}`);
        
        // Check if already registered
        const checkResult = await pool.query(
            `SELECT 1 FROM registrations WHERE athlete_id = $1 AND registered_sport_id = $2`,
            [athlete_id, registered_sport_id]
        );
        
        if (checkResult.rowCount > 0) {
            return NextResponse.json({ message: 'Athlete already registered for this sport' }, { status: 200 });
        }
        
        const result = await pool.query(`
            INSERT INTO registrations (athlete_id, registered_sport_id)
            VALUES ($1, $2)
            RETURNING *
            `, [athlete_id, registered_sport_id]);

        return NextResponse.json({ message: 'Registration successful', data: result.rows[0] }, { status: 201 });
    }
    catch (error) {
        console.error("POST registration error:", error);
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
        
        // if (!sportId) {
        //     return NextResponse.json({ error: 'Missing sportId parameter' }, { status: 400 });
        // }
        const values: (string | number)[] = [];
        const conditions: string[] = [];
        if (sportId) {
            values.push(sportId);
            conditions.push(`r.registered_sport_id = $${values.length}`);
        }
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
        console.log("Registration query conditions:", conditions);
        const query = `
        SELECT
            r.registration_id,
            r.registered_sport_id,
            a.athlete_id,
            a.name_en,
            a.surname_en,
            a.gender,
            a.disability_type,
            a.nationality
        FROM registrations r
        INNER JOIN athletes a ON r.athlete_id = a.athlete_id
        WHERE ${conditions.join(' AND ')}
        ORDER BY r.registration_id
        `;
        const result = await pool.query(query, values);
        console.log("Registration query result:", result.rows);
        return NextResponse.json(result.rows, { status: 200 } );
    } catch (error) {
        console.error("Registration query error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch registrations' },
            { status: 500 }
        );
       
    }
}
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { athlete_id} = body;
        if (!athlete_id) {
            return NextResponse.json({ error: 'Missing athlete_id field' }, { status: 400 });
        }
        const result = await pool.query('DELETE FROM registrations WHERE athlete_id = $1 RETURNING *', [athlete_id]);
        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'No registration found for the given athlete_id' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Registration deleted successfully', data: result.rows[0] }, { status: 200 });
    } catch (error) {

    }
}


// ###################### 2ND VERSION ############################### //

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { athlete_id, registered_sport_id } = body;

//     if (!athlete_id || !registered_sport_id) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Check if already registered
//     const existing = await db
//       .select()
//       .from(registrations)
//       .where(
//         and(
//           eq(registrations.athleteId, athlete_id),
//           eq(registrations.registeredSportId, registered_sport_id)
//         )
//       );

//     if (existing.length > 0) {
//       return NextResponse.json(
//         { message: "Athlete already registered for this sport" },
//         { status: 200 }
//       );
//     }

//     const result = await db
//       .insert(registrations)
//       .values({
//         athleteId: athlete_id,
//         registeredSportId: registered_sport_id,
//       })
//       .returning();

//     return NextResponse.json(
//       { message: "Registration successful", data: result[0] },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to register athlete" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const athleteId = searchParams.get("athleteId");
//     const sportId = searchParams.get("sportId");

//     const conditions = [];

//     if (athleteId) {
//       conditions.push(eq(registrations.athleteId, parseInt(athleteId, 10)));
//     }

//     if (sportId) {
//       conditions.push(eq(registrations.registeredSportId, parseInt(sportId, 10)));
//     }

//     let query = db
//       .select({
//         registrationId: registrations.registrationId,
//         registeredSportId: registrations.registeredSportId,
//         athleteId: athletes.athleteId,
//         nameEn: athletes.nameEn,
//         surnameEn: athletes.surnameEn,
//         gender: athletes.gender,
//         disabilityType: athletes.disabilityType,
//         nationality: athletes.nationality,
//       })
//       .from(registrations)
//       .innerJoin(athletes, eq(registrations.athleteId, athletes.athleteId))
//       .where(conditions.length ? and(...conditions) : undefined);
      

//     const result = await query;
//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch registrations" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { athlete_id } = body;

//     if (!athlete_id) {
//       return NextResponse.json(
//         { error: "Missing athlete_id" },
//         { status: 400 }
//       );
//     }

//     const result = await db
//       .delete(registrations)
//       .where(eq(registrations.athleteId, athlete_id))
//       .returning();

//     if (result.length === 0) {
//       return NextResponse.json(
//         { message: "No registrations found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         message: "Registration deleted successfully",
//         data: result[0],
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to delete registration" },
//       { status: 500 }
//     );
//   }
// }