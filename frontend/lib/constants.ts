// ============================================
// CONSTANTS
// ============================================

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  OVERVIEW: '/overview',
  TRANSACTIONS: '/transactions',
  BUDGETS: '/budgets',
  POTS: '/pots',
  RECURRING_BILLS: '/recurring-bills',
} as const

export const DEFAULT_PAGE_SIZE = 8

export const CATEGORY_LABELS: Record<string, string> = {
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

export const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: '#277C78',
  Bills: '#82C9D7',
  Groceries: '#F2CDAC',
  DiningOut: '#626070',
  Transportation: '#277C78',
  PersonalCare: '#82C9D7',
  Education: '#F2CDAC',
  Lifestyle: '#626070',
  Shopping: '#277C78',
  General: '#82C9D7',
}

export const CATEGORIES: Array<{ value: string; label: string; color: string }> =
  Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
    color: CATEGORY_COLORS[value],
  }))

export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'atoz', label: 'A to Z' },
  { value: 'ztoa', label: 'Z to A' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' },
]

export const THEME_COLORS = [
  '#277C78',
  '#82C9D7',
  '#F2CDAC',
  '#626070',
  '#826AF9',
  '#E96379',
  '#E6A715',
]
