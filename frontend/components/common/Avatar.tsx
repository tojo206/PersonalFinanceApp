// ============================================
// AVATAR COMPONENT
// ============================================

import { ImgHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  initials?: string
  alt?: string
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size = 'md', initials, src, alt = '', ...props }, ref) => {
    const sizeStyles = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    }

    const textSizeStyles = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    }

    // If no src and initials provided, show fallback
    if (!src) {
      return (
        <div
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-sidebar text-white font-medium border-2 border-border',
            sizeStyles[size],
            textSizeStyles[size],
            className
          )}
          {...props}
        >
          {initials || '?'}
        </div>
      )
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(
          'rounded-full object-cover border-2 border-border',
          sizeStyles[size],
          className
        )}
        {...props}
      />
    )
  }
)

Avatar.displayName = 'Avatar'
