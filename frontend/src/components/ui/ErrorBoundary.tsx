import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Render error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto mt-12 max-w-lg rounded-lg border border-red-100 bg-white p-6 text-center shadow-sm dark:border-red-900 dark:bg-slate-950">
          <h1 className="text-lg font-semibold text-slate-950 dark:text-white">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            The page could not render correctly.
          </p>
          <Button
            className="mt-5"
            onClick={() => this.setState({ hasError: false })}
            variant="secondary"
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
