import { z } from 'zod'

// Arabic name regex: Arabic letters, spaces, and common diacritics
const arabicNameRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s]+$/

// National ID: exactly 14 digits
const nationalIdRegex = /^\d{14}$/

// Egyptian phone number: starts with 01 and has 11 digits
const phoneRegex = /^01[0125]\d{8}$/

export const applicationSchema = z.object({
  governorateId: z.string().min(1, { message: 'المحافظة مطلوبة' }),
  fullName: z
    .string()
    .min(1, { message: 'الاسم الكامل مطلوب' })
    .min(10, { message: 'الاسم يجب أن يكون 10 أحرف على الأقل' })
    .max(100, { message: 'الاسم يجب ألا يتجاوز 100 حرف' })
    .refine(
      (name) => arabicNameRegex.test(name),
      { message: 'الاسم يجب أن يكون باللغة العربية فقط' }
    )
    .refine(
      (name) => name.trim().split(/\s+/).length >= 4,
      { message: 'الاسم يجب أن يكون رباعياً على الأقل (أربعة أسماء)' }
    ),
  nationalId: z
    .string()
    .min(1, { message: 'الرقم القومي مطلوب' })
    .regex(nationalIdRegex, { message: 'الرقم القومي يجب أن يكون 14 رقماً بالضبط' }),
  phone: z
    .string()
    .min(1, { message: 'رقم الهاتف مطلوب' })
    .regex(phoneRegex, { message: 'رقم الهاتف يجب أن يكون رقم مصري صحيح (01xxxxxxxxx)' }),
  birthDate: z
    .string()
    .min(1, { message: 'تاريخ الميلاد مطلوب' })
    .refine(
      (date) => {
        const birthDate = new Date(date)
        const today = new Date()
        return birthDate < today
      },
      { message: 'تاريخ الميلاد يجب أن يكون قبل اليوم' }
    )
    .refine(
      (date) => {
        const birthDate = new Date(date)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        return age >= 18 && age <= 100
      },
      { message: 'العمر يجب أن يكون بين 18 و 100 سنة' }
    ),
  education: z
    .string()
    .min(1, { message: 'المؤهل الدراسي مطلوب' })
    .min(5, { message: 'المؤهل الدراسي يجب أن يكون 5 أحرف على الأقل' }),
  address: z
    .string()
    .min(1, { message: 'العنوان مطلوب' })
    .min(10, { message: 'العنوان يجب أن يكون 10 أحرف على الأقل' })
    .max(200, { message: 'العنوان يجب ألا يتجاوز 200 حرف' }),
  photoUrl: z.string().min(1, { message: 'الصورة الشخصية مطلوبة' }),
  nationalIdPhotoUrl: z.string().min(1, { message: 'صورة وجه البطاقة مطلوبة' }),
  nationalIdPhotoBackUrl: z.string().min(1, { message: 'صورة ظهر البطاقة مطلوبة' }),
  experiences: z.array(z.string()).min(1, { message: 'يجب إضافة خبرة واحدة على الأقل' }),
})

export const applicationDecisionSchema = z
  .object({
    applicationId: z.string().min(1),
    status: z.enum(['ACCEPTED', 'REJECTED']),
    assignedUnitId: z.string().optional(),
    adminNote: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.status === 'ACCEPTED' && !data.assignedUnitId) {
        return false
      }
      return true
    },
    {
      message: 'يجب تحديد الوحدة عند قبول الطلب',
      path: ['assignedUnitId'],
    }
  )

export type ApplicationInput = z.infer<typeof applicationSchema>
export type ApplicationDecisionInput = z.infer<typeof applicationDecisionSchema>
