import {
  LayoutDashboard, Bug, ListChecks, ShieldCheck, Lock,
  ScanSearch, ShieldAlert, X,
} from 'lucide-react';
import { navItems, auditMeta } from '../data/auditData';
import { dashboardStats } from '../data/auditData';

const iconMap: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard, Bug, ListChecks, ShieldCheck, Lock, ScanSearch,
};

interface SidebarProps {
  active: string;
  onNavigate: (id: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ active, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-soc-border bg-soc-panel/95 backdrop-blur-md transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-soc-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green/10 border border-accent-green/30">
              <ShieldAlert size={22} className="text-accent-green" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent-green animate-pulse-slow" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold text-soc-bright leading-tight">
                SECURE CODING
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-accent-green font-semibold">
                Review Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-soc-muted hover:text-soc-bright"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-soc-muted/60">
            Audit Sections
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? 'nav-active-glow bg-accent-cyan/5 text-accent-cyan font-semibold'
                        : 'text-soc-muted hover:bg-soc-card/60 hover:text-soc-bright'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={isActive ? 'text-accent-cyan' : 'text-soc-muted group-hover:text-soc-text'}
                    />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Risk summary footer */}
        <div className="border-t border-soc-border px-4 py-4">
          <div className="rounded-lg border border-soc-border bg-soc-card/60 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-soc-muted">Risk Score</span>
              <span className="text-lg font-display font-extrabold text-accent-green tabular-nums">
                {dashboardStats.riskScore}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-soc-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-cyan"
                style={{ width: `${100 - dashboardStats.riskScore}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-soc-muted">
              <span>{dashboardStats.high} High</span>
              <span>{dashboardStats.open} Open</span>
              <span>{dashboardStats.resolved} Resolved</span>
            </div>
          </div>
          <p className="mt-3 px-1 text-[9px] leading-relaxed text-soc-muted/50">
            {auditMeta.engagement}
          </p>
        </div>
      </aside>
    </>
  );
}
