import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const governoratesData = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الدقهلية',
  'البحيرة',
  'الشرقية',
  'المنوفية',
  'القليوبية',
  'الغربية',
  'كفر الشيخ',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'الوادي الجديد',
  'مطروح',
  'شمال سيناء',
  'جنوب سيناء',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'دمياط',
]

const unitsData: Record<string, Array<{ name: string; address?: string; phone?: string; whatsappLink?: string }>> = {
  'القاهرة': [
    { name: 'وحدة مصر الجديدة', address: 'شارع الحرية، مصر الجديدة', phone: '0222222222', whatsappLink: 'https://wa.me/20222222222' },
    { name: 'وحدة المعادي', address: 'شارع النيل، المعادي', phone: '0233333333', whatsappLink: 'https://wa.me/20233333333' },
    { name: 'وحدة مدينة نصر', address: 'شارع مكرم عبيد، مدينة نصر', phone: '0244444444', whatsappLink: 'https://wa.me/20244444444' },
  ],
  'الجيزة': [
    { name: 'وحدة الدقي', address: 'شارع التحرير، الدقي', phone: '0255555555', whatsappLink: 'https://wa.me/20255555555' },
    { name: 'وحدة الهرم', address: 'شارع الهرم، الجيزة', phone: '0266666666', whatsappLink: 'https://wa.me/20266666666' },
    { name: 'وحدة 6 أكتوبر', address: 'المحور المركزي، 6 أكتوبر', phone: '0277777777', whatsappLink: 'https://wa.me/20277777777' },
  ],
  'الإسكندرية': [
    { name: 'وحدة سيدي جابر', address: 'شارع بور سعيد، سيدي جابر', phone: '0388888888', whatsappLink: 'https://wa.me/20388888888' },
    { name: 'وحدة محطة الرمل', address: 'ميدان سعد زغلول، محطة الرمل', phone: '0399999999', whatsappLink: 'https://wa.me/20399999999' },
  ],
}

const defaultSettings = [
  { key: 'site_name', value: 'وحدة الربط المركزي' },
  { key: 'support_phone', value: '0200000000' },
  { key: 'primary_color', value: '#2563eb' },
  { key: 'welcome_message', value: 'مرحباً بكم في منصة وحدة الربط المركزي. يمكنكم من خلال هذه المنصة تقديم طلبات الانضمام ومتابعة حالة طلباتكم.' },
]

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  console.log('👤 Creating admin user...')
  const hashedPassword = await bcrypt.hash('Password123!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@central.local' },
    update: {},
    create: {
      email: 'admin@central.local',
      password: hashedPassword,
      name: 'مدير النظام',
      role: Role.ADMIN,
    },
  })

  // Create governorates
  console.log('🏛️ Creating governorates...')
  for (const name of governoratesData) {
    await prisma.governorate.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  // Create units for governorates that have them
  console.log('🏢 Creating units...')
  for (const [governorateName, units] of Object.entries(unitsData)) {
    const governorate = await prisma.governorate.findUnique({
      where: { name: governorateName },
    })

    if (governorate) {
      for (const unit of units) {
        await prisma.unit.upsert({
          where: {
            name: unit.name,
          },
          update: {},
          create: {
            governorateId: governorate.id,
            name: unit.name,
            address: unit.address,
            phone: unit.phone,
            whatsappLink: unit.whatsappLink,
          },
        })
      }
    }
  }

  // Create default settings
  console.log('⚙️ Creating default settings...')
  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  console.log('✅ Seed completed successfully!')
  console.log('')
  console.log('📝 Admin credentials:')
  console.log('   Email: admin@central.local')
  console.log('   Password: Password123!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
