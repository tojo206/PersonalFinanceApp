// ============================================
// BUDGET CARD COMPONENT
// ============================================

'use client'

import Link from 'next/link'
import { Card } from '@/components/common'
import { formatCurrency, calculatePercentage, cn } from '@/lib/utils'
import type { Category } from '@/types'

interface BudgetCardProps {
  id: string
  category: Category
  maximum: number
  spent: number
  theme: string
  latestTransactions: Array<{
    id: string
    name: string
    amount: number
    date: Date
  }>
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
}

const CATEGORY_LABELS: Record<Category, string> = {
  Entertainment: 'Entertainment',
  Bills: 'Bills',
  Groceries: 'Groceries',
  DiningOut: 'Dining Out',
  Transportation: 'Transportation',
  PersonalCare: 'Personal Care',
  Education: 'Education',
  Lifestyle: 'Lifestyle',
  Shopping: 'Shopping',
  General: 'General',
}

export function BudgetCard({
  id,
  category,
  maximum,
  spent,
  theme,
  latestTransactions,
  onDelete,
  onEdit,
}: BudgetCardProps) {
  const percentage = calculatePercentage(spent, maximum)
  const remaining = maximum - spent
  const isOverBudget = spent > maximum

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: theme }}
          />
          <div>
            <h3 className="text-body font-semibold text-primary">
              {CATEGORY_LABELS[category]}
            </h3>
            <p className="text-small text-secondary">
              {formatCurrency(spent)} of {formatCurrency(maximum)}
            </p>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit?.(id)}
            className="p-1.5 text-secondary hover:text-primary hover:bg-sidebar-active rounded transition-colors"
            aria-label="Edit budget"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete?.(id)}
            className="p-1.5 text-secondary hover:text-danger hover:bg-danger/10 rounded transition-colors"
            aria-label="Delete budget"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full h-2 bg-sidebar-active rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              isOverBudget ? 'bg-danger' : ''
            )}
            style={{
              backgroundColor: isOverBudget ? undefined : theme,
              width: `${Math.min(percentage, 100)}%`,
            }}
          />
        </div>
        <p className={cn('text-small mt-2', isOverBudget ? 'text-danger' : 'text-secondary')}>
          {isOverBudget
            ? `${formatCurrency(Math.abs(remaining))} over budget`
            : `${formatCurrency(remaining)} remaining`}
        </p>
      </div>

      {/* Latest Transactions */}
      {latestTransactions.length > 0 && (
        <div className="mb-4">
          <p className="text-small text-secondary mb-2">Latest Spending</p>
          <div className="space-y-2">
            {latestTransactions.slice(0, 3).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between text-small"
              >
                <span className="text-primary">{transaction.name}</span>
                <span className={cn(transaction.amount >= 0 ? 'text-accent' : 'text-danger')}>
                  {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* See All Link */}
      <Link
        href={`/transactions?category=${category}`}
        className="text-small text-accent hover:text-accent-hover font-medium inline-flex items-center gap-1"
      >
        See All
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </Card>
  )
}
