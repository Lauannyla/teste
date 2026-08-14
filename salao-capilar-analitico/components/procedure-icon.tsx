import { HelpCircle, Layers, Palette, Sparkles, Sun, Wind, type LucideIcon } from 'lucide-react'
import type { ProcedureId } from '@/lib/types'

const ICONS: Record<ProcedureId, LucideIcon> = {
  progressiva: Wind,
  botox: Sparkles,
  selagem: Layers,
  coloracao: Palette,
  descoloracao: Sun,
  geral: HelpCircle,
}

export function ProcedureIcon({
  id,
  className,
}: {
  id: ProcedureId
  className?: string
}) {
  const Icon = ICONS[id] ?? Sparkles
  return <Icon className={className} />
}
