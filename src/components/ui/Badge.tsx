import type { ReactNode } from 'react';

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  brand: 'bg-brand-500/10 text-brand-300 border-brand-500/20',
  success: 'bg-success-500/10 text-success-400 border-success-500/20',
  warning: 'bg-warning-500/10 text-warning-400 border-warning-500/20',
  danger: 'bg-danger-500/10 text-danger-400 border-danger-500/20',
  neutral: 'bg-ink-700 text-ink-200 border-ink-600',
  accent: 'bg-accent-500/10 text-accent-400 border-accent-500/20',
};

const dotColors: Record<BadgeVariant, string> = {
  brand: 'bg-brand-400',
  success: 'bg-success-400',
  warning: 'bg-warning-400',
  danger: 'bg-danger-400',
  neutral: 'bg-ink-300',
  accent: 'bg-accent-400',
};

export function Badge({ variant = 'neutral', children, className = '', dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />}
      {children}
    </span>
  );
}
