// ============================================
// RECURRING BILLS PAGE
// ============================================

'use client'

import { useState, useEffect, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout'
import { BillsSummary, BillCard } from '@/components/recurring-bills'
import { Input, Select } from '@/components/common'
import { Loading } from '@/components/common'
import { SORT_OPTIONS } from '@/lib/constants'
import type { SortOption } from '@/types'
import { billsApi, ApiError } from '@/lib/api'

export default function RecurringBillsPage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('latest')
  const [bills, setBills] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)

      const [billsData, summaryData] = await Promise.all([
        billsApi.list({ sort }),
        billsApi.getSummary(),
      ])

      setBills(billsData)
      setSummary(summaryData)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to load bills')
      }
    } finally {
      setLoading(false)
    }
  }

  // Filter bills by search
  const filteredBills = useMemo(() => {
    if (!search) return bills

    return bills.filter((b) =>
      b.vendor_name.toLowerCase().includes(search.toLowerCase())
    )
  }, [bills, search])

  // Group by status
  const paidBills = filteredBills.filter((b: any) => b.isPaid)
  const upcomingBills = filteredBills.filter((b: any) => !b.isPaid)

  if (loading) {
    return (
      <DashboardLayout title="Recurring Bills">
        <Loading />
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Recurring Bills">
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

  return (
    <DashboardLayout title="Recurring Bills">
      <div className="space-y-6">
        {/* Summary Cards */}
        {summary && (
          <BillsSummary
            paidBills={summary.paid}
            totalUpcoming={summary.totalUpcoming}
            dueSoon={summary.dueSoon}
          />
        )}

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search bills"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            options={SORT_OPTIONS}
            className="md:w-48"
          />
        </div>

        {/* Bills List */}
        {paidBills.length > 0 && (
          <div>
            <h2 className="text-section-title text-primary mb-4">Paid Bills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paidBills.map((bill) => (
                <BillCard key={bill.id} {...bill} />
              ))}
            </div>
          </div>
        )}

        {upcomingBills.length > 0 && (
          <div>
            <h2 className="text-section-title text-primary mb-4">Upcoming Bills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingBills.map((bill) => (
                <BillCard key={bill.id} {...bill} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredBills.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-secondary">No recurring bills found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
