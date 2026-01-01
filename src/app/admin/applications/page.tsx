import { getApplications } from '@/actions/application.actions'
import { getGovernorates } from '@/actions/governorate.actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/shared/status-badge'
import Link from 'next/link'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react'

interface SearchParams {
  status?: string
  governorateId?: string
  search?: string
  page?: string
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const status = params.status || 'ALL'
  const governorateId = params.governorateId || ''
  const search = params.search || ''

  const [result, governorates] = await Promise.all([
    getApplications({
      status: status === 'ALL' ? undefined : status,
      governorateId: governorateId || undefined,
      search: search || undefined,
      page,
      limit: 10,
    }),
    getGovernorates(),
  ])

  if ('error' in result) {
    return <div>خطأ: {result.error}</div>
  }

  const { applications, pagination } = result

  const buildUrl = (newParams: Partial<SearchParams>) => {
    const urlParams = new URLSearchParams()
    const mergedParams = { status, governorateId, search, page: String(page), ...newParams }

    Object.entries(mergedParams).forEach(([key, value]) => {
      if (value && value !== 'ALL' && value !== '1') {
        urlParams.set(key, String(value))
      }
    })

    return `/admin/applications?${urlParams.toString()}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">الطلبات</h1>
        <p className="text-muted-foreground">إدارة ومراجعة طلبات الانضمام</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                placeholder="بحث بالاسم أو الرقم القومي أو البريد..."
                defaultValue={search}
                className="pe-10"
              />
            </div>
            <Select name="status" defaultValue={status}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">جميع الحالات</SelectItem>
                <SelectItem value="PENDING">قيد المراجعة</SelectItem>
                <SelectItem value="ACCEPTED">مقبول</SelectItem>
                <SelectItem value="REJECTED">مرفوض</SelectItem>
              </SelectContent>
            </Select>
            <Select name="governorateId" defaultValue={governorateId || 'all'}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="المحافظة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المحافظات</SelectItem>
                {governorates.map((gov) => (
                  <SelectItem key={gov.id} value={gov.id}>
                    {gov.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">بحث</Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلبات</CardTitle>
          <CardDescription>
            إجمالي {pagination.total} طلب
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              لا توجد طلبات مطابقة للبحث
            </p>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>الرقم القومي</TableHead>
                      <TableHead>المحافظة</TableHead>
                      <TableHead>تاريخ التقديم</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="w-[100px]">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.fullName}</p>
                            <p className="text-sm text-muted-foreground">{app.user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell dir="ltr">{app.nationalId}</TableCell>
                        <TableCell>{app.governorate.name}</TableCell>
                        <TableCell>
                          {format(new Date(app.submittedAt), 'dd/MM/yyyy', { locale: ar })}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={app.status} />
                        </TableCell>
                        <TableCell>
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/admin/applications/${app.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    صفحة {pagination.page} من {pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page <= 1}
                      asChild={pagination.page > 1}
                    >
                      {pagination.page > 1 ? (
                        <Link href={buildUrl({ page: String(pagination.page - 1) })}>
                          <ChevronRight className="h-4 w-4" />
                          السابق
                        </Link>
                      ) : (
                        <>
                          <ChevronRight className="h-4 w-4" />
                          السابق
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages}
                      asChild={pagination.page < pagination.totalPages}
                    >
                      {pagination.page < pagination.totalPages ? (
                        <Link href={buildUrl({ page: String(pagination.page + 1) })}>
                          التالي
                          <ChevronLeft className="h-4 w-4" />
                        </Link>
                      ) : (
                        <>
                          التالي
                          <ChevronLeft className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
