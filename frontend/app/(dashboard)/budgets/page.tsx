// ============================================
// BUDGETS PAGE
// ============================================

'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout'
import { BudgetCard } from '@/components/budgets'
import { Button } from '@/components/common'
import { Loading } from '@/components/common'
import { formatCurrency } from '@/lib/utils'
import { budgetsApi, ApiError } from '@/lib/api'

export default function BudgetsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [budgets, setBudgets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBudgets()
  }, [])

  async function fetchBudgets() {
    try {
      setLoading(true)
      setError(null)

      const data = await budgetsApi.list()

      // For each budget, fetch the latest transactions
      const budgetsWithTransactions = await Promise.all(
        data.map(async (budget) => {
          try {
            const transactions = await budgetsApi.getCategoryTransactions(budget.category)
            return {
              ...budget,
              latestTransactions: transactions.slice(0, 3),
            }
          } catch {
            return {
              ...budget,
              latestTransactions: [],
            }
          }
        })
      )

      setBudgets(budgetsWithTransactions)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to load budgets')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log('Edit budget:', id)
  }

  const handleDelete = async (id: string) => {
    try {
      await budgetsApi.delete(id)
      // Refresh the list
      fetchBudgets()
    } catch (err) {
      console.error('Failed to delete budget:', err)
    }
  }

  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0)
  const totalMaximum = budgets.reduce((sum, b) => sum + Number(b.maximum), 0)

  return (
    <DashboardLayout title="Budgets">
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-secondary text-small">
              {formatCurrency(totalSpent)} of {formatCurrency(totalMaximum)} spent across {budgets.length} budgets
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>+ Add New Budget</Button>
        </div>

        {/* Content */}
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-secondary mb-4">{error}</p>
            <button
              onClick={fetchBudgets}
              className="text-primary hover:text-primary-dark transition"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* Budgets Grid */}
            {budgets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((budget) => (
                  <BudgetCard
                    key={budget.id}
                    {...budget}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="card text-center py-12">
                <p className="text-secondary mb-4">No budgets yet. Create your first budget!</p>
                <Button onClick={() => setIsAddModalOpen(true)}>Add New Budget</Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* TODO: Add Budget Modal */}
      {/* {isAddModalOpen && (
        <AddBudgetModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )} */}
    </DashboardLayout>
  )
}
