'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, ClipboardList, Home, Sparkles, User } from 'lucide-react'
import { AppShell, type NavItem } from '@/components/app-shell'
import { useApp } from '@/lib/store'

const NAV: NavItem[] = [
  { href: '/cliente/inicio', label: 'Início', icon: Home },
  { href: '/cliente/procedimento', label: 'Novo Pré-Diagnóstico', icon: Sparkles },
  { href: '/cliente/atendimentos', label: 'Meus Atendimentos', icon: ClipboardList },
  { href: '/cliente/agendamentos', label: 'Agendamentos', icon: CalendarDays },
  { href: '/cliente/perfil', label: 'Perfil', icon: User },
]

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const { client, logoutClient } = useApp()
  const router = useRouter()

  // Protege a área do cliente: sem login, volta para a tela inicial.
  useEffect(() => {
    if (!client) router.replace('/')
  }, [client, router])

  if (!client) return null

  return (
    <AppShell items={NAV} onLogout={logoutClient} variant="cliente">
      {children}
    </AppShell>
  )
}
