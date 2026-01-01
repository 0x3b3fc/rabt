import { getGovernorates } from '@/actions/governorate.actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GovernorateDialog } from '@/components/forms/governorate-dialog'
import { GovernorateActions } from '@/components/forms/governorate-actions'
import { Plus } from 'lucide-react'

export default async function GovernoratesPage() {
  const governorates = await getGovernorates()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">المحافظات</h1>
          <p className="text-muted-foreground">إدارة قائمة المحافظات</p>
        </div>
        <GovernorateDialog>
          <Button>
            <Plus className="ms-2 h-4 w-4" />
            إضافة محافظة
          </Button>
        </GovernorateDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المحافظات</CardTitle>
          <CardDescription>إجمالي {governorates.length} محافظة</CardDescription>
        </CardHeader>
        <CardContent>
          {governorates.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              لا توجد محافظات
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المحافظة</TableHead>
                    <TableHead>عدد الوحدات</TableHead>
                    <TableHead>عدد الطلبات</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="w-[100px]">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {governorates.map((gov) => (
                    <TableRow key={gov.id}>
                      <TableCell className="font-medium">{gov.name}</TableCell>
                      <TableCell>{gov._count.units}</TableCell>
                      <TableCell>{gov._count.applications}</TableCell>
                      <TableCell>
                        <Badge variant={gov.isActive ? 'default' : 'secondary'}>
                          {gov.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <GovernorateActions governorate={gov} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
