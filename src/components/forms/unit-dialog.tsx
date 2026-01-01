'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { createUnit, updateUnit } from '@/actions/unit.actions'
import { useToast } from '@/hooks/use-toast'
import { Loader2, AlertCircle } from 'lucide-react'

interface UnitDialogProps {
  children: React.ReactNode
  governorates: Array<{ id: string; name: string }>
  unit?: {
    id: string
    name: string
    governorateId: string | null
    whatsappLink: string | null
    address: string | null
    phone: string | null
    isActive: boolean
  }
}

export function UnitDialog({ children, governorates, unit }: UnitDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(unit?.name || '')
  const [governorateId, setGovernorateId] = useState(unit?.governorateId || '')
  const [whatsappLink, setWhatsappLink] = useState(unit?.whatsappLink || '')
  const [address, setAddress] = useState(unit?.address || '')
  const [phone, setPhone] = useState(unit?.phone || '')
  const [isActive, setIsActive] = useState(unit?.isActive ?? true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const isEditing = !!unit

  const handleSubmit = async () => {
    setError(null)

    if (!name.trim()) {
      setError('يجب إدخال اسم الوحدة')
      return
    }

    setIsSubmitting(true)

    const data = {
      name: name.trim(),
      governorateId: governorateId || undefined,
      whatsappLink: whatsappLink || undefined,
      address: address || undefined,
      phone: phone || undefined,
      isActive,
    }

    const result = isEditing
      ? await updateUnit(unit.id, data)
      : await createUnit(data)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      toast({
        title: isEditing ? 'تم التحديث' : 'تم الإضافة',
        description: isEditing ? 'تم تحديث الوحدة بنجاح' : 'تم إضافة الوحدة بنجاح',
      })
      setOpen(false)
      resetForm()
      router.refresh()
    }
  }

  const resetForm = () => {
    if (!isEditing) {
      setName('')
      setGovernorateId('')
      setWhatsappLink('')
      setAddress('')
      setPhone('')
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'تعديل وحدة' : 'إضافة وحدة جديدة'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'قم بتعديل بيانات الوحدة' : 'أدخل بيانات الوحدة الجديدة'}
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
            <Label htmlFor="governorate">المحافظة (اختياري)</Label>
            <Select value={governorateId} onValueChange={setGovernorateId} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المحافظة" />
              </SelectTrigger>
              <SelectContent>
                {governorates.map((gov) => (
                  <SelectItem key={gov.id} value={gov.id}>
                    {gov.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">اسم الوحدة *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: وحدة مصر الجديدة"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">العنوان</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثال: شارع الحرية، مصر الجديدة"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">الهاتف</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01234567890"
              dir="ltr"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">رابط الواتساب</Label>
            <Input
              id="whatsapp"
              value={whatsappLink}
              onChange={(e) => setWhatsappLink(e.target.value)}
              placeholder="https://wa.me/201234567890"
              dir="ltr"
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
