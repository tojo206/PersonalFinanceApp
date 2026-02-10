// ============================================
// TYPES & INTERFACES
// ============================================

export type Category =
  | 'Entertainment'
  | 'Bills'
  | 'Groceries'
  | 'DiningOut'
  | 'Transportation'
  | 'PersonalCare'
  | 'Education'
  | 'Lifestyle'
  | 'Shopping'
  | 'General'

export type SortOption =
  | 'latest'
  | 'oldest'
  | 'atoz'
  | 'ztoa'
  | 'highest'
  | 'lowest'

export type ThemeColor =
  | '#277C78' // Green
  | '#82C9D7' // Cyan
  | '#F2CDAC' // Yellow/Tan
  | '#626070' // Navy Grey
  | '#826CB0' // Purple

// ============================================
// USER & AUTH
// ============================================

export interface User {
  id: string
  email: string
  name: string | null
  created_at: Date
  updated_at: Date
}

export interface AuthUser extends User {
  balance?: Balance
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  name?: string
}

export interface AuthResponse {
  success: boolean
  data?: {
    user: AuthUser
    accessToken: string
    refreshToken: string
  }
  error?: {
    code: string
    message: string
  }
}

// ============================================
// BALANCE
// ============================================

export interface Balance {
  id: string
  user_id: string
  current: number
  income: number
  expenses: number
  created_at: Date
  updated_at: Date
}

// ============================================
// TRANSACTIONS
// ============================================

export interface Transaction {
  id: string
  user_id: string
  avatar: string | null
  name: string
  category: Category
  date: Date
  amount: number
  recurring: boolean
  created_at: Date
  updated_at: Date
}

export interface TransactionInput {
  avatar?: string
  name: string
  category: Category
  date: Date
  amount: number
  recurring?: boolean
}

export interface TransactionsQuery {
  page?: number
  limit?: number
  search?: string
  sort?: SortOption
  category?: Category
}

export interface PaginatedTransactions {
  items: Transaction[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================
// BUDGETS
// ============================================

export interface Budget {
  id: string
  user_id: string
  category: Category
  maximum: number
  theme: string
  created_at: Date
  updated_at: Date
  spent?: number // Calculated field
  latestTransactions?: Transaction[] // Latest 3 transactions
}

export interface BudgetInput {
  category: Category
  maximum: number
  theme: string
}

export interface BudgetWithSpending extends Budget {
  spent: number
  remaining: number
  percentage: number
  latestTransactions: Transaction[]
}

// ============================================
// POTS
// ============================================

export interface Pot {
  id: string
  user_id: string
  name: string
  target: number
  total: number
  theme: string
  created_at: Date
  updated_at: Date
  percentage?: number // Calculated field
}

export interface PotInput {
  name: string
  target: number
  theme: string
}

export interface PotOperationInput {
  amount: number
}

// ============================================
// RECURRING BILLS
// ============================================

export interface RecurringBill {
  id: string
  user_id: string
  vendor_name: string
  amount: number
  due_day: number
  category: Category
  theme: string
  created_at: Date
  updated_at: Date
  isPaid?: boolean // Calculated for current month
  daysUntilDue?: number // Calculated field
}

export interface RecurringBillInput {
  vendor_name: string
  amount: number
  due_day: number
  category: Category
  theme: string
}

export interface BillsSummary {
  paid: number
  totalUpcoming: number
  dueSoon: number
  paidBills: RecurringBill[]
  upcomingBills: RecurringBill[]
  dueSoonBills: RecurringBill[]
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message?: string
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown[]
  }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// ============================================
// UI STATE
// ============================================

export interface SidebarState {
  isMinimized: boolean
}

export interface ModalState {
  isOpen: boolean
  type: 'add' | 'edit' | 'delete' | 'addMoney' | 'withdraw' | null
  data?: unknown
}
