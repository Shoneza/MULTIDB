import { NextResponse } from 'next/server'
import { getCurrentSession } from '@/app/lib/session'

export async function GET() {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    athleteId: session.athleteId,
    userName: session.userName,
    role: session.role
  })
}