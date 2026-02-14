import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number, locale = 'en-US', options?: Intl.DateTimeFormatOptions) {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, options ?? { year: 'numeric', month: 'short', day: '2-digit' }).format(d);
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
    ...options
  }).format(amount);
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  if (maxLength <= 1) return '…';
  return text.slice(0, Math.max(0, maxLength - 1)).trimEnd() + '…';
}

export function debounce<T extends (...args: any[]) => void>(fn: T, waitMs: number) {
  let t: any;
  const debounced = (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), waitMs);
  };
  debounced.cancel = () => {
    if (t) clearTimeout(t);
    t = null;
  };
  return debounced as T & { cancel: () => void };
}
