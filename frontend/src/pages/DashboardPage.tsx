import { AlertTriangle, CheckCircle2, CircleAlert, ListChecks } from 'lucide-react';
import type { ReactNode } from 'react';
import { IncidentsOverTimeChart } from '../components/charts/IncidentsOverTimeChart';
import { SeverityChart } from '../components/charts/SeverityChart';
import { StatusBreakdownChart } from '../components/charts/StatusBreakdownChart';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { useStats } from '../hooks/useStats';

function ChartPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h2 className="mb-4 text-base font-semibold text-slate-950 dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

export function DashboardPage() {
  const { data: stats, isLoading, error } = useStats();

  const today = new Date().toISOString().slice(0, 10);
  const resolvedToday =
    stats?.by_date.find((item) => item.date.slice(0, 10) === today)?.count ?? 0;

  const cards = [
    {
      label: 'Total Incidents',
      value: stats?.total ?? 0,
      icon: ListChecks,
      className: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Open Incidents',
      value: stats?.by_status.open ?? 0,
      icon: CircleAlert,
      className: 'bg-sky-50 text-sky-700',
    },
    {
      label: 'Critical Incidents',
      value: stats?.by_severity.critical ?? 0,
      icon: AlertTriangle,
      className: 'bg-red-50 text-red-700',
    },
    {
      label: 'Incidents Today',
      value: resolvedToday,
      icon: CheckCircle2,
      className: 'bg-emerald-50 text-emerald-700',
    },
  ];

  if (error) {
    return (
      <PageWrapper title="Dashboard" subtitle="Monitor incident volume and response posture.">
        <div className="rounded-lg border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          Failed to load dashboard stats.
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Dashboard" subtitle="Monitor incident volume and response posture.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <section
              key={card.label}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {card.label}
                  </p>
                  {isLoading ? (
                    <SkeletonLoader className="mt-3" width={72} height={32} />
                  ) : (
                    <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
                      {card.value}
                    </p>
                  )}
                </div>
                <span className={`rounded-md p-2 ${card.className}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartPanel title="Severity Breakdown">
          {isLoading || !stats ? <SkeletonLoader height={288} /> : <SeverityChart data={stats.by_severity} />}
        </ChartPanel>
        <ChartPanel title="Incidents Over Time">
          {isLoading || !stats ? <SkeletonLoader height={288} /> : <IncidentsOverTimeChart data={stats.by_date} />}
        </ChartPanel>
      </div>

      <div className="mt-6">
        <ChartPanel title="Status Breakdown">
          {isLoading || !stats ? <SkeletonLoader height={288} /> : <StatusBreakdownChart data={stats.by_status} />}
        </ChartPanel>
      </div>
    </PageWrapper>
  );
}
