// ============================================
// CONSTANTS
// ============================================

import type { Category, ThemeColor } from '@/types'

// ============================================
// CATEGORIES
// ============================================

export const CATEGORIES: readonly Category[] = [
  'Entertainment',
  'Bills',
  'Groceries',
  'DiningOut',
  'Transportation',
  'PersonalCare',
  'Education',
  'Lifestyle',
  'Shopping',
  'General',
] as const

// Category display names with spaces
export const CATEGORY_LABELS: Record<Category, string> = {
  Entertainment: 'Entertainment',
  Bills: 'Bills',
  Groceries: 'Groceries',
  DiningOut: 'Dining Out',
  Transportation: 'Transportation',
  PersonalCare: 'Personal Care',
  Education: 'Education',
  Lifestyle: 'Lifestyle',
  Shopping: 'Shopping',
  General: 'General',
}

// ============================================
// THEME COLORS
// ============================================

export const THEME_COLORS: Record<string, ThemeColor> = {
  green: '#277C78',
  cyan: '#82C9D7',
  yellow: '#F2CDAC',
  navyGrey: '#626070',
  purple: '#826CB0',
  red: '#C94739',
  turquoise: '#57BEB8',
  brown: '#855744',
  magenta: '#C76888',
  blue: '#3F88C5',
  navy: '#2B3C5E',
  armyGreen: '#6A7C60',
  pink: '#D8A7B1',
  gold: '#E8B056',
  orange: '#E88D67',
}

export const THEME_COLOR_LABELS: Record<string, string> = {
  green: 'Green',
  cyan: 'Cyan',
  yellow: 'Yellow',
  navyGrey: 'Navy Grey',
  purple: 'Purple',
  red: 'Red',
  turquoise: 'Turquoise',
  brown: 'Brown',
  magenta: 'Magenta',
  blue: 'Blue',
  navy: 'Navy',
  armyGreen: 'Army Green',
  pink: 'Pink',
  gold: 'Gold',
  orange: 'Orange',
}

// ============================================
// SORT OPTIONS
// ============================================

export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'atoz', label: 'A to Z' },
  { value: 'ztoa', label: 'Z to A' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' },
] as const

// ============================================
// PAGINATION
// ============================================

export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

// ============================================
// DATE & TIME
// ============================================

// Current app reference date (August 2024 from data.json)
export const APP_REFERENCE_DATE = new Date('2024-08-19T00:00:00Z')

// Bills due within X days are considered "due soon"
export const BILLS_DUE_SOON_DAYS = 5

// ============================================
// VALIDATION
// ============================================

export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 128

export const POT_NAME_MIN_LENGTH = 1
export const POT_NAME_MAX_LENGTH = 50

export const TRANSACTION_NAME_MIN_LENGTH = 1
export const TRANSACTION_NAME_MAX_LENGTH = 100

export const BUDGET_MINIMUM = 0.01
export const BUDGET_MAXIMUM = 999999.99

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  OVERVIEW: '/overview',
  TRANSACTIONS: '/transactions',
  BUDGETS: '/budgets',
  POTS: '/pots',
  RECURRING_BILLS: '/recurring-bills',
} as const

// ============================================
// API ROUTES
// ============================================

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
  },
  BALANCE: {
    GET: '/api/balance',
    UPDATE: '/api/balance',
  },
  TRANSACTIONS: {
    LIST: '/api/transactions',
    CREATE: '/api/transactions',
    GET: (id: string) => `/api/transactions/${id}`,
    UPDATE: (id: string) => `/api/transactions/${id}`,
    DELETE: (id: string) => `/api/transactions/${id}`,
  },
  BUDGETS: {
    LIST: '/api/budgets',
    CREATE: '/api/budgets',
    GET: (id: string) => `/api/budgets/${id}`,
    UPDATE: (id: string) => `/api/budgets/${id}`,
    DELETE: (id: string) => `/api/budgets/${id}`,
    GET_LATEST: (category: string) => `/api/budgets/${category}/latest`,
  },
  POTS: {
    LIST: '/api/pots',
    CREATE: '/api/pots',
    GET: (id: string) => `/api/pots/${id}`,
    UPDATE: (id: string) => `/api/pots/${id}`,
    DELETE: (id: string) => `/api/pots/${id}`,
    ADD_MONEY: (id: string) => `/api/pots/${id}/add`,
    WITHDRAW: (id: string) => `/api/pots/${id}/withdraw`,
  },
  BILLS: {
    LIST: '/api/bills',
    SUMMARY: '/api/bills/summary',
    CREATE: '/api/bills',
    GET: (id: string) => `/api/bills/${id}`,
    UPDATE: (id: string) => `/api/bills/${id}`,
    DELETE: (id: string) => `/api/bills/${id}`,
  },
} as const

// ============================================
// ERROR CODES
// ============================================

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const
