import { PrismaClient } from '@prisma/client'
import chalk from 'chalk'

const TEST_USERS = [
  {
    name: 'Super Admin',
    email: 'superadmin@example.com',
    role: 'SUPER_ADMIN',
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  },
  {
    name: 'Manager User',
    email: 'manager@example.com',
    role: 'MANAGER',
  },
  {
    name: 'Test User',
    email: 'user@example.com',
    role: 'USER',
  },
] as const

export async function seedUsers(prisma: PrismaClient) {
  console.log('\n🌱 Seeding users...')

  for (const userData of TEST_USERS) {
    const role = await prisma.role.findUnique({
      where: { name: userData.role },
      include: { permissions: true }
    })

    if (!role) {
      console.log(chalk.red(`❌ Role ${userData.role} not found, skipping user ${userData.email}`))
      continue
    }

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        roleId: role.id
      },
      create: {
        name: userData.name,
        email: userData.email,
        roleId: role.id
      },
      include: {
        role: {
          include: { permissions: true }
        }
      }
    })
    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        role: {
          include: { permissions: true }
        }
      }
    })
    console.log(chalk.green(`✅ Created user:`),userWithRole)
    console.log(chalk.green(`✅ Created user:`),userWithRole?.role?.permissions)
    console.log(chalk.green(`✅ Created user: ${user.name}`))
    console.log(chalk.blue(`   Role: ${user.role.name}`))
    console.log(chalk.yellow('   Permissions:'))
    user.role.permissions.forEach(permission => {
      console.log(chalk.yellow(`   - ${permission.name}`))
    })
    console.log('\n')
  }

  const totalUsers = await prisma.user.count()
  console.log(chalk.green(`✨ Successfully seeded ${totalUsers} users\n`))
}