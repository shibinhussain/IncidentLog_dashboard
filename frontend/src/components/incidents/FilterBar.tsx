import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { IncidentFilters, Severity, Status } from '../../types/incident';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface FilterBarProps {
  filters: IncidentFilters;
  onSearch: (value: string) => void;
  onSeverity: (value: Severity | '') => void;
  onStatus: (value: Status | '') => void;
  onReset: () => void;
}

export function hasActiveFilters(filters: IncidentFilters) {
  return Boolean(filters.search || filters.severity || filters.status);
}

export function FilterBar({
  filters,
  onSearch,
  onSeverity,
  onStatus,
  onReset,
}: FilterBarProps) {
  const [search, setSearch] = useState(filters.search || '');

  useEffect(() => {
    setSearch(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    const handle = window.setTimeout(() => onSearch(search), 300);
    return () => window.clearTimeout(handle);
  }, [search]);

  return (
    <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:grid-cols-[1fr_180px_200px_auto]">
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search title or description"
        leftIcon={<Search className="h-4 w-4" />}
        aria-label="Search incidents"
      />
      <Select
        value={filters.severity || ''}
        onChange={(event) => onSeverity(event.target.value as Severity | '')}
        options={[
          { value: '', label: 'All severities' },
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
          { value: 'critical', label: 'Critical' },
        ]}
        aria-label="Filter by severity"
      />
      <Select
        value={filters.status || ''}
        onChange={(event) => onStatus(event.target.value as Status | '')}
        options={[
          { value: '', label: 'All statuses' },
          { value: 'open', label: 'Open' },
          { value: 'investigating', label: 'Investigating' },
          { value: 'resolved', label: 'Resolved' },
        ]}
        aria-label="Filter by status"
      />
      {hasActiveFilters(filters) ? (
        <Button variant="secondary" onClick={onReset}>
          <X className="h-4 w-4" />
          Reset
        </Button>
      ) : null}
    </div>
  );
}
