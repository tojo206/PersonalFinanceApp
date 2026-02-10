// ============================================
// RECURRING BILL CARD COMPONENT
// ============================================

'use client'

import { Card } from '@/components/common'
import { formatCurrency, cn, daysUntilDue } from '@/lib/utils'
import type { Category } from '@/types'

interface BillCardProps {
  id: string
  vendor_name: string
  amount: number
  due_day: number
  category: Category
  theme: string
  isPaid?: boolean
  daysUntilDue?: number
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

export function BillCard({
  id,
  vendor_name,
  amount,
  due_day,
  category,
  theme,
  isPaid = false,
  daysUntilDue = 0,
}: BillCardProps) {
  return (
    <Card className="h-full">
      <div className="flex items-center gap-4">
        {/* Theme Indicator */}
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: theme + '20' }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: theme }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-body font-semibold text-primary truncate">
            {vendor_name}
          </h3>
          <p className="text-small text-secondary">
            {CATEGORY_LABELS[category]} • Due on the {due_day}
            {isPaid && (
              <span className="ml-2 text-accent">• Paid</span>
            )}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-body font-semibold text-primary">
            {formatCurrency(amount)}
          </p>
          {!isPaid && (
            <p className={cn(
              'text-small',
              daysUntilDue <= 3 ? 'text-danger' : 'text-secondary'
            )}>
              {daysUntilDue === 0
                ? 'Due today'
                : daysUntilDue < 0
                  ? 'Overdue'
                  : `in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
