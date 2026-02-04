'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  IconWorld,
  IconAlertTriangle,
  IconCopy,
  IconExternalLink,
  IconRefresh,
  IconLoader2,
  IconTrash,
  IconInfoCircle,
  IconCircleCheck,
  IconServer,
} from '@tabler/icons-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import {
  addDomainToVercel,
  getDomainConfigFromVercel,
  removeDomainFromVercel,
  verifyDomainOnVercel,
} from '@/actions/vercel/add-domain'
import { getStoreBySlugAuthAction } from '@/actions/stores/get-store-by-slug-auth.action'
import { updateStoreAction } from '@/actions/stores/update-store.action'

const domainFormSchema = z.object({
  domain: z
    .string()
    .min(4, 'Domínio muito curto')
    .regex(
      /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i,
      'Formato de domínio inválido (ex: seunegocio.com.br)'
    ),
})

type DomainFormData = z.infer<typeof domainFormSchema>

interface DnsRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT'
  host: string
  value: string
}

interface DomainConfig {
  name: string
  verified: boolean
  misconfigured: boolean
  configuredBy?: 'CNAME' | 'A' | null
  intendedRecords: DnsRecord[]
}

interface DomainTabProps {
  storeSlug: string
}

export function DomainTab({ storeSlug }: DomainTabProps) {
  const [isProPlan] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [isLoadingStore, setIsLoadingStore] = useState(true)
  const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(null)
  const [storeId, setStoreId] = useState<string | null>(null)

  const { executeAsync: fetchStore } = useAction(getStoreBySlugAuthAction)
  const { executeAsync: updateStore } = useAction(updateStoreAction)

  const form = useForm<DomainFormData>({
    resolver: zodResolver(domainFormSchema),
    defaultValues: {
      domain: '',
    },
  })

  useEffect(() => {
    async function loadStore() {
      setIsLoadingStore(true)

      const result = await fetchStore({ slug: storeSlug })

      if (result?.data) {
        setStoreId(result.data.id)

        if (result.data.customDomain) {
          const configResult = await getDomainConfigFromVercel(result.data.customDomain)

          if (configResult.success && configResult.data) {
            setDomainConfig({
              name: configResult.data.name,
              verified: configResult.data.verified,
              misconfigured: configResult.data.misconfigured,
              configuredBy: configResult.data.configuredBy,
              intendedRecords: configResult.data.intendedRecords || [
                { type: 'A', host: '@', value: '76.76.21.21' },
              ],
            })
          } else {
            setDomainConfig({
              name: result.data.customDomain,
              verified: false,
              misconfigured: true,
              intendedRecords: [{ type: 'A', host: '@', value: '76.76.21.21' }],
            })
          }
        }
      }

      setIsLoadingStore(false)
    }

    loadStore()
  }, [storeSlug, fetchStore])

  async function onSubmit(data: DomainFormData) {
    if (!storeId) {
      toast.error('Loja não encontrada')
      return
    }

    setIsLoading(true)

    const result = await addDomainToVercel(data.domain)

    if (result.success) {
      const storeResult = await updateStore({
        storeId,
        customDomain: data.domain,
      })

      if (!storeResult?.data) {
        toast.error('Erro ao salvar domínio')
        setIsLoading(false)
        return
      }

      toast.success('Domínio adicionado! Configure o DNS abaixo.')

      const configResult = await getDomainConfigFromVercel(data.domain)

      if (configResult.success && configResult.data) {
        setDomainConfig({
          name: configResult.data.name,
          verified: configResult.data.verified,
          misconfigured: configResult.data.misconfigured,
          configuredBy: configResult.data.configuredBy,
          intendedRecords: configResult.data.intendedRecords || [
            { type: 'A', host: '@', value: '76.76.21.21' },
          ],
        })
      } else {
        setDomainConfig({
          name: data.domain,
          verified: false,
          misconfigured: true,
          intendedRecords: [{ type: 'A', host: '@', value: '76.76.21.21' }],
        })
      }

      form.reset()
    } else {
      toast.error(result.error || 'Erro ao adicionar domínio')
    }

    setIsLoading(false)
  }

  async function handleVerifyDomain() {
    if (!domainConfig) return

    setIsVerifying(true)

    const result = await verifyDomainOnVercel(domainConfig.name)

    if (result.success) {
      setDomainConfig((prev) =>
        prev
          ? {
            ...prev,
            verified: result.verified,
            misconfigured: result.misconfigured,
          }
          : null
      )

      if (result.verified && !result.misconfigured) {
        toast.success('Domínio verificado com sucesso!')
      } else {
        toast.error('DNS ainda não configurado corretamente')
      }
    } else {
      toast.error(result.error || 'Erro ao verificar domínio')
    }

    setIsVerifying(false)
  }

  async function handleRemoveDomain() {
    if (!domainConfig || !storeId) return

    const confirmed = window.confirm(
      `Tem certeza que deseja remover o domínio ${domainConfig.name}?`
    )

    if (!confirmed) return

    setIsRemoving(true)

    const result = await removeDomainFromVercel(domainConfig.name)

    if (result.success) {
      await updateStore({
        storeId,
        customDomain: null,
      })

      toast.success('Domínio removido')
      setDomainConfig(null)
    } else {
      toast.error(result.error || 'Erro ao remover domínio')
    }

    setIsRemoving(false)
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success('Copiado!')
  }

  if (isLoadingStore) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <IconLoader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Carregando...
          </p>
        </div>
      </div>
    )
  }

  if (!isProPlan) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Domínio Próprio
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Use seu próprio domínio (ex: www.seunegocio.com.br)
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12 text-center dark:border-slate-700 dark:bg-slate-800/30">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 text-slate-400 dark:from-slate-700 dark:to-slate-800">
            <IconWorld className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
            Recurso do Plano Pro
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Faça upgrade para o plano Profissional para usar seu próprio domínio e aumentar
            a autoridade do seu negócio.
          </p>
          <EnhancedButton className="mt-6">Fazer upgrade</EnhancedButton>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Domínio Próprio
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Use seu próprio domínio personalizado
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!domainConfig ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10">
                  <IconWorld className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Adicionar domínio
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Insira o domínio que você já possui registrado
                  </p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu domínio</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <IconWorld className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              className="pl-10"
                              placeholder="seunegocio.com.br"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <EnhancedButton type="submit" loading={isLoading} className="w-full sm:w-auto">
                    Adicionar domínio
                  </EnhancedButton>
                </form>
              </Form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10">
                  <IconServer className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Configure seu DNS
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Siga os passos abaixo para ativar seu domínio
                  </p>
                </div>
              </div>

              {domainConfig.verified && !domainConfig.misconfigured ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
                      <IconCircleCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-emerald-900 dark:text-emerald-100">
                        DNS configurado corretamente
                      </p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        Seu site está disponível em{' '}
                        <a
                          href={`https://${domainConfig.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium underline"
                        >
                          {domainConfig.name}
                          <IconExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <EnhancedButton
                      variant="outline"
                      onClick={handleVerifyDomain}
                      loading={isVerifying}
                      className="gap-2"
                    >
                      <IconRefresh className="h-4 w-4" />
                      Verificar novamente
                    </EnhancedButton>

                    <EnhancedButton
                      variant="ghost"
                      onClick={handleRemoveDomain}
                      loading={isRemoving}
                      className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                    >
                      <IconTrash className="h-4 w-4" />
                      Remover domínio
                    </EnhancedButton>
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-start gap-3 rounded-xl border border-red-200/60 bg-red-50/50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20">
                      <IconAlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-100">
                        DNS não configurado
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Os registros DNS não estão apontando corretamente. Verifique os valores
                        abaixo e atualize no painel do seu provedor de domínio.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {(!domainConfig.verified || domainConfig.misconfigured) && (
              <>
                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                      1
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Registros DNS necessários
                    </h4>
                  </div>

                  <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                    A Vercel identificou os seguintes registros que você precisa configurar:
                  </p>

                  <div className="space-y-4">
                    {domainConfig.intendedRecords.map((record, index) => (
                      <motion.div
                        key={`${record.type}-${record.host}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/60 dark:bg-slate-800/30"
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          >
                            Recomendado
                          </Badge>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            Aponte o domínio{' '}
                            {record.host === '@' ? 'raiz' : `(${record.host})`} para este{' '}
                            {record.type === 'A' ? 'endereço IP' : 'registro'}
                          </span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <div>
                            <p className="mb-1 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                              Tipo
                            </p>
                            <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-800">
                              <Badge className="bg-emerald-500 text-white">{record.type}</Badge>
                            </div>
                          </div>

                          <div>
                            <p className="mb-1 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                              Nome/Host
                            </p>
                            <div className="flex h-10 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-800">
                              <code className="font-mono text-sm text-slate-700 dark:text-slate-300">
                                {record.host}
                              </code>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(record.host)}
                                className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                              >
                                <IconCopy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <p className="mb-1 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                              Valor/Destino
                            </p>
                            <div className="flex h-10 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-800">
                              <code className="font-mono text-sm text-slate-700 dark:text-slate-300">
                                {record.value}
                              </code>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(record.value)}
                                className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                              >
                                <IconCopy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <IconInfoCircle className="h-4 w-4" />
                    <span>
                      TTL: 3600 (segundos) - Pode usar o padrão do seu provedor
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                      2
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Aguarde e verifique
                    </h4>
                  </div>

                  <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                    Após adicionar os registros, a propagação DNS pode levar de{' '}
                    <strong className="text-slate-900 dark:text-white">
                      alguns minutos até 48 horas
                    </strong>
                    . Clique no botão "Verificar" abaixo para checar o status.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <EnhancedButton
                      variant="outline"
                      onClick={handleVerifyDomain}
                      loading={isVerifying}
                      className="gap-2"
                    >
                      <IconRefresh className="h-4 w-4" />
                      Verificar agora
                    </EnhancedButton>

                    <EnhancedButton
                      variant="ghost"
                      onClick={handleRemoveDomain}
                      loading={isRemoving}
                      className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                    >
                      <IconTrash className="h-4 w-4" />
                      Remover domínio
                    </EnhancedButton>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Dica:</strong> Se você não sabe como configurar o DNS, entre em
                    contato com o suporte do seu provedor de domínio (Registro.br, GoDaddy,
                    Hostinger, etc).
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
