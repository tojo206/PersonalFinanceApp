// ============================================
// UTILITY FUNCTIONS
// ============================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatDayMonth(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatAmount(amount: number): string {
  const formatted = Math.abs(amount).toFixed(2)
  const sign = amount < 0 ? '-' : amount > 0 ? '+' : ''
  return `${sign}$${formatted}`
}

export function formatTransactionAmount(amount: number): string {
  const absAmount = Math.abs(amount)
  const formatted = absAmount.toFixed(2)

  if (amount > 0) {
    return `+$${formatted}`
  } else if (amount < 0) {
    return `-$${formatted}`
  } else {
    return `$${formatted}`
  }
}

export function calculatePercentage(spent: number, maximum: number): number {
  if (maximum === 0) return 0
  return Math.min(100, Math.max(0, (spent / maximum) * 100))
}

export function calculatePotProgress(total: number, target: number): number {
  if (target === 0) return 0
  return Math.min(100, Math.max(0, (total / target) * 100))
}

export function daysUntilDue(dueDay: number, isPaid: boolean): number {
  if (isPaid) {
    // If paid, return a negative number to indicate it's done
    return -1
  }

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Create date for the due day in current month
  const dueDate = new Date(currentYear, currentMonth, dueDay)

  // If the due day has passed this month, it's due next month
  if (dueDate < today && dueDate.getDate() !== today.getDate()) {
    dueDate.setMonth(dueDate.getMonth() + 1)
  }

  // Calculate days difference
  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}
