import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUserApplication, hasUserApplied } from '@/actions/application.actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import Link from 'next/link'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const hasApplied = await hasUserApplied()
  const application = hasApplied ? await getUserApplication() : null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">مرحباً {session.user.name || 'بك'}</h1>
        <p className="text-muted-foreground">لوحة التحكم الخاصة بك</p>
      </div>

      {!hasApplied ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              تقديم طلب انضمام
            </CardTitle>
            <CardDescription>
              لم تقم بتقديم طلب انضمام بعد. يمكنك تقديم طلبك الآن.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/apply">تقديم طلب الآن</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                حالة طلبك
              </CardTitle>
              {application && <StatusBadge status={application.status} />}
            </div>
            <CardDescription>تم تقديم طلبك بنجاح</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {application?.status === 'PENDING' && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">طلبك قيد المراجعة</p>
                  <p className="text-sm text-yellow-700">
                    سيتم إعلامك بالنتيجة قريباً. شكراً لصبرك.
                  </p>
                </div>
              </div>
            )}

            {application?.status === 'ACCEPTED' && (
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">تم قبول طلبك</p>
                  <p className="text-sm text-green-700">
                    تهانينا! تم قبول طلبك للانضمام.
                  </p>
                </div>
              </div>
            )}

            {application?.status === 'REJECTED' && (
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">تم رفض طلبك</p>
                  <p className="text-sm text-red-700">
                    نأسف لإبلاغك بأن طلبك قد تم رفضه.
                  </p>
                </div>
              </div>
            )}

            <Button asChild variant="outline">
              <Link href="/application">عرض التفاصيل</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
