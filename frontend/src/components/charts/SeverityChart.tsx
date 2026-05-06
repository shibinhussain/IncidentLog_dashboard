import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import type { IncidentStats, Severity } from '../../types/incident';

interface SeverityChartProps {
  data: IncidentStats['by_severity'];
}

const colors: Record<Severity, string> = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
};

export function SeverityChart({ data }: SeverityChartProps) {
  const chartData = (Object.entries(data) as [Severity, number][])
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0);
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return <div className="flex h-72 items-center justify-center text-sm text-slate-500">No data yet</div>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92}>
              {chartData.map((item) => (
                <Cell key={item.name} fill={colors[item.name]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }: TooltipProps<number, Severity>) => {
                if (!active || !payload?.length) return null;
                const item = payload[0].payload as { name: Severity; value: number };
                return (
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow dark:border-slate-800 dark:bg-slate-950">
                    <div className="font-medium capitalize text-slate-950 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">
                      {item.value} incidents ({Math.round((item.value / total) * 100)}%)
                    </div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2 self-center">
        {(Object.entries(data) as [Severity, number][]).map(([severity, count]) => (
          <div key={severity} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 capitalize text-slate-600 dark:text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[severity] }} />
              {severity}
            </span>
            <span className="font-semibold text-slate-950 dark:text-white">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
