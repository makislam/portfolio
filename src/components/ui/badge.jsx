import React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  default: 'bg-indigo-600 text-white border-transparent',
  secondary: 'bg-slate-100 text-slate-900 border-transparent dark:bg-slate-800 dark:text-slate-100',
  outline: 'text-slate-900 border-slate-200 dark:text-slate-100 dark:border-slate-700',
};

export function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
