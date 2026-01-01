import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { UserHeader } from '@/components/layout/user-header'
import { getSiteName } from '@/actions/settings.actions'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role === 'ADMIN') {
    redirect('/admin/dashboard')
  }

  const siteName = await getSiteName()

  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader user={session.user} siteName={siteName} />
      <main className="flex-1 container mx-auto p-3 sm:p-4 lg:p-6">{children}</main>
    </div>
  )
}
