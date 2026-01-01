'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  applicationSchema,
  applicationDecisionSchema,
  ApplicationInput,
  ApplicationDecisionInput,
} from '@/validations/application.schema'
import { revalidatePath } from 'next/cache'

export async function submitApplication(data: ApplicationInput) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'يجب تسجيل الدخول أولاً' }
  }

  const validatedFields = applicationSchema.safeParse(data)

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors
    const firstError = Object.values(errors)[0]?.[0]
    return { error: firstError || 'بيانات غير صالحة' }
  }

  // Check if user already has an application
  const existingApplication = await prisma.application.findUnique({
    where: { userId: session.user.id },
  })

  if (existingApplication) {
    return { error: 'لديك طلب مقدم بالفعل' }
  }

  // Check if national ID is already used
  const existingNationalId = await prisma.application.findUnique({
    where: { nationalId: validatedFields.data.nationalId },
  })

  if (existingNationalId) {
    return { error: 'الرقم القومي مستخدم بالفعل في طلب آخر' }
  }

  await prisma.application.create({
    data: {
      userId: session.user.id,
      governorateId: validatedFields.data.governorateId,
      fullName: validatedFields.data.fullName,
      nationalId: validatedFields.data.nationalId,
      phone: validatedFields.data.phone,
      birthDate: new Date(validatedFields.data.birthDate),
      education: validatedFields.data.education,
      address: validatedFields.data.address,
      photoUrl: validatedFields.data.photoUrl,
      nationalIdPhotoUrl: validatedFields.data.nationalIdPhotoUrl,
      nationalIdPhotoBackUrl: validatedFields.data.nationalIdPhotoBackUrl,
      experiences: validatedFields.data.experiences,
    },
  })

  revalidatePath('/application')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function decideApplication(data: ApplicationDecisionInput) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'غير مصرح لك بهذا الإجراء' }
  }

  const validatedFields = applicationDecisionSchema.safeParse(data)

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors
    const firstError = Object.values(errors)[0]?.[0]
    return { error: firstError || 'بيانات غير صالحة' }
  }

  const { applicationId, status, assignedUnitId, adminNote } = validatedFields.data

  // Use transaction for atomic update
  await prisma.$transaction(async (tx) => {
    const application = await tx.application.update({
      where: { id: applicationId },
      data: {
        status,
        assignedUnitId: status === 'ACCEPTED' ? assignedUnitId : null,
        adminNote: adminNote || null,
        decidedAt: new Date(),
      },
    })

    // Update user.unitId based on decision
    if (status === 'ACCEPTED' && assignedUnitId) {
      await tx.user.update({
        where: { id: application.userId },
        data: { unitId: assignedUnitId },
      })
    } else if (status === 'REJECTED') {
      await tx.user.update({
        where: { id: application.userId },
        data: { unitId: null },
      })
    }
  })

  revalidatePath('/admin/applications')
  revalidatePath(`/admin/applications/${applicationId}`)

  return { success: true }
}

export async function getApplications(params?: {
  status?: string
  governorateId?: string
  unitId?: string
  search?: string
  page?: number
  limit?: number
}) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'غير مصرح لك بهذا الإجراء' }
  }

  const page = params?.page || 1
  const limit = params?.limit || 10
  const skip = (page - 1) * limit

  const where: {
    status?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
    governorateId?: string
    assignedUnitId?: string
    OR?: Array<{ fullName?: { contains: string; mode: 'insensitive' }; nationalId?: { contains: string }; user?: { email: { contains: string; mode: 'insensitive' } } }>
  } = {}

  if (params?.status && params.status !== 'ALL') {
    where.status = params.status as 'PENDING' | 'ACCEPTED' | 'REJECTED'
  }

  if (params?.governorateId) {
    where.governorateId = params.governorateId
  }

  if (params?.unitId) {
    where.assignedUnitId = params.unitId
  }

  if (params?.search) {
    where.OR = [
      { fullName: { contains: params.search, mode: 'insensitive' } },
      { nationalId: { contains: params.search } },
      { user: { email: { contains: params.search, mode: 'insensitive' } } },
    ]
  }

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        governorate: true,
        user: { select: { id: true, email: true, name: true } },
        assignedUnit: true,
      },
      orderBy: { submittedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.application.count({ where }),
  ])

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getApplicationById(id: string) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return null
  }

  return prisma.application.findUnique({
    where: { id },
    include: {
      governorate: true,
      user: { select: { id: true, email: true, name: true, phone: true, createdAt: true } },
      assignedUnit: {
        include: { governorate: true },
      },
    },
  })
}

export async function getUserApplication() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  return prisma.application.findUnique({
    where: { userId: session.user.id },
    include: {
      governorate: true,
      assignedUnit: {
        include: { governorate: true },
      },
    },
  })
}

export async function hasUserApplied() {
  const session = await auth()

  if (!session?.user?.id) {
    return false
  }

  const application = await prisma.application.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })

  return !!application
}
