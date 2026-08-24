import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function Card({ children, className = '', hover = false, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className={`card-surface ${hover ? 'glass-hover' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  subtext?: string;
  accent?: 'brand' | 'accent' | 'success' | 'warning';
  delay?: number;
}

const accentColors = {
  brand: 'text-brand-400 bg-brand-500/10',
  accent: 'text-accent-400 bg-accent-500/10',
  success: 'text-success-400 bg-success-500/10',
  warning: 'text-warning-400 bg-warning-500/10',
};

export function StatCard({ label, value, icon, subtext, accent = 'brand', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="card-surface glass-hover p-5 group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-ink-300 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accentColors[accent]}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-semibold text-ink-50 tracking-tight">{value}</div>
      {subtext && <div className="text-xs text-ink-300 mt-1">{subtext}</div>}
    </motion.div>
  );
}
