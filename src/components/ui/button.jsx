import React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  default: 'bg-indigo-600 text-white hover:bg-indigo-700',
  outline: 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100',
  ghost: 'hover:bg-slate-100 text-slate-900 dark:hover:bg-slate-800 dark:text-slate-100',
};

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-8',
};

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  children,
  ...props
}) {
  const Comp = asChild ? 'span' : 'button';
  
  const buttonContent = (
    <Comp
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        buttonVariants[variant] || buttonVariants.default,
        buttonSizes[size] || buttonSizes.default,
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );

  // If asChild, we expect children to be a single element (like <a>)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        buttonVariants[variant] || buttonVariants.default,
        buttonSizes[size] || buttonSizes.default,
        className,
        children.props.className
      ),
    });
  }

  return buttonContent;
}
