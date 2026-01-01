import { z } from 'zod'

export const governorateSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'اسم المحافظة مطلوب' })
    .min(3, { message: 'اسم المحافظة يجب أن يكون 3 أحرف على الأقل' }),
  isActive: z.boolean().default(true),
})

export type GovernorateInput = z.infer<typeof governorateSchema>
