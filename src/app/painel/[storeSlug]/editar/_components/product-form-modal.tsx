'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import {
    IconPackage,
    IconBrandWhatsapp,
    IconExternalLink,
    IconSparkles,
    IconPhoto,
    IconTrash,
    IconLoader2,
    IconGripVertical,
} from '@tabler/icons-react'
import { NumericFormat } from 'react-number-format'

import { createProductAction } from '@/actions/products/create-product.action'
import { updateProductAction } from '@/actions/products/update-product.action'
import { uploadEntityImageAction } from '@/actions/uploads/upload-entity-image.action'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalBody,
    ModalFooter,
    ModalFooterActions,
    ModalClose,
} from '@/components/ui/modal-blocks'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ProductImage {
    url: string
    alt: string
    order: number
}

const productFormSchema = z
    .object({
        name: z.string().min(1, 'Nome é obrigatório').max(255),
        description: z.string().optional(),
        priceInCents: z.number().int().positive('Preço deve ser maior que zero'),
        originalPriceInCents: z.number().int().positive().nullable().optional(),
        collectionId: z.string().uuid().nullable().optional(),
        ctaMode: z.enum(['WHATSAPP', 'EXTERNAL_LINK']),
        ctaLabel: z.string().max(80).optional(),
        ctaExternalUrl: z.string().url('URL inválida').optional().or(z.literal('')),
        ctaWhatsappMessage: z.string().optional(),
        status: z.enum(['ACTIVE', 'DRAFT', 'OUT_OF_STOCK']),
        isFeatured: z.boolean(),
    })
    .refine(
        (data) => {
            if (data.ctaMode === 'EXTERNAL_LINK') {
                return !!data.ctaExternalUrl && data.ctaExternalUrl.length > 0
            }
            return true
        },
        {
            message: 'URL é obrigatória quando o CTA redireciona para link externo',
            path: ['ctaExternalUrl'],
        }
    )

type ProductFormData = z.infer<typeof productFormSchema>

interface ProductForEdit {
    id: string
    name: string
    description: string | null
    priceInCents: number
    originalPriceInCents: number | null
    collectionId: string | null
    ctaMode: 'WHATSAPP' | 'EXTERNAL_LINK'
    ctaLabel: string | null
    ctaExternalUrl: string | null
    ctaWhatsappMessage: string | null
    status: 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK'
    isFeatured: boolean
    images: ProductImage[] | null
}

interface Collection {
    id: string
    name: string
}

interface ProductFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    storeId: string
    product?: ProductForEdit | null
    collections?: Collection[]
    onCreated: (product: {
        id: string
        name: string
        description: string | null
        priceInCents: number
        position: number
    }) => void
    onUpdated: (product: {
        id: string
        name: string
        description: string | null
        priceInCents: number
    }) => void
}

const STATUS_OPTIONS = [
    { value: 'ACTIVE', label: 'Ativo' },
    { value: 'DRAFT', label: 'Rascunho' },
    { value: 'OUT_OF_STOCK', label: 'Esgotado' },
] as const

const MAX_IMAGES = 8

export function ProductFormModal({
    open,
    onOpenChange,
    storeId,
    product,
    collections = [],
    onCreated,
    onUpdated,
}: ProductFormModalProps) {
    const isEditing = !!product

    const { executeAsync: createAsync, isExecuting: isCreating } =
        useAction(createProductAction)
    const { executeAsync: updateAsync, isExecuting: isUpdating } =
        useAction(updateProductAction)
    const { executeAsync: uploadImage, isExecuting: isUploading } =
        useAction(uploadEntityImageAction)

    const isExecuting = isCreating || isUpdating

    const [images, setImages] = useState<ProductImage[]>([])
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: '',
            description: '',
            priceInCents: 0,
            originalPriceInCents: null,
            collectionId: null,
            ctaMode: 'WHATSAPP',
            ctaLabel: '',
            ctaExternalUrl: '',
            ctaWhatsappMessage: '',
            status: 'ACTIVE',
            isFeatured: false,
        },
    })

    const ctaMode = form.watch('ctaMode')

    useEffect(() => {
        if (open) {
            form.reset({
                name: product?.name || '',
                description: product?.description || '',
                priceInCents: product?.priceInCents || 0,
                originalPriceInCents: product?.originalPriceInCents ?? null,
                collectionId: product?.collectionId ?? null,
                ctaMode: product?.ctaMode || 'WHATSAPP',
                ctaLabel: product?.ctaLabel || '',
                ctaExternalUrl: product?.ctaExternalUrl || '',
                ctaWhatsappMessage: product?.ctaWhatsappMessage || '',
                status: product?.status || 'ACTIVE',
                isFeatured: product?.isFeatured || false,
            })
            setImages(
                product?.images
                    ? [...product.images].sort((a, b) => a.order - b.order)
                    : []
            )
        }
    }, [open, product, form])

    async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files
        if (!files || files.length === 0) return

        const remainingSlots = MAX_IMAGES - images.length
        if (remainingSlots <= 0) {
            toast.error(`Máximo de ${MAX_IMAGES} imagens por produto`)
            event.target.value = ''
            return
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots)

        for (const file of filesToUpload) {
            if (!file.type.startsWith('image/')) {
                toast.error(`"${file.name}" não é uma imagem`)
                continue
            }

            if (file.size > 10 * 1024 * 1024) {
                toast.error(`"${file.name}" excede 10MB`)
                continue
            }

            const formData = new FormData()
            formData.append('file', file)

            const result = await uploadImage({
                storeId,
                file: formData,
                entity: 'product',
                entityId: product?.id,
            })

            if (result?.data?.url) {
                setImages((prev) => [
                    ...prev,
                    {
                        url: result.data!.url,
                        alt: form.getValues('name') || 'Imagem do produto',
                        order: prev.length,
                    },
                ])
            } else if (result?.serverError) {
                toast.error(result.serverError)
            }
        }

        event.target.value = ''
    }

    function handleRemoveImage(index: number) {
        setImages((prev) =>
            prev
                .filter((_, i) => i !== index)
                .map((img, i) => ({ ...img, order: i }))
        )
    }

    function handleDragStart(index: number) {
        setDraggedIndex(index)
    }

    function handleDragOver(e: React.DragEvent, index: number) {
        e.preventDefault()
        if (draggedIndex === null || draggedIndex === index) return

        setImages((prev) => {
            const updated = [...prev]
            const [dragged] = updated.splice(draggedIndex, 1)
            updated.splice(index, 0, dragged)
            return updated.map((img, i) => ({ ...img, order: i }))
        })
        setDraggedIndex(index)
    }

    function handleDragEnd() {
        setDraggedIndex(null)
    }

    async function onSubmit(data: ProductFormData) {
        if (isEditing && product) {
            const result = await updateAsync({
                productId: product.id,
                name: data.name,
                description: data.description || null,
                priceInCents: data.priceInCents,
                originalPriceInCents: data.originalPriceInCents ?? null,
                collectionId: data.collectionId ?? null,
                ctaMode: data.ctaMode,
                ctaLabel: data.ctaLabel || undefined,
                ctaExternalUrl:
                    data.ctaMode === 'EXTERNAL_LINK'
                        ? data.ctaExternalUrl || null
                        : null,
                ctaWhatsappMessage:
                    data.ctaMode === 'WHATSAPP'
                        ? data.ctaWhatsappMessage || null
                        : null,
                status: data.status,
                isFeatured: data.isFeatured,
                images: images.length > 0 ? images : undefined,
            })

            if (result?.data) {
                toast.success('Produto atualizado!')
                onOpenChange(false)
                onUpdated({
                    id: product.id,
                    name: result.data.name,
                    description: result.data.description,
                    priceInCents: result.data.priceInCents,
                })
            } else if (result?.serverError) {
                toast.error(result.serverError)
            }
        } else {
            const result = await createAsync({
                storeId,
                name: data.name,
                description: data.description || undefined,
                priceInCents: data.priceInCents,
                originalPriceInCents: data.originalPriceInCents ?? undefined,
                collectionId: data.collectionId ?? undefined,
                ctaMode: data.ctaMode,
                ctaLabel: data.ctaLabel || undefined,
                ctaExternalUrl:
                    data.ctaMode === 'EXTERNAL_LINK'
                        ? data.ctaExternalUrl || undefined
                        : undefined,
                status: data.status,
                isFeatured: data.isFeatured,
                images: images.length > 0 ? images : undefined,
            })

            if (result?.data) {
                toast.success('Produto adicionado!')
                onOpenChange(false)
                onCreated({
                    id: result.data.id,
                    name: result.data.name,
                    description: result.data.description,
                    priceInCents: result.data.priceInCents,
                    position: result.data.position,
                })
            } else if (result?.serverError) {
                toast.error(result.serverError)
            }
        }
    }

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalContent size="lg">
                <ModalHeader icon={<IconPackage className="h-5 w-5" />}>
                    <ModalTitle>
                        {isEditing ? 'Editar Produto' : 'Novo Produto'}
                    </ModalTitle>
                    <ModalDescription>
                        {isEditing
                            ? 'Altere as informações do produto'
                            : 'Preencha os dados do novo produto. A IA vai gerar o conteúdo SEO automaticamente.'}
                    </ModalDescription>
                </ModalHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-1 flex-col min-h-0"
                    >
                        <ModalBody className="space-y-5">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            Fotos do produto
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Até {MAX_IMAGES} imagens. Arraste para reordenar. A primeira será a principal.
                                        </p>
                                    </div>
                                    {images.length > 0 && (
                                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                            {images.length}/{MAX_IMAGES}
                                        </span>
                                    )}
                                </div>

                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />

                                <div className="flex flex-wrap gap-2">
                                    {images.map((image, index) => (
                                        <div
                                            key={`${image.url}-${index}`}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDragEnd={handleDragEnd}
                                            className={cn(
                                                'group relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border transition-all',
                                                index === 0
                                                    ? 'border-primary/50 ring-2 ring-primary/20'
                                                    : 'border-slate-200/60 dark:border-slate-700/60',
                                                draggedIndex === index && 'opacity-50 scale-95'
                                            )}
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.alt}
                                                className="h-full w-full object-cover"
                                            />

                                            {index === 0 && (
                                                <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                    Principal
                                                </span>
                                            )}

                                            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
                                                <button
                                                    type="button"
                                                    className="cursor-grab rounded-md bg-white/90 p-1.5 text-slate-700 shadow transition-transform hover:scale-110 active:cursor-grabbing"
                                                >
                                                    <IconGripVertical className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="rounded-md bg-red-500/90 p-1.5 text-white shadow transition-transform hover:scale-110"
                                                >
                                                    <IconTrash className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {images.length < MAX_IMAGES && (
                                        <button
                                            type="button"
                                            onClick={() => imageInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/50"
                                        >
                                            {isUploading ? (
                                                <IconLoader2 className="h-6 w-6 animate-spin text-primary" />
                                            ) : (
                                                <>
                                                    <IconPhoto className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                                                    <span className="mt-1 text-[10px] font-medium text-slate-400">
                                                        Adicionar
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do produto</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Camiseta Básica Algodão"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição (opcional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ex: Camiseta 100% algodão, disponível em várias cores e tamanhos"
                                                className="min-h-[80px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="flex items-center gap-1.5">
                                            <IconSparkles className="h-3.5 w-3.5 text-primary" />
                                            Se preenchida, será usada como base para a IA gerar o conteúdo SEO. Se vazia, a IA gera tudo automaticamente.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="priceInCents"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Preço</FormLabel>
                                            <FormControl>
                                                <NumericFormat
                                                    value={
                                                        field.value != null ? field.value / 100 : ''
                                                    }
                                                    onValueChange={(values) => {
                                                        field.onChange(
                                                            values.floatValue != null
                                                                ? Math.round(values.floatValue * 100)
                                                                : 0
                                                        )
                                                    }}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    prefix="R$ "
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    allowNegative={false}
                                                    customInput={Input}
                                                    placeholder="R$ 0,00"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="originalPriceInCents"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Preço original (opcional)</FormLabel>
                                            <FormControl>
                                                <NumericFormat
                                                    value={
                                                        field.value != null ? field.value / 100 : ''
                                                    }
                                                    onValueChange={(values) => {
                                                        field.onChange(
                                                            values.floatValue != null
                                                                ? Math.round(values.floatValue * 100)
                                                                : null
                                                        )
                                                    }}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    prefix="R$ "
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    allowNegative={false}
                                                    customInput={Input}
                                                    placeholder="R$ 0,00"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Aparece riscado como &quot;de&quot;
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {collections.length > 0 && (
                                <FormField
                                    control={form.control}
                                    name="collectionId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Coleção (opcional)</FormLabel>
                                            <Select
                                                value={field.value || 'none'}
                                                onValueChange={(value) =>
                                                    field.onChange(value === 'none' ? null : value)
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sem coleção" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">Sem coleção</SelectItem>
                                                    {collections.map((collection) => (
                                                        <SelectItem
                                                            key={collection.id}
                                                            value={collection.id}
                                                        >
                                                            {collection.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <div className="space-y-3 rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/60 dark:bg-slate-800/30">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                    Botão de ação (CTA)
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    O que acontece quando o visitante clica em &quot;{form.watch('ctaLabel') || 'Comprar'}&quot;
                                </p>

                                <FormField
                                    control={form.control}
                                    name="ctaMode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange('WHATSAPP')}
                                                    className={cn(
                                                        'flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all',
                                                        field.value === 'WHATSAPP'
                                                            ? 'border-green-500/50 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-950/30 dark:text-green-400'
                                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                    )}
                                                >
                                                    <IconBrandWhatsapp className="h-4 w-4 shrink-0" />
                                                    <div>
                                                        <span className="font-medium">WhatsApp</span>
                                                        <p className="text-xs opacity-70">Abre conversa com mensagem do produto</p>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange('EXTERNAL_LINK')}
                                                    className={cn(
                                                        'flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all',
                                                        field.value === 'EXTERNAL_LINK'
                                                            ? 'border-primary/50 bg-primary/5 text-primary dark:border-primary/30 dark:bg-primary/10'
                                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                    )}
                                                >
                                                    <IconExternalLink className="h-4 w-4 shrink-0" />
                                                    <div>
                                                        <span className="font-medium">Link externo</span>
                                                        <p className="text-xs opacity-70">Redireciona para Shopee, ML, etc.</p>
                                                    </div>
                                                </button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ctaLabel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Texto do botão</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex: Comprar, Adquirir, Quero esse"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {ctaMode === 'WHATSAPP' && (
                                    <FormField
                                        control={form.control}
                                        name="ctaWhatsappMessage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mensagem do WhatsApp (opcional)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Ex: Olá! Tenho interesse no produto {nome} (R$ {preço})"
                                                        className="min-h-[60px] resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Se vazia, será gerada automaticamente com nome e preço do produto.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {ctaMode === 'EXTERNAL_LINK' && (
                                    <FormField
                                        control={form.control}
                                        name="ctaExternalUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>URL de destino</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="https://shopee.com.br/seu-produto"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Link da Shopee, Mercado Livre, Hotmart ou qualquer URL.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {STATUS_OPTIONS.map((option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isFeatured"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Destaque</FormLabel>
                                            <div className="flex items-center gap-3 rounded-lg border border-slate-200/60 bg-white px-3 py-2.5 dark:border-slate-700/60 dark:bg-slate-800/50">
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    id="isFeatured"
                                                />
                                                <Label
                                                    htmlFor="isFeatured"
                                                    className="cursor-pointer text-sm text-slate-600 dark:text-slate-400"
                                                >
                                                    Produto em destaque
                                                </Label>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <ModalClose asChild>
                                <EnhancedButton type="button" variant="outline">
                                    Cancelar
                                </EnhancedButton>
                            </ModalClose>
                            <ModalFooterActions>
                                <EnhancedButton type="submit" loading={isExecuting}>
                                    {isEditing ? 'Salvar alterações' : 'Adicionar produto'}
                                </EnhancedButton>
                            </ModalFooterActions>
                        </ModalFooter>
                    </form>
                </Form>
            </ModalContent>
        </Modal>
    )
}