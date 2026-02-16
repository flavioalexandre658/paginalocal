import Image from 'next/image'
import { IconBrandWhatsapp } from '@tabler/icons-react'
import { getWhatsAppUrl, getWhatsAppDefaultMessage, getStoreHomeUrl } from '@/lib/utils'

interface SiteHeaderProps {
  storeName: string
  slug: string
  logoUrl: string
  whatsapp: string
  whatsappDefaultMessage?: string | null
  buttonColor?: string | null
  showWhatsappButton: boolean
}

export function SiteHeader({
  storeName,
  slug,
  logoUrl,
  whatsapp,
  whatsappDefaultMessage,
  buttonColor,
  showWhatsappButton,
}: SiteHeaderProps) {
  const btnColor = buttonColor || '#22c55e'
  const whatsappUrl = getWhatsAppUrl(whatsapp, getWhatsAppDefaultMessage(storeName, whatsappDefaultMessage))

  return (
    <header className="relative z-20 w-full">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex h-[72px] max-w-4xl items-center justify-center md:h-[80px] md:justify-between">
          {/* Logo com dimensões fixas para evitar CLS */}
          <a
            href={getStoreHomeUrl(slug)}
            className="relative block h-10 w-[140px] shrink-0 md:h-12 md:w-[140px]"
          >
            <Image
              src={logoUrl}
              alt={`Logo ${storeName}`}
              fill
              sizes="140px"
              className="object-contain"
              priority
              quality={90}
            />
          </a>

          {/* WhatsApp button — desktop only */}
          {showWhatsappButton && (

            <a href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-2 rounded-full px-6 text-sm font-bold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg md:inline-flex"
              style={{
                backgroundColor: btnColor,
                boxShadow: `0 4px 12px ${btnColor}30`,
              }}
            >
              <IconBrandWhatsapp className="h-5 w-5" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </header>
  )
}