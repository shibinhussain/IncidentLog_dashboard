import { clsx } from 'clsx';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, leftIcon, className, id, ...props },
  ref,
) {
  const inputId = id || props.name;

  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      {label ? <span className="mb-1.5 block">{label}</span> : null}
      <span className="relative block">
        {leftIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'h-10 w-full rounded-md border bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-900',
            leftIcon && 'pl-10',
            error ? 'border-red-400' : 'border-slate-200 dark:border-slate-800',
            className,
          )}
          {...props}
        />
      </span>
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
      {!error && helperText ? (
        <span className="mt-1 block text-xs text-slate-500">{helperText}</span>
      ) : null}
    </label>
  );
});
