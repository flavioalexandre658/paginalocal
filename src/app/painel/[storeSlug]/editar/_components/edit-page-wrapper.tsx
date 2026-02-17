'use client'

import { useEffect } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { IconLoader2 } from '@tabler/icons-react'
import { getStoreForEditAction } from '@/actions/stores/get-store-for-edit.action'

type ActionResult = Awaited<ReturnType<typeof getStoreForEditAction>>
type StoreEditData = NonNullable<NonNullable<ActionResult>['data']>

interface EditPageWrapperProps {
  storeSlug: string
  children: (data: StoreEditData) => React.ReactNode
}

export function EditPageWrapper({ storeSlug, children }: EditPageWrapperProps) {
  const { executeAsync, result, isExecuting } = useAction(getStoreForEditAction)

  useEffect(() => {
    executeAsync({ storeSlug })
  }, [executeAsync, storeSlug])

  const data = result?.data

  if (isExecuting || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <IconLoader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return <>{children(data)}</>
}
