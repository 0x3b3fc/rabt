'use server'

import { signIn, signOut } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { loginSchema, registerSchema, LoginInput, RegisterInput } from '@/validations/auth.schema'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export async function login(data: LoginInput) {
  const validatedFields = loginSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'بيانات غير صالحة' }
  }

  try {
    await signIn('credentials', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
        default:
          return { error: 'حدث خطأ أثناء تسجيل الدخول' }
      }
    }
    throw error
  }

  // Get user role for redirect
  const user = await prisma.user.findUnique({
    where: { email: validatedFields.data.email },
    select: { role: true },
  })

  return {
    success: true,
    redirectTo: user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard',
  }
}

export async function register(data: RegisterInput) {
  const validatedFields = registerSchema.safeParse(data)

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors
    const firstError = Object.values(errors)[0]?.[0]
    return { error: firstError || 'بيانات غير صالحة' }
  }

  const { name, email, password } = validatedFields.data

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: 'البريد الإلكتروني مستخدم بالفعل' }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return { success: true }
}

export async function logout() {
  await signOut({ redirect: false })
  redirect('/login')
}
