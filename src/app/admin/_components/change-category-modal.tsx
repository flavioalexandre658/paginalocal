'use client'

import { useState, useEffect } from 'react'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import { IconCategory, IconLoader2, IconCheck } from '@tabler/icons-react'

import { getCategoriesAction } from '@/actions/categories/get-categories.action'
import { changeStoreCategoryAction } from '@/actions/admin/change-store-category.action'
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
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { cn } from '@/lib/utils'

interface ChangeCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store: {
    id: string
    name: string
    category: string
    categoryId: string | null
  }
  onSuccess: () => void
}

interface CategoryOption {
  id: string
  name: string
}

export function ChangeCategoryModal({
  open,
  onOpenChange,
  store,
  onSuccess,
}: ChangeCategoryModalProps) {
  const { executeAsync: loadCategories } = useAction(getCategoriesAction)
  const { executeAsync: changeCategory, isExecuting } = useAction(changeStoreCategoryAction)

  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(store.categoryId)

  useEffect(() => {
    if (open) {
      setSelectedCategoryId(store.categoryId)
      setIsLoadingCategories(true)

      loadCategories().then((result) => {
        if (result?.data) {
          setCategories(result.data.map((c) => ({ id: c.id, name: c.name })))
        }
        setIsLoadingCategories(false)
      })
    }
  }, [open, store.categoryId, loadCategories])

  async function handleConfirm() {
    if (!selectedCategoryId) {
      toast.error('Selecione uma categoria')
      return
    }

    const result = await changeCategory({
      storeId: store.id,
      categoryId: selectedCategoryId,
    })

    if (result?.data) {
      toast.success('Categoria alterada com sucesso!')
      onOpenChange(false)
      onSuccess()
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
  const hasChanged = selectedCategoryId !== store.categoryId

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ModalHeader icon={<IconCategory className="h-5 w-5" />}>
          <ModalTitle>Alterar Categoria</ModalTitle>
          <ModalDescription>
            Altere a categoria da loja <strong>{store.name}</strong>.
            Categoria atual: <strong>{store.category}</strong>
          </ModalDescription>
        </ModalHeader>

        <ModalBody>
          {isLoadingCategories ? (
            <div className="flex items-center justify-center py-8">
              <IconLoader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id
                const isCurrent = store.category === cat.name

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={cn(
                      'relative flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-slate-200/60 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700/60 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-slate-600'
                    )}
                  >
                    {isSelected && (
                      <IconCheck className="h-4 w-4 shrink-0 text-primary" />
                    )}
                    <span className="truncate">{cat.name}</span>
                    {isCurrent && (
                      <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        atual
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {selectedCategory && hasChanged && (
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
              Nova categoria: <strong>{selectedCategory.name}</strong>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <ModalClose asChild>
            <EnhancedButton variant="outline">Cancelar</EnhancedButton>
          </ModalClose>
          <ModalFooterActions>
            <EnhancedButton
              onClick={handleConfirm}
              loading={isExecuting}
              disabled={!hasChanged || !selectedCategoryId}
            >
              Salvar Categoria
            </EnhancedButton>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
