"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  ModalFooterActions,
} from '@/components/ui/modal-blocks'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { deleteStoreAction } from '@/actions/stores/delete-store.action'

interface DeleteStoreModalProps {
  storeId: string
  storeName: string
  storeSlug: string
  onSuccess?: () => void
}

const consequences = [
  {
    icon: IconWorld,
    title: 'URL Perdida',
    description: 'O endereço do seu site ficará indisponível permanentemente',
  },
  {
    icon: IconSearch,
    title: 'SEO Perdido',
    description: 'Todo o posicionamento conquistado no Google será perdido',
  },
  {
    icon: IconUsers,
    title: 'Leads Apagados',
    description: 'Histórico de contatos e leads será excluído',
  },
  {
    icon: IconPhoto,
    title: 'Fotos Removidas',
    description: 'Todas as imagens e galeria serão deletadas',
  },
  {
    icon: IconStar,
    title: 'Depoimentos',
    description: 'Todos os depoimentos de clientes serão removidos',
  },
]

export function DeleteStoreModal({ storeId, storeName, storeSlug, onSuccess }: DeleteStoreModalProps) {
  const router = useRouter()
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

      <ModalContent size="md">
        <ModalHeader
          icon={<IconAlertTriangle className="h-5 w-5 text-red-500" />}
          className="bg-gradient-to-b from-red-50/80 to-red-50/20 dark:from-red-950/30 dark:to-red-950/10"
        >
          <ModalTitle>Excluir "{storeName}"?</ModalTitle>
          <ModalDescription>
            Esta ação é <strong className="text-red-600 dark:text-red-400">irreversível</strong>.
            Todos os dados serão permanentemente apagados.
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              O que será perdido:
            </p>
            <div className="space-y-2">
              {consequences.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 rounded-lg border border-red-200/60 bg-red-50/50 p-3 dark:border-red-900/40 dark:bg-red-950/20"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">
                      {item.title}
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Atenção:</strong> Se você possui uma assinatura ativa, ela continuará válida e poderá ser
              usada para criar uma nova loja. A exclusão da loja não cancela sua assinatura.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-sm font-medium">
              Para confirmar, digite <span className="font-bold text-red-600">EXCLUIR</span> abaixo:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
              placeholder="Digite EXCLUIR para confirmar"
              className="border-red-200 focus:border-red-500 focus:ring-red-500 dark:border-red-900"
              autoComplete="off"
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <EnhancedButton
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isExecuting}
          >
            Cancelar
          </EnhancedButton>
          <ModalFooterActions>
            <EnhancedButton
              variant="destructive"
              onClick={handleDelete}
              disabled={!isConfirmationValid}
              loading={isExecuting}
              loadingText="Excluindo..."
            >
              <IconTrash className="h-4 w-4" />
              Excluir permanentemente
            </EnhancedButton>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
