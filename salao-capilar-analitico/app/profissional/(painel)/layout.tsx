'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/store'
import { AppShell, type NavItem } from '@/components/app-shell'
import { LayoutDashboard, Users, CalendarDays, ClipboardList, Settings } from 'lucide-react'

const NAV: NavItem[] = [
  { href: '/profissional/painel', label: 'Painel', icon: LayoutDashboard },
  { href: '/profissional/clientes', label: 'Clientes', icon: Users },
  { href: '/profissional/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/profissional/historico', label: 'Histórico', icon: ClipboardList },
  { href: '/profissional/configuracoes', label: 'Configurações', icon: Settings },
]

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const { professionalLogged, logoutProfessional } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!professionalLogged) router.replace('/profissional/login')
  }, [professionalLogged, router])

  if (!professionalLogged) return null

  return (
    <AppShell items={NAV} onLogout={logoutProfessional} variant="profissional">
      {children}
    </AppShell>
  )
}
