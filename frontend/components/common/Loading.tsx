// ============================================
// LOADING COMPONENTS
// ============================================

import { cn } from '@/lib/utils'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div
      className={cn(
        'inline-block rounded-full border-accent border-t-transparent animate-spin',
        sizeStyles[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-secondary">{message}</p>
      </div>
    </div>
  )
}

export interface LoadingCardProps {
  rows?: number
  className?: string
}

export function LoadingCard({ rows = 3, className }: LoadingCardProps) {
  return (
    <div className={cn('card', className)}>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-sidebar-active rounded"
            style={{
              height: i === 0 ? '24px' : i === rows - 1 ? '16px' : '20px',
              width: i === 0 ? '60%' : i === rows - 1 ? '40%' : '80%',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Simple loading component for inline use
export function Loading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-secondary">{message}</p>
      </div>
    </div>
  )
}
