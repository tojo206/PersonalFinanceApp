// ============================================
// POTS SUMMARY COMPONENT
// ============================================

'use client'

import Link from 'next/link'
import { Card } from '@/components/common'
import { formatCurrency, cn } from '@/lib/utils'

interface Pot {
  id: string
  name: string
  total: number
  target: number
  theme: string
}

interface PotsSummaryProps {
  pots: Pot[]
  totalSaved: number
}

export function PotsSummary({ pots, totalSaved }: PotsSummaryProps) {
  // Get first 4 pots for display
  const displayPots = pots.slice(0, 4)

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-section-title text-primary">Pots</h2>
        <Link
          href="/pots"
          className="text-small text-secondary hover:text-accent transition-colors"
        >
          See Details
        </Link>
      </div>

      <div className="mb-4">
        <p className="text-small text-secondary mb-1">Total Saved</p>
        <p className="text-card-value text-primary">{formatCurrency(totalSaved)}</p>
      </div>

      <div className="space-y-3">
        {displayPots.map((pot) => {
          const percentage = Math.min(100, (pot.total / pot.target) * 100)

          return (
            <div key={pot.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Pot Theme Indicator */}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: pot.theme }}
                />
                <div>
                  <p className="text-small font-medium text-primary">{pot.name}</p>
                  {/* Progress Bar */}
                  <div className="w-24 h-1.5 bg-sidebar-active rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: pot.theme,
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-small text-secondary">{formatCurrency(pot.total)}</p>
            </div>
          )
        })}
      </div>

      {pots.length === 0 && (
        <div className="text-center py-8">
          <p className="text-secondary text-small">No pots yet. Create your first pot!</p>
        </div>
      )}
    </Card>
  )
}
