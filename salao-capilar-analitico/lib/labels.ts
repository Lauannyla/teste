import type { AppointmentStatus, EvaluationDecision, ResultLevel } from './types'

// Mapas de rótulos legíveis para os valores armazenados no questionário.

export const LABELS: Record<string, string> = {
  // tipo de cabelo
  natural: 'Natural',
  quimica: 'Possui química',
  // sim/nao
  sim: 'Sim',
  nao: 'Não',
  nao_sei: 'Não sei',
  // última química
  menos_1: 'Menos de 1 mês',
  '1_3': 'De 1 a 3 meses',
  '3_6': 'De 3 a 6 meses',
  mais_6: 'Mais de 6 meses',
  nunca: 'Nunca',
  // saúde
  muito_saudavel: 'Muito saudável',
  saudavel: 'Saudável',
  ressecado: 'Ressecado',
  quebradico: 'Quebradiço',
  muito_danificado: 'Muito danificado',
  elastico: 'Elástico',
  // hidratação
  regular: 'Sim, regularmente',
  as_vezes: 'Às vezes',
  // calor
  raramente: 'Raramente',
  algumas_semana: 'Algumas vezes por semana',
  frequentemente: 'Frequentemente',
  todos_dias: 'Todos os dias',
}

export function label(value: string): string {
  if (!value) return '—'
  return LABELS[value] ?? value
}

export const RESULT_META: Record<
  ResultLevel,
  { titulo: string; curto: string; cor: string; soft: string; emoji: string; descricao: string }
> = {
  viavel: {
    titulo: 'Viável',
    curto: 'Viável',
    cor: 'viable',
    soft: 'viable-soft',
    emoji: '🟢',
    descricao:
      'Com base nas informações fornecidas, não foram identificados fatores que impeçam inicialmente o procedimento.',
  },
  viavel_com_restricoes: {
    titulo: 'Viável com restrições',
    curto: 'Com restrições',
    cor: 'restriction',
    soft: 'restriction-soft',
    emoji: '🟡',
    descricao:
      'Existem fatores que precisam de atenção e que o profissional deverá avaliar antes da realização.',
  },
  nao_recomendado: {
    titulo: 'Não recomendado',
    curto: 'Não recomendado',
    cor: 'danger',
    soft: 'danger-soft',
    emoji: '🔴',
    descricao:
      'Foram identificados fatores que podem exigir avaliação profissional antes da realização do procedimento.',
  },
}

export const EVALUATION_META: Record<EvaluationDecision, { titulo: string; cor: string }> = {
  pendente: { titulo: 'Avaliação pendente', cor: 'muted' },
  aprovado: { titulo: 'Aprovado', cor: 'viable' },
  aprovado_com_cuidados: { titulo: 'Aprovado com cuidados', cor: 'restriction' },
  nao_recomendado: { titulo: 'Não recomendado', cor: 'danger' },
}

export const STATUS_META: Record<AppointmentStatus, { titulo: string; cor: string }> = {
  aguardando: { titulo: 'Aguardando confirmação', cor: 'restriction' },
  confirmado: { titulo: 'Confirmado', cor: 'viable' },
  reagendar: { titulo: 'Reagendar', cor: 'muted' },
  cancelado: { titulo: 'Cancelado', cor: 'danger' },
}

export const SAFETY_NOTICE =
  'Importante: esta é apenas uma pré-análise baseada nas informações fornecidas no questionário. Ela não substitui uma avaliação profissional presencial. Antes de realizar o procedimento, recomendamos uma avaliação no salão e, quando necessário, a realização de um teste de mecha ou outra avaliação técnica.'
