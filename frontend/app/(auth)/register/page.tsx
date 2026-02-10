// ============================================
// REGISTER PAGE
// ============================================

import { RegisterForm } from '@/components/auth'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl mb-4">
            <span className="text-white font-bold text-3xl">f</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Create an account</h1>
          <p className="text-secondary mt-2">Start tracking your finances today</p>
        </div>

        {/* Register Form */}
        <div className="card">
          <div className="p-card">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}
