'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { settingsSchema, SettingsInput } from '@/validations/settings.schema'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
  const settings = await prisma.setting.findMany()

  const settingsMap: Record<string, string> = {}
  for (const setting of settings) {
    settingsMap[setting.key] = setting.value || ''
  }

  return settingsMap
}

export async function getSetting(key: string) {
  const setting = await prisma.setting.findUnique({
    where: { key },
  })

  return setting?.value || null
}

export async function updateSettings(data: SettingsInput) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'غير مصرح لك بهذا الإجراء' }
  }

  const validatedFields = settingsSchema.safeParse(data)

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors
    const firstError = Object.values(errors)[0]?.[0]
    return { error: firstError || 'بيانات غير صالحة' }
  }

  const settingsToUpdate = Object.entries(validatedFields.data)

  for (const [key, value] of settingsToUpdate) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: value || '' },
      create: { key, value: value || '' },
    })
  }

  revalidatePath('/admin/settings')
  revalidatePath('/')
  return { success: true }
}

export async function getSiteName() {
  const setting = await prisma.setting.findUnique({
    where: { key: 'site_name' },
  })

  return setting?.value || 'وحدة الربط المركزي'
}
