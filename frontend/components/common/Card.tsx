// ============================================
// CARD COMPONENT
// ============================================

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dark' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hover = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-card transition-all duration-200'

    const variantStyles = {
      default: 'bg-card border border-border shadow-card',
      dark: 'bg-sidebar text-white',
      bordered: 'bg-card border border-border',
    }

    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-card',
      lg: 'p-6',
    }

    const hoverStyles = hover ? 'hover:shadow-card-hover cursor-pointer' : ''

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
