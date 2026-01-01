import { getUsers } from '@/actions/user.actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react'

interface SearchParams {
  search?: string
  page?: string
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''

  const result = await getUsers({
    search: search || undefined,
    page,
    limit: 10,
  })

  if ('error' in result) {
    return <div>خطأ: {result.error}</div>
  }

  const { users, pagination } = result

  const buildUrl = (newParams: Partial<SearchParams>) => {
    const urlParams = new URLSearchParams()
    const mergedParams = { search, page: String(page), ...newParams }

    Object.entries(mergedParams).forEach(([key, value]) => {
      if (value && value !== '1') {
        urlParams.set(key, String(value))
      }
    })

    return `/admin/users?${urlParams.toString()}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">المستخدمين</h1>
        <p className="text-muted-foreground">قائمة المستخدمين المسجلين في النظام</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <form className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                placeholder="بحث بالاسم أو البريد الإلكتروني..."
                defaultValue={search}
                className="pe-10"
              />
            </div>
            <Button type="submit">بحث</Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين</CardTitle>
          <CardDescription>إجمالي {pagination.total} مستخدم</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              لا يوجد مستخدمين
            </p>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المستخدم</TableHead>
                      <TableHead>تاريخ التسجيل</TableHead>
                      <TableHead>حالة الطلب</TableHead>
                      <TableHead>الوحدة</TableHead>
                      <TableHead className="w-[80px]">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name || 'بدون اسم'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: ar })}
                        </TableCell>
                        <TableCell>
                          {user.application ? (
                            <Badge
                              variant={
                                user.application.status === 'ACCEPTED'
                                  ? 'default'
                                  : user.application.status === 'REJECTED'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {user.application.status === 'PENDING' && 'قيد المراجعة'}
                              {user.application.status === 'ACCEPTED' && 'مقبول'}
                              {user.application.status === 'REJECTED' && 'مرفوض'}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">لم يتقدم</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.unit?.name || '-'}
                        </TableCell>
                        <TableCell>
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/admin/users/${user.id}`}>
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
