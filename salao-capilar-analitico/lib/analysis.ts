import type { AnalysisResult, ProcedureId, Questionnaire, ResultLevel } from './types'

/**
 * ================================================================
 *  MOTOR DE PRÉ-ANÁLISE (lógica simulada em JavaScript)
 * ================================================================
 *
 * Esta lógica é intencionalmente separada da interface.
 *
 * FUTURA INTEGRAÇÃO COM FLASK:
 * No futuro, o front-end enviará as respostas para uma API REST:
 *
 *   POST /diagnosticar
 *   body: {
 *     "procedimento": "progressiva",
 *     "quimica_recente": true,
 *     "descoloracao": false,
 *     "uso_calor": "frequente",
 *     "estado_cabelo": "ressecado",
 *     "alergia": false
 *   }
 *
 *   resposta: {
 *     "resultado": "viavel_com_restricoes",
 *     "observacoes": [],
 *     "necessita_avaliacao": true,
 *     "necessita_teste_mecha": true
 *   }
 *
 * A função `analisar()` abaixo reproduz esse contrato. Para migrar para o
 * Python/Flask, basta reimplementar essas regras no back-end e trocar a
 * chamada por um `fetch('/diagnosticar', ...)` (veja `analisarViaApi`).
 *
 * IMPORTANTE: o resultado é apenas uma ORIENTAÇÃO INICIAL.
 * Nunca é um diagnóstico definitivo — a avaliação presencial é obrigatória.
 */

// Peso de risco por estado do cabelo
const ESTADO_RISCO: Record<string, number> = {
  muito_saudavel: 0,
  saudavel: 0,
  ressecado: 2,
  elastico: 3,
  quebradico: 3,
  muito_danificado: 4,
}

// Peso de risco por frequência de calor
const CALOR_RISCO: Record<string, number> = {
  nunca: 0,
  raramente: 0,
  algumas_semana: 1,
  frequentemente: 2,
  todos_dias: 3,
}

// Procedimentos considerados mais agressivos ao fio
const PROCEDIMENTOS_SENSIVEIS: ProcedureId[] = ['descoloracao', 'progressiva']

/**
 * Analisa as respostas do questionário e retorna a pré-análise.
 * Regras simuladas — devem ser espelhadas na futura API Flask.
 */
export function analisar(procedimento: ProcedureId, q: Questionnaire): AnalysisResult {
  let risco = 0
  const fatores: string[] = []
  let necessitaTesteMecha = false

  // Estado do cabelo
  risco += ESTADO_RISCO[q.saudeCabelo] ?? 0
  if (q.saudeCabelo === 'muito_danificado') {
    fatores.push('O cabelo foi descrito como muito danificado.')
  } else if (q.saudeCabelo === 'quebradico') {
    fatores.push('O cabelo apresenta quebra, o que exige atenção.')
  } else if (q.saudeCabelo === 'ressecado') {
    fatores.push('O cabelo está ressecado e pode precisar de preparação.')
  } else if (q.saudeCabelo === 'elastico') {
    fatores.push('Fio com elasticidade anormal pode indicar fragilidade.')
  } else if (q.saudeCabelo === 'muito_saudavel' || q.saudeCabelo === 'saudavel') {
    fatores.push('O cabelo foi descrito como saudável.')
  }

  // Corte químico
  if (q.corteQuimico === 'sim') {
    risco += 3
    fatores.push('Histórico de corte químico indica fragilidade estrutural.')
  } else if (q.corteQuimico === 'nao_sei') {
    risco += 1
    fatores.push('Não há certeza sobre corte químico anterior.')
  }

  // Química recente
  const quimicaRecente = q.ultimaQuimica === 'menos_1' || q.ultimaQuimica === '1_3'
  if (quimicaRecente) {
    risco += 2
    fatores.push('Química realizada recentemente pode sobrecarregar o fio.')
  }

  // Descoloração no histórico
  if (q.jaDescoloracao === 'sim') {
    risco += 2
    fatores.push('Já houve descoloração, o que aumenta a sensibilidade dos fios.')
    if (PROCEDIMENTOS_SENSIVEIS.includes(procedimento)) {
      necessitaTesteMecha = true
    }
  }

  // Alisamento anterior combinado com nova progressiva/descoloração
  if (q.jaAlisamento === 'sim' && PROCEDIMENTOS_SENSIVEIS.includes(procedimento)) {
    risco += 1
    fatores.push('Alisamentos anteriores exigem cautela com novas químicas.')
  }

  // Uso de calor
  const calor = CALOR_RISCO[q.usoCalor] ?? 0
  risco += calor
  if (calor >= 2) {
    fatores.push('Uso frequente de fontes de calor contribui para o desgaste.')
  }

  // Hidratação (fator de proteção)
  if (q.hidratacao === 'regular') {
    risco = Math.max(0, risco - 1)
    fatores.push('Faz tratamentos regularmente, o que ajuda na saúde do fio.')
  } else if (q.hidratacao === 'nao') {
    risco += 1
    fatores.push('Ausência de hidratação regular pode fragilizar os fios.')
  }

  // Alergia
  const temAlergia = q.alergia === 'sim'
  if (temAlergia) {
    risco += 2
    necessitaTesteMecha = true
    fatores.push('Relato de alergia/sensibilidade exige teste antes do procedimento.')
  } else if (q.alergia === 'nao_sei') {
    necessitaTesteMecha = true
    fatores.push('Sem certeza sobre alergias: teste de mecha recomendado.')
  }

  // Procedimentos sensíveis sempre pedem atenção extra
  if (PROCEDIMENTOS_SENSIVEIS.includes(procedimento) && risco >= 3) {
    necessitaTesteMecha = true
  }

  // Classificação final (semáforo)
  let resultado: ResultLevel
  if (risco <= 2) {
    resultado = 'viavel'
  } else if (risco <= 5) {
    resultado = 'viavel_com_restricoes'
  } else {
    resultado = 'nao_recomendado'
  }

  // Procedimento geral sempre depende de avaliação
  if (procedimento === 'geral' && resultado === 'viavel') {
    resultado = 'viavel_com_restricoes'
    fatores.push('Procedimento a definir: o profissional indicará o mais adequado.')
  }

  return {
    resultado,
    fatores,
    necessitaAvaliacao: true, // a avaliação presencial é sempre necessária
    necessitaTesteMecha,
  }
}

/**
 * Versão preparada para a futura API Flask.
 * Hoje usa a lógica local; basta descomentar o fetch quando o back-end existir.
 */
export async function analisarViaApi(
  procedimento: ProcedureId,
  q: Questionnaire,
): Promise<AnalysisResult> {
  // FUTURO (Flask):
  // const res = await fetch('/diagnosticar', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     procedimento,
  //     quimica_recente: q.ultimaQuimica === 'menos_1' || q.ultimaQuimica === '1_3',
  //     descoloracao: q.jaDescoloracao === 'sim',
  //     uso_calor: q.usoCalor,
  //     estado_cabelo: q.saudeCabelo,
  //     alergia: q.alergia === 'sim',
  //   }),
  // })
  // return res.json()

  // Protótipo: usa a lógica local simulada
  return analisar(procedimento, q)
}
