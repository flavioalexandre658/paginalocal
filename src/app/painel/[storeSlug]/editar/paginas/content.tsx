'use client'

import { EditPageWrapper } from '../_components/edit-page-wrapper'
import { PagesTab } from '../_components/pages-tab'

interface PaginasPageContentProps {
  storeSlug: string
}

export function PaginasPageContent({ storeSlug }: PaginasPageContentProps) {
  return (
    <EditPageWrapper storeSlug={storeSlug}>
      {(data) => (
        <PagesTab
          store={data.store}
          pages={data.pages}
          services={data.services}
          storeSlug={storeSlug}
        />
      )}
    </EditPageWrapper>
  )
}
