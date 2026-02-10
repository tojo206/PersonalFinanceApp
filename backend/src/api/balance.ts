// ============================================
// BALANCE API ROUTE
// ============================================

import { Router } from 'express'
import { z } from 'zod'
import prisma from '../../../lib/prisma.js'
import { authenticate } from '../../middleware/index.js'

const router = Router()
// Validation schemas
const updateBalanceSchema = z.object({
  current: z.number().optional(),
  income: z.number().optional(),
  expenses: z.number().optional(),
})

// ============================================
// ROUTES
// ============================================

// Get user balance
router.get('/', authenticate, async (req: any, res) => {
  try {
    let balance = await prisma.balance.findUnique({
      where: { user_id: req.userId },
    })

    // Create balance if it doesn't exist
    if (!balance) {
      balance = await prisma.balance.create({
        data: {
          user_id: req.userId,
          current: 0,
          income: 0,
          expenses: 0,
        },
      })
    }

    res.json({
      success: true,
      data: balance,
    })
  } catch (error) {
    console.error('Get balance error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Update balance (internal use)
router.patch('/', authenticate, async (req: any, res) => {
  try {
    const data = updateBalanceSchema.parse(req.body)

    const balance = await prisma.balance.update({
      where: { user_id: req.userId },
      data,
    })

    res.json({
      success: true,
      data: balance,
    })
  } catch (error) {
    console.error('Update balance error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

export { router as balanceRouter }
