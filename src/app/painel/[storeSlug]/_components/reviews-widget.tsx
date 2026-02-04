'use client'

import { IconStar, IconStarFilled, IconExternalLink, IconMessageCircle } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface Review {
  id: string
  authorName: string
  content: string
  rating: number
  imageUrl: string | null
  createdAt: Date
}

interface ReviewsWidgetProps {
  reviews: Review[]
  googleRating?: string | null
  googleReviewsCount?: number | null
  googlePlaceId?: string | null
}

export function ReviewsWidget({
  reviews,
  googleRating,
  googleReviewsCount,
  googlePlaceId,
}: ReviewsWidgetProps) {
  const rating = googleRating ? parseFloat(googleRating) : null
  const googleMapsUrl = googlePlaceId
    ? `https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`
    : null

  return (
    <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-500 shadow-lg shadow-amber-500/10">
            <IconStar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Avaliações
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Do Google Meu Negócio
            </p>
          </div>
        </div>

        {rating && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 dark:bg-amber-950/30">
            <IconStarFilled className="h-5 w-5 text-amber-500" />
            <span className="text-lg font-semibold text-amber-700 dark:text-amber-400">
              {rating.toFixed(1)}
            </span>
            {googleReviewsCount && (
              <span className="text-sm text-amber-600 dark:text-amber-500">
                ({googleReviewsCount})
              </span>
            )}
          </div>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.slice(0, 3).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <IconMessageCircle className="h-6 w-6" />
          </div>
          <p className="mt-3 font-medium text-slate-700 dark:text-slate-200">
            Nenhuma avaliação ainda
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sincronize com o Google para importar avaliações
          </p>
        </div>
      )}

      {googleMapsUrl && (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-slate-50/50 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <IconExternalLink className="h-4 w-4" />
          Ver todas no Google
        </a>
      )}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/60 dark:bg-slate-800/30">
      <div className="flex items-start gap-3">
        {review.imageUrl ? (
          <img
            src={review.imageUrl}
            alt={review.authorName}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-sm font-medium text-primary">
              {review.authorName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
              {review.authorName}
            </p>
            <div className="flex shrink-0">
              {[...Array(5)].map((_, i) => (
                <IconStarFilled
                  key={i}
                  className={cn(
                    'h-3 w-3',
                    i < review.rating
                      ? 'text-amber-400'
                      : 'text-slate-200 dark:text-slate-700'
                  )}
                />
              ))}
            </div>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {review.content}
          </p>
        </div>
      </div>
    </div>
  )
}
