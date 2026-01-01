import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSettings } from '@/actions/settings.actions'
import { auth } from '@/lib/auth'
import { UserPlus, LogIn, CheckCircle, FileText, Users } from 'lucide-react'

export default async function HomePage() {
  const session = await auth()
  const settings = await getSettings()

  const siteName = settings.site_name || 'وحدة الربط المركزي'
  const welcomeMessage =
    settings.welcome_message ||
    'مرحباً بكم في منصة وحدة الربط المركزي. يمكنكم من خلال هذه المنصة تقديم طلبات الانضمام ومتابعة حالة طلباتكم.'

  const features = [
    {
      icon: FileText,
      title: 'تقديم الطلبات',
      description: 'قم بتقديم طلب الانضمام بسهولة من خلال نموذج بسيط',
    },
    {
      icon: CheckCircle,
      title: 'متابعة الحالة',
      description: 'تابع حالة طلبك واحصل على إشعارات فورية',
    },
    {
      icon: Users,
      title: 'التواصل المباشر',
      description: 'تواصل مع الوحدة المختصة عبر الواتساب',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg sm:w-[50px] sm:h-[50px]"
            />
            <span className="font-bold text-base sm:text-xl truncate max-w-[150px] sm:max-w-none">{siteName}</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            {session?.user ? (
              <Button asChild size="sm" className="h-8 px-3 sm:h-9 sm:px-4">
                <Link href={session.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}>
                  <span className="hidden sm:inline">لوحة التحكم</span>
                  <span className="sm:hidden">التحكم</span>
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="h-8 px-2 sm:h-9 sm:px-3">
                  <Link href="/login">
                    <LogIn className="h-4 w-4 sm:ms-2" />
                    <span className="hidden sm:inline">تسجيل الدخول</span>
                  </Link>
                </Button>
                <Button asChild size="sm" className="h-8 px-2 sm:h-9 sm:px-3">
                  <Link href="/register">
                    <UserPlus className="h-4 w-4 sm:ms-2" />
                    <span className="hidden sm:inline">إنشاء حساب</span>
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-8 sm:py-16">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-6 sm:mb-8">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto rounded-2xl mb-4 sm:mb-6 sm:w-[150px] sm:h-[150px]"
            />
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">{siteName}</h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {welcomeMessage}
            </p>
          </div>

          {!session?.user && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8">
                <Link href="/register">
                  <UserPlus className="ms-2 h-5 w-5" />
                  إنشاء حساب جديد
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8">
                <Link href="/login">
                  <LogIn className="ms-2 h-5 w-5" />
                  تسجيل الدخول
                </Link>
              </Button>
            </div>
          )}

          {session?.user && session.user.role !== 'ADMIN' && (
            <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8">
              <Link href="/dashboard">
                الذهاب إلى لوحة التحكم
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-10">المميزات</h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 bg-card">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteName}. جميع الحقوق محفوظة.
          </p>
          {settings.support_phone && (
            <p className="text-sm text-muted-foreground mt-2">
              للدعم الفني: <span dir="ltr">{settings.support_phone}</span>
            </p>
          )}
        </div>
      </footer>
    </div>
  )
}
