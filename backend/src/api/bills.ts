// ============================================
// RECURRING BILLS API ROUTE
// ============================================

import { Router } from 'express'
import { z } from 'zod'
import prisma from '../../../lib/prisma.js'
import { authenticate } from '../../middleware'

const router = Router()

// Validation schemas
const createBillSchema = z.object({
  vendor_name: z.string().min(1).max(100),
  amount: z.number().positive(),
  due_day: z.number().int().min(1).max(31),
  category: z.enum(['Entertainment', 'Bills', 'Groceries', 'DiningOut', 'Transportation', 'PersonalCare', 'Education', 'Lifestyle', 'Shopping', 'General']),
  theme: z.string(),
})

// ============================================
// ROUTES
// ============================================

// Get all bills
router.get('/', authenticate, async (req: any, res) => {
  try {
    const { search, sort = 'latest' } = req.query

    // Build where clause
    const where: any = {
      user_id: req.userId,
    }

    // Search filter
    if (search) {
      where.vendor_name = {
        contains: search as string,
      }
    }
    // Ensure unique vendors only
    const bills = await prisma.recurringBill.findMany({
      where,
      orderBy: {
        due_day: sort === 'latest' ? 'asc' : sort === 'oldest' ? 'desc' : undefined,
      },
    })

    // Calculate payment status and days until due
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const billsWithStatus = await Promise.all(
      bills.map(async (bill) => {
        // Check if this bill has been paid this month
        const paidTransaction = await prisma.transaction.findFirst({
          where: {
            user_id: req.userId,
            name: bill.vendor_name,
            amount: -bill.amount,
            date: {
              gte: new Date(currentYear, currentMonth, 1),
              lte: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59),
            },
          },
        })

        const isPaid = !!paidTransaction

        // Calculate days until due
        let daysUntilDue = bill.due_day - now.getDate()
        if (daysUntilDue < 0) {
          // Due date has passed this month, next due is next month
          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
          daysUntilDue = daysInMonth - now.getDate() + bill.due_day
        }

        return {
          ...bill,
          isPaid,
          daysUntilDue,
        }
      })
    )

    res.json({
      success: true,
      data: billsWithStatus,
    })
  } catch (error) {
    console.error('Get bills error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Get bills summary
router.get('/summary', authenticate, async (req: any, res) => {
  try {
    const bills = await prisma.recurringBill.findMany({
      where: { user_id: req.userId },
    })

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const summary = {
      paid: 0,
      totalUpcoming: 0,
      dueSoon: 0,
      paidBills: [] as any[],
      upcomingBills: [] as any[],
      dueSoonBills: [] as any[],
    }

    await Promise.all(
      bills.map(async (bill) => {
        // Check if paid this month
        const paidTransaction = await prisma.transaction.findFirst({
          where: {
            user_id: req.userId,
            name: bill.vendor_name,
            amount: -bill.amount,
            date: {
              gte: new Date(currentYear, currentMonth, 1),
              lte: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59),
            },
          },
        })

        const isPaid = !!paidTransaction

        // Calculate days until due
        let daysUntilDue = bill.due_day - now.getDate()
        if (daysUntilDue < 0) {
          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
          daysUntilDue = daysInMonth - now.getDate() + bill.due_day
        }

        const billWithStatus = {
          ...bill,
          isPaid,
          daysUntilDue,
        }

        if (isPaid) {
          summary.paid += bill.amount
          summary.paidBills.push(billWithStatus)
        } else {
          summary.totalUpcoming += bill.amount
          summary.upcomingBills.push(billWithStatus)

          if (daysUntilDue <= 5) {
            summary.dueSoon += bill.amount
            summary.dueSoonBills.push(billWithStatus)
          }
        }
      })
    )

    res.json({
      success: true,
      data: summary,
    })
  } catch (error) {
    console.error('Get bills summary error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Get single bill
router.get('/:id', authenticate, async (req: any, res) => {
  try {
    const bill = await prisma.recurringBill.findFirst({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    })

    if (!bill) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Bill not found',
        },
      })
    }

    res.json({
      success: true,
      data: bill,
    })
  } catch (error) {
    console.error('Get bill error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Create bill
router.post('/', authenticate, async (req: any, res) => {
  try {
    const data = createBillSchema.parse(req.body)

    const bill = await prisma.recurringBill.create({
      data: {
        ...data,
        user_id: req.userId,
      },
    })

    res.status(201).json({
      success: true,
      data: bill,
    })
  } catch (error) {
    console.error('Create bill error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Update bill
router.patch('/:id', authenticate, async (req: any, res) => {
  try {
    const existingBill = await prisma.recurringBill.findFirst({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    })

    if (!existingBill) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Bill not found',
        },
      })
    }

    const data = createBillSchema.partial().parse(req.body)

    const bill = await prisma.recurringBill.update({
      where: { id: req.params.id },
      data,
    })

    res.json({
      success: true,
      data: bill,
    })
  } catch (error) {
    console.error('Update bill error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Delete bill
router.delete('/:id', authenticate, async (req: any, res) => {
  try {
    const existingBill = await prisma.recurringBill.findFirst({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    })

    if (!existingBill) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Bill not found',
        },
      })
    }

    await prisma.recurringBill.delete({
      where: { id: req.params.id },
    })

    res.json({
      success: true,
      data: { id: req.params.id },
    })
  } catch (error) {
    console.error('Delete bill error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

export { router as billsRouter }
