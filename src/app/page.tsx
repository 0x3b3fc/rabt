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
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-bold text-xl">{siteName}</span>
          </Link>
          <nav className="flex items-center gap-2">
            {session?.user ? (
              <Button asChild>
                <Link href={session.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}>
                  لوحة التحكم
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">
                    <LogIn className="ms-2 h-4 w-4" />
                    تسجيل الدخول
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register">
                    <UserPlus className="ms-2 h-4 w-4" />
                    إنشاء حساب
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-16">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto rounded-2xl mb-6"
            />
            <h1 className="text-4xl font-bold mb-4 lg:text-5xl">{siteName}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {welcomeMessage}
            </p>
          </div>

          {!session?.user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/register">
                  <UserPlus className="ms-2 h-5 w-5" />
                  إنشاء حساب جديد
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/login">
                  <LogIn className="ms-2 h-5 w-5" />
                  تسجيل الدخول
                </Link>
              </Button>
            </div>
          )}

          {session?.user && session.user.role !== 'ADMIN' && (
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/dashboard">
                الذهاب إلى لوحة التحكم
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">المميزات</h2>
          <div className="grid gap-6 md:grid-cols-3">
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
