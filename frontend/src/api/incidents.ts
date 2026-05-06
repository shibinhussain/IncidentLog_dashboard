import { apiClient } from './client';
import type {
  CreateIncidentDTO,
  Incident,
  IncidentFilters,
  IncidentStats,
  PaginatedResponse,
  UpdateIncidentDTO,
} from '../types/incident';

export async function getIncidents(
  filters: IncidentFilters = {},
): Promise<PaginatedResponse<Incident>> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''),
  );

  const { data } = await apiClient.get<PaginatedResponse<Incident>>('/incidents', {
    params,
  });
  return data;
}

export async function getIncidentById(id: string): Promise<Incident> {
  const { data } = await apiClient.get<Incident>(`/incidents/${id}`);
  return data;
}

export async function createIncident(data: CreateIncidentDTO): Promise<Incident> {
  const response = await apiClient.post<Incident>('/incidents', data);
  return response.data;
}

export async function updateIncident(
  id: string,
  data: UpdateIncidentDTO,
): Promise<Incident> {
  const response = await apiClient.put<Incident>(`/incidents/${id}`, data);
  return response.data;
}

export async function deleteIncident(id: string): Promise<void> {
  await apiClient.delete(`/incidents/${id}`);
}

export async function getStats(): Promise<IncidentStats> {
  const { data } = await apiClient.get<IncidentStats>('/stats');
  return data;
}
