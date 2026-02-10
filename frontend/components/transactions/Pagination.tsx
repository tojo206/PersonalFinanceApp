// ============================================
// PAGINATION COMPONENT
// ============================================

'use client'

import { Button } from '@/components/common'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages: number[] = []

  // Always show first page
  pages.push(1)

  // Show pages around current page
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }

  // Always show last page if more than 1 page
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-small text-secondary">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="hidden md:flex items-center gap-1">
          {pages.map((page, index) => {
            const prevPage = pages[index - 1]
            const showEllipsis = prevPage && page - prevPage > 1

            return (
              <div key={page} className="flex items-center">
                {showEllipsis && (
                  <span className="px-2 text-secondary">...</span>
                )}
                <button
                  onClick={() => onPageChange(page)}
                  className={cn(
                    'w-10 h-10 rounded-card flex items-center justify-center text-small font-medium transition-colors',
                    currentPage === page
                      ? 'bg-accent text-white'
                      : 'text-secondary hover:bg-sidebar-active hover:text-primary'
                  )}
                >
                  {page}
                </button>
              </div>
            )
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
