import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createIncident,
  deleteIncident,
  getIncidentById,
  getIncidents,
  updateIncident,
} from '../api/incidents';
import type {
  CreateIncidentDTO,
  Incident,
  IncidentFilters,
  UpdateIncidentDTO,
} from '../types/incident';

export function useIncidents(filters: IncidentFilters) {
  return useQuery({
    queryKey: ['incidents', filters],
    queryFn: () => getIncidents(filters),
    staleTime: 30_000,
  });
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: ['incidents', id],
    queryFn: () => getIncidentById(id),
    enabled: Boolean(id),
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIncidentDTO) => createIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIncidentDTO }) =>
      updateIncident(id, data),
    onSuccess: (updated: Incident) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.setQueryData(['incidents', updated.id], updated);
    },
  });
}

export function useDeleteIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteIncident(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
