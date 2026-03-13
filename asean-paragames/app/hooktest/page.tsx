'use client'

import { useRequireRole } from '@/app/lib/hooks/useauth';

export default function MyPage() {
  const { authorized, loading, session } = useRequireRole(['admin'])

  if (loading) return <div>Loading...</div>
  if (!authorized) return <div>Unauthorized</div>

  // Get the athleteId (userId) from session
  const userId = session?.athleteId

  return (
    <div>
      <p>Your User ID: {userId}</p>
      <p>Your Name: {session?.userName}</p>
      <p>Your Role: {session?.role}</p>
    </div>
  )
}