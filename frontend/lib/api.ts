// ============================================
// API UTILITY FUNCTIONS
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Add auth token if available
  const token = getAccessToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const data: ApiResponse<T> = await response.json()

  if (!response.ok || !data.success) {
    // Handle token expiration
    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await refreshToken()
      if (refreshed) {
        // Retry original request
        return request<T>(endpoint, options)
      }
      // Clear tokens and redirect to login
      clearTokens()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    throw new ApiError(
      data.error?.code || 'UNKNOWN_ERROR',
      data.error?.message || 'An error occurred'
    )
  }

  return data.data as T
}

// Token management
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('access_token='))
    ?.split('=')[1] || null
}

function clearTokens() {
  if (typeof window === 'undefined') return
  document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (response.ok) {
      return true
    }

    return false
  } catch {
    return false
  }
}

// Auth API
export const authApi = {
  register: async (email: string, password: string, name?: string) => {
    return request<{ accessToken: string; refreshToken: string; user: any }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
        credentials: 'include',
      }
    )
  },

  login: async (email: string, password: string) => {
    return request<{ accessToken: string; refreshToken: string; user: any }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      }
    )
  },

  logout: async () => {
    return request('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
  },

  getMe: async () => {
    return request<any>('/api/auth/me')
  },
}

// Balance API
export const balanceApi = {
  get: async () => {
    return request<{
      current: number
      income: number
      expenses: number
    }>('/api/balance')
  },

  update: async (data: { current?: number; income?: number; expenses?: number }) => {
    return request<any>('/api/balance', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },
}

// Transactions API
export const transactionsApi = {
  list: async (params?: {
    page?: number
    limit?: number
    search?: string
    sort?: string
    category?: string
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.category) queryParams.append('category', params.category)

    const query = queryParams.toString()
    return request<{
      transactions: any[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>(`/api/transactions${query ? `?${query}` : ''}`)
  },

  create: async (data: {
    name: string
    amount: number
    category: string
    date?: Date
    avatar?: string
    recurring?: boolean
  }) => {
    return request<any>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: any) => {
    return request<any>(`/api/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string) => {
    return request<{ id: string }>(`/api/transactions/${id}`, {
      method: 'DELETE',
    })
  },
}

// Budgets API
export const budgetsApi = {
  list: async () => {
    return request<any[]>('/api/budgets')
  },

  create: async (data: {
    category: string
    maximum: number
    theme: string
  }) => {
    return request<any>('/api/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: any) => {
    return request<any>(`/api/budgets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string) => {
    return request<{ id: string }>(`/api/budgets/${id}`, {
      method: 'DELETE',
    })
  },

  getCategoryTransactions: async (category: string) => {
    return request<any[]>(`/api/budgets/${category}/latest`)
  },
}

// Pots API
export const potsApi = {
  list: async () => {
    return request<any[]>('/api/pots')
  },

  create: async (data: { name: string; target: number; theme: string }) => {
    return request<any>('/api/pots', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: any) => {
    return request<any>(`/api/pots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string) => {
    return request<{ id: string }>(`/api/pots/${id}`, {
      method: 'DELETE',
    })
  },

  addMoney: async (id: string, amount: number) => {
    return request<any>(`/api/pots/${id}/add`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  },

  withdraw: async (id: string, amount: number) => {
    return request<any>(`/api/pots/${id}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  },
}

// Bills API
export const billsApi = {
  list: async (params?: { search?: string; sort?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sort) queryParams.append('sort', params.sort)

    const query = queryParams.toString()
    return request<any[]>(`/api/bills${query ? `?${query}` : ''}`)
  },

  getSummary: async () => {
    return request<{
      paid: number
      totalUpcoming: number
      dueSoon: number
      paidBills: any[]
      upcomingBills: any[]
      dueSoonBills: any[]
    }>('/api/bills/summary')
  },

  create: async (data: {
    vendor_name: string
    amount: number
    due_day: number
    category: string
    theme: string
  }) => {
    return request<any>('/api/bills', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: any) => {
    return request<any>(`/api/bills/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string) => {
    return request<{ id: string }>(`/api/bills/${id}`, {
      method: 'DELETE',
    })
  },
}

export { ApiError }
