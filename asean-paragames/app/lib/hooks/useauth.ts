'use client'
import { SessionPayload } from '@/app/lib/definitions'
import { useEffect, useState } from 'react'

export function useAuth() {
  const [session, setSession] = useState<SessionPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<number | null>(null);
  
  useEffect(() => {
    // Fetch session from server
    fetch('/api/currentuser')
      .then(res => res.json())
      .then(data => {
        setSession(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return { session, loading }
}

export function useRequireRole(allowedRoles: string[]) {
  const { session, loading } = useAuth()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (!loading && session?.role) {
      setAuthorized(allowedRoles.includes(session.role))
    }
  }, [session, loading, allowedRoles])

  return { authorized, loading, session }
}