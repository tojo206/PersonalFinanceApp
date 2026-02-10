// ============================================
// AUTH SERVICE
// ============================================

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../lib/prisma.js'
import type { User, LoginInput, RegisterInput, AuthResponse, JWTPayload } from '../../types/index.js'

const SALT_ROUNDS = 12

export class AuthService {
  // Generate access token
  private generateAccessToken(userId: string, email: string): string {
    const payload: JWTPayload = {
      userId,
      email,
      type: 'access',
    }

    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'default-secret', {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    } as jwt.SignOptions)
  }

  // Generate refresh token
  private generateRefreshToken(userId: string, email: string): string {
    const payload: JWTPayload = {
      userId,
      email,
      type: 'refresh',
    }

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'default-secret', {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    } as jwt.SignOptions)
  }

  // Register new user
  async register(data: RegisterInput): Promise<AuthResponse> {
    const { email, password, name } = data

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'User already exists',
        },
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // Create user with balance
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        balance: {
          create: {
            current: 0,
            income: 0,
            expenses: 0,
          },
        },
      },
      include: {
        balance: true,
      },
    })

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.email)
    const refreshToken = this.generateRefreshToken(user.id, user.email)

    // Store refresh token in session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })

    return {
      success: true,
      data: {
        user: user as any,
        accessToken,
        refreshToken,
      },
    }
  }

  // Login user
  async login(data: LoginInput): Promise<AuthResponse> {
    const { email, password } = data

    // Find user with password field included
    const user = await prisma.user.findUnique({
      where: { email },
      include: { balance: true },
    }) as any

    if (!user) {
      return {
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid email or password',
        },
      }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return {
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid email or password',
        },
      }
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.email)
    const refreshToken = this.generateRefreshToken(user.id, user.email)

    // Store refresh token in session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return {
      success: true,
      data: {
        user: user as any,
        accessToken,
        refreshToken,
      },
    }
  }

  // Verify token
  verifyToken(token: string): JWTPayload | null {
    try {
      const secret = process.env.JWT_ACCESS_SECRET || 'default-secret'
      return jwt.verify(token, secret) as JWTPayload
    } catch {
      return null
    }
  }

  // Refresh token
  async refresh(refreshToken: string): Promise<AuthResponse> {
    // Find session with user
    const session = await prisma.session.findUnique({
      where: { token: refreshToken },
    }) as any

    if (!session || session.expiresAt < new Date()) {
      // Delete expired session
      if (session) {
        await prisma.session.delete({ where: { id: session.id } })
      }

      return {
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid or expired refresh token',
        },
      }
    }

    // Get user with balance
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { balance: true },
    }) as any

    // Generate new tokens
    const accessToken = this.generateAccessToken(user.id, user.email)
    const newRefreshToken = this.generateRefreshToken(user.id, user.email)

    // Update session
    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return {
      success: true,
      data: {
        user,
        accessToken,
        refreshToken: newRefreshToken,
      },
    }
  }

  // Logout
  async logout(refreshToken: string): Promise<{ success: boolean }> {
    await prisma.session.deleteMany({
      where: { token: refreshToken },
    })

    return { success: true }
  }
}
