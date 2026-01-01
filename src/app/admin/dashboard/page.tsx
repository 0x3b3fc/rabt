import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Building2,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalApplications,
    pendingApplications,
    acceptedApplications,
    rejectedApplications,
    totalGovernorates,
    totalUnits,
    latestApplications,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: 'PENDING' } }),
    prisma.application.count({ where: { status: 'ACCEPTED' } }),
    prisma.application.count({ where: { status: 'REJECTED' } }),
    prisma.governorate.count({ where: { isActive: true } }),
    prisma.unit.count({ where: { isActive: true } }),
    prisma.application.findMany({
      take: 5,
      orderBy: { submittedAt: 'desc' },
      include: {
        user: { select: { email: true } },
        governorate: { select: { name: true } },
      },
    }),
  ])

  const stats = [
    {
      title: 'إجمالي المستخدمين',
      value: totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'إجمالي الطلبات',
      value: totalApplications,
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    {
      title: 'طلبات معلقة',
      value: pendingApplications,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'طلبات مقبولة',
      value: acceptedApplications,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'طلبات مرفوضة',
      value: rejectedApplications,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'المحافظات',
      value: totalGovernorates,
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'الوحدات',
      value: totalUnits,
      icon: Building2,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة عامة على النظام</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Latest Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>أحدث الطلبات</CardTitle>
              <CardDescription>آخر 5 طلبات مقدمة</CardDescription>
            </div>
            <Link
              href="/admin/applications"
              className="text-sm text-primary hover:underline"
            >
              عرض الكل
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {latestApplications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              لا توجد طلبات بعد
            </p>
          ) : (
            <div className="space-y-4">
              {latestApplications.map((app) => (
                <Link
                  key={app.id}
                  href={`/admin/applications/${app.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{app.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {app.governorate.name} • {app.user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(app.submittedAt), 'dd/MM/yyyy', { locale: ar })}
                    </span>
                    <StatusBadge status={app.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
