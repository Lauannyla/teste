import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RESULT_META } from '@/lib/labels'
import type { ResultLevel } from '@/lib/types'

const ICONS = {
  viavel: CheckCircle2,
  viavel_com_restricoes: AlertTriangle,
  nao_recomendado: XCircle,
}

const STYLES: Record<ResultLevel, { ring: string; bg: string; text: string; lamp: string }> = {
  viavel: {
    ring: 'ring-viable/25',
    bg: 'bg-viable-soft',
    text: 'text-viable',
    lamp: 'bg-viable',
  },
  viavel_com_restricoes: {
    ring: 'ring-restriction/30',
    bg: 'bg-restriction-soft',
    text: 'text-restriction-foreground',
    lamp: 'bg-restriction',
  },
  nao_recomendado: {
    ring: 'ring-danger/25',
    bg: 'bg-danger-soft',
    text: 'text-danger',
    lamp: 'bg-danger',
  },
}

/** Indicador grande em formato de semáforo para o resultado da pré-análise. */
export function Semaphore({ level }: { level: ResultLevel }) {
  const meta = RESULT_META[level]
  const s = STYLES[level]
  const Icon = ICONS[level]
  const order: ResultLevel[] = ['viavel', 'viavel_com_restricoes', 'nao_recomendado']

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-5 rounded-3xl p-8 text-center ring-1',
        s.bg,
        s.ring,
      )}
    >
      {/* lâmpadas do semáforo */}
      <div className="flex items-center gap-2 rounded-full bg-card/70 p-2 shadow-sm ring-1 ring-border/50">
        {order.map((lvl) => (
          <span
            key={lvl}
            className={cn(
              'size-3 rounded-full transition-all',
              lvl === level ? STYLES[lvl].lamp : 'bg-muted-foreground/20',
              lvl === level && 'scale-125 shadow-[0_0_0_4px] shadow-current/10',
            )}
          />
        ))}
      </div>

      <div className={cn('flex size-20 items-center justify-center rounded-full bg-card/70 shadow-sm', s.text)}>
        <Icon className="size-11" strokeWidth={2} />
      </div>

      <div className="space-y-1">
        <p className="label-mono">Resultado da pré-análise</p>
        <h2 className={cn('text-3xl font-bold tracking-tight', s.text)}>{meta.titulo}</h2>
      </div>
      <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
        {meta.descricao}
      </p>
    </div>
  )
}
