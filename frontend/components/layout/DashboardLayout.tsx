// ============================================
// DASHBOARD LAYOUT COMPONENT
// ============================================

'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <main className={cn('transition-all duration-300', 'ml-sidebar')}>
        {/* Header */}
        <header className="bg-card border-b border-border px-8 py-6">
          {title && (
            <h1 className="text-page-title text-primary">{title}</h1>
          )}
        </header>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
