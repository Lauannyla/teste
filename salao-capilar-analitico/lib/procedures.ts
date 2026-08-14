import type { ProcedureId } from './types'

/**
 * Catálogo de procedimentos do salão.
 *
 * Os preços são fixos e demonstrativos. Foram centralizados aqui para que
 * possam ser facilmente alterados no futuro (ou carregados de uma API Flask).
 * O procedimento "geral" tem preço variável, definido após avaliação.
 */

export interface ProcedureInfo {
  id: ProcedureId
  nome: string
  icone: string // nome do ícone lucide
  descricao: string
  /** Preço fixo em reais. null = definido após avaliação (procedimento geral). */
  preco: number | null
  tempoAproximado: string
  sessoes: string
  cuidadosAntes: string[]
  cuidadosDepois: string[]
  observacoes: string
}

export const PROCEDURES: Record<ProcedureId, ProcedureInfo> = {
  progressiva: {
    id: 'progressiva',
    nome: 'Progressiva',
    icone: 'Wind',
    descricao: 'Alisamento e redução de volume para fios mais lisos e alinhados.',
    preco: 280,
    tempoAproximado: '2h a 3h',
    sessoes: 'Sessão única (retoque a cada 3-4 meses)',
    cuidadosAntes: [
      'Evite lavar o cabelo no dia do procedimento.',
      'Não faça outras químicas nos dias anteriores.',
      'Informe o profissional sobre químicas recentes.',
    ],
    cuidadosDepois: [
      'Aguarde o tempo indicado antes da primeira lavagem.',
      'Use shampoo sem sal para prolongar o resultado.',
      'Evite prender o cabelo nos primeiros dias.',
    ],
    observacoes:
      'A progressiva reage de formas diferentes conforme o histórico químico do fio.',
  },
  botox: {
    id: 'botox',
    nome: 'Botox Capilar',
    icone: 'Sparkles',
    descricao: 'Tratamento de reconstrução e nutrição profunda dos fios.',
    preco: 220,
    tempoAproximado: '1h30 a 2h30',
    sessoes: 'Sessão única (manutenção mensal opcional)',
    cuidadosAntes: [
      'Cabelo limpo, sem resíduos de finalizadores.',
      'Informe tratamentos recentes ao profissional.',
    ],
    cuidadosDepois: [
      'Hidrate regularmente para manter a nutrição.',
      'Evite fontes de calor em excesso.',
    ],
    observacoes:
      'Indicado para fios ressecados; o resultado varia conforme o dano existente.',
  },
  selagem: {
    id: 'selagem',
    nome: 'Selagem',
    icone: 'Layers',
    descricao: 'Selagem térmica para reduzir frizz e dar brilho aos fios.',
    preco: 200,
    tempoAproximado: '1h30 a 2h30',
    sessoes: 'Sessão única',
    cuidadosAntes: [
      'Cabelo higienizado antes do atendimento.',
      'Evite outras químicas próximas à data.',
    ],
    cuidadosDepois: [
      'Use produtos indicados para selagem.',
      'Evite acúmulo de resíduos e oleosidade.',
    ],
    observacoes: 'A durabilidade depende dos cuidados de manutenção em casa.',
  },
  coloracao: {
    id: 'coloracao',
    nome: 'Coloração',
    icone: 'Palette',
    descricao: 'Mudança ou realce de cor com tinturas profissionais.',
    preco: 180,
    tempoAproximado: '1h30 a 2h30',
    sessoes: 'Sessão única (retoque de raiz conforme crescimento)',
    cuidadosAntes: [
      'Teste de mecha pode ser solicitado.',
      'Informe alergias a produtos químicos.',
    ],
    cuidadosDepois: [
      'Use linha para cabelos coloridos.',
      'Proteja a cor do sol e do cloro.',
    ],
    observacoes: 'O resultado da cor depende da base e do histórico do fio.',
  },
  descoloracao: {
    id: 'descoloracao',
    nome: 'Descoloração',
    icone: 'Sun',
    descricao: 'Clareamento dos fios para bases mais claras e mechas.',
    preco: 320,
    tempoAproximado: '2h30 a 4h',
    sessoes: 'Pode exigir mais de uma sessão',
    cuidadosAntes: [
      'Teste de mecha altamente recomendado.',
      'Cabelo em bom estado reduz riscos.',
      'Evite química recente antes de descolorir.',
    ],
    cuidadosDepois: [
      'Reconstrução e hidratação são essenciais.',
      'Evite calor excessivo nas primeiras semanas.',
    ],
    observacoes:
      'Procedimento mais sensível: exige avaliação cuidadosa do estado do fio.',
  },
  geral: {
    id: 'geral',
    nome: 'Geral / Não sei qual preciso',
    icone: 'HelpCircle',
    descricao: 'Não tem certeza do procedimento? O profissional indica o melhor.',
    preco: null, // definido após avaliação profissional
    tempoAproximado: 'Definido após avaliação',
    sessoes: 'Definido após avaliação',
    cuidadosAntes: ['Traga o histórico do seu cabelo para a avaliação.'],
    cuidadosDepois: ['Serão indicados conforme o procedimento escolhido.'],
    observacoes:
      'O valor deste atendimento pode variar de acordo com a avaliação realizada pelo profissional.',
  },
}

export const PROCEDURE_LIST = Object.values(PROCEDURES)

export function formatPrice(value: number | null): string {
  if (value === null) return 'Definido após avaliação profissional'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
