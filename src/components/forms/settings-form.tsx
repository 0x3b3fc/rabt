'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { updateSettings } from '@/actions/settings.actions'
import { useToast } from '@/hooks/use-toast'
import { Loader2, AlertCircle, Save } from 'lucide-react'

interface SettingsFormProps {
  settings: Record<string, string>
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [siteName, setSiteName] = useState(settings.site_name || 'وحدة الربط المركزي')
  const [supportPhone, setSupportPhone] = useState(settings.support_phone || '')
  const [primaryColor, setPrimaryColor] = useState(settings.primary_color || '#2563eb')
  const [welcomeMessage, setWelcomeMessage] = useState(settings.welcome_message || '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const result = await updateSettings({
      site_name: siteName,
      support_phone: supportPhone,
      primary_color: primaryColor,
      welcome_message: welcomeMessage,
    })

    if (result.error) {
      setError(result.error)
    } else {
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ الإعدادات بنجاح',
      })
      router.refresh()
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="siteName">اسم الموقع *</Label>
          <Input
            id="siteName"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="وحدة الربط المركزي"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supportPhone">هاتف الدعم</Label>
          <Input
            id="supportPhone"
            value={supportPhone}
            onChange={(e) => setSupportPhone(e.target.value)}
            placeholder="01234567890"
            dir="ltr"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryColor">اللون الرئيسي</Label>
          <div className="flex gap-2">
            <Input
              id="primaryColor"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              placeholder="#2563eb"
              dir="ltr"
              disabled={isSubmitting}
            />
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-10 w-10 rounded border cursor-pointer"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="welcomeMessage">رسالة الترحيب</Label>
        <Textarea
          id="welcomeMessage"
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          placeholder="مرحباً بكم في منصة وحدة الربط المركزي..."
          rows={4}
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">
          تظهر هذه الرسالة في الصفحة الرئيسية
        </p>
      </div>

      <Button type="submit" disabled={!siteName || isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="ms-2 h-4 w-4 animate-spin" />
            جاري الحفظ...
          </>
        ) : (
          <>
            <Save className="ms-2 h-4 w-4" />
            حفظ الإعدادات
          </>
        )}
      </Button>
    </form>
  )
}
