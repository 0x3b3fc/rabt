import { redirect } from 'next/navigation'
import { hasUserApplied } from '@/actions/application.actions'
import { getActiveGovernorates } from '@/actions/governorate.actions'
import { ApplicationForm } from '@/components/forms/application-form'

export default async function ApplyPage() {
  const hasApplied = await hasUserApplied()

  if (hasApplied) {
    redirect('/application')
  }

  const governorates = await getActiveGovernorates()

  return (
    <div className="py-6">
      <ApplicationForm governorates={governorates} />
    </div>
  )
}
