// ============================================
// BACKEND SERVER - MAIN ENTRY POINT
// ============================================

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { authRouter } from './api/auth.js'
import { balanceRouter } from './api/balance.js'
import { transactionsRouter } from './api/transactions.js'
import { budgetsRouter } from './api/budgets.js'
import { potsRouter } from './api/pots.js'
import { billsRouter } from './api/bills.js'
import { errorHandler } from './middleware/errorHandler.js'

// Load environment variables
dotenv.config({ path: '../.env' })

const app = express()
const PORT = process.env.API_PORT || 3001

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet())

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } },
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ============================================
// API ROUTES
// ============================================

app.use('/api/auth', authRouter)
app.use('/api/balance', balanceRouter)
app.use('/api/transactions', transactionsRouter)
app.use('/api/budgets', budgetsRouter)
app.use('/api/pots', potsRouter)
app.use('/api/bills', billsRouter)

// ============================================
// 404 HANDLER
// ============================================

app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'API endpoint not found',
    },
  })
})

// ============================================
// ERROR HANDLER
// ============================================

app.use(errorHandler)

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`)
  console.log(`📊 API: http://localhost:${PORT}/api`)
  console.log(`❤️  Health: http://localhost:${PORT}/health`)
})

export default app
