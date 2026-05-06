import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-normal text-blue-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        The page you are looking for is not available.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
