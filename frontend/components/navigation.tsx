'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FolderKanban, Workflow, Bot, Settings } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/workflows', label: 'Workflows', icon: Workflow },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-bold text-white">
            ClawCortex
          </Link>
          <div className="flex gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href || (href !== '/' && pathname.startsWith(href));

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
