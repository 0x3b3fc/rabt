'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Users,
  MapPin,
  Building2,
  Settings,
} from 'lucide-react'

const navItems = [
  {
    title: 'لوحة التحكم',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'الطلبات',
    href: '/admin/applications',
    icon: FileText,
  },
  {
    title: 'المستخدمين',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'المحافظات',
    href: '/admin/governorates',
    icon: MapPin,
  },
  {
    title: 'الوحدات',
    href: '/admin/units',
    icon: Building2,
  },
  {
    title: 'الإعدادات',
    href: '/admin/settings',
    icon: Settings,
  },
]

interface AdminSidebarProps {
  siteName?: string
}

export function AdminSidebar({ siteName = 'وحدة الربط المركزي' }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-64 flex-col border-l bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-lg"
          />
          <span className="font-bold text-lg">{siteName}</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
