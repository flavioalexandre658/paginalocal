import { IconMapPin, IconPhone, IconClock, IconExternalLink } from '@tabler/icons-react'
import { PhoneContactLink } from './phone-contact-link'

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return phone
}

interface ContactSectionProps {
  store: {
    id: string
    name: string
    slug: string
    address: string
    city: string
    state: string
    zipCode?: string | null
    phone: string
    whatsapp: string
    openingHours?: Record<string, string> | null
    latitude?: string | null
    longitude?: string | null
    isActive: boolean
  }
  isOwner?: boolean
}

const DAYS_MAP: Record<string, string> = {
  seg: 'Segunda',
  ter: 'Terça',
  qua: 'Quarta',
  qui: 'Quinta',
  sex: 'Sexta',
  sab: 'Sábado',
  dom: 'Domingo',
}

export function ContactSection({ store, isOwner = false }: ContactSectionProps) {
  const fullAddress = `${store.address}, ${store.city} - ${store.state}${store.zipCode ? `, ${store.zipCode}` : ''}`
  const mapsUrl = store.latitude && store.longitude
    ? `https://www.google.com/maps?q=${store.latitude},${store.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

  const openingHours = store.openingHours as Record<string, string> | null

  return (
    <section id="contato" className="relative py-16 md:py-20 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.03] to-transparent" />
      
      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 mb-4">
            <IconMapPin className="h-4 w-4" />
            Localização
          </span>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
            Onde fica a {store.name} em {store.city}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Venha nos visitar ou entre em contato
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {/* Contact Cards */}
          <div className="space-y-6 stagger-children">
            <ContactCard
              icon={<IconMapPin className="h-6 w-6" />}
              iconBg="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30"
              iconColor="text-blue-600 dark:text-blue-400"
              title="Endereço"
            >
              <p className="text-slate-600 dark:text-slate-300">{fullAddress}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
              >
                <IconExternalLink className="h-4 w-4" />
                Ver no Google Maps
              </a>
            </ContactCard>

            {store.phone && store.phone.trim() !== '' && (
              <ContactCard
                icon={<IconPhone className="h-6 w-6" />}
                iconBg="bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/30"
                iconColor="text-emerald-600 dark:text-emerald-400"
                title="Telefone"
              >
                <PhoneContactLink
                  store={store}
                  isOwner={isOwner}
                  formattedPhone={formatPhone(store.phone)}
                />
              </ContactCard>
            )}

            {openingHours && Object.keys(openingHours).length > 0 && (
              <ContactCard
                icon={<IconClock className="h-6 w-6" />}
                iconBg="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/30"
                iconColor="text-amber-600 dark:text-amber-400"
                title="Horário de Funcionamento"
              >
                <div className="space-y-2">
                  {Object.entries(openingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        {DAYS_MAP[day] || day}
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </ContactCard>
            )}
          </div>

          {/* Map with Glassmorphism Border */}
          {store.latitude && store.longitude && (
            <div className="animate-fade-in-up animation-delay-300 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 shadow-lg shadow-slate-200/20 backdrop-blur-sm dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/30">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}&q=${store.latitude},${store.longitude}&zoom=15`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Localização da ${store.name} em ${store.city}`}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ContactCard({
  icon,
  iconBg,
  iconColor,
  title,
  children,
}: {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="group relative rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200/50 dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/30 dark:hover:border-blue-800/50 animate-fade-in-up overflow-hidden">
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:from-blue-500/5 group-hover:to-blue-500/5 pointer-events-none" />
      
      <div className="relative flex items-start gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor} ring-1 ring-slate-200/50 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md dark:ring-slate-700/50`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  )
}
