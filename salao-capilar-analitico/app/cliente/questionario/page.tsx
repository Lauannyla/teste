'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, Input, Textarea } from '@/components/ui/field'
import { OptionGroup } from '@/components/option-group'
import { ProcedureIcon } from '@/components/procedure-icon'
import { PROCEDURES } from '@/lib/procedures'
import { useApp } from '@/lib/store'
import type { Questionnaire } from '@/lib/types'

const OPT = {
  simNao: [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' },
  ],
  simNaoSei: [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' },
    { value: 'nao_sei', label: 'Não sei' },
  ],
  calor: [
    { value: 'nunca', label: 'Nunca' },
    { value: 'raramente', label: 'Raramente' },
    { value: 'algumas_semana', label: 'Algumas vezes por semana' },
    { value: 'frequentemente', label: 'Frequentemente' },
    { value: 'todos_dias', label: 'Todos os dias' },
  ],
}

const TOTAL = 5

export default function QuestionarioPage() {
  const router = useRouter()
  const { draft, updateQuestionnaire } = useApp()
  const [step, setStep] = useState(1)
  const [erro, setErro] = useState('')

  // Sem procedimento escolhido, volta para a seleção.
  useEffect(() => {
    if (!draft.procedimento) router.replace('/cliente/procedimento')
  }, [draft.procedimento, router])

  if (!draft.procedimento) return null
  const proc = PROCEDURES[draft.procedimento]
  const q = draft.questionnaire

  function set<K extends keyof Questionnaire>(key: K, val: Questionnaire[K]) {
    updateQuestionnaire({ [key]: val } as Partial<Questionnaire>)
    setErro('')
  }

  function validar(): boolean {
    if (step === 1) {
      if (!q.nome || !q.telefone || !q.email) {
        setErro('Preencha nome, telefone e e-mail para continuar.')
        return false
      }
    }
    if (step === 2) {
      if (!q.tipoCabelo || !q.jaAlisamento || !q.jaDescoloracao || !q.jaColoracao || !q.ultimaQuimica) {
        setErro('Responda todas as perguntas desta etapa.')
        return false
      }
    }
    if (step === 3) {
      if (!q.saudeCabelo || !q.hidratacao || !q.corteQuimico) {
        setErro('Responda todas as perguntas desta etapa.')
        return false
      }
    }
    if (step === 4) {
      if (!q.usoCalor || !q.freqChapinha || !q.freqSecador || !q.freqBabyliss) {
        setErro('Responda todas as perguntas desta etapa.')
        return false
      }
    }
    if (step === 5) {
      if (!q.alergia) {
        setErro('Informe se possui alergia ou sensibilidade.')
        return false
      }
    }
    return true
  }

  function avancar() {
    if (!validar()) return
    if (step < TOTAL) {
      setStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push('/cliente/revisao')
    }
  }

  function voltar() {
    if (step > 1) setStep((s) => s - 1)
    else router.push('/cliente/procedimento')
  }

  const progresso = (step / TOTAL) * 100

  return (
    <div className="mx-auto max-w-2xl">
      {/* Cabeçalho com procedimento */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
          <ProcedureIcon id={proc.id} className="size-5" />
        </div>
        <div>
          <p className="label-mono">Procedimento</p>
          <p className="font-semibold">{proc.nome}</p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Etapa {step} de {TOTAL}
          </span>
          <span className="text-muted-foreground">{Math.round(progresso)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      <Card className="p-6 sm:p-7">
        {step === 1 && (
          <div className="space-y-5">
            <StepTitle title="Seus dados" desc="Precisamos de algumas informações de contato." />
            <Field label="Nome completo">
              <Input value={q.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Seu nome" />
            </Field>
            <Field label="Telefone">
              <Input
                value={q.telefone}
                onChange={(e) => set('telefone', e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </Field>
            <Field label="E-mail">
              <Input
                type="email"
                value={q.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="voce@email.com"
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <StepTitle title="Histórico do cabelo" desc="Conte-nos sobre as químicas já realizadas." />
            <Field label="Seu cabelo é natural ou possui química?">
              <OptionGroup
                value={q.tipoCabelo}
                onChange={(v) => set('tipoCabelo', v as Questionnaire['tipoCabelo'])}
                options={[
                  { value: 'natural', label: 'Natural' },
                  { value: 'quimica', label: 'Possui química' },
                ]}
              />
            </Field>
            <Field label="Você já fez progressiva ou outro alisamento?">
              <OptionGroup value={q.jaAlisamento} onChange={(v) => set('jaAlisamento', v as Questionnaire['jaAlisamento'])} options={OPT.simNao} />
            </Field>
            <Field label="Você já realizou descoloração?">
              <OptionGroup value={q.jaDescoloracao} onChange={(v) => set('jaDescoloracao', v as Questionnaire['jaDescoloracao'])} options={OPT.simNao} />
            </Field>
            <Field label="Você já realizou coloração?">
              <OptionGroup value={q.jaColoracao} onChange={(v) => set('jaColoracao', v as Questionnaire['jaColoracao'])} options={OPT.simNao} />
            </Field>
            <Field label="Quando foi realizada a última química?">
              <OptionGroup
                value={q.ultimaQuimica}
                onChange={(v) => set('ultimaQuimica', v as Questionnaire['ultimaQuimica'])}
                options={[
                  { value: 'menos_1', label: 'Menos de 1 mês' },
                  { value: '1_3', label: 'De 1 a 3 meses' },
                  { value: '3_6', label: 'De 3 a 6 meses' },
                  { value: 'mais_6', label: 'Mais de 6 meses' },
                  { value: 'nunca', label: 'Nunca' },
                ]}
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <StepTitle title="Estado do cabelo" desc="Como está a saúde atual dos seus fios?" />
            <Field label="Como você considera a saúde atual do seu cabelo?">
              <OptionGroup
                value={q.saudeCabelo}
                onChange={(v) => set('saudeCabelo', v as Questionnaire['saudeCabelo'])}
                options={[
                  { value: 'muito_saudavel', label: 'Muito saudável' },
                  { value: 'saudavel', label: 'Saudável' },
                  { value: 'ressecado', label: 'Ressecado' },
                  { value: 'quebradico', label: 'Quebradiço' },
                  { value: 'muito_danificado', label: 'Muito danificado' },
                  { value: 'elastico', label: 'Elástico' },
                ]}
              />
            </Field>
            <Field label="Você costuma fazer hidratação ou tratamentos?">
              <OptionGroup
                value={q.hidratacao}
                onChange={(v) => set('hidratacao', v as Questionnaire['hidratacao'])}
                options={[
                  { value: 'regular', label: 'Sim, regularmente' },
                  { value: 'as_vezes', label: 'Às vezes' },
                  { value: 'nao', label: 'Não' },
                ]}
                columns={3}
              />
            </Field>
            <Field label="Você já teve corte químico?">
              <OptionGroup value={q.corteQuimico} onChange={(v) => set('corteQuimico', v as Questionnaire['corteQuimico'])} options={OPT.simNaoSei} columns={3} />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <StepTitle title="Uso de fontes de calor" desc="Chapinha, secador, babyliss e modeladores." />
            <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3.5 text-sm text-secondary-foreground">
              <Flame className="mt-0.5 size-4 shrink-0 text-primary" />
              <p>
                Fontes de calor incluem <strong>chapinha</strong>, <strong>secador</strong>,{' '}
                <strong>babyliss</strong> e <strong>modeladores</strong>. O uso frequente pode
                desgastar os fios.
              </p>
            </div>
            <Field label="Com que frequência você utiliza fontes de calor no geral?">
              <OptionGroup value={q.usoCalor} onChange={(v) => set('usoCalor', v as Questionnaire['usoCalor'])} options={OPT.calor} columns={1} />
            </Field>
            <Field label="Com que frequência utiliza chapinha?">
              <OptionGroup value={q.freqChapinha} onChange={(v) => set('freqChapinha', v as Questionnaire['freqChapinha'])} options={OPT.calor} columns={1} />
            </Field>
            <Field label="Com que frequência utiliza secador?">
              <OptionGroup value={q.freqSecador} onChange={(v) => set('freqSecador', v as Questionnaire['freqSecador'])} options={OPT.calor} columns={1} />
            </Field>
            <Field label="Com que frequência utiliza babyliss ou modelador?">
              <OptionGroup value={q.freqBabyliss} onChange={(v) => set('freqBabyliss', v as Questionnaire['freqBabyliss'])} options={OPT.calor} columns={1} />
            </Field>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <StepTitle title="Outras informações" desc="Detalhes que ajudam o profissional a te atender melhor." />
            <Field label="Possui alergia ou sensibilidade a produtos químicos?">
              <OptionGroup value={q.alergia} onChange={(v) => set('alergia', v as Questionnaire['alergia'])} options={OPT.simNaoSei} columns={3} />
            </Field>
            {q.alergia === 'sim' && (
              <Field label="Qual?">
                <Input
                  value={q.alergiaQual}
                  onChange={(e) => set('alergiaQual', e.target.value)}
                  placeholder="Descreva a alergia ou sensibilidade"
                />
              </Field>
            )}
            <Field label="Alguma informação importante sobre seu cabelo para o profissional?">
              <Textarea
                value={q.infoAdicional}
                onChange={(e) => set('infoAdicional', e.target.value)}
                placeholder="Opcional"
              />
            </Field>
            <Field label="Qual resultado você deseja alcançar com o procedimento?">
              <Textarea
                value={q.resultadoDesejado}
                onChange={(e) => set('resultadoDesejado', e.target.value)}
                placeholder="Descreva o resultado desejado"
              />
            </Field>
          </div>
        )}

        {erro && <p className="mt-5 text-sm text-destructive">{erro}</p>}

        <div className="mt-7 flex items-center justify-between gap-3">
          <Button variant="outline" size="lg" className="h-11" onClick={voltar}>
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
          <Button size="lg" className="h-11" onClick={avancar}>
            {step === TOTAL ? 'Revisar respostas' : 'Próximo'}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

function StepTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}
