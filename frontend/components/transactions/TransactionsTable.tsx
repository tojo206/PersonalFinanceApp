// ============================================
// TRANSACTIONS TABLE COMPONENT
// ============================================

'use client'

import { Avatar } from '@/components/common'
import { formatTransactionAmount, formatDate, cn } from '@/lib/utils'
import type { Transaction, Category } from '@/types'

interface TransactionsTableProps {
  transactions: Transaction[]
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

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <p className="text-secondary">No transactions found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Table Header - Desktop */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-card py-3 bg-sidebar-active text-small font-medium text-secondary">
        <div className="col-span-4">Recipient/Sender</div>
        <div className="col-span-3">Category</div>
        <div className="col-span-3">Transaction Date</div>
        <div className="col-span-2 text-right">Amount</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-border">
        {transactions.map((transaction) => {
          const amountDisplay = formatTransactionAmount(transaction.amount)

          return (
            <div
              key={transaction.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-card py-4 items-center hover:bg-sidebar-hover transition-colors"
            >
              {/* Name & Avatar */}
              <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                <Avatar
                  src={transaction.avatar || undefined}
                  initials={transaction.name.charAt(0).toUpperCase()}
                  alt={transaction.name}
                  size="md"
                />
                <div>
                  <p className="text-body font-medium text-primary">{transaction.name}</p>
                  <p className="md:hidden text-small text-secondary">
                    {CATEGORY_LABELS[transaction.category]} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              {/* Category - Desktop */}
              <div className="col-span-3 hidden md:block text-small text-secondary">
                {CATEGORY_LABELS[transaction.category]}
              </div>

              {/* Date - Desktop */}
              <div className="col-span-3 hidden md:block text-small text-secondary">
                {formatDate(transaction.date)}
              </div>

              {/* Amount */}
              <div className="col-span-1 md:col-span-2 text-right">
                <p className={cn('text-body font-semibold', amountDisplay.className)}>
                  {amountDisplay.value}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
