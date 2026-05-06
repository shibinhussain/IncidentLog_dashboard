import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { IncidentStats } from '../../types/incident';
import { formatFullDate, formatShortDate } from '../../utils/format';

interface IncidentsOverTimeChartProps {
  data: IncidentStats['by_date'];
}

export function IncidentsOverTimeChart({ data }: IncidentsOverTimeChartProps) {
  const hasData = data.some((item) => item.count > 0);

  if (!hasData) {
    return <div className="flex h-72 items-center justify-center text-sm text-slate-500">No data yet</div>;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            tick={{ fontSize: 12, fill: '#64748b' }}
            interval="preserveStartEnd"
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip
            labelFormatter={(label) => formatFullDate(String(label))}
            formatter={(value) => [value, 'Incidents']}
            contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0' }}
          />
          <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
