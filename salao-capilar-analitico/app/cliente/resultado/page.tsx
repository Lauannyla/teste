'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CalendarPlus,
  CircleDot,
  Clock,
  FlaskConical,
  Info,
  ListChecks,
  Loader2,
  Repeat,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Semaphore } from '@/components/semaphore'
import { SafetyNotice } from '@/components/safety-notice'
import { ProcedureIcon } from '@/components/procedure-icon'
import { PROCEDURES, formatPrice } from '@/lib/procedures'
import { useApp } from '@/lib/store'
import type { CaseRecord } from '@/lib/types'

export default function ResultadoPage() {
  const router = useRouter()
  const { draft, submitDraft } = useApp()
  const [loading, setLoading] = useState(true)
  const [record, setRecord] = useState<CaseRecord | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!draft.procedimento) {
      router.replace('/cliente/procedimento')
      return
    }
    if (started.current) return
    started.current = true
    // Simula o tempo de análise (futuramente: chamada à API Flask).
    const timer = setTimeout(async () => {
      const rec = await submitDraft()
      setRecord(rec)
      setLoading(false)
    }, 2200)
    return () => clearTimeout(timer)
  }, [draft.procedimento, router, submitDraft])

  if (loading || !record) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="relative flex size-24 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/15" />
          <span className="absolute inset-2 animate-pulse rounded-full bg-primary/20" />
          <Loader2 className="size-9 animate-spin text-primary" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold tracking-tight">Analisando suas respostas...</h1>
          <p className="max-w-xs text-pretty text-sm text-muted-foreground">
            Estamos avaliando o histórico e o estado do seu cabelo para gerar a pré-análise.
          </p>
        </div>
      </div>
    )
  }

  const proc = PROCEDURES[record.procedimento]
  const { analysis } = record
  const emphasis = analysis.resultado === 'nao_recomendado'

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Semáforo */}
      <Semaphore level={analysis.resultado} />

      {/* Aviso de segurança */}
      <SafetyNotice emphasis={emphasis} />

      {/* Fatores */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <ListChecks className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Por que chegamos a esse resultado?</h2>
        </div>
        <ul className="space-y-2.5">
          {analysis.fatores.map((fator, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
              <CircleDot className="mt-0.5 size-4 shrink-0 text-primary/70" />
              <span className="text-foreground">{fator}</span>
            </li>
          ))}
        </ul>
        {analysis.necessitaTesteMecha && (
          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-restriction-soft p-3.5 text-sm text-restriction-foreground">
            <FlaskConical className="size-4 shrink-0" />
            <span>
              Pode ser recomendado um <strong>teste de mecha</strong> antes do procedimento.
            </span>
          </div>
        )}
      </Card>

      {/* Informações do procedimento */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
            <ProcedureIcon id={proc.id} className="size-4" />
          </div>
          <h2 className="text-lg font-semibold">Sobre o procedimento: {proc.nome}</h2>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <InfoTile icon={<Clock className="size-4" />} rotulo="Tempo aproximado" valor={proc.tempoAproximado} />
          <InfoTile icon={<Repeat className="size-4" />} rotulo="Sessões estimadas" valor={proc.sessoes} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Cuidados antes</h3>
            <ul className="space-y-1.5">
              {proc.cuidadosAntes.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Cuidados depois</h3>
            <ul className="space-y-1.5">
              {proc.cuidadosDepois.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-muted p-3.5 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <span>
            {proc.observacoes} Estas informações são estimativas e podem ser alteradas após a
            avaliação presencial.
          </span>
        </div>
      </Card>

      {/* Preço */}
      <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <p className="label-mono">
            {proc.preco === null ? 'Valor' : 'Valor do procedimento'}
          </p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {proc.preco === null ? 'Definido após avaliação profissional' : formatPrice(proc.preco)}
          </p>
          {proc.preco === null && (
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              O valor deste atendimento pode variar de acordo com a avaliação realizada pelo
              profissional.
            </p>
          )}
        </div>
      </Card>

      {/* CTA agendamento */}
      <Card
        className={
          emphasis
            ? 'border-danger/25 bg-danger-soft p-6'
            : 'border-primary/20 bg-secondary/50 p-6'
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-md space-y-1">
            <h3 className="font-semibold">
              {emphasis ? 'Agende uma avaliação presencial' : 'Pronta para o próximo passo?'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {emphasis
                ? 'Recomendamos agendar uma avaliação com o profissional antes de qualquer procedimento.'
                : 'Solicite um horário para avaliação ou atendimento no salão.'}
            </p>
          </div>
          <Button
            size="lg"
            className="h-11"
            onClick={() => router.push(`/cliente/agendamentos?caso=${record.id}`)}
          >
            <CalendarPlus className="size-4" />
            {emphasis ? 'Agendar avaliação' : 'Solicitar agendamento'}
          </Button>
        </div>
      </Card>

      <div className="flex justify-center pb-4">
        <Button variant="ghost" onClick={() => router.push('/cliente/atendimentos')}>
          Ver em meus atendimentos
        </Button>
      </div>
    </div>
  )
}

function InfoTile({
  icon,
  rotulo,
  valor,
}: {
  icon: React.ReactNode
  rotulo: string
  valor: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5">
      <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{rotulo}</p>
        <p className="text-sm font-medium">{valor}</p>
      </div>
    </div>
  )
}
