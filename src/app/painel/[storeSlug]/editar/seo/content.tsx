'use client'

import { EditPageWrapper } from '../_components/edit-page-wrapper'
import { SeoTab } from '../_components/seo-tab'

interface SeoPageContentProps {
  storeSlug: string
}

export function SeoPageContent({ storeSlug }: SeoPageContentProps) {
  return (
    <EditPageWrapper storeSlug={storeSlug}>
      {(data) => <SeoTab store={data.store} storeSlug={storeSlug} />}
    </EditPageWrapper>
  )
}
