// ============================================
// DATE UTILITIES
// ============================================

import { format, formatDistanceToNow, isAfter, isBefore, addDays, startOfMonth, endOfMonth } from 'date-fns'

/**
 * Format a date for display
 * @param date - Date to format
 * @param formatString - Format string (default: "dd MMM yyyy")
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  formatString: string = 'dd MMM yyyy'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatString)
}

/**
 * Format a date with time
 * @param date - Date to format
 * @returns Formatted date string with time
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'dd MMM yyyy, HH:mm')
}

/**
 * Format a date as relative time (e.g., "2 days ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

/**
 * Check if a date is in the current month
 * @param date - Date to check
 * @param referenceDate - Reference date (default: now)
 * @returns True if date is in current month
 */
export function isCurrentMonth(
  date: Date | string,
  referenceDate: Date = new Date()
): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const start = startOfMonth(referenceDate)
  const end = endOfMonth(referenceDate)
  return !isBefore(dateObj, start) && !isAfter(dateObj, end)
}

/**
 * Check if a date is within the next N days
 * @param date - Date to check
 * @param days - Number of days
 * @param fromDate - Reference date (default: now)
 * @returns True if date is within range
 */
export function isWithinDays(
  date: Date | string,
  days: number,
  fromDate: Date = new Date()
): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const targetDate = addDays(fromDate, days)
  return !isAfter(dateObj, targetDate)
}

/**
 * Get the day of month (1-31)
 * @param date - Date to get day from
 * @returns Day of month
 */
export function getDayOfMonth(date: Date | string): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.getDate()
}

/**
 * Create a date with the given day of month
 * @param day - Day of month (1-31)
 * @param month - Month (0-11, default: current month)
 * @param year - Year (default: current year)
 * @returns Date object
 */
export function createDateWithDay(
  day: number,
  month: number = new Date().getMonth(),
  year: number = new Date().getFullYear()
): Date {
  return new Date(year, month, Math.min(day, new Date(year, month + 1, 0).getDate()))
}

/**
 * Check if a recurring bill is due for the current month
 * @param dueDay - Day of month bill is due
 * @param currentDate - Current date (default: now)
 * @returns True if bill is still due (not yet paid this month)
 */
export function isBillDueThisMonth(dueDay: number, currentDate: Date = new Date()): boolean {
  const today = currentDate.getDate()
  return today <= dueDay
}

/**
 * Calculate days until a bill is due
 * @param dueDay - Day of month bill is due
 * @param currentDate - Current date (default: now)
 * @returns Number of days until due (negative if overdue)
 */
export function daysUntilDue(dueDay: number, currentDate: Date = new Date()): number {
  const today = currentDate.getDate()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  if (dueDay >= today) {
    return dueDay - today
  }
  // Due date has passed this month, next due is next month
  return (daysInMonth - today) + dueDay
}
