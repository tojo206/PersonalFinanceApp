// ============================================
// OVERVIEW PAGE
// ============================================

'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout'
import {
  BalanceCards,
  PotsSummary,
  BudgetsSummary,
  TransactionsList,
  RecurringBillsSummary,
} from '@/components/overview'
import { Loading } from '@/components/common'
import { balanceApi, potsApi, budgetsApi, transactionsApi, billsApi, ApiError } from '@/lib/api'

interface Balance {
  current: number
  income: number
  expenses: number
}

export default function OverviewPage() {
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState<Balance | null>(null)
  const [pots, setPots] = useState<any[]>([])
  const [budgets, setBudgets] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [billsSummary, setBillsSummary] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [balanceData, potsData, budgetsData, transactionsData, billsData] =
        await Promise.all([
          balanceApi.get(),
          potsApi.list(),
          budgetsApi.list(),
          transactionsApi.list({ limit: 5 }),
          billsApi.getSummary(),
        ])

      setBalance(balanceData)
      setPots(potsData)
      setBudgets(budgetsData)
      setTransactions(transactionsData.transactions || [])
      setBillsSummary(billsData)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to load data')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Overview">
        <Loading />
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Overview">
        <div className="text-center py-12">
          <p className="text-secondary mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="text-primary hover:text-primary-dark transition"
          >
            Try again
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const totalSaved = pots.reduce((sum: number, pot: any) => sum + Number(pot.total), 0)

  return (
    <DashboardLayout title="Overview">
      <div className="space-y-6">
        {/* Balance Cards */}
        {balance && <BalanceCards balance={balance} />}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <PotsSummary pots={pots} totalSaved={totalSaved} />
            <TransactionsList transactions={transactions} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <BudgetsSummary budgets={budgets} />
            {billsSummary && <RecurringBillsSummary summary={billsSummary} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
