// ============================================
// TRANSACTIONS API ROUTE
// ============================================

import { Router } from 'express'
import { z } from 'zod'
import prisma from '../../../lib'
import { authenticate } from '../../middleware'
import type { Transaction, TransactionsQuery } from '../../../types'

const router = Router()

// Validation schemas
const createTransactionSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(1),
  category: z.enum(['Entertainment', 'Bills', 'Groceries', 'DiningOut', 'Transportation', 'PersonalCare', 'Education', 'Lifestyle', 'Shopping', 'General']),
  date: z.string().or(z.date()),
  amount: z.number(),
  recurring: z.boolean().optional(),
})

// ============================================
// ROUTES
// ============================================

// Get all transactions (with pagination, search, sort, filter)
router.get('/', authenticate, async (req: any, res) => {
  try {
    const {
      page = '1',
      limit = '10',
      search,
      sort = 'latest',
      category,
    } = req.query as TransactionsQuery

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where: any = {
      user_id: req.userId,
    }

    // Search filter
    if (search) {
      where.name = {
        contains: search as string,
      }
    }

    // Category filter
    if (category && category !== 'all') {
      where.category = category
    }

    // Build order by
    let orderBy: any = {}
    switch (sort) {
      case 'latest':
        orderBy = { date: 'desc' }
        break
      case 'oldest':
        orderBy = { date: 'asc' }
        break
      case 'atoz':
        orderBy = { name: 'asc' }
        break
      case 'ztoa':
        orderBy = { name: 'desc' }
        break
      case 'highest':
        orderBy = { amount: 'desc' }
        break
      case 'lowest':
        orderBy = { amount: 'asc' }
        break
      default:
        orderBy = { date: 'desc' }
    }

    // Get total count
    const total = await prisma.transaction.count({ where })

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
    })

    const totalPages = Math.ceil(total / limitNum)

    res.json({
      success: true,
      data: {
        items: transactions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
        },
      },
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Get single transaction
router.get('/:id', authenticate, async (req: any, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    })

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Transaction not found',
        },
      })
    }

    res.json({
      success: true,
      data: transaction,
    })
  } catch (error) {
    console.error('Get transaction error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Create transaction
router.post('/', authenticate, async (req: any, res) => {
  try {
    const data = createTransactionSchema.parse(req.body)

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        user_id: req.userId,
        date: new Date(data.date),
      },
    })

    // Update balance
    await prisma.balance.update({
      where: { user_id: req.userId },
      data: {
        current: { increment: transaction.amount },
        ...(transaction.amount > 0
          ? { income: { increment: transaction.amount } }
          : { expenses: { increment: Math.abs(transaction.amount) } }
        ),
      },
    })

    res.status(201).json({
      success: true,
      data: transaction,
    })
  } catch (error) {
    console.error('Create transaction error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Update transaction
router.patch('/:id', authenticate, async (req: any, res) => {
  try {
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    })

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Transaction not found',
        },
      })
    }

    const data = createTransactionSchema.partial().parse(req.body)

    // Update balance if amount changed
    if (data.amount !== undefined && data.amount !== existingTransaction.amount) {
      const amountDiff = data.amount - existingTransaction.amount

      await prisma.balance.update({
        where: { user_id: req.userId },
        data: {
          current: { increment: amountDiff },
          // Update income/expenses based on sign change
          ...((existingTransaction.amount >= 0 && data.amount < 0) ||
            (existingTransaction.amount < 0 && data.amount >= 0)
            ? {
              ...(existingTransaction.amount >= 0 ? { income: { decrement: existingTransaction.amount } } : {}),
              ...(existingTransaction.amount < 0 ? { expenses: { decrement: Math.abs(existingTransaction.amount) } } : {}),
            }
            : {}),
          ...(data.amount > 0 ? { income: { increment: data.amount } } : {}),
          ...(data.amount < 0 ? { expenses: { increment: Math.abs(data.amount) } } : {}),
        },
      })
    }

    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data: {
        ...data,
        date: data.date !== undefined ? new Date(data.date) : undefined,
      },
    })

    res.json({
      success: true,
      data: transaction,
    })
  } catch (error) {
    console.error('Update transaction error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Delete transaction
router.delete('/:id', authenticate, async (req: any, res) => {
  try {
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    })

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Transaction not found',
        },
      })
    }

    // Update balance
    await prisma.balance.update({
      where: { user_id: req.userId },
      data: {
        current: { decrement: existingTransaction.amount },
        ...(existingTransaction.amount > 0
          ? { income: { decrement: existingTransaction.amount } }
          : { expenses: { decrement: Math.abs(existingTransaction.amount) } }
        ),
      },
    })

    await prisma.transaction.delete({
      where: { id: req.params.id },
    })

    res.json({
      success: true,
      data: { id: req.params.id },
    })
  } catch (error) {
    console.error('Delete transaction error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

export { router as transactionsRouter }
