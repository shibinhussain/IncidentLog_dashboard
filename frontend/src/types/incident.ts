export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'open' | 'investigating' | 'resolved';

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIncidentDTO {
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  date: string;
}

export interface UpdateIncidentDTO extends Partial<CreateIncidentDTO> {}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface IncidentStats {
  by_severity: Record<Severity, number>;
  by_status: Record<Status, number>;
  by_date: { date: string; count: number }[];
  total: number;
}

export interface IncidentFilters {
  search?: string;
  severity?: Severity | '';
  status?: Status | '';
  sort_by?: 'date' | 'severity' | 'title' | 'status' | 'created_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}
