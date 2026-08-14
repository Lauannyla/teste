import { cn } from '@/lib/utils'

type Tone = 'viable' | 'restriction' | 'danger' | 'muted' | 'primary'

const TONES: Record<Tone, string> = {
  viable: 'bg-viable-soft text-viable border-viable/25',
  restriction: 'bg-restriction-soft text-restriction-foreground border-restriction/35',
  danger: 'bg-danger-soft text-danger border-danger/25',
  muted: 'bg-muted text-muted-foreground border-border',
  primary: 'bg-secondary text-secondary-foreground border-primary/20',
}

export function Badge({
  tone = 'muted',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Dot({ tone }: { tone: Tone }) {
  const colors: Record<Tone, string> = {
    viable: 'bg-viable',
    restriction: 'bg-restriction',
    danger: 'bg-danger',
    muted: 'bg-muted-foreground',
    primary: 'bg-primary',
  }
  return <span className={cn('size-1.5 rounded-full', colors[tone])} />
}
