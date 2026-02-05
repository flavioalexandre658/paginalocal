'use client'

import { useState } from 'react'
import { 
  IconShare, 
  IconCopy, 
  IconCheck,
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandX,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconMail,
  IconShare2,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
} from '@/components/ui/modal-blocks'

interface ShareModalProps {
  url: string
  title: string
  description?: string
  trigger?: React.ReactNode
  triggerClassName?: string
}

const SHARE_OPTIONS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: IconBrandWhatsapp,
    color: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20',
    getUrl: (url: string, title: string) => 
      `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${url}`)}`,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: IconBrandFacebook,
    color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
    getUrl: (url: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    icon: IconBrandX,
    color: 'bg-slate-500/10 text-slate-600 hover:bg-slate-500/20',
    getUrl: (url: string, title: string) => 
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: IconBrandLinkedin,
    color: 'bg-sky-500/10 text-sky-600 hover:bg-sky-500/20',
    getUrl: (url: string) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: IconBrandTelegram,
    color: 'bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20',
    getUrl: (url: string, title: string) => 
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: 'email',
    label: 'E-mail',
    icon: IconMail,
    color: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20',
    getUrl: (url: string, title: string, description?: string) => 
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description || title}\n\n${url}`)}`,
  },
]

export function ShareModal({ 
  url, 
  title, 
  description,
  trigger,
  triggerClassName,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url,
        })
      } catch {
        // User cancelled or error
      }
    }
  }

  function handleShareClick(option: typeof SHARE_OPTIONS[number]) {
    const shareUrl = option.getUrl(url, title, description)
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  const supportsNativeShare = typeof navigator !== 'undefined' && 'share' in navigator

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        {trigger || (
          <EnhancedButton
            variant="outline"
            size="icon"
            className={cn('shrink-0', triggerClassName)}
            title="Compartilhar"
          >
            <IconShare className="h-4 w-4" />
          </EnhancedButton>
        )}
      </ModalTrigger>
      <ModalContent size="sm">
        <ModalHeader icon={<IconShare className="h-5 w-5" />}>
          <ModalTitle>Compartilhar</ModalTitle>
          <ModalDescription>
            Compartilhe este site com seus amigos e clientes
          </ModalDescription>
        </ModalHeader>
        <ModalBody className="space-y-6">
          {/* Copy Link Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Link do site
            </label>
            <div className="flex gap-2">
              <div className="flex-1 rounded-xl border border-slate-200/60 bg-slate-50/50 px-4 py-3 text-sm text-slate-600 truncate dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-300">
                {url}
              </div>
              <EnhancedButton
                variant={copied ? 'default' : 'outline'}
                onClick={handleCopyLink}
                className={cn(
                  'shrink-0 gap-2 transition-all',
                  copied && 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500'
                )}
              >
                {copied ? (
                  <>
                    <IconCheck className="h-4 w-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <IconCopy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </EnhancedButton>
            </div>
          </div>

          {/* Native Share Button (Mobile) */}
          {supportsNativeShare && (
            <EnhancedButton
              variant="outline"
              onClick={handleNativeShare}
              className="w-full gap-2 py-6"
            >
              <IconShare2 className="h-5 w-5" />
              Mais opções de compartilhamento
            </EnhancedButton>
          )}

          {/* Social Share Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Compartilhar via
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SHARE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleShareClick(option)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl p-4 transition-all duration-200',
                    'border border-transparent',
                    'hover:border-slate-200/60 hover:shadow-md',
                    'dark:hover:border-slate-700/60',
                    option.color
                  )}
                >
                  <option.icon className="h-6 w-6" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

// Button variant that can be used inline
export function ShareButton({
  url,
  title,
  description,
  variant = 'icon',
  className,
}: ShareModalProps & { variant?: 'icon' | 'button'; className?: string }) {
  if (variant === 'button') {
    return (
      <ShareModal
        url={url}
        title={title}
        description={description}
        trigger={
          <EnhancedButton variant="outline" className={cn('gap-2', className)}>
            <IconShare className="h-4 w-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </EnhancedButton>
        }
      />
    )
  }

  return (
    <ShareModal
      url={url}
      title={title}
      description={description}
      triggerClassName={className}
    />
  )
}
