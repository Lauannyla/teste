'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CalendarCheck, CalendarDays, CheckCircle2, Clock } from 'lucide-react'
import { PageHeader } from '@/components/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar, HORARIOS } from '@/components/calendar'
import { ProcedureIcon } from '@/components/procedure-icon'
import { PROCEDURES } from '@/lib/procedures'
import { STATUS_META } from '@/lib/labels'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/store'

function AgendamentosContent() {
  const router = useRouter()
  const params = useSearchParams()
  const casoId = params.get('caso')
  const { myCases, setAppointment } = useApp()

  const cases = myCases()
  const semAgendamento = cases.filter((c) => !c.appointment)
  const agendados = cases.filter((c) => c.appointment)

  const [selectedCase, setSelectedCase] = useState<string | null>(casoId ?? null)
  const [data, setData] = useState<string | null>(null)
  const [horario, setHorario] = useState<string | null>(null)
  const [tipo, setTipo] = useState<'avaliacao' | 'atendimento'>('avaliacao')
  const [sucesso, setSucesso] = useState(false)

  const casoAtual = useMemo(
    () => cases.find((c) => c.id === selectedCase),
    [cases, selectedCase],
  )

  // Se o caso é "não recomendado", prioriza avaliação.
  useEffect(() => {
    if (casoAtual?.analysis.resultado === 'nao_recomendado') setTipo('avaliacao')
  }, [casoAtual])

  function confirmar() {
    if (!selectedCase || !data || !horario) return
    setAppointment(selectedCase, {
      data,
      horario,
      tipo,
      status: 'aguardando',
    })
    setSucesso(true)
    setData(null)
    setHorario(null)
  }

  return (
    <>
      <PageHeader
        title="Agendamentos"
        subtitle="Solicite um horário e acompanhe o status das suas solicitações."
      />

      {sucesso && (
        <Card className="mb-6 flex items-center gap-3 border-viable/30 bg-viable-soft p-4 text-viable">
          <CheckCircle2 className="size-5 shrink-0" />
          <p className="text-sm font-medium">
            Solicitação enviada! O salão irá confirmar seu horário em breve.
          </p>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Nova solicitação */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Nova solicitação</h2>

          {cases.length === 0 ? (
            <div className="rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">
              Faça uma pré-análise antes de solicitar um agendamento.
              <div className="mt-3">
                <Button className="h-9" onClick={() => router.push('/cliente/procedimento')}>
                  Iniciar pré-diagnóstico
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* escolher caso */}
              <div>
                <p className="mb-2 text-sm font-medium">Referente à pré-análise</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {cases.map((c) => {
                    const proc = PROCEDURES[c.procedimento]
                    const active = selectedCase === c.id
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCase(c.id)}
                        className={cn(
                          'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-all',
                          active
                            ? 'border-primary bg-secondary shadow-[0_0_0_3px] shadow-primary/10'
                            : 'border-border hover:border-primary/40',
                        )}
                      >
                        <ProcedureIcon id={c.procedimento} className="size-4 text-primary" />
                        <span className="font-medium">{proc.nome}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* tipo */}
              <div>
                <p className="mb-2 text-sm font-medium">Tipo de atendimento</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['avaliacao', 'atendimento'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTipo(t)}
                      className={cn(
                        'rounded-xl border px-3 py-2.5 text-sm font-medium transition-all',
                        tipo === t
                          ? 'border-primary bg-secondary text-secondary-foreground'
                          : 'border-border hover:border-primary/40',
                      )}
                    >
                      {t === 'avaliacao' ? 'Avaliação' : 'Atendimento'}
                    </button>
                  ))}
                </div>
                {casoAtual?.analysis.resultado === 'nao_recomendado' && (
                  <p className="mt-2 text-xs text-danger">
                    Para este resultado, recomendamos iniciar por uma avaliação presencial.
                  </p>
                )}
              </div>

              {/* calendário */}
              <div className="rounded-xl border border-border p-4">
                <Calendar selected={data} onSelect={setData} />
              </div>

              {/* horários */}
              {data && (
                <div>
                  <p className="mb-2 text-sm font-medium">Horários disponíveis</p>
                  <div className="grid grid-cols-4 gap-2">
                    {HORARIOS.map((h) => (
                      <button
                        key={h}
                        onClick={() => setHorario(h)}
                        className={cn(
                          'rounded-lg border py-2 text-sm font-medium transition-all',
                          horario === h
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary/40',
                        )}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                size="lg"
                className="h-11 w-full"
                disabled={!selectedCase || !data || !horario}
                onClick={confirmar}
              >
                <CalendarCheck className="size-4" />
                Solicitar {tipo === 'avaliacao' ? 'avaliação' : 'atendimento'}
              </Button>
            </div>
          )}
        </Card>

        {/* Solicitações existentes */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Minhas solicitações</h2>
          {agendados.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
              <CalendarDays className="size-8 text-muted-foreground/50" />
              Você ainda não tem agendamentos.
            </div>
          ) : (
            <ul className="space-y-3">
              {agendados.map((c) => {
                const proc = PROCEDURES[c.procedimento]
                const ap = c.appointment!
                return (
                  <li key={c.id} className="rounded-xl border border-border p-3.5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{proc.nome}</span>
                      <Badge tone={STATUS_META[ap.status].cor as never}>
                        {STATUS_META[ap.status].titulo}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-3.5" />
                        {new Date(ap.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {ap.horario}
                      </span>
                      <span className="capitalize">{ap.tipo}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          {semAgendamento.length > 0 && agendados.length > 0 && (
            <p className="mt-4 text-xs text-muted-foreground">
              {semAgendamento.length} pré-análise(s) ainda sem agendamento.
            </p>
          )}
        </Card>
      </div>
    </>
  )
}

export default function AgendamentosPage() {
  return (
    <Suspense fallback={null}>
      <AgendamentosContent />
    </Suspense>
  )
}
