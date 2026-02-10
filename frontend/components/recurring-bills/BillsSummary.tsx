// ============================================
// BILLS SUMMARY COMPONENT
// ============================================

'use client'

import { Card } from '@/components/common'
import { formatCurrency, cn } from '@/lib/utils'

interface BillsSummaryProps {
  paidBills: number
  totalUpcoming: number
  dueSoon: number
}

export function BillsSummary({ paidBills, totalUpcoming, dueSoon }: BillsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Paid Bills */}
      <Card padding="lg">
        <p className="text-small text-secondary mb-1">Paid Bills</p>
        <p className="text-card-value text-primary">{formatCurrency(paidBills)}</p>
      </Card>

      {/* Total Upcoming */}
      <Card padding="lg">
        <p className="text-small text-secondary mb-1">Total Upcoming</p>
        <p className="text-card-value text-primary">{formatCurrency(totalUpcoming)}</p>
      </Card>

      {/* Due Soon */}
      <Card padding="lg">
        <p className="text-small text-secondary mb-1">Due Soon</p>
        <p className={cn('text-card-value', dueSoon > 0 ? 'text-danger' : 'text-primary')}>
          {formatCurrency(dueSoon)}
        </p>
      </Card>
    </div>
  )
}
