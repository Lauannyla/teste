import { analisar } from './analysis'
import { PROCEDURES } from './procedures'
import type { CaseRecord, Questionnaire } from './types'

/**
 * Dados de DEMONSTRAÇÃO.
 * Servem apenas para popular o dashboard profissional durante a feira.
 * Cada registro é marcado com `isDemo: true`.
 */

function baseQuestionnaire(overrides: Partial<Questionnaire>): Questionnaire {
  return {
    nome: '',
    telefone: '',
    email: '',
    tipoCabelo: 'quimica',
    jaAlisamento: 'nao',
    jaDescoloracao: 'nao',
    jaColoracao: 'nao',
    ultimaQuimica: '3_6',
    saudeCabelo: 'saudavel',
    hidratacao: 'as_vezes',
    corteQuimico: 'nao',
    usoCalor: 'algumas_semana',
    freqChapinha: 'algumas_semana',
    freqSecador: 'frequentemente',
    freqBabyliss: 'raramente',
    alergia: 'nao',
    alergiaQual: '',
    infoAdicional: '',
    resultadoDesejado: '',
    ...overrides,
  }
}

function build(
  id: string,
  procedimento: keyof typeof PROCEDURES,
  q: Questionnaire,
  daysAgo: number,
): CaseRecord {
  const analysis = analisar(procedimento, q)
  const criadoEm = new Date(Date.now() - daysAgo * 86400000).toISOString()
  return {
    id,
    procedimento,
    questionnaire: q,
    analysis,
    evaluation: {
      decisao: 'pendente',
      observacoes: '',
      solicitarTesteMecha: analysis.necessitaTesteMecha,
      orcamentoFinal: null,
    },
    appointment: null,
    criadoEm,
    isDemo: true,
    clienteEmail: q.email,
  }
}

export function createDemoCases(): CaseRecord[] {
  return [
    build(
      'demo-1',
      'progressiva',
      baseQuestionnaire({
        nome: 'Marina Alves',
        telefone: '(11) 98888-1010',
        email: 'marina.demo@exemplo.com',
        saudeCabelo: 'saudavel',
        hidratacao: 'regular',
        usoCalor: 'raramente',
        ultimaQuimica: 'mais_6',
        resultadoDesejado: 'Deixar o cabelo mais liso e alinhado.',
      }),
      2,
    ),
    build(
      'demo-2',
      'descoloracao',
      baseQuestionnaire({
        nome: 'Beatriz Souza',
        telefone: '(11) 97777-2020',
        email: 'beatriz.demo@exemplo.com',
        jaColoracao: 'sim',
        saudeCabelo: 'ressecado',
        hidratacao: 'as_vezes',
        usoCalor: 'frequentemente',
        ultimaQuimica: '1_3',
        resultadoDesejado: 'Clarear para um loiro iluminado.',
        infoAdicional: 'Cabelo já foi tingido de castanho escuro.',
      }),
      5,
    ),
    build(
      'demo-3',
      'coloracao',
      baseQuestionnaire({
        nome: 'Carla Nunes',
        telefone: '(11) 96666-3030',
        email: 'carla.demo@exemplo.com',
        jaDescoloracao: 'sim',
        jaAlisamento: 'sim',
        saudeCabelo: 'muito_danificado',
        corteQuimico: 'sim',
        hidratacao: 'nao',
        usoCalor: 'todos_dias',
        ultimaQuimica: 'menos_1',
        alergia: 'sim',
        alergiaQual: 'Sensibilidade a amônia.',
        resultadoDesejado: 'Cobrir os fios brancos.',
      }),
      1,
    ),
  ]
}
