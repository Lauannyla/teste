'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send } from 'lucide-react'
import { PageHeader } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProcedureIcon } from '@/components/procedure-icon'
import { PROCEDURES } from '@/lib/procedures'
import { label } from '@/lib/labels'
import { useApp } from '@/lib/store'

export default function RevisaoPage() {
  const router = useRouter()
  const { draft } = useApp()
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!draft.procedimento) router.replace('/cliente/procedimento')
  }, [draft.procedimento, router])

  if (!draft.procedimento) return null
  const proc = PROCEDURES[draft.procedimento]
  const q = draft.questionnaire

  function enviar() {
    setEnviando(true)
    // A pré-análise em si roda na tela de resultado (com loading).
    router.push('/cliente/resultado')
  }

  const grupos: { titulo: string; itens: { rotulo: string; valor: string }[] }[] = [
    {
      titulo: 'Histórico do cabelo',
      itens: [
        { rotulo: 'Tipo de cabelo', valor: label(q.tipoCabelo) },
        { rotulo: 'Já fez alisamento', valor: label(q.jaAlisamento) },
        { rotulo: 'Já fez descoloração', valor: label(q.jaDescoloracao) },
        { rotulo: 'Já fez coloração', valor: label(q.jaColoracao) },
        { rotulo: 'Última química', valor: label(q.ultimaQuimica) },
      ],
    },
    {
      titulo: 'Estado do cabelo',
      itens: [
        { rotulo: 'Saúde atual', valor: label(q.saudeCabelo) },
        { rotulo: 'Hidratação', valor: label(q.hidratacao) },
        { rotulo: 'Corte químico', valor: label(q.corteQuimico) },
      ],
    },
    {
      titulo: 'Uso de fontes de calor',
      itens: [
        { rotulo: 'Geral', valor: label(q.usoCalor) },
        { rotulo: 'Chapinha', valor: label(q.freqChapinha) },
        { rotulo: 'Secador', valor: label(q.freqSecador) },
        { rotulo: 'Babyliss/modelador', valor: label(q.freqBabyliss) },
      ],
    },
    {
      titulo: 'Outras informações',
      itens: [
        { rotulo: 'Alergias', valor: q.alergia === 'sim' ? `Sim — ${q.alergiaQual || 'não especificado'}` : label(q.alergia) },
        { rotulo: 'Informações adicionais', valor: q.infoAdicional || '—' },
        { rotulo: 'Resultado desejado', valor: q.resultadoDesejado || '—' },
      ],
    },
  ]

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Confira suas respostas" subtitle="Revise antes de enviar para a pré-análise." />

      {/* Procedimento */}
      <Card className="mb-4 flex items-center gap-3 p-5">
        <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
          <ProcedureIcon id={proc.id} className="size-5" />
        </div>
        <div>
          <p className="label-mono">Procedimento escolhido</p>
          <p className="font-semibold">{proc.nome}</p>
        </div>
      </Card>

      {/* Dados do cliente */}
      <Card className="mb-4 p-5">
        <h3 className="mb-3 font-semibold">Seus dados</h3>
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          <Item rotulo="Nome" valor={q.nome} />
          <Item rotulo="Telefone" valor={q.telefone} />
          <Item rotulo="E-mail" valor={q.email} />
        </dl>
      </Card>

      {grupos.map((g) => (
        <Card key={g.titulo} className="mb-4 p-5">
          <h3 className="mb-3 font-semibold">{g.titulo}</h3>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {g.itens.map((it) => (
              <Item key={it.rotulo} rotulo={it.rotulo} valor={it.valor} />
            ))}
          </dl>
        </Card>
      ))}

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="lg"
          className="h-11"
          onClick={() => router.push('/cliente/questionario')}
        >
          <ArrowLeft className="size-4" />
          Editar respostas
        </Button>
        <Button size="lg" className="h-11" onClick={enviar} disabled={enviando}>
          <Send className="size-4" />
          Enviar para pré-análise
        </Button>
      </div>
    </div>
  )
}

function Item({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 py-1.5 last:border-0 sm:border-0">
      <dt className="text-xs text-muted-foreground">{rotulo}</dt>
      <dd className="text-sm font-medium text-foreground">{valor}</dd>
    </div>
  )
}
