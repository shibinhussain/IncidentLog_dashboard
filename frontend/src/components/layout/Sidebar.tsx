import { BarChart3, ListChecks } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

interface SidebarProps {
  incidentCount?: number;
}

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/incidents', label: 'Incidents', icon: ListChecks },
];

export function Sidebar({ incidentCount }: SidebarProps) {
  return (
    <aside className="hidden w-64 flex-none border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-950 lg:block">
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800',
                )
              }
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {link.label}
              </span>
              {link.to === '/incidents' && incidentCount !== undefined ? (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                  {incidentCount}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
