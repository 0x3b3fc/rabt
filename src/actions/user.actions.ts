'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function getUsers(params?: {
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
    role: 'USER'
    OR?: Array<{ name?: { contains: string; mode: 'insensitive' }; email?: { contains: string; mode: 'insensitive' } }>
  } = {
    role: 'USER',
  }

  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { email: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        unit: {
          select: { id: true, name: true },
        },
        application: {
          select: { id: true, status: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getUserById(id: string) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return null
  }

  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      unit: {
        include: { governorate: true },
      },
      application: {
        include: {
          governorate: true,
          assignedUnit: {
            include: { governorate: true },
          },
        },
      },
    },
  })
}

export async function getCurrentUser() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      unit: {
        include: { governorate: true },
      },
    },
  })
}
