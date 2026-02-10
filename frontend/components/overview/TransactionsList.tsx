// ============================================
// TRANSACTIONS LIST COMPONENT (Overview)
// ============================================

'use client'

import Link from 'next/link'
import { Card, Avatar } from '@/components/common'
import { formatTransactionAmount, formatDate } from '@/lib/utils'

interface Transaction {
  id: string
  avatar: string | null
  name: string
  amount: number
  date: Date
}

interface TransactionsListProps {
  transactions: Transaction[]
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  // Show only first 5 transactions on overview
  const displayTransactions = transactions.slice(0, 5)

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-section-title text-primary">Transactions</h2>
        <Link
          href="/transactions"
          className="text-small text-secondary hover:text-accent transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {displayTransactions.map((transaction) => {
          const amountDisplay = formatTransactionAmount(transaction.amount)

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={transaction.avatar || undefined}
                  initials={transaction.name.charAt(0).toUpperCase()}
                  alt={transaction.name}
                  size="md"
                />
                <div>
                  <p className="text-body font-medium text-primary">{transaction.name}</p>
                  <p className="text-small text-secondary">{formatDate(transaction.date)}</p>
                </div>
              </div>
              <p className={cn('text-body font-semibold', amountDisplay.className)}>
                {amountDisplay.value}
              </p>
            </div>
          )
        })}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-secondary text-small">No transactions yet.</p>
        </div>
      )}
    </Card>
  )
}
