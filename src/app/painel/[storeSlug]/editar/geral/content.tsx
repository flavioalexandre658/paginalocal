'use client'

import { EditPageWrapper } from '../_components/edit-page-wrapper'
import { GeneralTab } from '../_components/general-tab'

interface GeralPageContentProps {
  storeSlug: string
}

export function GeralPageContent({ storeSlug }: GeralPageContentProps) {
  return (
    <EditPageWrapper storeSlug={storeSlug}>
      {(data) => <GeneralTab store={data.store} />}
    </EditPageWrapper>
  )
}
