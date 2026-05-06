import { clsx } from 'clsx';
import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, className, id, ...props },
  ref,
) {
  const selectId = id || props.name;

  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      {label ? <span className="mb-1.5 block">{label}</span> : null}
      <select
        ref={ref}
        id={selectId}
        className={clsx(
          'h-10 w-full rounded-md border bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-900',
          error ? 'border-red-400' : 'border-slate-200 dark:border-slate-800',
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
});
