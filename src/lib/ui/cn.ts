import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Tailwind-safe class merge for UI components. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
