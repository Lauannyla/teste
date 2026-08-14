'use client'

import Link from 'next/link'
import { ArrowRight, CalendarDays, ClipboardList, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProcedureIcon } from '@/components/procedure-icon'
import { PROCEDURES } from '@/lib/procedures'
import { RESULT_META, STATUS_META } from '@/lib/labels'
import { useApp } from '@/lib/store'

export default function InicioPage() {
  const { client, myCases } = useApp()
  const cases = myCases()
  const ultimos = cases.slice(0, 3)

  return (
    <>
      <PageHeader
        title={`Olá, ${client?.nome?.split(' ')[0] ?? 'cliente'}!`}
        subtitle="Que bom ter você por aqui. Vamos cuidar do seu cabelo?"
      />

      {/* Destaque principal */}
      <Card className="relative mb-6 overflow-hidden border-none bg-gradient-to-br from-primary to-[oklch(0.42_0.17_305)] p-6 text-primary-foreground sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl"
        />
        <div className="relative max-w-lg space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5" /> Pré-análise em poucos minutos
          </span>
          <h2 className="text-balance text-2xl font-bold leading-tight sm:text-3xl">
            Descubra se o seu cabelo está pronto para o procedimento desejado.
          </h2>
          <p className="text-pretty text-sm text-primary-foreground/80">
            Responda um questionário rápido e receba uma orientação inicial. A avaliação presencial
            do profissional continua sendo essencial.
          </p>
          <Button
            render={<Link href="/cliente/procedimento" />}
            variant="secondary"
            size="lg"
            className="mt-2 h-11 bg-white text-primary hover:bg-white/90"
          >
            Iniciar novo pré-diagnóstico
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </Card>

      {/* Atalhos */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
            <ClipboardList className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Meus atendimentos</p>
            <p className="text-sm text-muted-foreground">
              {cases.length} registro{cases.length === 1 ? '' : 's'}
            </p>
          </div>
          <Button render={<Link href="/cliente/atendimentos" />} variant="ghost" size="icon-lg">
            <ArrowRight className="size-4" />
          </Button>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
            <CalendarDays className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Agendamentos</p>
            <p className="text-sm text-muted-foreground">Solicite ou acompanhe seus horários</p>
          </div>
          <Button render={<Link href="/cliente/agendamentos" />} variant="ghost" size="icon-lg">
            <ArrowRight className="size-4" />
          </Button>
        </Card>
      </div>

      {/* Últimas pré-análises */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Suas pré-análises recentes</h3>
        {cases.length > 0 && (
          <Link href="/cliente/atendimentos" className="text-sm text-primary hover:underline">
            Ver todas
          </Link>
        )}
      </div>

      {ultimos.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">
            <Sparkles className="size-6" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold">Você ainda não tem pré-análises</p>
            <p className="text-sm text-muted-foreground">
              Comece agora e descubra os cuidados ideais para o seu cabelo.
            </p>
          </div>
          <Button render={<Link href="/cliente/procedimento" />} className="mt-2 h-10">
            Fazer minha primeira pré-análise
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ultimos.map((c) => {
            const proc = PROCEDURES[c.procedimento]
            const meta = RESULT_META[c.analysis.resultado]
            return (
              <Card key={c.id} className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                      <ProcedureIcon id={c.procedimento} className="size-4" />
                    </div>
                    <span className="font-semibold">{proc.nome}</span>
                  </div>
                  <Badge tone={meta.cor as never}>{meta.curto}</Badge>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">
                  {new Date(c.criadoEm).toLocaleDateString('pt-BR')}
                </p>
                {c.appointment && (
                  <Badge tone={STATUS_META[c.appointment.status].cor as never}>
                    {STATUS_META[c.appointment.status].titulo}
                  </Badge>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}
