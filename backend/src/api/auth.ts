// ============================================
// AUTH API ROUTE
// ============================================

import { Router } from 'express'
import { z } from 'zod'
import prisma from '../../../lib/prisma.js'
import { AuthService } from '../../services/auth.service.js'
import { authenticate } from '../../middleware/index.js'

const router = Router()
const authService = new AuthService()

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// ============================================
// ROUTES
// ============================================

// Register
router.post('/register', async (req, res) => {
  try {
    const result = await authService.register(req.body)

    if (!result.success) {
      return res.status(400).json(result)
    }

    res.status(201).json(result)
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during registration',
      },
    })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const result = await authService.login(req.body)

    if (!result.success) {
      return res.status(401).json(result)
    }

    res.json(result)
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during login',
      },
    })
  }
})

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Refresh token is required',
        },
      })
    }

    await authService.logout(refreshToken)

    res.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during logout',
      },
    })
  }
})

// Get current user
router.get('/me', authenticate, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { balance: true },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred',
      },
    })
  }
})

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Refresh token is required',
        },
      })
    }

    const result = await authService.refresh(refreshToken)

    if (!result.success) {
      return res.status(401).json(result)
    }

    res.json(result)
  } catch (error) {
    console.error('Refresh error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during token refresh',
      },
    })
  }
})

export { router as authRouter }
