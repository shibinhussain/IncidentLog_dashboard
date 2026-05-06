import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { IncidentFilters, Severity, Status } from '../types/incident';

const DEFAULT_PAGE_SIZE = 20;

export function useIncidentFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<IncidentFilters>(
    () => ({
      search: searchParams.get('search') || undefined,
      severity: (searchParams.get('severity') as Severity | null) || '',
      status: (searchParams.get('status') as Status | null) || '',
      sort_by:
        (searchParams.get('sort_by') as IncidentFilters['sort_by'] | null) || 'date',
      sort_order:
        (searchParams.get('sort_order') as IncidentFilters['sort_order'] | null) ||
        'desc',
      page: Number(searchParams.get('page') || 1),
      page_size: Number(searchParams.get('page_size') || DEFAULT_PAGE_SIZE),
    }),
    [searchParams],
  );

  const updateFilters = (updates: IncidentFilters, resetPage = true) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    if (resetPage) next.set('page', '1');
    setSearchParams(next, { replace: true });
  };

  return {
    filters,
    setSearch: (search: string) => updateFilters({ search: search || undefined }),
    setSeverity: (severity: Severity | '') => updateFilters({ severity }),
    setStatus: (status: Status | '') => updateFilters({ status }),
    setSortBy: (sort_by: IncidentFilters['sort_by']) => updateFilters({ sort_by }),
    setSortOrder: (sort_order: IncidentFilters['sort_order']) =>
      updateFilters({ sort_order }),
    setPage: (page: number) => updateFilters({ page }, false),
    setPageSize: (page_size: number) => updateFilters({ page_size }),
    resetFilters: () => setSearchParams({}, { replace: true }),
  };
}
