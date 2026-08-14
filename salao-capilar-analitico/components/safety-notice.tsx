import { Info, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SAFETY_NOTICE } from '@/lib/labels'

/**
 * Aviso de segurança exibido SEMPRE junto ao resultado da pré-análise.
 * Quando `emphasis` é true (resultado "Não recomendado"), fica mais destacado.
 */
export function SafetyNotice({ emphasis = false }: { emphasis?: boolean }) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed',
        emphasis
          ? 'border-danger/30 bg-danger-soft text-danger'
          : 'border-primary/15 bg-secondary/60 text-secondary-foreground',
      )}
      role="note"
    >
      {emphasis ? (
        <ShieldAlert className="mt-0.5 size-5 shrink-0" />
      ) : (
        <Info className="mt-0.5 size-5 shrink-0" />
      )}
      <div className="space-y-1">
        {emphasis && (
          <p className="font-semibold">
            Procure o profissional antes de realizar este procedimento.
          </p>
        )}
        <p className={emphasis ? 'text-danger/90' : 'text-muted-foreground'}>{SAFETY_NOTICE}</p>
      </div>
    </div>
  )
}
