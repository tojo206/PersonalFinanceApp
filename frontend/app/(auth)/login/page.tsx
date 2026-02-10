// ============================================
// LOGIN PAGE
// ============================================

import { LoginForm } from '@/components/auth'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl mb-4">
            <span className="text-white font-bold text-3xl">f</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Welcome back</h1>
          <p className="text-secondary mt-2">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <div className="p-card">
            <LoginForm />
          </div>
        </div>

        {/* Demo Account Notice */}
        <div className="mt-6 p-4 bg-sidebar-active rounded-card text-center text-sm text-secondary">
          <p>Demo account: demo@example.com / password123</p>
        </div>
      </div>
    </div>
  )
}
