// ============================================
// BUDGETS API ROUTE
// ============================================

import { Router } from 'express'
import { z } from 'zod'
import prisma from '../../../lib/prisma.js'
import { authenticate } from '../../middleware/index.js'

const router = Router()

// Validation schemas
const createBudgetSchema = z.object({
  category: z.enum(['Entertainment', 'Bills', 'Groceries', 'DiningOut', 'Transportation', 'PersonalCare', 'Education', 'Lifestyle', 'Shopping', 'General']),
  maximum: z.number().positive(),
  theme: z.string(),
})

// ============================================
// ROUTES
// ============================================

// Get all budgets
router.get('/', authenticate, async (req: any, res) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { user_id: req.userId },
      orderBy: { created_at: 'desc' },
    })

    // Calculate spent for each budget (current month)
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await prisma.transaction.aggregate({
          where: {
            user_id: req.userId,
            category: budget.category,
            date: { gte: currentMonth },
            amount: { lt: 0 }, // Only expenses count toward budget
          },
          _sum: { amount: true },
        })

        const spentAmount = Math.abs(spent._sum.amount || 0)

        return {
          ...budget,
          spent: spentAmount,
          remaining: budget.maximum - spentAmount,
          percentage: Math.min(100, (spentAmount / budget.maximum) * 100),
        }
      })
    )

    res.json({
      success: true,
      data: budgetsWithSpending,
    })
  } catch (error) {
    console.error('Get budgets error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Get latest transactions for a budget category
router.get('/:category/latest', authenticate, async (req: any, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: req.userId,
        category: req.params.category as any,
      },
      orderBy: { date: 'desc' },
      take: 3,
    })

    res.json({
      success: true,
      data: transactions,
    })
  } catch (error) {
    console.error('Get budget transactions error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Create budget
router.post('/', authenticate, async (req: any, res) => {
  try {
    const data = createBudgetSchema.parse(req.body)

    // Check if budget for this category already exists
    const existing = await prisma.budget.findUnique({
      where: { category: data.category },
    })

    if (existing) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'Budget for this category already exists',
        },
      })
    }

    const budget = await prisma.budget.create({
      data: {
        ...data,
        user_id: req.userId,
      },
    })

    res.status(201).json({
      success: true,
      data: budget,
    })
  } catch (error) {
    console.error('Create budget error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Update budget
router.patch('/:id', authenticate, async (req: any, res) => {
  try {
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    })

    if (!existingBudget) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Budget not found',
        },
      })
    }

    const data = createBudgetSchema.partial().parse(req.body)

    // Check if changing category and new category already has a budget
    if (data.category && data.category !== existingBudget.category) {
      const conflict = await prisma.budget.findUnique({
        where: { category: data.category },
      })

      if (conflict) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'Budget for this category already exists',
          },
        })
      }
    }

    const budget = await prisma.budget.update({
      where: { id: req.params.id },
      data,
    })

    res.json({
      success: true,
      data: budget,
    })
  } catch (error) {
    console.error('Update budget error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Delete budget
router.delete('/:id', authenticate, async (req: any, res) => {
  try {
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    })

    if (!existingBudget) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Budget not found',
        },
      })
    }

    await prisma.budget.delete({
      where: { id: req.params.id },
    })

    res.json({
      success: true,
      data: { id: req.params.id },
    })
  } catch (error) {
    console.error('Delete budget error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

export { router as budgetsRouter }
