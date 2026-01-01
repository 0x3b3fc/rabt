'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { decideApplication } from '@/actions/application.actions'
import { useToast } from '@/hooks/use-toast'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface ApplicationDecisionFormProps {
  applicationId: string
  currentStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  currentUnitId: string | null
  currentNote: string | null
  units: Array<{ id: string; name: string }>
}

export function ApplicationDecisionForm({
  applicationId,
  currentStatus,
  currentUnitId,
  currentNote,
  units,
}: ApplicationDecisionFormProps) {
  const [status, setStatus] = useState<'ACCEPTED' | 'REJECTED' | ''>('')
  const [unitId, setUnitId] = useState(currentUnitId || '')
  const [note, setNote] = useState(currentNote || '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!status) {
      setError('يرجى اختيار قرار')
      return
    }

    if (status === 'ACCEPTED' && !unitId) {
      setError('يجب اختيار الوحدة عند القبول')
      return
    }

    setError(null)
    setIsSubmitting(true)

    const result = await decideApplication({
      applicationId,
      status,
      assignedUnitId: status === 'ACCEPTED' ? unitId : undefined,
      adminNote: note || undefined,
    })

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      toast({
        title: 'تم حفظ القرار',
        description: status === 'ACCEPTED' ? 'تم قبول الطلب بنجاح' : 'تم رفض الطلب',
      })
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>اتخاذ قرار</CardTitle>
        <CardDescription>
          {currentStatus === 'PENDING'
            ? 'قم بمراجعة الطلب واتخاذ القرار المناسب'
            : 'يمكنك تعديل القرار إذا لزم الأمر'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label>القرار</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={status === 'ACCEPTED' ? 'default' : 'outline'}
              className={status === 'ACCEPTED' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={() => setStatus('ACCEPTED')}
              disabled={isSubmitting}
            >
              <CheckCircle className="ms-2 h-4 w-4" />
              قبول
            </Button>
            <Button
              type="button"
              variant={status === 'REJECTED' ? 'default' : 'outline'}
              className={status === 'REJECTED' ? 'bg-red-600 hover:bg-red-700' : ''}
              onClick={() => setStatus('REJECTED')}
              disabled={isSubmitting}
            >
              <XCircle className="ms-2 h-4 w-4" />
              رفض
            </Button>
          </div>
        </div>

        {status === 'ACCEPTED' && (
          <div className="space-y-2">
            <Label>الوحدة *</Label>
            <Select value={unitId} onValueChange={setUnitId} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الوحدة" />
              </SelectTrigger>
              <SelectContent>
                {units.length === 0 ? (
                  <SelectItem value="none" disabled>
                    لا توجد وحدات في هذه المحافظة
                  </SelectItem>
                ) : (
                  units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>ملاحظة (اختياري)</Label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="أضف ملاحظة للمتقدم..."
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!status || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="ms-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            'حفظ القرار'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
