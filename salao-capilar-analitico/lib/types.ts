// Tipos compartilhados do sistema.
// Estruturados para que futuramente uma API Python possa retornar os mesmos formatos.

export type ProcedureId =
  | 'progressiva'
  | 'botox'
  | 'selagem'
  | 'coloracao'
  | 'descoloracao'
  | 'geral'

export type ResultLevel = 'viavel' | 'viavel_com_restricoes' | 'nao_recomendado'

export type EvaluationDecision =
  | 'pendente'
  | 'aprovado'
  | 'aprovado_com_cuidados'
  | 'nao_recomendado'

export type AppointmentStatus =
  | 'aguardando'
  | 'confirmado'
  | 'reagendar'
  | 'cancelado'

// Respostas do questionário
export interface Questionnaire {
  // Etapa 1 - dados
  nome: string
  telefone: string
  email: string
  // Etapa 2 - histórico
  tipoCabelo: 'natural' | 'quimica' | ''
  jaAlisamento: 'sim' | 'nao' | ''
  jaDescoloracao: 'sim' | 'nao' | ''
  jaColoracao: 'sim' | 'nao' | ''
  ultimaQuimica: 'menos_1' | '1_3' | '3_6' | 'mais_6' | 'nunca' | ''
  // Etapa 3 - estado
  saudeCabelo: 'muito_saudavel' | 'saudavel' | 'ressecado' | 'quebradico' | 'muito_danificado' | 'elastico' | ''
  hidratacao: 'regular' | 'as_vezes' | 'nao' | ''
  corteQuimico: 'sim' | 'nao' | 'nao_sei' | ''
  // Etapa 4 - calor
  usoCalor: 'nunca' | 'raramente' | 'algumas_semana' | 'frequentemente' | 'todos_dias' | ''
  freqChapinha: 'nunca' | 'raramente' | 'algumas_semana' | 'frequentemente' | 'todos_dias' | ''
  freqSecador: 'nunca' | 'raramente' | 'algumas_semana' | 'frequentemente' | 'todos_dias' | ''
  freqBabyliss: 'nunca' | 'raramente' | 'algumas_semana' | 'frequentemente' | 'todos_dias' | ''
  // Etapa 5 - outras
  alergia: 'sim' | 'nao' | 'nao_sei' | ''
  alergiaQual: string
  infoAdicional: string
  resultadoDesejado: string
}

export interface AnalysisResult {
  resultado: ResultLevel
  fatores: string[]
  necessitaAvaliacao: boolean
  necessitaTesteMecha: boolean
}

export interface ProfessionalEvaluation {
  decisao: EvaluationDecision
  observacoes: string
  solicitarTesteMecha: boolean
  orcamentoFinal: number | null
}

export interface Appointment {
  data: string // ISO date
  horario: string
  tipo: 'avaliacao' | 'atendimento'
  status: AppointmentStatus
}

export interface CaseRecord {
  id: string
  procedimento: ProcedureId
  questionnaire: Questionnaire
  analysis: AnalysisResult
  evaluation: ProfessionalEvaluation
  appointment: Appointment | null
  criadoEm: string // ISO
  isDemo?: boolean
  clienteEmail: string
}

export interface ClientUser {
  nome: string
  email: string
  telefone: string
}
