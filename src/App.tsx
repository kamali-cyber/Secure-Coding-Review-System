import { useState } from 'react';
import { Menu, Terminal, ShieldAlert, GitBranch } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import VulnerableCodePage from './pages/VulnerableCodePage';
import FindingsPage from './pages/FindingsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import SecureCodePage from './pages/SecureCodePage';
import StaticAnalysisPage from './pages/StaticAnalysisPage';
import { auditMeta } from './data/auditData';

const pageMap: Record<string, () => JSX.Element> = {
  dashboard: DashboardPage,
  vulnerable: VulnerableCodePage,
  findings: FindingsPage,
  recommendations: RecommendationsPage,
  secure: SecureCodePage,
  analysis: StaticAnalysisPage,
};

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const ActivePage = pageMap[active] || DashboardPage;

  const handleNavigate = (id: string) => {
    setActive(id);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-soc-bg text-soc-text">
      <Sidebar
        active={active}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-soc-border bg-soc-bg/90 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-soc-muted hover:text-soc-bright"
              >
                <Menu size={22} />
              </button>
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-accent-cyan" />
                <span className="font-mono text-xs text-soc-muted">
                  security-audit <span className="text-soc-muted/40">/</span>{' '}
                  <span className="text-accent-cyan">{active}</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse-slow" />
                <span className="text-[11px] text-soc-muted">Scan complete</span>
              </div>
              <div className="hidden items-center gap-2 rounded-md border border-soc-border bg-soc-card/60 px-2.5 py-1 md:flex">
                <GitBranch size={12} className="text-soc-muted" />
                <span className="font-mono text-[11px] text-soc-muted">v{auditMeta.version}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert size={15} className="text-accent-red" />
                <span className="hidden text-[11px] font-semibold text-soc-muted sm:inline">
                  {auditMeta.date}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <ActivePage />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-soc-border px-4 py-5 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-[11px] text-soc-muted sm:flex-row">
            <span>{auditMeta.engagement}</span>
            <span className="font-mono text-soc-muted/60">
              Secure Coding Review · {auditMeta.target}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
