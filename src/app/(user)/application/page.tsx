import { redirect } from 'next/navigation'
import { getUserApplication } from '@/actions/application.actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, XCircle, User, MapPin, Building2, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export default async function ApplicationPage() {
  const application = await getUserApplication()

  if (!application) {
    redirect('/apply')
  }

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: ar })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">طلب الانضمام</h1>
          <p className="text-muted-foreground">تفاصيل طلبك ومتابعة حالته</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {/* Status Message */}
      {application.status === 'PENDING' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-start gap-3 pt-6">
            <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">طلبك قيد المراجعة</p>
              <p className="text-sm text-yellow-700">
                سيتم إعلامك بالنتيجة قريباً. شكراً لصبرك.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {application.status === 'ACCEPTED' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-start gap-3 pt-6">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-800">تم قبول طلبك</p>
              <p className="text-sm text-green-700">
                تهانينا! تم قبول طلبك للانضمام.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {application.status === 'REJECTED' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">تم رفض طلبك</p>
                <p className="text-sm text-red-700">
                  نأسف لإبلاغك بأن طلبك قد تم رفضه.
                </p>
              </div>
            </div>
            {application.adminNote && (
              <div className="pt-2 border-t border-red-200">
                <p className="text-sm font-medium text-red-800">ملاحظة الإدارة:</p>
                <p className="text-sm text-red-700">{application.adminNote}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Assigned Unit Details */}
      {application.status === 'ACCEPTED' && application.assignedUnit && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              الوحدة المسجل بها
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {application.assignedUnit.governorate && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">المحافظة</p>
                    <p className="font-medium">{application.assignedUnit.governorate.name}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">الوحدة</p>
                  <p className="font-medium">{application.assignedUnit.name}</p>
                </div>
              </div>
              {application.assignedUnit.address && (
                <div>
                  <p className="text-sm text-muted-foreground">العنوان</p>
                  <p className="font-medium">{application.assignedUnit.address}</p>
                </div>
              )}
              {application.assignedUnit.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">الهاتف</p>
                  <p className="font-medium" dir="ltr">{application.assignedUnit.phone}</p>
                </div>
              )}
            </div>
            {application.assignedUnit.whatsappLink && (
              <Button asChild className="w-full" variant="default">
                <a
                  href={application.assignedUnit.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="ms-2 h-4 w-4" />
                  تواصل عبر الواتساب
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Application Details */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات الطلب</CardTitle>
          <CardDescription>
            تم التقديم في {formatDate(application.submittedAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={application.photoUrl || undefined} alt={application.fullName} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">{application.fullName}</p>
              <p className="text-sm text-muted-foreground">{application.nationalId}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">تاريخ الميلاد</p>
              <p className="font-medium">{formatDate(application.birthDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">المحافظة</p>
              <p className="font-medium">{application.governorate.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">المؤهل الدراسي</p>
              <p className="font-medium">{application.education}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">العنوان</p>
              <p className="font-medium">{application.address}</p>
            </div>
          </div>

          {/* Experiences Section */}
          {application.experiences && application.experiences.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">الخبرات والمهارات</p>
                <div className="flex flex-wrap gap-2">
                  {application.experiences.map((exp) => (
                    <Badge key={exp} variant="secondary">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {application.decidedAt && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">تاريخ القرار</p>
                <p className="font-medium">{formatDate(application.decidedAt)}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button asChild variant="outline">
          <Link href="/dashboard">العودة للوحة التحكم</Link>
        </Button>
      </div>
    </div>
  )
}
