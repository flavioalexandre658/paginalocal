'use client'

import { EditPageWrapper } from '../_components/edit-page-wrapper'
import { SocialTab } from '../_components/social-tab'

interface RedesSociaisPageContentProps {
  storeSlug: string
}

export function RedesSociaisPageContent({ storeSlug }: RedesSociaisPageContentProps) {
  return (
    <EditPageWrapper storeSlug={storeSlug}>
      {(data) => <SocialTab store={data.store} />}
    </EditPageWrapper>
  )
}
