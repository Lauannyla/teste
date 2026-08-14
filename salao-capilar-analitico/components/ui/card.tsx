import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgba(80,40,120,0.04),0_8px_24px_-12px_rgba(80,40,120,0.12)]',
        className,
      )}
      {...props}
    />
  )
}
