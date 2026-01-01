'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { UnitDialog } from './unit-dialog'
import { deleteUnit, toggleUnitActive } from '@/actions/unit.actions'
import { useToast } from '@/hooks/use-toast'
import { MoreHorizontal, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface UnitActionsProps {
  unit: {
    id: string
    name: string
    governorateId: string
    whatsappLink: string | null
    address: string | null
    phone: string | null
    isActive: boolean
    _count: {
      users: number
      applications: number
    }
  }
  governorates: Array<{ id: string; name: string }>
}

export function UnitActions({ unit, governorates }: UnitActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteUnit(unit.id)

    if (result.error) {
      toast({
        title: 'خطأ',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الوحدة بنجاح',
      })
      router.refresh()
    }

    setIsDeleting(false)
    setShowDeleteDialog(false)
  }

  const handleToggleActive = async () => {
    const result = await toggleUnitActive(unit.id)

    if (result.error) {
      toast({
        title: 'خطأ',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'تم التحديث',
        description: unit.isActive ? 'تم إلغاء تفعيل الوحدة' : 'تم تفعيل الوحدة',
      })
      router.refresh()
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <UnitDialog unit={unit} governorates={governorates}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Pencil className="ms-2 h-4 w-4" />
              تعديل
            </DropdownMenuItem>
          </UnitDialog>
          <DropdownMenuItem onClick={handleToggleActive}>
            {unit.isActive ? (
              <>
                <ToggleLeft className="ms-2 h-4 w-4" />
                إلغاء التفعيل
              </>
            ) : (
              <>
                <ToggleRight className="ms-2 h-4 w-4" />
                تفعيل
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="ms-2 h-4 w-4" />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الوحدة &quot;{unit.name}&quot; نهائياً. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'جاري الحذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
