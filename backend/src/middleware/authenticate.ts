// ============================================
// AUTH MIDDLEWARE
// ============================================

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { JWTPayload } from '../../types/index.js'

export interface AuthRequest extends Request {
  userId?: string
  userEmail?: string
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'No token provided',
        },
      })
    }

    const token = authHeader.substring(7)

    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error('JWT_ACCESS_SECRET not configured')
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as JWTPayload

    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid token type',
        },
      })
    }

    req.userId = decoded.userId
    req.userEmail = decoded.email

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Invalid or expired token',
      },
    })
  }
}
