'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ImageUpload } from '@/components/shared/image-upload'
import { applicationSchema, ApplicationInput } from '@/validations/application.schema'
import { submitApplication } from '@/actions/application.actions'
import { useToast } from '@/hooks/use-toast'
import { Loader2, AlertCircle } from 'lucide-react'

interface ApplicationFormProps {
  governorates: Array<{ id: string; name: string }>
}

export function ApplicationForm({ governorates }: ApplicationFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      governorateId: '',
      fullName: '',
      nationalId: '',
      birthDate: '',
      education: '',
      address: '',
      photoUrl: '',
    },
  })

  const onSubmit = async (data: ApplicationInput) => {
    setError(null)
    setIsSubmitting(true)

    const result = await submitApplication(data)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else if (result.success) {
      toast({
        title: 'تم التقديم بنجاح',
        description: 'شكرًا لتقديمك، سيتم إعلامك بالنتيجة.',
      })
      router.push('/application')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>نموذج طلب الانضمام</CardTitle>
        <CardDescription>يرجى ملء جميع البيانات المطلوبة بدقة</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel>الصورة الشخصية *</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>الاسم الرباعي (بالعربية) *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="أحمد محمد علي حسن"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      يجب كتابة الاسم رباعياً باللغة العربية
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الرقم القومي *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="29901011234567"
                        maxLength={14}
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>14 رقماً</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ الميلاد *</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="governorateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المحافظة *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المحافظة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {governorates.map((gov) => (
                          <SelectItem key={gov.id} value={gov.id}>
                            {gov.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المؤهل الدراسي *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="بكالوريوس هندسة - جامعة القاهرة"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان بالتفصيل *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="المحافظة - المدينة - الحي - الشارع - رقم المبنى"
                      rows={3}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="ms-2 h-4 w-4 animate-spin" />
                  جاري التقديم...
                </>
              ) : (
                'تقديم الطلب'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
