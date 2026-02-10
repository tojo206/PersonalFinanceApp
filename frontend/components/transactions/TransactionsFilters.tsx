// ============================================
// TRANSACTIONS FILTERS COMPONENT
// ============================================

'use client'

import { Input, Select } from '@/components/common'
import { CATEGORIES, CATEGORY_LABELS, SORT_OPTIONS } from '@/lib/constants'
import type { Category, SortOption } from '@/types'

interface TransactionsFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  sort: SortOption
  onSortChange: (value: SortOption) => void
  category: Category | 'all'
  onCategoryChange: (value: Category | 'all') => void
}

export function TransactionsFilters({
  search,
  onSearchChange,
  sort,
  onSortChange,
  category,
  onCategoryChange,
}: TransactionsFiltersProps) {
  const categoryOptions = [
    { value: 'all', label: 'All Transactions' },
    ...CATEGORIES.map((cat) => ({ value: cat, label: CATEGORY_LABELS[cat] })),
  ]

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1">
        <Input
          type="search"
          placeholder="Search transactions"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Sort */}
      <Select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        options={SORT_OPTIONS}
        className="md:w-48"
      />

      {/* Category Filter */}
      <Select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as Category | 'all')}
        options={categoryOptions}
        className="md:w-48"
      />
    </div>
  )
}
