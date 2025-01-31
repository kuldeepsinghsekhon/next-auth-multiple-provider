import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getBackupCodes: (codesString: string | null) => string[] = (codesString: string | null): string[] => {
  if (!codesString) return []
  return JSON.parse(codesString)
}

export const setBackupCodes = (codes: string[]): string => {
  return JSON.stringify(codes)
}
// ...existing code...

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}