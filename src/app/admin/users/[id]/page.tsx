import { notFound } from 'next/navigation'
import { getUserById } from '@/actions/user.actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/shared/status-badge'
import Link from 'next/link'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { ArrowRight, User, Mail, Phone, Calendar, MapPin, Building2, FileText } from 'lucide-react'

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: ar })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/users">
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">تفاصيل المستخدم</h1>
          <p className="text-muted-foreground">معلومات المستخدم وطلبه</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات الحساب</CardTitle>
            <CardDescription>
              تم التسجيل في {formatDate(user.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-bold">{user.name || 'بدون اسم'}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">الهاتف</p>
                    <p className="font-medium" dir="ltr">{user.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ التسجيل</p>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>

            {user.unit && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">الوحدة المسجل بها</p>
                    <p className="font-medium">{user.unit.name}</p>
                    <p className="text-sm text-muted-foreground">{user.unit.governorate.name}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Application Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>طلب الانضمام</CardTitle>
              {user.application && <StatusBadge status={user.application.status} />}
            </div>
          </CardHeader>
          <CardContent>
            {!user.application ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">لم يتقدم بطلب بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={user.application.photoUrl || undefined}
                      alt={user.application.fullName}
                    />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{user.application.fullName}</p>
                    <p className="text-sm text-muted-foreground" dir="ltr">
                      {user.application.nationalId}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.application.governorate.name}</span>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">المؤهل</p>
                    <p>{user.application.education}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">العنوان</p>
                    <p>{user.application.address}</p>
                  </div>
                </div>

                {user.application.assignedUnit && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">الوحدة المسجل بها</p>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-medium">{user.application.assignedUnit.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.application.assignedUnit.governorate.name}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <Button asChild className="w-full" variant="outline">
                  <Link href={`/admin/applications/${user.application.id}`}>
                    عرض تفاصيل الطلب
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
