import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { AdminHeader } from '@/components/layout/admin-header'
import { getSiteName } from '@/actions/settings.actions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const siteName = await getSiteName()

  return (
    <div className="min-h-screen flex">
      <AdminSidebar siteName={siteName} />
      <div className="flex-1 flex flex-col">
        <AdminHeader user={session.user} siteName={siteName} />
        <main className="flex-1 p-3 sm:p-4 lg:p-6 bg-muted/30">{children}</main>
      </div>
    </div>
  )
}
