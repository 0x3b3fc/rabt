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

  // Fetch all users with their application data
  const users = await prisma.user.findMany({
    where: {
      role: 'USER',
    },
    include: {
      application: {
        include: {
          governorate: true,
          assignedUnit: {
            include: { governorate: true },
          },
        },
      },
      unit: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Transform data for Excel
  const data = users.map((user, index) => ({
    '#': index + 1,
    'اسم المستخدم': user.name || '-',
    'البريد الإلكتروني': user.email,
    'هاتف المستخدم': user.phone || '-',
    'تاريخ التسجيل': format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm'),
    'حالة الطلب': user.application
      ? (user.application.status === 'PENDING' ? 'قيد المراجعة' : user.application.status === 'ACCEPTED' ? 'مقبول' : 'مرفوض')
      : 'لم يتقدم',
    'الاسم الكامل (الطلب)': user.application?.fullName || '-',
    'الرقم القومي': user.application?.nationalId || '-',
    'هاتف الطلب': user.application?.phone || '-',
    'تاريخ الميلاد': user.application?.birthDate ? format(new Date(user.application.birthDate), 'yyyy-MM-dd') : '-',
    'المحافظة': user.application?.governorate?.name || '-',
    'العنوان': user.application?.address || '-',
    'المؤهل الدراسي': user.application?.education || '-',
    'الوحدة المعينة': user.application?.assignedUnit?.name || '-',
    'محافظة الوحدة': user.application?.assignedUnit?.governorate?.name || '-',
    'ملاحظة الإدارة': user.application?.adminNote || '-',
    'تاريخ التقديم': user.application?.submittedAt ? format(new Date(user.application.submittedAt), 'yyyy-MM-dd HH:mm') : '-',
    'تاريخ القرار': user.application?.decidedAt ? format(new Date(user.application.decidedAt), 'yyyy-MM-dd HH:mm') : '-',
    'رابط الصورة الشخصية': user.application?.photoUrl || '-',
    'رابط صورة البطاقة': user.application?.nationalIdPhotoUrl || '-',
  }))

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: [
      '#',
      'اسم المستخدم',
      'البريد الإلكتروني',
      'هاتف المستخدم',
      'تاريخ التسجيل',
      'حالة الطلب',
      'الاسم الكامل (الطلب)',
      'الرقم القومي',
      'هاتف الطلب',
      'تاريخ الميلاد',
      'المحافظة',
      'العنوان',
      'المؤهل الدراسي',
      'الوحدة المعينة',
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
    { wch: 20 },  // اسم المستخدم
    { wch: 25 },  // البريد الإلكتروني
    { wch: 14 },  // هاتف المستخدم
    { wch: 18 },  // تاريخ التسجيل
    { wch: 12 },  // حالة الطلب
    { wch: 30 },  // الاسم الكامل (الطلب)
    { wch: 16 },  // الرقم القومي
    { wch: 14 },  // هاتف الطلب
    { wch: 12 },  // تاريخ الميلاد
    { wch: 15 },  // المحافظة
    { wch: 40 },  // العنوان
    { wch: 25 },  // المؤهل الدراسي
    { wch: 20 },  // الوحدة المعينة
    { wch: 15 },  // محافظة الوحدة
    { wch: 30 },  // ملاحظة الإدارة
    { wch: 18 },  // تاريخ التقديم
    { wch: 18 },  // تاريخ القرار
    { wch: 50 },  // رابط الصورة الشخصية
    { wch: 50 },  // رابط صورة البطاقة
  ]

  XLSX.utils.book_append_sheet(workbook, worksheet, 'المستخدمين والطلبات')

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  // Return as downloadable file
  const filename = `users_applications_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
