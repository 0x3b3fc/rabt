'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createGovernorate, updateGovernorate } from '@/actions/governorate.actions'
import { useToast } from '@/hooks/use-toast'
import { Loader2, AlertCircle } from 'lucide-react'

interface GovernorateDialogProps {
  children: React.ReactNode
  governorate?: {
    id: string
    name: string
    isActive: boolean
  }
}

export function GovernorateDialog({ children, governorate }: GovernorateDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(governorate?.name || '')
  const [isActive, setIsActive] = useState(governorate?.isActive ?? true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const isEditing = !!governorate

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)

    const result = isEditing
      ? await updateGovernorate(governorate.id, { name, isActive })
      : await createGovernorate({ name, isActive })

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      toast({
        title: isEditing ? 'تم التحديث' : 'تم الإضافة',
        description: isEditing ? 'تم تحديث المحافظة بنجاح' : 'تم إضافة المحافظة بنجاح',
      })
      setOpen(false)
      resetForm()
      router.refresh()
    }
  }

  const resetForm = () => {
    if (!isEditing) {
      setName('')
      setIsActive(true)
    }
    setError(null)
    setIsSubmitting(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'تعديل محافظة' : 'إضافة محافظة جديدة'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'قم بتعديل بيانات المحافظة' : 'أدخل بيانات المحافظة الجديدة'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">اسم المحافظة</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: القاهرة"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">نشط</Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={!name || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="ms-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : isEditing ? (
              'تحديث'
            ) : (
              'إضافة'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
