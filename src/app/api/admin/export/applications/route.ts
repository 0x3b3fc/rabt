import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  // Fetch all applications with related data
  const applications = await prisma.application.findMany({
    include: {
      user: true,
      governorate: true,
      assignedUnit: {
        include: { governorate: true },
      },
    },
    orderBy: { submittedAt: 'desc' },
  })

  // Transform data for Excel
  const data = applications.map((app, index) => ({
    '#': index + 1,
    'الاسم الكامل': app.fullName,
    'الرقم القومي': app.nationalId,
    'رقم الهاتف': app.phone,
    'البريد الإلكتروني': app.user.email,
    'تاريخ الميلاد': format(new Date(app.birthDate), 'yyyy-MM-dd'),
    'المحافظة': app.governorate.name,
    'العنوان': app.address,
    'المؤهل الدراسي': app.education,
    'الحالة': app.status === 'PENDING' ? 'قيد المراجعة' : app.status === 'ACCEPTED' ? 'مقبول' : 'مرفوض',
    'الوحدة': app.assignedUnit?.name || '-',
    'محافظة الوحدة': app.assignedUnit?.governorate?.name || '-',
    'ملاحظة الإدارة': app.adminNote || '-',
    'تاريخ التقديم': format(new Date(app.submittedAt), 'yyyy-MM-dd HH:mm'),
    'تاريخ القرار': app.decidedAt ? format(new Date(app.decidedAt), 'yyyy-MM-dd HH:mm') : '-',
    'رابط الصورة الشخصية': app.photoUrl || '-',
    'رابط صورة البطاقة': app.nationalIdPhotoUrl || '-',
  }))

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: [
      '#',
      'الاسم الكامل',
      'الرقم القومي',
      'رقم الهاتف',
      'البريد الإلكتروني',
      'تاريخ الميلاد',
      'المحافظة',
      'العنوان',
      'المؤهل الدراسي',
      'الحالة',
      'الوحدة',
      'محافظة الوحدة',
      'ملاحظة الإدارة',
      'تاريخ التقديم',
      'تاريخ القرار',
      'رابط الصورة الشخصية',
      'رابط صورة البطاقة',
    ]
  })

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },   // #
    { wch: 30 },  // الاسم الكامل
    { wch: 16 },  // الرقم القومي
    { wch: 14 },  // رقم الهاتف
    { wch: 25 },  // البريد الإلكتروني
    { wch: 12 },  // تاريخ الميلاد
    { wch: 15 },  // المحافظة
    { wch: 40 },  // العنوان
    { wch: 25 },  // المؤهل الدراسي
    { wch: 12 },  // الحالة
    { wch: 20 },  // الوحدة
    { wch: 15 },  // محافظة الوحدة
    { wch: 30 },  // ملاحظة الإدارة
    { wch: 18 },  // تاريخ التقديم
    { wch: 18 },  // تاريخ القرار
    { wch: 50 },  // رابط الصورة الشخصية
    { wch: 50 },  // رابط صورة البطاقة
  ]

  XLSX.utils.book_append_sheet(workbook, worksheet, 'الطلبات')

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  // Return as downloadable file
  const filename = `applications_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
