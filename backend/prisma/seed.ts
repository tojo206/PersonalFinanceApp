// ============================================
// DATABASE SEED FILE
// ============================================

import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma.js'

async function main() {
  console.log('🌱 Starting database seed...')

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
      balance: {
        create: {
          current: 4836.00,
          income: 3814.25,
          expenses: 1700.50,
        },
      },
    },
  })

  console.log(`✅ Created user: ${user.email}`)

  // Create sample transactions
  const sampleTransactions = [
    {
      user_id: user.id,
      avatar: '/assets/images/avatars/emma-richardson.jpg',
      name: 'Emma Richardson',
      category: 'General' as const,
      date: new Date('2024-08-19T14:23:11Z'),
      amount: 75.50,
      recurring: false,
    },
    {
      user_id: user.id,
      avatar: '/assets/images/avatars/savory-bites-bistro.jpg',
      name: 'Savory Bites Bistro',
      category: 'DiningOut' as const,
      date: new Date('2024-08-19T20:23:11Z'),
      amount: -55.50,
      recurring: false,
    },
    {
      user_id: user.id,
      avatar: '/assets/images/avatars/daniel-carter.jpg',
      name: 'Daniel Carter',
      category: 'General' as const,
      date: new Date('2024-08-18T09:45:32Z'),
      amount: -42.30,
      recurring: false,
    },
    {
      user_id: user.id,
      avatar: '/assets/images/avatars/pixel-playground.jpg',
      name: 'Pixel Playground',
      category: 'Entertainment' as const,
      date: new Date('2024-08-11T18:45:38Z'),
      amount: -10.00,
      recurring: true,
    },
    {
      user_id: user.id,
      avatar: '/assets/images/avatars/elevate-education.jpg',
      name: 'Elevate Education',
      category: 'Education' as const,
      date: new Date('2024-08-04T11:15:22Z'),
      amount: -50.00,
      recurring: true,
    },
    {
      user_id: user.id,
      avatar: '/assets/images/avatars/spark-electric-solutions.jpg',
      name: 'Spark Electric Solutions',
      category: 'Bills' as const,
      date: new Date('2024-08-02T09:25:11Z'),
      amount: -100.00,
      recurring: true,
    },
  ]

  for (const transaction of sampleTransactions) {
    await prisma.transaction.create({ data: transaction })
  }

  console.log(`✅ Created ${sampleTransactions.length} sample transactions`)

  // Create sample budgets
  const sampleBudgets = [
    {
      user_id: user.id,
      category: 'Entertainment' as const,
      maximum: 50.00,
      theme: '#277C78',
    },
    {
      user_id: user.id,
      category: 'Bills' as const,
      maximum: 750.00,
      theme: '#82C9D7',
    },
    {
      user_id: user.id,
      category: 'DiningOut' as const,
      maximum: 75.00,
      theme: '#F2CDAC',
    },
    {
      user_id: user.id,
      category: 'PersonalCare' as const,
      maximum: 100.00,
      theme: '#626070',
    },
  ]

  for (const budget of sampleBudgets) {
    await prisma.budget.create({ data: budget })
  }

  console.log(`✅ Created ${sampleBudgets.length} sample budgets`)

  // Create sample pots
  const samplePots = [
    {
      user_id: user.id,
      name: 'Savings',
      target: 2000.00,
      total: 159.00,
      theme: '#277C78',
    },
    {
      user_id: user.id,
      name: 'Concert Ticket',
      target: 150.00,
      total: 110.00,
      theme: '#626070',
    },
    {
      user_id: user.id,
      name: 'Gift',
      target: 150.00,
      total: 110.00,
      theme: '#82C9D7',
    },
    {
      user_id: user.id,
      name: 'New Laptop',
      target: 1000.00,
      total: 10.00,
      theme: '#F2CDAC',
    },
  ]

  for (const pot of samplePots) {
    await prisma.pot.create({ data: pot })
  }

  console.log(`✅ Created ${samplePots.length} sample pots`)

  // Create sample recurring bills
  const sampleBills = [
    {
      user_id: user.id,
      vendor_name: 'Pixel Playground',
      amount: 10.00,
      due_day: 11,
      category: 'Entertainment' as const,
      theme: '#277C78',
    },
    {
      user_id: user.id,
      vendor_name: 'Elevate Education',
      amount: 50.00,
      due_day: 4,
      category: 'Education' as const,
      theme: '#82C9D7',
    },
    {
      user_id: user.id,
      vendor_name: 'Serenity Spa & Wellness',
      amount: 30.00,
      due_day: 3,
      category: 'PersonalCare' as const,
      theme: '#626070',
    },
    {
      user_id: user.id,
      vendor_name: 'Spark Electric Solutions',
      amount: 100.00,
      due_day: 2,
      category: 'Bills' as const,
      theme: '#F2CDAC',
    },
  ]

  for (const bill of sampleBills) {
    await prisma.recurringBill.create({ data: bill })
  }

  console.log(`✅ Created ${sampleBills.length} sample recurring bills`)

  console.log('🎉 Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
