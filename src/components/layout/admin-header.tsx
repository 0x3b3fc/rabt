'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { logout } from '@/actions/auth.actions'
import { Menu, LogOut, User } from 'lucide-react'
import Link from 'next/link'
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
  { title: 'لوحة التحكم', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'الطلبات', href: '/admin/applications', icon: FileText },
  { title: 'المستخدمين', href: '/admin/users', icon: Users },
  { title: 'المحافظات', href: '/admin/governorates', icon: MapPin },
  { title: 'الوحدات', href: '/admin/units', icon: Building2 },
  { title: 'الإعدادات', href: '/admin/settings', icon: Settings },
]

interface AdminHeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
  siteName?: string
}

export function AdminHeader({ user, siteName = 'وحدة الربط المركزي' }: AdminHeaderProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 sm:h-16 items-center justify-between border-b bg-card px-3 sm:px-4 lg:px-6">
      <div className="flex items-center gap-2 sm:gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 sm:h-10 sm:w-10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">القائمة</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-0">
            <div className="flex h-14 sm:h-16 items-center border-b px-4 sm:px-6">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="font-bold text-sm sm:text-base truncate max-w-[150px]">{siteName}</span>
              </Link>
            </div>
            <nav className="space-y-1 p-4">
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
          </SheetContent>
        </Sheet>
        <h1 className="text-sm sm:text-lg font-semibold lg:hidden truncate max-w-[120px] sm:max-w-[180px]">{siteName}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
              <AvatarFallback>
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name || 'مدير'}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
            <LogOut className="ms-2 h-4 w-4" />
            تسجيل الخروج
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
