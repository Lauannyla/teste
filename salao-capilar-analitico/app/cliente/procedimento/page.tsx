'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/app-shell'
import { Card } from '@/components/ui/card'
import { ProcedureIcon } from '@/components/procedure-icon'
import { PROCEDURE_LIST, formatPrice } from '@/lib/procedures'
import { useApp } from '@/lib/store'
import type { ProcedureId } from '@/lib/types'

export default function ProcedimentoPage() {
  const router = useRouter()
  const { startDraft } = useApp()

  function escolher(id: ProcedureId) {
    startDraft(id)
    router.push('/cliente/questionario')
  }

  return (
    <>
      <PageHeader
        title="O que você deseja fazer?"
        subtitle="Escolha o procedimento desejado. Em seguida, você responderá um questionário rápido."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PROCEDURE_LIST.map((proc) => (
          <button
            key={proc.id}
            onClick={() => escolher(proc.id)}
            className="group text-left"
          >
            <Card className="flex h-full flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_32px_-14px_rgba(90,40,140,0.28)]">
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ProcedureIcon id={proc.id} className="size-6" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{proc.nome}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                {proc.descricao}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-medium text-foreground">
                  {proc.preco === null ? 'A definir' : formatPrice(proc.preco)}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Selecionar
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </>
  )
}
