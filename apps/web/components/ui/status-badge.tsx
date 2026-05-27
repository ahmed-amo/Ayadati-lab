import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'registered' | 'deposit_paid' | 'ordered' | 'shipped' | 'arrived' | 'completed';
  className?: string;
}

const statusConfig = {
  registered: {
    label: 'Registered',
    color: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-600 dark:bg-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  deposit_paid: {
    label: 'Deposit Paid',
    color: 'text-yellow-600 dark:text-yellow-400',
    dot: 'bg-yellow-600 dark:bg-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
  ordered: {
    label: 'Ordered',
    color: 'text-purple-600 dark:text-purple-400',
    dot: 'bg-purple-600 dark:bg-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  shipped: {
    label: 'Shipped',
    color: 'text-orange-600 dark:text-orange-400',
    dot: 'bg-orange-600 dark:bg-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  arrived: {
    label: 'Arrived',
    color: 'text-green-600 dark:text-green-400',
    dot: 'bg-green-600 dark:bg-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-600 dark:bg-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
        config.bg,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      <span className={config.color}>{config.label}</span>
    </div>
  );
}
