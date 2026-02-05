"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import {
  IconTrash,
  IconAlertTriangle,
  IconSearch,
  IconUsers,
  IconPhoto,
  IconStar,
  IconWorld,
} from '@tabler/icons-react'

import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal-blocks'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { deleteStoreAction } from '@/actions/stores/delete-store.action'

interface DeleteStoreModalProps {
  storeId: string
  storeName: string
  onSuccess?: () => void
}

const consequences = [
  { icon: IconWorld, title: 'URL e site indisponível' },
  { icon: IconSearch, title: 'Posicionamento no Google perdido' },
  { icon: IconUsers, title: 'Leads e contatos apagados' },
  { icon: IconPhoto, title: 'Fotos e galeria removidas' },
  { icon: IconStar, title: 'Depoimentos excluídos' },
]

export function DeleteStoreModal({ storeId, storeName, onSuccess }: DeleteStoreModalProps) {
  const [open, setOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const { executeAsync, isExecuting } = useAction(deleteStoreAction)

  const isConfirmationValid = confirmationText === 'EXCLUIR'

  async function handleDelete() {
    if (!isConfirmationValid) return

    const result = await executeAsync({
      storeId,
      confirmationText,
    })

    if (result?.data?.success) {
      toast.success(`Loja "${storeName}" excluída com sucesso`)
      setOpen(false)
      setConfirmationText('')
      onSuccess?.()
    } else if (result?.serverError) {
      toast.error(result.serverError)
    } else {
      toast.error('Erro ao excluir loja. Tente novamente.')
    }
  }

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen)
    if (!newOpen) {
      setConfirmationText('')
    }
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalTrigger asChild>
        <EnhancedButton
          variant="ghost"
          size="icon"
          className="shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
          title="Excluir loja"
        >
          <IconTrash className="h-4 w-4" />
        </EnhancedButton>
      </ModalTrigger>

      <ModalContent size="sm" className="mx-4 max-h-[85vh] sm:mx-0">
        <ModalHeader
          icon={<IconAlertTriangle className="h-5 w-5 text-red-500" />}
          className="bg-gradient-to-b from-red-50/80 to-red-50/20 px-4 py-4 sm:px-6 sm:py-5 dark:from-red-950/30 dark:to-red-950/10"
        >
          <ModalTitle className="text-base sm:text-lg">Excluir loja?</ModalTitle>
          <ModalDescription className="text-xs sm:text-sm">
            Esta ação é <strong className="text-red-600 dark:text-red-400">irreversível</strong>.
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-6">
          {/* Consequences - Compact grid for mobile */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-2">
            {consequences.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center gap-2 rounded-lg border border-red-200/60 bg-red-50/50 p-2 sm:p-2.5 dark:border-red-900/40 dark:bg-red-950/20"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-600 sm:h-7 sm:w-7 dark:bg-red-900/50 dark:text-red-400">
                  <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <p className="text-xs font-medium text-red-900 sm:text-sm dark:text-red-100">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Warning - More compact */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
            <p className="text-xs text-amber-800 sm:text-sm dark:text-amber-200">
              <strong>Nota:</strong> Sua assinatura permanecerá ativa e poderá ser usada para criar outra loja.
            </p>
          </div>

          {/* Confirmation input */}
          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-xs font-medium sm:text-sm">
              Digite <span className="font-bold text-red-600">EXCLUIR</span> para confirmar:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
              placeholder="EXCLUIR"
              className="h-10 border-red-200 text-sm focus:border-red-500 focus:ring-red-500 dark:border-red-900"
              autoComplete="off"
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex-col gap-2 px-4 py-3 sm:flex-row sm:px-6 sm:py-4">
          <EnhancedButton
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isExecuting}
            className="w-full sm:w-auto"
            size="sm"
          >
            Cancelar
          </EnhancedButton>
          <EnhancedButton
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmationValid}
            loading={isExecuting}
            loadingText="Excluindo..."
            className="w-full sm:w-auto"
            size="sm"
          >
            <IconTrash className="h-4 w-4" />
            Excluir
          </EnhancedButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
