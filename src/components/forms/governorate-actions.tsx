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
import { GovernorateDialog } from './governorate-dialog'
import { deleteGovernorate, toggleGovernorateActive } from '@/actions/governorate.actions'
import { useToast } from '@/hooks/use-toast'
import { MoreHorizontal, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface GovernorateActionsProps {
  governorate: {
    id: string
    name: string
    isActive: boolean
    _count: {
      units: number
      applications: number
    }
  }
}

export function GovernorateActions({ governorate }: GovernorateActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteGovernorate(governorate.id)

    if (result.error) {
      toast({
        title: 'خطأ',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المحافظة بنجاح',
      })
      router.refresh()
    }

    setIsDeleting(false)
    setShowDeleteDialog(false)
  }

  const handleToggleActive = async () => {
    const result = await toggleGovernorateActive(governorate.id)

    if (result.error) {
      toast({
        title: 'خطأ',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'تم التحديث',
        description: governorate.isActive ? 'تم إلغاء تفعيل المحافظة' : 'تم تفعيل المحافظة',
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
          <GovernorateDialog governorate={governorate}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Pencil className="ms-2 h-4 w-4" />
              تعديل
            </DropdownMenuItem>
          </GovernorateDialog>
          <DropdownMenuItem onClick={handleToggleActive}>
            {governorate.isActive ? (
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
              سيتم حذف المحافظة &quot;{governorate.name}&quot; نهائياً. هذا الإجراء لا يمكن التراجع عنه.
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
