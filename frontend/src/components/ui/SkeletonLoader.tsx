import { clsx } from 'clsx';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function SkeletonLoader({ width = '100%', height = 16, className }: SkeletonLoaderProps) {
  return (
    <span
      className={clsx('block animate-pulse rounded-md bg-blue-100 dark:bg-slate-800', className)}
      style={{ width, height }}
    />
  );
}
