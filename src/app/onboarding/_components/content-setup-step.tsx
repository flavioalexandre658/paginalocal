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
import { PglButton } from '@/components/ui/pgl-button'
import { PglField, PglFieldLabel, PglFieldInput, PglFieldTextarea } from '@/components/ui/pgl-field'
import { OnboardingCard, OnboardingHeader, OnboardingBody } from '@/components/ui/pgl-onboarding'
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
            className="w-full max-w-md"
        >
            <OnboardingCard>
                <OnboardingHeader
                    title="Vamos configurar o seu site"
                    subtitle={`${storeName} precisa de conteúdo inicial`}
                />

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 px-6 pt-2">
                    {subSteps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-2">
                            <div
                                className={cn(
                                    'flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300',
                                    step.isCompleted
                                        ? 'bg-emerald-500 text-white'
                                        : index === currentSubStepIndex
                                            ? 'bg-black/80 text-white'
                                            : 'bg-black/5 text-black/40'
                                )}
                            >
                                {step.isCompleted ? (
                                    <IconCheck className="size-3.5" />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            {index < subSteps.length - 1 && (
                                <div
                                    className={cn(
                                        'h-px w-8 rounded-full transition-all duration-300',
                                        step.isCompleted ? 'bg-emerald-500' : 'bg-black/[0.06]'
                                    )}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <OnboardingBody>
                    <AnimatePresence mode="wait">
                        {!allCompleted && currentSubStep && (
                            <motion.div
                                key={currentSubStep.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-black/5">
                                        <currentSubStep.icon className="size-4.5 text-black/55" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-black/40">
                                            Passo {currentSubStepIndex + 1} de {subSteps.length}
                                        </p>
                                        <h2 className="text-sm font-semibold text-black/80">
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
                                className="py-6 text-center"
                            >
                                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                                    <IconCheck className="size-6" />
                                </div>
                                <h2 className="text-lg font-semibold text-black/80">
                                    Tudo pronto!
                                </h2>
                                <p className="mt-1 text-sm text-black/55">
                                    Seu conteúdo inicial foi cadastrado com sucesso
                                </p>
                                <PglButton
                                    variant="dark"
                                    size="sm"
                                    onClick={onComplete}
                                    className="mt-6 w-full"
                                >
                                    <IconRocket className="size-4" />
                                    Concluir configuração
                                </PglButton>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </OnboardingBody>

                <p className="px-6 pb-6 text-center text-xs text-black/30">
                    Você poderá adicionar mais itens depois no painel
                </p>
            </OnboardingCard>
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
        <PglField>
            <PglFieldLabel>
                {label}
                <span className="ml-1 font-normal text-black/30">(opcional)</span>
            </PglFieldLabel>
            {preview ? (
                <div className="relative h-28 w-full overflow-hidden rounded-2xl ring-1 ring-black/[0.06]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview.url} alt="preview" className="h-full w-full object-cover" />
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50"
                    >
                        <IconX className="size-3.5 text-white" />
                    </button>
                    <div className="absolute left-2 top-2 flex size-5 items-center justify-center rounded-full bg-emerald-500">
                        <IconCheck className="size-3 text-white" />
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border border-dashed border-black/[0.12] px-4 py-3 text-left",
                        "transition-all duration-150 hover:border-black/30 hover:bg-black/[0.02]",
                    )}
                >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-black/5">
                        <IconPhoto className="size-4 text-black/30" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm text-black/55">
                            <span className="font-medium text-black/80">Clique</span> para adicionar imagem
                        </p>
                        <p className="text-xs text-black/30">JPG, PNG, WebP · Máx 10MB</p>
                    </div>
                    <IconUpload className="ml-auto size-4 shrink-0 text-black/20" />
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
        </PglField>
    )
}

// ===== Created Items List =====

function CreatedItemsList({ items }: { items: { name: string; price: string }[] }) {
    if (items.length === 0) return null
    return (
        <div className="mb-4 space-y-1.5">
            {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-black/[0.06] px-4 py-2.5 text-sm">
                    <span className="font-medium text-black/80">{item.name}</span>
                    <span className="text-black/55">R$ {item.price}</span>
                </div>
            ))}
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
            <PglField>
                <PglFieldLabel>Nome da coleção</PglFieldLabel>
                <PglFieldInput
                    placeholder="Ex: Camisetas, Bolos, Acessórios..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={isBusy}
                    autoFocus
                />
            </PglField>

            <MiniDropZone
                label="Imagem da coleção"
                preview={imagePreview}
                onSelect={handleImageSelect}
                onRemove={handleImageRemove}
            />

            <PglButton
                type="submit"
                variant="dark"
                size="sm"
                disabled={isBusy || !name.trim()}
                loading={isBusy}
                className="w-full"
            >
                {!isBusy && <IconArrowRight className="size-4" />}
                Criar coleção
            </PglButton>
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
    const [createdProducts, setCreatedProducts] = useState<{ name: string; price: string }[]>([])
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
            setCreatedProducts(prev => [...prev, { name: name.trim(), price }])
            toast.success('Produto adicionado!')
            setName('')
            setPrice('')
            handleImageRemove()
        }
    }

    const isBusy = isExecuting || isUploading

    return (
        <div className="space-y-4">
            <CreatedItemsList items={createdProducts} />

            <form onSubmit={handleSubmit} className="space-y-4">
                <PglField>
                    <PglFieldLabel>Nome do produto</PglFieldLabel>
                    <PglFieldInput
                        placeholder="Ex: Camiseta Básica, Bolo de Chocolate..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={isBusy}
                        autoFocus
                    />
                </PglField>

                <PglField>
                    <PglFieldLabel>Preço (R$)</PglFieldLabel>
                    <PglFieldInput
                        placeholder="29,90"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        disabled={isBusy}
                    />
                </PglField>

                <MiniDropZone
                    label="Foto do produto"
                    preview={imagePreview}
                    onSelect={handleImageSelect}
                    onRemove={handleImageRemove}
                />

                <div className="flex gap-2">
                    <PglButton
                        type="submit"
                        variant="outline"
                        size="sm"
                        disabled={isBusy || !name.trim() || !price}
                        loading={isBusy}
                        className="flex-1"
                    >
                        {!isBusy && <IconPackage className="size-4" />}
                        {createdProducts.length === 0 ? 'Adicionar produto' : '+ Adicionar outro'}
                    </PglButton>

                    {createdProducts.length > 0 && (
                        <PglButton
                            type="button"
                            variant="dark"
                            size="sm"
                            onClick={onSuccess}
                            className="flex-1"
                        >
                            <IconArrowRight className="size-4" />
                            Continuar
                        </PglButton>
                    )}
                </div>
            </form>

            {createdProducts.length === 0 && (
                <PglButton
                    variant="ghost"
                    size="xs"
                    onClick={onSuccess}
                    className="w-full"
                >
                    Pular — a IA vai sugerir produtos
                </PglButton>
            )}
        </div>
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
    const [createdPlans, setCreatedPlans] = useState<{ name: string; price: string }[]>([])
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
            isHighlighted: createdPlans.length === 0,
            ctaMode: 'WHATSAPP',
        })

        if (result?.serverError) {
            toast.error(result.serverError)
            return
        }

        if (result?.data) {
            setCreatedPlans(prev => [...prev, { name: name.trim(), price }])
            toast.success('Plano criado!')
            setName('')
            setPrice('')
            setFeatures('')
        }
    }

    return (
        <div className="space-y-4">
            <CreatedItemsList items={createdPlans} />

            <form onSubmit={handleSubmit} className="space-y-4">
                <PglField>
                    <PglFieldLabel>Nome do plano</PglFieldLabel>
                    <PglFieldInput
                        placeholder="Ex: Plano Mensal, Pacote Premium..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={isExecuting}
                        autoFocus
                    />
                </PglField>

                <PglField>
                    <PglFieldLabel>Preço mensal (R$)</PglFieldLabel>
                    <PglFieldInput
                        placeholder="99,90"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        disabled={isExecuting}
                    />
                </PglField>

                <PglField>
                    <PglFieldLabel>
                        Benefícios <span className="font-normal text-black/30">(um por linha, opcional)</span>
                    </PglFieldLabel>
                    <PglFieldTextarea
                        placeholder={"Acesso ilimitado\nSuporte prioritário\nMaterial exclusivo"}
                        value={features}
                        onChange={e => setFeatures(e.target.value)}
                        rows={3}
                        disabled={isExecuting}
                    />
                </PglField>

                <div className="flex gap-2">
                    <PglButton
                        type="submit"
                        variant="outline"
                        size="sm"
                        disabled={isExecuting || !name.trim() || !price}
                        loading={isExecuting}
                        className="flex-1"
                    >
                        {!isExecuting && <IconCreditCard className="size-4" />}
                        {createdPlans.length === 0 ? 'Criar plano' : '+ Adicionar outro'}
                    </PglButton>

                    {createdPlans.length > 0 && (
                        <PglButton
                            type="button"
                            variant="dark"
                            size="sm"
                            onClick={onSuccess}
                            className="flex-1"
                        >
                            <IconArrowRight className="size-4" />
                            Continuar
                        </PglButton>
                    )}
                </div>
            </form>

            {createdPlans.length === 0 && (
                <PglButton
                    variant="ghost"
                    size="xs"
                    onClick={onSuccess}
                    className="w-full"
                >
                    Pular — a IA vai sugerir planos
                </PglButton>
            )}
        </div>
    )
}
