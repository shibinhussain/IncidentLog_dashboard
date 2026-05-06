import { useQuery } from '@tanstack/react-query';
import { getStats } from '../api/incidents';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
