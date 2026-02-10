// ============================================
// VALIDATION UTILITIES
// ============================================

import type { Category } from '@/types'
import { PASSWORD_MIN_LENGTH, POT_NAME_MIN_LENGTH, POT_NAME_MAX_LENGTH } from '@/lib/constants'

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Password validation regex (at least 8 chars, one letter, one number)
 */
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/

/**
 * Validate email address
 * @param email - Email to validate
 * @returns True if valid
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns True if valid
 */
export function isValidPassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH && PASSWORD_REGEX.test(password)
}

/**
 * Validate pot name
 * @param name - Name to validate
 * @returns True if valid
 */
export function isValidPotName(name: string): boolean {
  const trimmed = name.trim()
  return (
    trimmed.length >= POT_NAME_MIN_LENGTH &&
    trimmed.length <= POT_NAME_MAX_LENGTH
  )
}

/**
 * Validate amount (positive number)
 * @param amount - Amount to validate
 * @returns True if valid
 */
export function isValidAmount(amount: number): boolean {
  return typeof amount === 'number' && !isNaN(amount) && amount > 0
}

/**
 * Validate budget amount
 * @param amount - Amount to validate
 * @returns True if valid
 */
export function isValidBudgetAmount(amount: number): boolean {
  return typeof amount === 'number' && !isNaN(amount) && amount >= 0.01
}

/**
 * Validate due day (1-31)
 * @param day - Day to validate
 * @returns True if valid
 */
export function isValidDueDay(day: number): boolean {
  return Number.isInteger(day) && day >= 1 && day <= 31
}

/**
 * Validate category
 * @param category - Category to validate
 * @returns True if valid
 */
export function isValidCategory(category: string): category is Category {
  const validCategories: Category[] = [
    'Entertainment', 'Bills', 'Groceries', 'DiningOut',
    'Transportation', 'PersonalCare', 'Education',
    'Lifestyle', 'Shopping', 'General'
  ]
  return validCategories.includes(category as Category)
}

/**
 * Validate hex color code
 * @param color - Color string to validate
 * @returns True if valid hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color)
}

/**
 * Sanitize string input (trim and prevent XSS)
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

/**
 * Get error message for invalid email
 * @returns Error message
 */
export function getEmailError(): string {
  return 'Please enter a valid email address'
}

/**
 * Get error message for invalid password
 * @returns Error message
 */
export function getPasswordError(): string {
  return `Password must be at least ${PASSWORD_MIN_LENGTH} characters with letters and numbers`
}

/**
 * Get error message for invalid name
 * @param fieldName - Name of the field
 * @returns Error message
 */
export function getNameError(fieldName: string = 'Name'): string {
  return `${fieldName} is required`
}

/**
 * Get error message for invalid amount
 * @returns Error message
 */
export function getAmountError(): string {
  return 'Please enter a valid amount'
}
