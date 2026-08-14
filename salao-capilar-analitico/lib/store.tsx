'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { analisarViaApi } from './analysis'
import { createDemoCases } from './demo-data'
import { PROCEDURES } from './procedures'
import type {
  Appointment,
  CaseRecord,
  ClientUser,
  ProcedureId,
  ProfessionalEvaluation,
  Questionnaire,
} from './types'

/**
 * Store simples em memória (com persistência leve em localStorage) para o
 * protótipo. Nada de Firebase. No futuro, estas funções chamarão a API Flask.
 */

const STORAGE_KEY = 'salao_proto_state_v1'

export function emptyQuestionnaire(user?: ClientUser | null): Questionnaire {
  return {
    nome: user?.nome ?? '',
    telefone: user?.telefone ?? '',
    email: user?.email ?? '',
    tipoCabelo: '',
    jaAlisamento: '',
    jaDescoloracao: '',
    jaColoracao: '',
    ultimaQuimica: '',
    saudeCabelo: '',
    hidratacao: '',
    corteQuimico: '',
    usoCalor: '',
    freqChapinha: '',
    freqSecador: '',
    freqBabyliss: '',
    alergia: '',
    alergiaQual: '',
    infoAdicional: '',
    resultadoDesejado: '',
  }
}

interface Draft {
  procedimento: ProcedureId | null
  questionnaire: Questionnaire
}

interface AppState {
  companyName: string
  client: ClientUser | null
  professionalLogged: boolean
  cases: CaseRecord[]
  draft: Draft
}

interface AppContextValue extends AppState {
  setCompanyName: (name: string) => void
  loginClient: (user: ClientUser) => void
  registerClient: (user: ClientUser) => void
  logoutClient: () => void
  loginProfessional: () => void
  logoutProfessional: () => void
  // fluxo de pré-diagnóstico
  startDraft: (procedimento: ProcedureId) => void
  updateQuestionnaire: (patch: Partial<Questionnaire>) => void
  resetDraft: () => void
  submitDraft: () => Promise<CaseRecord>
  // agendamento e avaliação
  setAppointment: (caseId: string, appointment: Appointment) => void
  updateEvaluation: (caseId: string, evaluation: Partial<ProfessionalEvaluation>) => void
  updateAppointmentStatus: (caseId: string, status: Appointment['status']) => void
  getCase: (id: string) => CaseRecord | undefined
  myCases: () => CaseRecord[]
}

const AppContext = createContext<AppContextValue | null>(null)

function loadInitial(): AppState {
  const fallback: AppState = {
    companyName: '',
    client: null,
    professionalLogged: false,
    cases: createDemoCases(),
    draft: { procedimento: null, questionnaire: emptyQuestionnaire() },
  }
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      companyName: parsed.companyName ?? '',
      client: parsed.client ?? null,
      professionalLogged: parsed.professionalLogged ?? false,
      cases: parsed.cases && parsed.cases.length ? parsed.cases : createDemoCases(),
      draft: parsed.draft ?? { procedimento: null, questionnaire: emptyQuestionnaire() },
    }
  } catch {
    return fallback
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => ({
    companyName: '',
    client: null,
    professionalLogged: false,
    cases: createDemoCases(),
    draft: { procedimento: null, questionnaire: emptyQuestionnaire() },
  }))
  const [hydrated, setHydrated] = useState(false)

  // hidrata do localStorage apenas no cliente (evita mismatch de SSR)
  useEffect(() => {
    setState(loadInitial())
    setHydrated(true)
  }, [])

  // persiste
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignora
    }
  }, [state, hydrated])

  const setCompanyName = useCallback((name: string) => {
    setState((s) => ({ ...s, companyName: name }))
  }, [])

  const loginClient = useCallback((user: ClientUser) => {
    setState((s) => ({ ...s, client: user }))
  }, [])

  const registerClient = useCallback((user: ClientUser) => {
    setState((s) => ({ ...s, client: user }))
  }, [])

  const logoutClient = useCallback(() => {
    setState((s) => ({
      ...s,
      client: null,
      draft: { procedimento: null, questionnaire: emptyQuestionnaire() },
    }))
  }, [])

  const loginProfessional = useCallback(() => {
    setState((s) => ({ ...s, professionalLogged: true }))
  }, [])

  const logoutProfessional = useCallback(() => {
    setState((s) => ({ ...s, professionalLogged: false }))
  }, [])

  const startDraft = useCallback((procedimento: ProcedureId) => {
    setState((s) => ({
      ...s,
      draft: {
        procedimento,
        questionnaire: emptyQuestionnaire(s.client),
      },
    }))
  }, [])

  const updateQuestionnaire = useCallback((patch: Partial<Questionnaire>) => {
    setState((s) => ({
      ...s,
      draft: { ...s.draft, questionnaire: { ...s.draft.questionnaire, ...patch } },
    }))
  }, [])

  const resetDraft = useCallback(() => {
    setState((s) => ({
      ...s,
      draft: { procedimento: null, questionnaire: emptyQuestionnaire(s.client) },
    }))
  }, [])

  const submitDraft = useCallback(async (): Promise<CaseRecord> => {
    const procedimento = state.draft.procedimento
    if (!procedimento) throw new Error('Nenhum procedimento selecionado')
    const q = state.draft.questionnaire
    const analysis = await analisarViaApi(procedimento, q)
    const record: CaseRecord = {
      id: `case-${Date.now()}`,
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
      criadoEm: new Date().toISOString(),
      clienteEmail: q.email || state.client?.email || '',
    }
    setState((s) => ({ ...s, cases: [record, ...s.cases] }))
    return record
  }, [state.draft, state.client])

  const setAppointment = useCallback((caseId: string, appointment: Appointment) => {
    setState((s) => ({
      ...s,
      cases: s.cases.map((c) => (c.id === caseId ? { ...c, appointment } : c)),
    }))
  }, [])

  const updateAppointmentStatus = useCallback(
    (caseId: string, status: Appointment['status']) => {
      setState((s) => ({
        ...s,
        cases: s.cases.map((c) =>
          c.id === caseId && c.appointment
            ? { ...c, appointment: { ...c.appointment, status } }
            : c,
        ),
      }))
    },
    [],
  )

  const updateEvaluation = useCallback(
    (caseId: string, evaluation: Partial<ProfessionalEvaluation>) => {
      setState((s) => ({
        ...s,
        cases: s.cases.map((c) =>
          c.id === caseId ? { ...c, evaluation: { ...c.evaluation, ...evaluation } } : c,
        ),
      }))
    },
    [],
  )

  const getCase = useCallback((id: string) => state.cases.find((c) => c.id === id), [state.cases])

  const myCases = useCallback(() => {
    if (!state.client) return []
    return state.cases.filter((c) => !c.isDemo && c.clienteEmail === state.client!.email)
  }, [state.cases, state.client])

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      setCompanyName,
      loginClient,
      registerClient,
      logoutClient,
      loginProfessional,
      logoutProfessional,
      startDraft,
      updateQuestionnaire,
      resetDraft,
      submitDraft,
      setAppointment,
      updateEvaluation,
      updateAppointmentStatus,
      getCase,
      myCases,
    }),
    [
      state,
      setCompanyName,
      loginClient,
      registerClient,
      logoutClient,
      loginProfessional,
      logoutProfessional,
      startDraft,
      updateQuestionnaire,
      resetDraft,
      submitDraft,
      setAppointment,
      updateEvaluation,
      updateAppointmentStatus,
      getCase,
      myCases,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}
