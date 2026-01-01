import { getSettings } from '@/actions/settings.actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SettingsForm } from '@/components/forms/settings-form'

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">إعدادات الموقع والنظام</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات الموقع</CardTitle>
          <CardDescription>تخصيص إعدادات الموقع العامة</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  )
}
