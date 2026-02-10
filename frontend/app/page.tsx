// ============================================
// HOME PAGE - REDIRECT
// ============================================

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // TODO: Check authentication status
    // For now, redirect to overview
    router.replace('/overview')
  }, [router])

  return null
}
