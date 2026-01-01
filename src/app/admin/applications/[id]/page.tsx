import { notFound } from 'next/navigation'
import { getApplicationById } from '@/actions/application.actions'
import { getAllUnits } from '@/actions/unit.actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/shared/status-badge'
import { ApplicationDecisionForm } from '@/components/forms/application-decision-form'
import Link from 'next/link'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { ArrowRight, User, Mail, Phone, Calendar, MapPin, GraduationCap, Home } from 'lucide-react'

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const application = await getApplicationById(id)

  if (!application) {
    notFound()
  }

  const units = await getAllUnits(false)

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: ar })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/applications">
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">تفاصيل الطلب</h1>
          <p className="text-muted-foreground">مراجعة واتخاذ قرار بشأن الطلب</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>بيانات المتقدم</CardTitle>
                <StatusBadge status={application.status} />
              </div>
              <CardDescription>
                تم التقديم في {formatDate(application.submittedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={application.photoUrl || undefined} alt={application.fullName} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xl font-bold">{application.fullName}</p>
                  <p className="text-muted-foreground" dir="ltr">{application.nationalId}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <p className="font-medium">{application.user.email}</p>
                  </div>
                </div>

                {application.user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">الهاتف</p>
                      <p className="font-medium" dir="ltr">{application.user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ الميلاد</p>
                    <p className="font-medium">{formatDate(application.birthDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">المحافظة</p>
                    <p className="font-medium">{application.governorate.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">المؤهل الدراسي</p>
                    <p className="font-medium">{application.education}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">العنوان</p>
                    <p className="font-medium">{application.address}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ تسجيل الحساب</p>
                  <p className="font-medium">{formatDate(application.user.createdAt)}</p>
                </div>
                {application.decidedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ القرار</p>
                    <p className="font-medium">{formatDate(application.decidedAt)}</p>
                  </div>
                )}
              </div>

              {application.assignedUnit && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">الوحدة المسجل بها</p>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-medium">{application.assignedUnit.name}</p>
                      {application.assignedUnit.governorate && (
                        <p className="text-sm text-muted-foreground">
                          {application.assignedUnit.governorate.name}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {application.adminNote && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">ملاحظة الإدارة</p>
                    <p className="p-4 bg-muted rounded-lg">{application.adminNote}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Decision Form */}
        <div>
          <ApplicationDecisionForm
            applicationId={application.id}
            currentStatus={application.status}
            currentUnitId={application.assignedUnitId}
            currentNote={application.adminNote}
            units={units}
          />
        </div>
      </div>
    </div>
  )
}
