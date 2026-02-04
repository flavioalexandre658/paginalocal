'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import {
  IconPlus,
  IconTrash,
  IconGripVertical,
  IconListDetails,
  IconHelpCircle,
  IconMapPin,
} from '@tabler/icons-react'

import { updateStoreAction } from '@/actions/stores/update-store.action'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const sectionsFormSchema = z.object({
  faq: z.array(z.object({
    question: z.string().min(1, 'Pergunta é obrigatória'),
    answer: z.string().min(1, 'Resposta é obrigatória'),
  })),
  neighborhoods: z.array(z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
  })),
})

type SectionsFormData = z.infer<typeof sectionsFormSchema>

interface Service {
  id: string
  name: string
  description: string | null
  position: number
}

interface SectionsTabProps {
  store: {
    id: string
    faq: Array<{ question: string; answer: string }> | null
    neighborhoods: string[] | null
  }
  services: Service[]
  storeSlug: string
}

export function SectionsTab({ store, services, storeSlug }: SectionsTabProps) {
  const { executeAsync, isExecuting } = useAction(updateStoreAction)
  const [expandedSections, setExpandedSections] = useState<string[]>(['services'])

  const form = useForm<SectionsFormData>({
    resolver: zodResolver(sectionsFormSchema),
    defaultValues: {
      faq: store.faq || [{ question: '', answer: '' }],
      neighborhoods: (store.neighborhoods || []).map((n) => ({ name: n })),
    },
  })

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: 'faq',
  })

  const { fields: neighborhoodFields, append: appendNeighborhood, remove: removeNeighborhood } = useFieldArray({
    control: form.control,
    name: 'neighborhoods',
  })

  async function onSubmit(data: SectionsFormData) {
    const result = await executeAsync({
      storeId: store.id,
      faq: data.faq,
      neighborhoods: data.neighborhoods.map((n) => n.name),
    })

    if (result?.data) {
      toast.success('Seções atualizadas!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Seções Dinâmicas
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Personalize os conteúdos que aparecem no seu site
        </p>
      </div>

      <Accordion
        type="multiple"
        value={expandedSections}
        onValueChange={setExpandedSections}
        className="space-y-4"
      >
        <AccordionItem
          value="services"
          className="rounded-xl border border-slate-200/60 bg-slate-50/30 px-4 dark:border-slate-700/60 dark:bg-slate-800/30"
        >
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <IconListDetails className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900 dark:text-white">
                  Serviços ({services.length})
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lista de serviços oferecidos
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-3">
              {services.length > 0 ? (
                services.map((service, index) => (
                  <div
                    key={service.id}
                    className="flex items-start gap-3 rounded-lg border border-slate-200/60 bg-white p-3 dark:border-slate-700/60 dark:bg-slate-900/50"
                  >
                    <IconGripVertical className="mt-1 h-4 w-4 cursor-grab text-slate-400" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {service.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {service.description || 'Sem descrição'}
                      </p>
                    </div>
                    <button className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950">
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-sm text-slate-500">
                  Nenhum serviço cadastrado
                </p>
              )}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-primary hover:text-primary dark:border-slate-700"
              >
                <IconPlus className="h-4 w-4" />
                Adicionar serviço
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="faq"
          className="rounded-xl border border-slate-200/60 bg-slate-50/30 px-4 dark:border-slate-700/60 dark:bg-slate-800/30"
        >
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <IconHelpCircle className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900 dark:text-white">
                  Perguntas Frequentes ({faqFields.length})
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  FAQ para SEO e clientes
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {faqFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-3 rounded-lg border border-slate-200/60 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/50"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-medium text-slate-400">
                        Pergunta {index + 1}
                      </span>
                      {faqFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaq(index)}
                          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <FormField
                      control={form.control}
                      name={`faq.${index}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Ex: Qual o horário de funcionamento?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`faq.${index}.answer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Digite a resposta..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => appendFaq({ question: '', answer: '' })}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-primary hover:text-primary dark:border-slate-700"
                >
                  <IconPlus className="h-4 w-4" />
                  Adicionar pergunta
                </button>

                <div className="flex justify-end pt-2">
                  <EnhancedButton type="submit" loading={isExecuting} size="sm">
                    Salvar FAQ
                  </EnhancedButton>
                </div>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="neighborhoods"
          className="rounded-xl border border-slate-200/60 bg-slate-50/30 px-4 dark:border-slate-700/60 dark:bg-slate-800/30"
        >
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <IconMapPin className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900 dark:text-white">
                  Áreas Atendidas ({neighborhoodFields.length})
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Bairros e regiões que você atende
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {neighborhoodFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <FormField
                        control={form.control}
                        name={`neighborhoods.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <input
                                {...field}
                                className="w-24 bg-transparent text-sm focus:outline-none"
                                placeholder="Bairro"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => removeNeighborhood(index)}
                        className="rounded-full p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                      >
                        <IconTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendNeighborhood({ name: '' })}
                    className="flex items-center gap-1 rounded-full border-2 border-dashed border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition-colors hover:border-primary hover:text-primary dark:border-slate-700"
                  >
                    <IconPlus className="h-3 w-3" />
                    Adicionar
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <EnhancedButton type="submit" loading={isExecuting} size="sm">
                    Salvar Áreas
                  </EnhancedButton>
                </div>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
