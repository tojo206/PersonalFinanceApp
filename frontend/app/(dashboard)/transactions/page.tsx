// ============================================
// TRANSACTIONS PAGE
// ============================================

'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout'
import {
  TransactionsFilters,
  TransactionsTable,
  Pagination,
} from '@/components/transactions'
import { Loading } from '@/components/common'
import type { Category, SortOption } from '@/types'
import { DEFAULT_PAGE_SIZE } from '@/lib/constants'
import { transactionsApi, ApiError } from '@/lib/api'

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('latest')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const [transactions, setTransactions] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [currentPage, sort, category, search])

  async function fetchTransactions() {
    try {
      setLoading(true)
      setError(null)

      const params: any = {
        page: currentPage,
        limit: DEFAULT_PAGE_SIZE,
        sort,
      }

      if (search) params.search = search
      if (category !== 'all') params.category = category

      const data = await transactionsApi.list(params)

      setTransactions(data.transactions || [])
      setTotalPages(data.totalPages || 1)
      setTotal(data.total || 0)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to load transactions')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRetry = () => {
    fetchTransactions()
  }

  return (
    <DashboardLayout title="Transactions">
      <div className="space-y-6">
        {/* Filters */}
        <TransactionsFilters
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          category={category}
          onCategoryChange={setCategory}
        />

        {/* Results count */}
        <p className="text-small text-secondary">
          {total} transaction{total !== 1 ? 's' : ''} found
        </p>

        {/* Content */}
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-secondary mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="text-primary hover:text-primary-dark transition"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <TransactionsTable transactions={transactions} />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
