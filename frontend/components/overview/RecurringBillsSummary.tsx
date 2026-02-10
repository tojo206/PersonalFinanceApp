// ============================================
// RECURRING BILLS SUMMARY COMPONENT
// ============================================

'use client'

import Link from 'next/link'
import { Card } from '@/components/common'
import { formatCurrency } from '@/lib/utils'

interface BillsSummary {
  paid: number
  totalUpcoming: number
  dueSoon: number
}

interface RecurringBillsSummaryProps {
  summary: BillsSummary
}

export function RecurringBillsSummary({ summary }: RecurringBillsSummaryProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-section-title text-primary">Recurring Bills</h2>
        <Link
          href="/recurring-bills"
          className="text-small text-secondary hover:text-accent transition-colors"
        >
          See Details
        </Link>
      </div>

      {/* Summary Items */}
      <div className="space-y-4">
        {/* Paid Bills */}
        <div className="flex items-center justify-between">
          <p className="text-small text-secondary">Paid Bills</p>
          <p className="text-body font-semibold text-primary">
            {formatCurrency(summary.paid)}
          </p>
        </div>

        {/* Total Upcoming */}
        <div className="flex items-center justify-between">
          <p className="text-small text-secondary">Total Upcoming</p>
          <p className="text-body font-semibold text-primary">
            {formatCurrency(summary.totalUpcoming)}
          </p>
        </div>

        {/* Due Soon */}
        {summary.dueSoon > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-small text-secondary">Due Soon</p>
            <p className="text-body font-semibold text-danger">
              {formatCurrency(summary.dueSoon)}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
