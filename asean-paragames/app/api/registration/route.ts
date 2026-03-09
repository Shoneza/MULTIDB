import { NextResponse, NextRequest } from 'next/server';

// simple in‑memory store used when Postgres is not desired
const registrations: Record<number, number[]> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST /api/registration received body', body);
    const { athlete_id, registered_sport_id } = body;
    if (!athlete_id || !registered_sport_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    registrations[athlete_id] = registrations[athlete_id] || [];
    if (!registrations[athlete_id].includes(registered_sport_id)) {
      registrations[athlete_id].push(registered_sport_id);
    }

    return NextResponse.json(
      { message: 'Registration stored in memory', data: registrations[athlete_id] },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST registration error:', error);
    return NextResponse.json({ error: 'Failed to register athlete' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const athleteId = searchParams.get('athleteId');
    if (!athleteId) {
      return NextResponse.json({ error: 'Missing athleteId parameter' }, { status: 400 });
    }

    const id = Number(athleteId);
    const data = registrations[id] || [];
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Registration query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { athleteId } = body;
    if (!athleteId) {
      return NextResponse.json({ error: 'Missing athlete_id field' }, { status: 400 });
    }
    const id = Number(athleteId);
    delete registrations[id];
    return NextResponse.json({ message: 'Registrations cleared' }, { status: 200 });
  } catch (error) {
    console.error('Delete registration error:', error);
    return NextResponse.json({ error: 'Failed to delete registrations' }, { status: 500 });
  }
}