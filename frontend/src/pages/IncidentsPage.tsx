import type { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, Pencil, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { Table } from '../components/ui/Table';
import { useToast } from '../components/ui/Toast';
import { FilterBar, hasActiveFilters } from '../components/incidents/FilterBar';
import { IncidentFormModal } from '../components/incidents/IncidentFormModal';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useIncidentFilters } from '../hooks/useIncidentFilters';
import { useDeleteIncident, useIncidents } from '../hooks/useIncidents';
import type { Incident, IncidentFilters } from '../types/incident';
import { formatDateTime, formatRelativeTime } from '../utils/format';

function SortHeader({
  label,
  field,
  filters,
  onSort,
}: {
  label: string;
  field: NonNullable<IncidentFilters['sort_by']>;
  filters: IncidentFilters;
  onSort: (field: NonNullable<IncidentFilters['sort_by']>) => void;
}) {
  const active = filters.sort_by === field;
  const Icon = filters.sort_order === 'asc' ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded text-xs font-semibold uppercase tracking-normal text-slate-600 hover:text-blue-700 dark:text-slate-300"
      onClick={() => onSort(field)}
    >
      {label}
      {active ? <Icon className="h-3.5 w-3.5" /> : null}
    </button>
  );
}

export function IncidentsPage() {
  const {
    filters,
    setSearch,
    setSeverity,
    setStatus,
    setSortBy,
    setSortOrder,
    setPage,
    setPageSize,
    resetFilters,
  } = useIncidentFilters();
  const incidentsQuery = useIncidents(filters);
  const deleteMutation = useDeleteIncident();
  const { toast } = useToast();
  const [editingIncident, setEditingIncident] = useState<Incident | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Incident | undefined>();

  const onSort = (field: NonNullable<IncidentFilters['sort_by']>) => {
    if (filters.sort_by === field) {
      setSortOrder(filters.sort_order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const columns = useMemo<ColumnDef<Incident>[]>(
    () => [
      {
        id: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <button
            type="button"
            className="max-w-md text-left"
            onClick={(event) => {
              event.stopPropagation();
              setEditingIncident(row.original);
              setIsFormOpen(true);
            }}
          >
            <span className="block font-semibold text-slate-950 dark:text-white">
              {row.original.title}
            </span>
            <span className="mt-1 line-clamp-1 block text-xs text-slate-500">
              {row.original.description}
            </span>
          </button>
        ),
      },
      {
        id: 'severity',
        header: 'Severity',
        cell: ({ row }) => <Badge variant={row.original.severity} />,
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge variant={row.original.status} />,
      },
      {
        id: 'date',
        header: () => (
          <SortHeader label="Date" field="date" filters={filters} onSort={onSort} />
        ),
        cell: ({ row }) => formatDateTime(row.original.date),
      },
      {
        id: 'created',
        header: 'Created',
        cell: ({ row }) => formatRelativeTime(row.original.created_at),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Edit incident"
              onClick={(event) => {
                event.stopPropagation();
                setEditingIncident(row.original);
                setIsFormOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Delete incident"
              onClick={(event) => {
                event.stopPropagation();
                setDeleteTarget(row.original);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ),
      },
    ],
    [filters],
  );

  const openCreate = () => {
    setEditingIncident(undefined);
    setIsFormOpen(true);
  };

  const emptyFiltered = hasActiveFilters(filters);
  const incidents = incidentsQuery.data?.data ?? [];

  return (
    <PageWrapper
      title="Incidents"
      subtitle="Search, triage, and maintain your incident log."
      actions={
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Incident
        </Button>
      }
    >
      <FilterBar
        filters={filters}
        onSearch={setSearch}
        onSeverity={setSeverity}
        onStatus={setStatus}
        onReset={resetFilters}
      />

      {incidentsQuery.isError ? (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          Failed to load incidents.
        </div>
      ) : incidents.length === 0 && !incidentsQuery.isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
            {emptyFiltered ? 'No incidents match your filters' : 'No incidents found'}
          </h2>
          <div className="mt-5">
            {emptyFiltered ? (
              <Button variant="secondary" onClick={resetFilters}>
                Reset filters
              </Button>
            ) : (
              <Button onClick={openCreate}>Create your first incident</Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={incidents}
            loading={incidentsQuery.isLoading}
            emptyMessage="No incidents found"
            onRowClick={(incident) => {
              setEditingIncident(incident);
              setIsFormOpen(true);
            }}
          />
          <Pagination
            page={filters.page || 1}
            totalPages={incidentsQuery.data?.total_pages ?? 0}
            pageSize={filters.page_size || 20}
            total={incidentsQuery.data?.total ?? 0}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      <IncidentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        incident={editingIncident}
      />

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(undefined)}
        title="Delete Incident"
        size="sm"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Delete "{deleteTarget?.title}"? This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(undefined)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={async () => {
              if (!deleteTarget) return;
              try {
                await deleteMutation.mutateAsync(deleteTarget.id);
                toast.success('Incident deleted');
                setDeleteTarget(undefined);
              } catch {
                toast.error('Failed to delete incident');
              }
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
