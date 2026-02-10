// ============================================
// POTS API ROUTE
// ============================================

import { Router } from 'express'
import { z } from 'zod'
import prisma from '../../../lib/prisma.js'
import { authenticate } from '../../middleware/index.js'

const router = Router()

// Validation schemas
const createPotSchema = z.object({
  name: z.string().min(1).max(50),
  target: z.number().positive(),
  theme: z.string(),
})

const potOperationSchema = z.object({
  amount: z.number().positive(),
})

// ============================================
// ROUTES
// ============================================

// Get all pots
router.get('/', authenticate, async (req: any, res) => {
  try {
    const pots = await prisma.pot.findMany({
      where: { user_id: req.userId },
      orderBy: { created_at: 'desc' },
    })

    const potsWithProgress = pots.map((pot) => ({
      ...pot,
      percentage: Math.min(100, (pot.total / pot.target) * 100),
    }))

    res.json({
      success: true,
      data: potsWithProgress,
    })
  } catch (error) {
    console.error('Get pots error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Get single pot
router.get('/:id', authenticate, async (req: any, res) => {
  try {
    const pot = await prisma.pot.findFirst({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    })

    if (!pot) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Pot not found',
        },
      })
    }

    res.json({
      success: true,
      data: {
        ...pot,
        percentage: Math.min(100, (pot.total / pot.target) * 100),
      },
    })
  } catch (error) {
    console.error('Get pot error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Create pot
router.post('/', authenticate, async (req: any, res) => {
  try {
    const data = createPotSchema.parse(req.body)

    const pot = await prisma.pot.create({
      data: {
        ...data,
        user_id: req.userId,
        total: 0,
      },
    })

    res.status(201).json({
      success: true,
      data: pot,
    })
  } catch (error) {
    console.error('Create pot error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Update pot
router.patch('/:id', authenticate, async (req: any, res) => {
  try {
    const existingPot = await prisma.pot.findFirst({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    })

    if (!existingPot) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Pot not found',
        },
      })
    }

    const data = createPotSchema.partial().parse(req.body)

    const pot = await prisma.pot.update({
      where: { id: req.params.id },
      data,
    })

    res.json({
      success: true,
      data: pot,
    })
  } catch (error) {
    console.error('Update pot error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Delete pot
router.delete('/:id', authenticate, async (req: any, res) => {
  try {
    const existingPot = await prisma.pot.findFirst({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    })

    if (!existingPot) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Pot not found',
        },
      })
    }

    // Return money to balance
    await prisma.balance.update({
      where: { user_id: req.userId },
      data: {
        current: { increment: existingPot.total },
      },
    })

    await prisma.pot.delete({
      where: { id: req.params.id },
    })

    res.json({
      success: true,
      data: { id: req.params.id },
    })
  } catch (error) {
    console.error('Delete pot error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Add money to pot
router.post('/:id/add', authenticate, async (req: any, res) => {
  try {
    const { amount } = potOperationSchema.parse(req.body)

    const existingPot = await prisma.pot.findFirst({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    })

    if (!existingPot) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Pot not found',
        },
      })
    }

    // Check if user has enough balance
    const balance = await prisma.balance.findUnique({
      where: { user_id: req.userId },
    })

    if (!balance || balance.current < amount) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_FUNDS',
          message: 'Insufficient balance',
        },
      })
    }

    // Add to pot and deduct from balance
    const [pot] = await prisma.$transaction([
      prisma.pot.update({
        where: { id: req.params.id },
        data: {
          total: { increment: amount },
        },
      }),
      prisma.balance.update({
        where: { user_id: req.userId },
        data: {
          current: { decrement: amount },
        },
      }),
    ])

    res.json({
      success: true,
      data: pot,
    })
  } catch (error) {
    console.error('Add to pot error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Withdraw from pot
router.post('/:id/withdraw', authenticate, async (req: any, res) => {
  try {
    const { amount } = potOperationSchema.parse(req.body)

    const existingPot = await prisma.pot.findFirst({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    })

    if (!existingPot) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Pot not found',
        },
      })
    }

    // Check if pot has enough money
    if (existingPot.total < amount) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_FUNDS',
          message: 'Insufficient funds in pot',
        },
      })
    }

    // Withdraw from pot and add to balance
    const [pot] = await prisma.$transaction([
      prisma.pot.update({
        where: { id: req.params.id },
        data: {
          total: { decrement: amount },
        },
      }),
      prisma.balance.update({
        where: { user_id: req.userId },
        data: {
          current: { increment: amount },
        },
      }),
    ])

    res.json({
      success: true,
      data: pot,
    })
  } catch (error) {
    console.error('Withdraw from pot error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

export { router as potsRouter }
