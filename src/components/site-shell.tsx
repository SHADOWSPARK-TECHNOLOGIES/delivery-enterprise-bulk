import Link from 'next/link';

const NAV = [
  ['/', 'Overview'],
  ['/dashboard', 'Fleet'],
  ['/bulk-upload', 'Bulk upload'],
  ['/scheduled', 'Scheduled'],
  ['/reports', 'Reports'],
  ['/cold-chain', 'Cold chain'],
];

export function FleetHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-3">
        <Link href="/" className="font-mono text-lg font-bold cyber-text-grad">ss//fleet</Link>
        <nav className="ml-auto hidden items-center gap-0.5 md:flex">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg px-2.5 py-2 text-sm text-muted hover:text-cyan">{label}</Link>
          ))}
        </nav>
        <Link href="/dashboard" className="hidden rounded-lg bg-cyan px-3 py-2 text-sm font-semibold text-bg hover:shadow-glow md:block">Open fleet</Link>
      </div>
    </header>
  );
}

export function FleetFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center">
        <div className="font-mono text-lg font-bold cyber-text-grad">ss//fleet</div>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Enterprise bulk logistics for Nigeria — Lagos to Kano, cold-chain ready. © {new Date().getFullYear()} ShadowSpark Technologies · Owerri.
        </p>
      </div>
    </footer>
  );
}
