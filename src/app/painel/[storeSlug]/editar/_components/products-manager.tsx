'use client'

import { useState, useEffect } from 'react'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconGripVertical,
  IconShoppingCart,
  IconFolders,
} from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { getProductsAction } from '@/actions/products/get-products.action'
import { deleteProductAction } from '@/actions/products/delete-product.action'
import { getCollectionsAction } from '@/actions/collections/get-collections.action'
import { ProductFormModal } from './product-form-modal'

interface ProductsManagerProps {
  storeId: string
  onNeedCollection?: () => void
}

interface Product {
  id: string
  name: string
  description: string | null
  priceInCents: number
  originalPriceInCents: number | null
  collectionId: string | null
  status: string
  isFeatured: boolean
  ctaMode: string
  ctaExternalUrl: string | null
}

interface Collection {
  id: string
  name: string
}

interface ProductImage {
  url: string
  alt: string
  order: number
}
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


export function ProductsManager({ storeId, onNeedCollection }: ProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { executeAsync: getProducts } = useAction(getProductsAction)
  const { executeAsync: getCollections } = useAction(getCollectionsAction)
  const { executeAsync: deleteProduct } = useAction(deleteProductAction)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    const [productsResult, collectionsResult] = await Promise.all([
      getProducts({ storeId, includeInactive: true }),
      getCollections({ storeId, includeInactive: false }),
    ])
    if (productsResult?.data) setProducts(productsResult.data as Product[])
    if (collectionsResult?.data) setCollections(collectionsResult.data as Collection[])
    setIsLoading(false)
  }

  function handleAdd() {
    if (collections.length === 0) {
      toast.error('Crie uma coleção primeiro!')
      if (onNeedCollection) onNeedCollection()
      return
    }
    setEditingProduct(null)
    setModalOpen(true)
  }

  function handleEdit(product: Product) {
    setEditingProduct(product)
    setModalOpen(true)
  }

  function handleCreated() {
    loadData()
  }

  function handleUpdated() {
    loadData()
  }

  async function handleDelete(productId: string) {
    if (!confirm('Excluir este produto?')) return

    setDeletingId(productId)
    const result = await deleteProduct({ productId })

    if (result?.data) {
      toast.success('Produto excluído!')
      loadData()
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
    setDeletingId(null)
  }

  function formatPrice(priceInCents: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceInCents / 100)
  }

  return (
    <div className="space-y-3">
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex items-start gap-3 rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 transition-all hover:border-primary/30 hover:bg-white dark:border-slate-700/60 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
            >
              <IconGripVertical className="mt-0.5 hidden h-5 w-5 cursor-grab text-slate-300 transition-colors group-hover:text-slate-400 sm:block" />
              <button
                type="button"
                onClick={() => handleEdit(product)}
                className="flex flex-1 cursor-pointer text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {product.name}
                    </p>
                    {product.isFeatured && (
                      <Badge className="text-xs bg-primary/10 text-primary border-0">Destaque</Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className={`text-xs ${product.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-700'
                        : product.status === 'DRAFT'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {product.status === 'ACTIVE' ? 'Ativo' : product.status === 'DRAFT' ? 'Rascunho' : 'Esgotado'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {formatPrice(product.priceInCents)}
                    {product.originalPriceInCents && (
                      <span className="ml-2 text-xs text-slate-400 line-through">
                        {formatPrice(product.originalPriceInCents)}
                      </span>
                    )}
                  </p>
                  {product.description && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                      {product.description}
                    </p>
                  )}
                </div>
                <span className="ml-2 mt-1 text-slate-400 transition-colors group-hover:text-primary">
                  <IconPencil className="h-4 w-4" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(product.id)}
                disabled={deletingId === product.id}
                className="rounded-lg p-2 text-slate-400 opacity-100 transition-all hover:bg-red-50 hover:text-red-500 disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-red-950"
              >
                <IconTrash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </>
      ) : collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <IconFolders className="h-6 w-6 text-amber-600" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            Crie uma coleção primeiro
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Produtos precisam estar organizados em coleções
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
            <IconShoppingCart className="h-6 w-6 text-slate-400" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            Nenhum produto cadastrado
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Adicione produtos para exibir no seu catálogo
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-4 text-sm font-medium text-slate-500 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-slate-700"
      >
        <IconPlus className="h-4 w-4" />
        Adicionar produto
      </button>

      <ProductFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        storeId={storeId}
        product={editingProduct as ProductForEdit | null}
        collections={collections}
        onCreated={handleCreated}
        onUpdated={handleUpdated}
      />
    </div>
  )
}
