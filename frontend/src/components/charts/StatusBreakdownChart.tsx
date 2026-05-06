import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { IncidentStats, Status } from '../../types/incident';

interface StatusBreakdownChartProps {
  data: IncidentStats['by_status'];
}

const labels: Record<Status, string> = {
  open: 'Open',
  investigating: 'Investigating',
  resolved: 'Resolved',
};

export function StatusBreakdownChart({ data }: StatusBreakdownChartProps) {
  const chartData = (Object.entries(data) as [Status, number][]).map(([status, count]) => ({
    status: labels[status],
    count,
  }));
  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return <div className="flex h-72 items-center justify-center text-sm text-slate-500">No data yet</div>;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 24, bottom: 0, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis type="category" dataKey="status" width={104} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip formatter={(value) => [value, 'Incidents']} contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0' }} />
          <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
