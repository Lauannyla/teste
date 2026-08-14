'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, Input } from '@/components/ui/field'
import { useApp } from '@/lib/store'

export default function ClientWelcomePage() {
  const router = useRouter()
  const { loginClient } = useApp()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !senha) {
      setErro('Preencha e-mail e senha para continuar.')
      return
    }
    // Protótipo: autenticação simulada. No futuro, chamada à API Flask.
    const nome = email.split('@')[0].replace(/[._]/g, ' ')
    loginClient({
      nome: nome.charAt(0).toUpperCase() + nome.slice(1),
      email,
      telefone: '',
    })
    router.push('/cliente/inicio')
  }

  return (
    <main className="flex min-h-svh flex-col lg:flex-row">
      {/* HERO */}
      <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[oklch(0.4_0.16_305)] via-primary to-[oklch(0.58_0.17_295)] p-8 text-primary-foreground lg:w-[46%] lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full bg-white/10 blur-2xl"
        />
        <Brand
          size="md"
          className="relative [&_.text-muted-foreground]:text-primary-foreground/60 [&_span]:text-primary-foreground"
        />

        <div className="relative max-w-md space-y-6 py-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="size-3.5" /> Pré-análise capilar inteligente
          </span>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Seu cabelo merece cuidado desde o primeiro passo.
          </h1>
          <p className="text-pretty text-base leading-relaxed text-primary-foreground/80">
            Faça uma pré-análise antes do seu procedimento e descubra os cuidados necessários para
            o seu cabelo.
          </p>
        </div>

        <ul className="relative hidden flex-col gap-4 text-sm text-primary-foreground/85 lg:flex">
          {[
            'Questionário rápido e guiado',
            'Resultado em semáforo fácil de entender',
            'Acompanhamento com profissional do salão',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span className="flex size-5 items-center justify-center rounded-full bg-white/20">
                <ArrowRight className="size-3" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* LOGIN */}
      <section className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Brand size="md" />
          </div>
          <div className="mb-7 space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight">Bem-vinda de volta</h2>
            <p className="text-sm text-muted-foreground">
              Acesse sua conta para iniciar uma nova pré-análise.
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="E-mail" htmlFor="email">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Senha" htmlFor="senha">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="senha"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Sua senha"
                    className="pl-10"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
              </Field>

              {erro && <p className="text-sm text-destructive">{erro}</p>}

              <Button type="submit" size="lg" className="mt-1 h-11 w-full text-sm">
                Entrar
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Ainda não possui uma conta?{' '}
            <Link href="/cadastro" className="font-medium text-primary hover:underline">
              Criar conta
            </Link>
          </p>

          <div className="mt-10 border-t border-border pt-5 text-center">
            <Link
              href="/profissional/login"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Acesso profissional
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
