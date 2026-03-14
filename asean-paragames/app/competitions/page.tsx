import { verifySession } from '@/app/lib/dal'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await verifySession()
  const userRole = session?.role // Assuming 'role' is part of the session object
    
  if (userRole === 'admin') {
    redirect('/competitions/admin')
  } else if (userRole === 'athlete') {
    redirect('/competitions/athlete')
  } else {
    redirect('/competitions/guest')
  }
}