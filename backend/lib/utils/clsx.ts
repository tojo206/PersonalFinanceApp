// ============================================
// CLASSNAME UTILITIES (clsx alternative)
// ============================================

/**
 * Utility function to conditionally join class names
 * Similar to clsx library but lightweight
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Create a class name with conditional values
 * @param base - Base class name(s)
 * @param conditions - Object mapping conditions to class names
 * @returns Combined class name string
 */
export function conditionalClass(
  base: string,
  conditions: Record<string, boolean>
): string {
  const conditionalClasses = Object.entries(conditions)
    .filter(([_, active]) => active)
    .map(([className]) => className)
    .join(' ')

  return cn(base, conditionalClasses)
}
