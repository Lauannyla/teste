'use client'

import { cn } from '@/lib/utils'
import { useApp } from '@/lib/store'

/**
 * Marca da empresa. O NOME e a LOGO são propositalmente editáveis:
 * enquanto o nome não for definido nas Configurações, mostramos um
 * placeholder "Sua Empresa". A logo é representada por um monograma.
 */
export function Brand({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const { companyName } = useApp()
  const name = companyName?.trim() || 'Sua Empresa'
  const initial = (companyName?.trim()?.[0] ?? 'S').toUpperCase()

  const dims = {
    sm: { box: 'size-8 text-sm rounded-lg', text: 'text-sm' },
    md: { box: 'size-10 text-base rounded-xl', text: 'text-lg' },
    lg: { box: 'size-14 text-2xl rounded-2xl', text: 'text-2xl' },
  }[size]

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        aria-hidden
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-primary to-[oklch(0.42_0.17_305)] font-semibold text-primary-foreground shadow-sm',
          dims.box,
        )}
      >
        {initial}
      </div>
      <div className="flex flex-col leading-tight">
        <span className={cn('font-semibold tracking-tight text-foreground', dims.text)}>
          {name}
        </span>
        {!companyName?.trim() && (
          <span className="text-[0.65rem] text-muted-foreground">nome editável</span>
        )}
      </div>
    </div>
  )
}
