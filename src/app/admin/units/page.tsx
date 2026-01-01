import { getUnits } from '@/actions/unit.actions'
import { getGovernorates } from '@/actions/governorate.actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { UnitDialog } from '@/components/forms/unit-dialog'
import { UnitActions } from '@/components/forms/unit-actions'
import { Plus, MessageCircle } from 'lucide-react'

interface SearchParams {
  governorateId?: string
}

export default async function UnitsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const governorateId = params.governorateId || ''

  const [units, governorates] = await Promise.all([
    getUnits({ governorateId: governorateId || undefined }),
    getGovernorates(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الوحدات</h1>
          <p className="text-muted-foreground">إدارة الوحدات التابعة للمحافظات</p>
        </div>
        <UnitDialog governorates={governorates}>
          <Button>
            <Plus className="ms-2 h-4 w-4" />
            إضافة وحدة
          </Button>
        </UnitDialog>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <form className="flex gap-4">
            <Select name="governorateId" defaultValue={governorateId || 'all'}>
              <SelectTrigger className="w-full sm:w-[250px]">
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
            <Button type="submit">تصفية</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الوحدات</CardTitle>
          <CardDescription>إجمالي {units.length} وحدة</CardDescription>
        </CardHeader>
        <CardContent>
          {units.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              لا توجد وحدات
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">اسم الوحدة</TableHead>
                    <TableHead className="whitespace-nowrap">المحافظة</TableHead>
                    <TableHead className="whitespace-nowrap">الهاتف</TableHead>
                    <TableHead className="whitespace-nowrap">واتساب</TableHead>
                    <TableHead className="whitespace-nowrap">الأعضاء</TableHead>
                    <TableHead className="whitespace-nowrap">الحالة</TableHead>
                    <TableHead className="whitespace-nowrap w-[70px]">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {units.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell>
                        <div className="min-w-[150px]">
                          <p className="font-medium">{unit.name}</p>
                          {unit.address && (
                            <p className="text-sm text-muted-foreground">{unit.address}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{unit.governorate?.name || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span dir="ltr">{unit.phone || '-'}</span>
                      </TableCell>
                      <TableCell>
                        {unit.whatsappLink ? (
                          <a
                            href={unit.whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{unit._count.users}</TableCell>
                      <TableCell>
                        <Badge variant={unit.isActive ? 'default' : 'secondary'}>
                          {unit.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <UnitActions unit={unit} governorates={governorates} />
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
