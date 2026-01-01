import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex h-14 sm:h-16 items-center justify-center border-b bg-card px-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-lg sm:w-[50px] sm:h-[50px]"
          />
          <span className="font-bold text-sm sm:text-lg">وحدة الربط المركزي</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-3 sm:p-4">
        {children}
      </main>
    </div>
  )
}
