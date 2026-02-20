'use client'

import { useRef, useState } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import {
    IconCheck,
    IconLoader2,
    IconArrowRight,
    IconPackage,
    IconCreditCard,
    IconCategory,
    IconSparkles,
    IconRocket,
    IconUpload,
    IconX,
    IconPhoto,
} from '@tabler/icons-react'
import toast from 'react-hot-toast'

import { createCollectionAction } from '@/actions/collections/create-collection.action'
import { createProductAction } from '@/actions/products/create-product.action'
import { createPricingPlanAction } from '@/actions/pricing-plans/create-pricing-plan.action'
import { uploadEntityImageAction } from '@/actions/uploads/upload-entity-image.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type StoreMode = 'LOCAL_BUSINESS' | 'PRODUCT_CATALOG' | 'SERVICE_PRICING' | 'HYBRID'

interface ContentSetupStepProps {
    storeId: string
    storeName: string
    mode: StoreMode
    onComplete: () => void
}

interface SubStep {
    id: string
    title: string
    description: string
    icon: typeof IconPackage
    isCompleted: boolean
}

function getSubSteps(mode: StoreMode): SubStep[] {
    const steps: SubStep[] = []

    if (mode === 'PRODUCT_CATALOG' || mode === 'HYBRID') {
        steps.push({
            id: 'collection',
            title: 'Criar uma coleção',
            description: 'Organize seus produtos em coleções',
            icon: IconCategory,
            isCompleted: false,
        })
        steps.push({
            id: 'product',
            title: 'Adicionar um produto',
            description: 'Cadastre seu primeiro produto',
            icon: IconPackage,
            isCompleted: false,
        })
    }

    if (mode === 'SERVICE_PRICING' || mode === 'HYBRID') {
        steps.push({
            id: 'plan',
            title: 'Criar um plano',
            description: 'Configure seu primeiro plano de preço',
            icon: IconCreditCard,
            isCompleted: false,
        })
    }

    return steps
}

export function ContentSetupStep({ storeId, storeName, mode, onComplete }: ContentSetupStepProps) {
    const [subSteps, setSubSteps] = useState<SubStep[]>(() => getSubSteps(mode))
    const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0)
    const [createdCollectionId, setCreatedCollectionId] = useState<string | null>(null)

    const currentSubStep = subSteps[currentSubStepIndex]
    const completedCount = subSteps.filter(s => s.isCompleted).length
    const allCompleted = completedCount === subSteps.length

    function handleSubStepComplete(createdData?: { collectionId?: string }) {
        if (createdData?.collectionId) {
            setCreatedCollectionId(createdData.collectionId)
        }

        setSubSteps(prev =>
            prev.map((s, i) => (i === currentSubStepIndex ? { ...s, isCompleted: true } : s))
        )

        if (currentSubStepIndex < subSteps.length - 1) {
            setTimeout(() => setCurrentSubStepIndex(prev => prev + 1), 600)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-lg"
        >
            {/* Header */}
            <div className="mb-6 text-center md:mb-8">
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10"
                >
                    <IconSparkles className="h-6 w-6 text-primary" />
                </motion.div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    Vamos configurar o seu site
                </h1>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                    {storeName} precisa de conteúdo inicial para ficar completo
                </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6 flex items-center justify-center gap-2">
                {subSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2">
                        <div
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300',
                                step.isCompleted
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                                    : index === currentSubStepIndex
                                        ? 'bg-primary text-white shadow-md shadow-primary/30'
                                        : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                            )}
                        >
                            {step.isCompleted ? (
                                <IconCheck className="h-4 w-4" />
                            ) : (
                                index + 1
                            )}
                        </div>
                        {index < subSteps.length - 1 && (
                            <div
                                className={cn(
                                    'h-0.5 w-8 rounded-full transition-all duration-300',
                                    step.isCompleted ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                                )}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Current Sub-Step Form */}
            <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
                <AnimatePresence mode="wait">
                    {!allCompleted && currentSubStep && (
                        <motion.div
                            key={currentSubStep.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                                    <currentSubStep.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-primary">
                                        Passo {currentSubStepIndex + 1} de {subSteps.length}
                                    </p>
                                    <h2 className="font-semibold text-slate-900 dark:text-white">
                                        {currentSubStep.title}
                                    </h2>
                                </div>
                            </div>

                            {currentSubStep.id === 'collection' && (
                                <CollectionForm
                                    storeId={storeId}
                                    onSuccess={(collectionId) => handleSubStepComplete({ collectionId })}
                                />
                            )}

                            {currentSubStep.id === 'product' && (
                                <ProductForm
                                    storeId={storeId}
                                    collectionId={createdCollectionId}
                                    onSuccess={() => handleSubStepComplete()}
                                />
                            )}

                            {currentSubStep.id === 'plan' && (
                                <PlanForm
                                    storeId={storeId}
                                    onSuccess={() => handleSubStepComplete()}
                                />
                            )}
                        </motion.div>
                    )}

                    {allCompleted && (
                        <motion.div
                            key="all-done"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="py-4 text-center"
                        >
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">
                                <IconCheck className="h-7 w-7 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Tudo pronto!
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Seu conteúdo inicial foi cadastrado com sucesso
                            </p>
                            <Button
                                onClick={onComplete}
                                className="mt-6 h-12 w-full gap-2 cursor-pointer text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30"
                            >
                                <IconRocket className="h-5 w-5" />
                                Concluir configuração
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-center text-xs text-slate-400"
            >
                Você poderá adicionar mais itens depois no painel
            </motion.p>
        </motion.div>
    )
}

// ===== Shared Mini Drop Zone =====

function MiniDropZone({
    preview,
    onSelect,
    onRemove,
    label,
}: {
    preview: { file: File; url: string } | null
    onSelect: (file: File) => void
    onRemove: () => void
    label: string
}) {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
                <span className="ml-1 font-normal text-slate-400">(opcional)</span>
            </label>
            {preview ? (
                <div className="relative h-28 w-full overflow-hidden rounded-lg border border-emerald-200/60 bg-emerald-50/30 dark:border-emerald-800/40 dark:bg-emerald-950/20">
                    <img src={preview.url} alt="preview" className="h-full w-full object-cover" />
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50"
                    >
                        <IconX className="h-3.5 w-3.5 text-white" />
                    </button>
                    <div className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                        <IconCheck className="h-3 w-3 text-white" />
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex w-full items-center gap-3 rounded-lg border-2 border-dashed border-slate-200/70 bg-slate-50/50 px-4 py-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5 dark:border-slate-700/60 dark:bg-slate-800/40"
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700/60">
                        <IconPhoto className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            <span className="font-medium text-primary">Clique</span> para adicionar imagem
                        </p>
                        <p className="text-xs text-slate-400">JPG, PNG, WebP · Máx 10MB</p>
                    </div>
                    <IconUpload className="ml-auto h-4 w-4 shrink-0 text-slate-300" />
                </button>
            )}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) onSelect(file)
                    e.target.value = ''
                }}
            />
        </div>
    )
}

// ===== Collection Form =====

function CollectionForm({
    storeId,
    onSuccess,
}: {
    storeId: string
    onSuccess: (collectionId: string) => void
}) {
    const [name, setName] = useState('')
    const [imagePreview, setImagePreview] = useState<{ file: File; url: string } | null>(null)
    const { executeAsync, isExecuting } = useAction(createCollectionAction)
    const { executeAsync: uploadImage, isExecuting: isUploading } = useAction(uploadEntityImageAction)

    function handleImageSelect(file: File) {
        if (imagePreview) URL.revokeObjectURL(imagePreview.url)
        setImagePreview({ file, url: URL.createObjectURL(file) })
    }

    function handleImageRemove() {
        if (imagePreview) URL.revokeObjectURL(imagePreview.url)
        setImagePreview(null)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) return

        let imageUrl: string | undefined

        if (imagePreview) {
            const fd = new FormData()
            fd.append('file', imagePreview.file)
            const uploadResult = await uploadImage({ storeId, file: fd, entity: 'collection' })
            if (uploadResult?.data?.url) {
                imageUrl = uploadResult.data.url
            }
        }

        const result = await executeAsync({
            storeId,
            name: name.trim(),
            isActive: true,
            imageUrl,
        })

        if (result?.serverError) {
            toast.error(result.serverError)
            return
        }

        if (result?.data) {
            toast.success('Coleção criada!')
            onSuccess(result.data.id)
        }
    }

    const isBusy = isExecuting || isUploading

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Nome da coleção
                </label>
                <Input
                    placeholder="Ex: Camisetas, Bolos, Acessórios..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="h-11 border-slate-200/50 bg-white/50 transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700/50 dark:bg-slate-800/50"
                    disabled={isBusy}
                    autoFocus
                />
            </div>

            <MiniDropZone
                label="Imagem da coleção"
                preview={imagePreview}
                onSelect={handleImageSelect}
                onRemove={handleImageRemove}
            />

            <Button
                type="submit"
                disabled={isBusy || !name.trim()}
                className="h-11 w-full gap-2 cursor-pointer shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
                {isBusy ? (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <IconArrowRight className="h-4 w-4" />
                )}
                Criar coleção
            </Button>
        </form>
    )
}

// ===== Product Form =====

function ProductForm({
    storeId,
    collectionId,
    onSuccess,
}: {
    storeId: string
    collectionId: string | null
    onSuccess: () => void
}) {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [imagePreview, setImagePreview] = useState<{ file: File; url: string } | null>(null)
    const { executeAsync, isExecuting } = useAction(createProductAction)
    const { executeAsync: uploadImage, isExecuting: isUploading } = useAction(uploadEntityImageAction)

    function handleImageSelect(file: File) {
        if (imagePreview) URL.revokeObjectURL(imagePreview.url)
        setImagePreview({ file, url: URL.createObjectURL(file) })
    }

    function handleImageRemove() {
        if (imagePreview) URL.revokeObjectURL(imagePreview.url)
        setImagePreview(null)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim() || !price) return

        const priceInCents = Math.round(parseFloat(price.replace(',', '.')) * 100)
        if (isNaN(priceInCents) || priceInCents <= 0) {
            toast.error('Informe um preço válido')
            return
        }

        let images: Array<{ url: string; alt: string; order: number }> | undefined

        if (imagePreview) {
            const fd = new FormData()
            fd.append('file', imagePreview.file)
            const uploadResult = await uploadImage({ storeId, file: fd, entity: 'product' })
            if (uploadResult?.data?.url) {
                images = [{ url: uploadResult.data.url, alt: name.trim(), order: 0 }]
            }
        }

        const result = await executeAsync({
            storeId,
            collectionId: collectionId || undefined,
            name: name.trim(),
            priceInCents,
            ctaMode: 'WHATSAPP',
            status: 'ACTIVE',
            images,
        })

        if (result?.serverError) {
            toast.error(result.serverError)
            return
        }

        if (result?.data) {
            toast.success('Produto adicionado!')
            onSuccess()
        }
    }

    const isBusy = isExecuting || isUploading

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Nome do produto
                </label>
                <Input
                    placeholder="Ex: Camiseta Básica, Bolo de Chocolate..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="h-11 border-slate-200/50 bg-white/50 transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700/50 dark:bg-slate-800/50"
                    disabled={isBusy}
                    autoFocus
                />
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Preço (R$)
                </label>
                <Input
                    placeholder="29,90"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="h-11 border-slate-200/50 bg-white/50 transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700/50 dark:bg-slate-800/50"
                    disabled={isBusy}
                />
            </div>

            <MiniDropZone
                label="Foto do produto"
                preview={imagePreview}
                onSelect={handleImageSelect}
                onRemove={handleImageRemove}
            />

            <Button
                type="submit"
                disabled={isBusy || !name.trim() || !price}
                className="h-11 w-full gap-2 cursor-pointer shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
                {isBusy ? (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <IconArrowRight className="h-4 w-4" />
                )}
                Adicionar produto
            </Button>
        </form>
    )
}

// ===== Pricing Plan Form =====

function PlanForm({
    storeId,
    onSuccess,
}: {
    storeId: string
    onSuccess: () => void
}) {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [features, setFeatures] = useState('')
    const { executeAsync, isExecuting } = useAction(createPricingPlanAction)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim() || !price) return

        const priceInCents = Math.round(parseFloat(price.replace(',', '.')) * 100)
        if (isNaN(priceInCents) || priceInCents <= 0) {
            toast.error('Informe um preço válido')
            return
        }

        const featuresList = features
            .split('\n')
            .map(f => f.trim())
            .filter(Boolean)

        const result = await executeAsync({
            storeId,
            name: name.trim(),
            priceInCents,
            interval: 'MONTHLY',
            features: featuresList.length > 0 ? featuresList : undefined,
            isHighlighted: true,
            ctaMode: 'WHATSAPP',
        })

        if (result?.serverError) {
            toast.error(result.serverError)
            return
        }

        if (result?.data) {
            toast.success('Plano criado!')
            onSuccess()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Nome do plano
                </label>
                <Input
                    placeholder="Ex: Plano Mensal, Pacote Premium..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="h-11 border-slate-200/50 bg-white/50 transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700/50 dark:bg-slate-800/50"
                    disabled={isExecuting}
                    autoFocus
                />
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Preço mensal (R$)
                </label>
                <Input
                    placeholder="99,90"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="h-11 border-slate-200/50 bg-white/50 transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700/50 dark:bg-slate-800/50"
                    disabled={isExecuting}
                />
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Benefícios{' '}
                    <span className="font-normal text-slate-400">(um por linha, opcional)</span>
                </label>
                <textarea
                    placeholder={"Acesso ilimitado\nSuporte prioritário\nMaterial exclusivo"}
                    value={features}
                    onChange={e => setFeatures(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-md border border-slate-200/50 bg-white/50 px-3 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-slate-700/50 dark:bg-slate-800/50"
                    disabled={isExecuting}
                />
            </div>

            <Button
                type="submit"
                disabled={isExecuting || !name.trim() || !price}
                className="h-11 w-full gap-2 cursor-pointer shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
                {isExecuting ? (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <IconArrowRight className="h-4 w-4" />
                )}
                Criar plano
            </Button>
        </form>
    )
}
