'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, Input } from '@/components/ui/field'
import { useApp } from '@/lib/store'

export default function ProfessionalLoginPage() {
  const router = useRouter()
  const { loginProfessional } = useApp()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !senha) {
      setErro('Informe e-mail e senha profissional.')
      return
    }
    // Protótipo: login simulado. No futuro, autenticação via API Flask.
    loginProfessional()
    router.push('/profissional/dashboard')
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-[oklch(0.22_0.04_305)] p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-between">
          <Brand
            size="sm"
            className="[&_.text-muted-foreground]:text-primary-foreground/50 [&_span]:text-primary-foreground"
          />
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-primary-foreground/60 hover:text-primary-foreground"
          >
            <ArrowLeft className="size-4" /> Área do cliente
          </Link>
        </div>

        <Card className="p-6 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="label-mono">Restrito</p>
              <h1 className="text-xl font-bold tracking-tight">Área Profissional</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="E-mail profissional" htmlFor="email">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="profissional@salao.com"
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

        <p className="mt-5 text-center text-xs text-primary-foreground/50">
          Acesso exclusivo para profissionais do salão.
        </p>
      </div>
    </main>
  )
}
