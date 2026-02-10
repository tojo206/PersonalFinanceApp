// ============================================
// BALANCE CARDS COMPONENT
// ============================================

'use client'

import { Card } from '@/components/common'
import { formatCurrency, cn } from '@/lib/utils'

interface BalanceCardsProps {
  balance: {
    current: number
    income: number
    expenses: number
  }
}

export function BalanceCards({ balance }: BalanceCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Current Balance Card */}
      <Card variant="dark" padding="lg" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <p className="text-secondary text-sm mb-1">Current Balance</p>
        <p className="text-card-value text-white">{formatCurrency(balance.current)}</p>
      </Card>

      {/* Income Card */}
      <Card padding="lg">
        <p className="text-secondary text-sm mb-1">Income</p>
        <p className={cn('text-card-value', balance.income >= 0 ? 'text-accent' : 'text-danger')}>
          {balance.income >= 0 ? '+' : ''}{formatCurrency(balance.income)}
        </p>
      </Card>

      {/* Expenses Card */}
      <Card padding="lg">
        <p className="text-secondary text-sm mb-1">Expenses</p>
        <p className="text-card-value text-danger">
          {formatCurrency(balance.expenses)}
        </p>
      </Card>
    </div>
  )
}
