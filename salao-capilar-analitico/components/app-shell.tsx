'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Menu, X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Brand } from '@/components/brand'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

/**
 * Casca de aplicação com navegação lateral (desktop) e menu hambúrguer (mobile).
 * Reutilizada pelas áreas do cliente e do profissional.
 */
export function AppShell({
  items,
  onLogout,
  variant = 'cliente',
  children,
}: {
  items: NavItem[]
  onLogout: () => void
  variant?: 'cliente' | 'profissional'
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    onLogout()
    router.push(variant === 'profissional' ? '/profissional/login' : '/')
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
            )}
          >
            <Icon className="size-[18px]" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  const logoutBtn = (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-danger-soft hover:text-danger"
    >
      <LogOut className="size-[18px]" />
      Sair
    </button>
  )

  return (
    <div className="flex min-h-svh bg-background">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <div className="px-1 pt-2">
          <Brand size="sm" />
        </div>
        {nav}
        {logoutBtn}
      </aside>

      {/* Topbar mobile */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <Brand size="sm" />
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground"
          >
            <Menu className="size-5" />
          </button>
        </header>

        {/* Drawer mobile */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 top-0 flex h-full w-72 flex-col gap-6 bg-sidebar p-4 shadow-xl">
              <div className="flex items-center justify-between px-1 pt-1">
                <Brand size="sm" />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fechar menu"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>
              {nav}
              {logoutBtn}
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  )
}

/** Cabeçalho de página reutilizável. */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
