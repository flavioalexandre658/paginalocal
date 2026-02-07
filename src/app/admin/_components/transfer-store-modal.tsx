'use client'

import { useState } from 'react'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import {
  IconArrowsExchange,
  IconSearch,
  IconLoader2,
  IconCheck,
} from '@tabler/icons-react'

import { searchUsersAction } from '@/actions/admin/search-users.action'
import { transferStoreAction } from '@/actions/admin/transfer-store.action'
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
import { Input } from '@/components/ui/input'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'

interface TransferStoreModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store: {
    id: string
    name: string
    ownerName: string
    ownerEmail: string
  }
  onSuccess: () => void
}

interface SearchUser {
  id: string
  name: string
  email: string
  phone: string | null
  planName: string | null
  storeCount: number
}

export function TransferStoreModal({
  open,
  onOpenChange,
  store,
  onSuccess,
}: TransferStoreModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null)
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])

  const { executeAsync: searchAsync, isExecuting: isSearching } = useAction(searchUsersAction)
  const { executeAsync: transferAsync, isExecuting: isTransferring } = useAction(transferStoreAction)

  async function handleSearch() {
    if (!searchQuery.trim()) return
    const result = await searchAsync({ query: searchQuery })
    if (result?.data) {
      setSearchResults(result.data)
    }
  }

  async function handleTransfer() {
    if (!selectedUser) return

    const result = await transferAsync({
      storeId: store.id,
      targetUserId: selectedUser.id,
    })

    if (result?.data) {
      toast.success(result.data.reason)
      onOpenChange(false)
      setSelectedUser(null)
      setSearchQuery('')
      setSearchResults([])
      onSuccess()
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      setSelectedUser(null)
      setSearchQuery('')
      setSearchResults([])
    }
    onOpenChange(value)
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size="md">
        <ModalHeader icon={<IconArrowsExchange className="h-5 w-5" />}>
          <ModalTitle>Transferir Loja</ModalTitle>
          <ModalDescription>
            Transferir <strong>{store.name}</strong> de {store.ownerName} ({store.ownerEmail}) para outro usuário
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-4">
          {selectedUser ? (
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    <IconCheck className="mr-1 inline h-4 w-4 text-primary" />
                    {selectedUser.name}
                  </p>
                  <p className="text-xs text-slate-500">{selectedUser.email}</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {selectedUser.planName || 'Gratuito'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {Number(selectedUser.storeCount)} lojas
                    </Badge>
                  </div>
                </div>
                <EnhancedButton
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  Trocar
                </EnhancedButton>
              </div>

              {!selectedUser.planName && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                  Este usuário não possui assinatura ativa. A loja será transferida como <strong>inativa</strong>.
                </div>
              )}
            </div>
          ) : (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSearch()
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Buscar usuário por nome ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <EnhancedButton type="submit" loading={isSearching} size="sm">
                  Buscar
                </EnhancedButton>
              </form>

              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <IconLoader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="max-h-60 space-y-2 overflow-y-auto">
                  {searchResults.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setSelectedUser(u)}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200/60 px-4 py-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5 dark:border-slate-700/60 dark:hover:border-primary/30"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {u.planName || 'Gratuito'}
                      </Badge>
                    </button>
                  ))}
                </div>
              ) : searchQuery && !isSearching ? (
                <p className="py-4 text-center text-sm text-slate-500">
                  Nenhum usuário encontrado
                </p>
              ) : null}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <ModalClose asChild>
            <EnhancedButton variant="outline">Cancelar</EnhancedButton>
          </ModalClose>
          <ModalFooterActions>
            <EnhancedButton
              onClick={handleTransfer}
              loading={isTransferring}
              disabled={!selectedUser}
            >
              Transferir loja
            </EnhancedButton>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
