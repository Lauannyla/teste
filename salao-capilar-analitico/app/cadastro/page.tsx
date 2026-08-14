'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, Input } from '@/components/ui/field'
import { useApp } from '@/lib/store'

export default function CadastroPage() {
  const router = useRouter()
  const { registerClient } = useApp()
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmar: '',
  })
  const [erro, setErro] = useState('')

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome || !form.email || !form.telefone || !form.senha) {
      setErro('Preencha todos os campos para criar sua conta.')
      return
    }
    if (form.senha !== form.confirmar) {
      setErro('As senhas não coincidem.')
      return
    }
    // Protótipo: cadastro simulado. No futuro, POST para a API Flask.
    registerClient({ nome: form.nome, email: form.email, telefone: form.telefone })
    router.push('/cliente/inicio')
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-secondary/40 p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Brand size="sm" />
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" /> Voltar
          </Link>
        </div>

        <Card className="p-6 sm:p-7">
          <div className="mb-6 space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">Criar conta</h1>
            <p className="text-sm text-muted-foreground">
              Leva menos de um minuto. Depois é só escolher seu procedimento.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Nome completo" htmlFor="nome">
              <Input id="nome" value={form.nome} onChange={set('nome')} placeholder="Seu nome" />
            </Field>
            <Field label="E-mail" htmlFor="email">
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="voce@email.com"
              />
            </Field>
            <Field label="Telefone" htmlFor="telefone">
              <Input
                id="telefone"
                value={form.telefone}
                onChange={set('telefone')}
                placeholder="(00) 00000-0000"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Senha" htmlFor="senha">
                <Input
                  id="senha"
                  type="password"
                  value={form.senha}
                  onChange={set('senha')}
                  placeholder="••••••••"
                />
              </Field>
              <Field label="Confirmar senha" htmlFor="confirmar">
                <Input
                  id="confirmar"
                  type="password"
                  value={form.confirmar}
                  onChange={set('confirmar')}
                  placeholder="••••••••"
                />
              </Field>
            </div>

            {erro && <p className="text-sm text-destructive">{erro}</p>}

            <Button type="submit" size="lg" className="mt-1 h-11 w-full text-sm">
              Criar conta
              <ArrowRight className="size-4" />
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já possui conta?{' '}
          <Link href="/" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
