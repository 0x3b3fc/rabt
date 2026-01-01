'use server'

import { cloudinary } from '@/lib/cloudinary'
import { auth } from '@/lib/auth'

export async function uploadImage(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'يجب تسجيل الدخول أولاً' }
  }

  const file = formData.get('file') as File

  if (!file) {
    return { error: 'لم يتم اختيار ملف' }
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { error: 'نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, WEBP' }
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { error: 'حجم الملف يجب ألا يتجاوز 5 ميجابايت' }
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'rabt/applications',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good' },
      ],
    })

    return { success: true, url: result.secure_url }
  } catch (error) {
    console.error('Upload error:', error)
    return { error: 'حدث خطأ أثناء رفع الصورة' }
  }
}
