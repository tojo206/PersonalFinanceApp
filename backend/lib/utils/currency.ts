// ============================================
// CURRENCY UTILITIES
// ============================================

/**
 * Format a number as currency (USD)
 * @param amount - The amount to format
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(
  amount: number,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount)
}

/**
 * Format a number as currency without the currency symbol
 * @param amount - The amount to format
 * @returns Formatted number string (e.g., "1,234.56")
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))
}

/**
 * Get the appropriate CSS class for a currency amount
 * @param amount - The amount to check
 * @returns CSS class name
 */
export function getCurrencyClass(amount: number): string {
  if (amount > 0) return 'currency-positive'
  if (amount < 0) return 'currency-negative'
  return ''
}

/**
 * Format a transaction amount with sign and color
 * @param amount - The transaction amount
 * @returns Object with formatted value and CSS class
 */
export function formatTransactionAmount(amount: number): {
  value: string
  className: string
} {
  const isPositive = amount >= 0
  const sign = isPositive ? '+' : ''
  return {
    value: `${sign}${formatAmount(amount)}`,
    className: isPositive ? 'currency-positive' : 'currency-negative',
  }
}

/**
 * Calculate percentage of budget spent
 * @param spent - Amount spent
 * @param maximum - Budget maximum
 * @returns Percentage (0-100)
 */
export function calculatePercentage(spent: number, maximum: number): number {
  if (maximum <= 0) return 0
  return Math.min(100, Math.max(0, (spent / maximum) * 100))
}

/**
 * Calculate pot progress percentage
 * @param total - Current total in pot
 * @param target - Pot target amount
 * @returns Percentage (0-100)
 */
export function calculatePotProgress(total: number, target: number): number {
  if (target <= 0) return 0
  return Math.min(100, Math.max(0, (total / target) * 100))
}
