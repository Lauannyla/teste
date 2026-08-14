'use client'

import Link from 'next/link'
import { useApp } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProcedureIcon } from '@/components/procedure-icon'
import { getProcedure } from '@/lib/procedures'
import { CalendarClock, Plus } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  aguardando: 'Aguardando confirmação',
  confirmado: 'Confirmado',
  reagendar: 'Reagendamento solicitado',
  cancelado: 'Cancelado',
}

const STATUS_TONE: Record<string, 'amber' | 'green' | 'lilac' | 'red'> = {
  aguardando: 'amber',
  confirmado: 'green',
  reagendar: 'lilac',
  cancelado: 'red',
}

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
}

export default function MeusAgendamentosPage() {
  const { myCases } = useApp()
  const cases = myCases().filter((c) => c.appointment)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Meus agendamentos</h1>
          <p className="mt-1 text-muted-foreground">Acompanhe suas avaliações e atendimentos marcados.</p>
        </div>
        <Button asChild size="default" className="rounded-full">
          <Link href="/cliente/procedimento">
            <Plus className="size-4" />
            Nova análise
          </Link>
        </Button>
      </header>

      {cases.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">
            <CalendarClock className="size-7" />
          </div>
          <h2 className="font-serif text-xl text-foreground">Nenhum agendamento ainda</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Faça uma pré-análise para liberar o agendamento da sua avaliação presencial.
          </p>
          <Button asChild className="mt-2 rounded-full">
            <Link href="/cliente/procedimento">Iniciar pré-análise</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {cases.map((c) => {
            const proc = getProcedure(c.procedimento)
            const appt = c.appointment!
            return (
              <Card key={c.id} className="flex flex-wrap items-center gap-5">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <ProcedureIcon id={c.procedimento} className="size-6" />
                </div>
                <div className="min-w-[180px] flex-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {appt.tipo === 'avaliacao' ? 'Avaliação presencial' : 'Atendimento'}
                  </p>
                  <p className="font-medium text-foreground">{proc.nome}</p>
                  <p className="mt-1 text-sm capitalize text-muted-foreground">
                    {formatDate(appt.data)} · {appt.horario}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[appt.status]}>{STATUS_LABEL[appt.status]}</Badge>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
