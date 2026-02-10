// ============================================
// BUDGETS SUMMARY COMPONENT
// ============================================

'use client'

import Link from 'next/link'
import { Card } from '@/components/common'
import { formatCurrency, calculatePercentage, cn } from '@/lib/utils'
import type { Category } from '@/types'

interface Budget {
  id: string
  category: Category
  maximum: number
  theme: string
  spent: number
}

interface BudgetsSummaryProps {
  budgets: Budget[]
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

export function BudgetsSummary({ budgets }: BudgetsSummaryProps) {
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalMaximum = budgets.reduce((sum, b) => sum + b.maximum, 0)
  const overallPercentage = calculatePercentage(totalSpent, totalMaximum)

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-section-title text-primary">Budgets</h2>
        <Link
          href="/budgets"
          className="text-small text-secondary hover:text-accent transition-colors"
        >
          See Details
        </Link>
      </div>

      {/* Donut Chart Representation */}
      <div className="flex items-center gap-6 mb-6">
        {/* CSS-based Donut Chart */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background Circle */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3"
            />
            {/* Progress Circle */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray={`${overallPercentage}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-small text-secondary">
            {formatCurrency(totalSpent)} of {formatCurrency(totalMaximum)} limit
          </p>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-2">
        {budgets.slice(0, 4).map((budget) => {
          const percentage = calculatePercentage(budget.spent, budget.maximum)
          const isOverBudget = budget.spent > budget.maximum

          return (
            <div key={budget.id} className="flex items-center justify-between text-small">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: budget.theme }}
                />
                <span className="text-secondary">{CATEGORY_LABELS[budget.category]}</span>
              </div>
              <span className={cn(isOverBudget ? 'text-danger' : 'text-secondary')}>
                {formatCurrency(budget.spent)}
              </span>
            </div>
          )
        })}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-8">
          <p className="text-secondary text-small">No budgets yet. Create your first budget!</p>
        </div>
      )}
    </Card>
  )
}
