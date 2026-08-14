'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function toISO(d: Date) {
  return d.toISOString().slice(0, 10)
}

/** Calendário mensal simples. Datas passadas ficam desabilitadas. */
export function Calendar({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (iso: string) => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (Date | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  function changeMonth(delta: number) {
    setView(new Date(year, month + delta, 1))
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => changeMonth(-1)}
          aria-label="Mês anterior"
          className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-semibold">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={() => changeMonth(1)}
          aria-label="Próximo mês"
          className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mb-1.5 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="text-xs font-medium text-muted-foreground">
            {w}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <span key={i} />
          const iso = toISO(date)
          const isPast = date < today
          const isWeekend = date.getDay() === 0
          const disabled = isPast || isWeekend
          const isSelected = selected === iso
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => onSelect(iso)}
              className={cn(
                'flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all',
                disabled && 'cursor-not-allowed text-muted-foreground/30',
                !disabled && !isSelected && 'text-foreground hover:bg-secondary',
                isSelected && 'bg-primary text-primary-foreground shadow-sm',
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Domingos indisponíveis para agendamento.</p>
    </div>
  )
}

export const HORARIOS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']
