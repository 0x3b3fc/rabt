import { z } from 'zod'

export const settingsSchema = z.object({
  site_name: z.string().min(1, { message: 'اسم الموقع مطلوب' }),
  support_phone: z.string().optional().or(z.literal('')),
  primary_color: z.string().optional().or(z.literal('')),
  welcome_message: z.string().optional().or(z.literal('')),
})

export type SettingsInput = z.infer<typeof settingsSchema>
