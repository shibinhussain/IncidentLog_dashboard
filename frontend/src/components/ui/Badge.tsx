import { clsx } from 'clsx';
import type { Severity, Status } from '../../types/incident';

type BadgeVariant = Severity | Status;

interface BadgeProps {
  variant: BadgeVariant;
}

const colors: Record<BadgeVariant, string> = {
  low: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800',
  medium:
    'bg-yellow-50 text-yellow-800 ring-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:ring-yellow-800',
  high: 'bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:ring-orange-800',
  critical: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-200 dark:ring-red-800',
  open: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:ring-blue-800',
  investigating:
    'bg-yellow-50 text-yellow-800 ring-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:ring-yellow-800',
  resolved:
    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800',
};

export function Badge({ variant }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex min-w-20 justify-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1',
        colors[variant],
      )}
    >
      {variant.replace('_', ' ')}
    </span>
  );
}
