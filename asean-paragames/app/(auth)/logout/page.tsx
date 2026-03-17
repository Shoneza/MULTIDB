import { deleteSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'

export default async function LogoutPage() {
  await deleteSession()
  redirect('/login')
}
