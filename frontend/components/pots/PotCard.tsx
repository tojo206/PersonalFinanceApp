// ============================================
// POT CARD COMPONENT
// ============================================

'use client'

import { Card, Button } from '@/components/common'
import { formatCurrency, calculatePotProgress, cn } from '@/lib/utils'

interface PotCardProps {
  id: string
  name: string
  target: number
  total: number
  theme: string
  onAddMoney?: (id: string) => void
  onWithdraw?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function PotCard({
  id,
  name,
  target,
  total,
  theme,
  onAddMoney,
  onWithdraw,
  onEdit,
  onDelete,
}: PotCardProps) {
  const percentage = calculatePotProgress(total, target)
  const remaining = target - total

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: theme }}
          />
          <h3 className="text-body font-semibold text-primary">{name}</h3>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit?.(id)}
            className="p-1.5 text-secondary hover:text-primary hover:bg-sidebar-active rounded transition-colors"
            aria-label="Edit pot"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete?.(id)}
            className="p-1.5 text-secondary hover:text-danger hover:bg-danger/10 rounded transition-colors"
            aria-label="Delete pot"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Donut Chart for Progress */}
      <div className="flex items-center gap-6 mb-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={theme}
              strokeWidth="3"
              strokeDasharray={`${percentage}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{Math.round(percentage)}%</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-small text-secondary">
            Total Saved
          </p>
          <p className="text-xl font-bold text-primary mb-1">
            {formatCurrency(total)}
          </p>
          <p className="text-small text-secondary">
            {formatCurrency(remaining)} to go
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full h-2 bg-sidebar-active rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              backgroundColor: theme,
              width: `${percentage}%`,
            }}
          />
        </div>
        <p className="text-small text-secondary mt-2">
          Target: {formatCurrency(target)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onAddMoney?.(id)}
        >
          + Add Money
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => onWithdraw?.(id)}
        >
          Withdraw
        </Button>
      </div>
    </Card>
  )
}
