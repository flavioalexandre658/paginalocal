'use client'

import { useState } from 'react'

interface TestimonialAvatarProps {
  imageUrl?: string | null
  authorName: string
}

const AVATAR_COLORS = [
  'from-slate-200 to-slate-100 text-slate-600',
  'from-blue-100 to-blue-50 text-blue-600',
  'from-emerald-100 to-emerald-50 text-emerald-600',
  'from-amber-100 to-amber-50 text-amber-600',
  'from-violet-100 to-violet-50 text-violet-600',
  'from-cyan-100 to-cyan-50 text-cyan-600',
]

function getColorByName(name: string): string {
  const charCode = name.charCodeAt(0) + (name.charCodeAt(1) || 0)
  return AVATAR_COLORS[charCode % AVATAR_COLORS.length]
}

export function TestimonialAvatar({ imageUrl, authorName }: TestimonialAvatarProps) {
  const [hasError, setHasError] = useState(false)
  const initial = authorName.charAt(0).toUpperCase()
  const colorClass = getColorByName(authorName)

  if (!imageUrl || hasError) {
    return (
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br shadow-sm ${colorClass}`}>
        <span className="text-lg font-semibold">{initial}</span>
      </div>
    )
  }

  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full shadow-sm ring-2 ring-white dark:ring-slate-800">
      <img
        src={imageUrl}
        alt={authorName}
        className="h-full w-full object-cover"
        onError={() => setHasError(true)}
        referrerPolicy="no-referrer"
      />
    </div>
  )
}
