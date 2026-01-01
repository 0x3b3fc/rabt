'use client'

import Link from 'next/link'
import Image from 'next/image'
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
import { logout } from '@/actions/auth.actions'
import { LogOut, User } from 'lucide-react'

interface UserHeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
  siteName?: string
}

export function UserHeader({ user, siteName = 'وحدة الربط المركزي' }: UserHeaderProps) {
  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 sm:h-16 items-center justify-between border-b bg-card px-3 sm:px-4 lg:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-lg sm:w-[50px] sm:h-[50px]"
        />
        <span className="font-bold text-sm sm:text-lg truncate max-w-[120px] sm:max-w-[200px]">{siteName}</span>
      </Link>

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
              <p className="text-sm font-medium leading-none">{user.name || 'مستخدم'}</p>
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
