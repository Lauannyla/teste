'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Option {
  value: string
  label: string
}

/**
 * Grupo de opções em formato de cartões selecionáveis, com feedback visual.
 * Usado nas perguntas do questionário.
 */
export function OptionGroup({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: Option[]
  value: string
  onChange: (value: string) => void
  columns?: 1 | 2 | 3
}) {
  const cols = { 1: 'grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' }[columns]
  return (
    <div className={cn('grid gap-2.5', cols)}>
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all',
              active
                ? 'border-primary bg-secondary text-secondary-foreground shadow-[0_0_0_3px] shadow-primary/10'
                : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary/40',
            )}
          >
            {opt.label}
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full border transition-all',
                active ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
              )}
            >
              {active && <Check className="size-3" strokeWidth={3} />}
            </span>
          </button>
        )
      })}
    </div>
  )
}
