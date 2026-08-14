'use client'

import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'
import { useState } from 'react'
import { LogOut, User } from 'lucide-react'

export default function PerfilPage() {
  const { client, loginClient, logoutClient, myCases } = useApp()
  const router = useRouter()
  const [nome, setNome] = useState(client?.nome ?? '')
  const [telefone, setTelefone] = useState(client?.telefone ?? '')
  const [saved, setSaved] = useState(false)

  const totalAnalises = myCases().length

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!client) return
    loginClient({ ...client, nome, telefone })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleLogout() {
    logoutClient()
    router.push('/')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <User className="size-7" />
        </div>
        <div>
          <h1 className="font-serif text-3xl text-foreground">{client?.nome || 'Meu perfil'}</h1>
          <p className="text-muted-foreground">{client?.email}</p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-muted-foreground">Análises realizadas</p>
          <p className="mt-1 font-serif text-3xl text-foreground">{totalAnalises}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Conta</p>
          <p className="mt-1 font-serif text-3xl text-foreground">Cliente</p>
        </Card>
      </div>

      <Card>
        <h2 className="font-serif text-xl text-foreground">Dados pessoais</h2>
        <form onSubmit={handleSave} className="mt-4 grid gap-4">
          <Field label="Nome completo">
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </Field>
          <Field label="Telefone / WhatsApp">
            <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          </Field>
          <Field label="E-mail">
            <Input value={client?.email ?? ''} disabled />
          </Field>
          <div className="flex items-center gap-3">
            <Button type="submit" className="rounded-full">
              Salvar alterações
            </Button>
            {saved && <span className="text-sm text-primary">Dados atualizados.</span>}
          </div>
        </form>
      </Card>

      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full rounded-full border-border text-muted-foreground"
      >
        <LogOut className="size-4" />
        Sair da conta
      </Button>
    </div>
  )
}
