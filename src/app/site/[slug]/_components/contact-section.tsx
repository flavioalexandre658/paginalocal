import React from "react"
import { IconMapPin, IconPhone, IconExternalLink, IconClock } from "@tabler/icons-react"
import { PhoneContactLink } from "./phone-contact-link"

// ✅ local-copy modular (igual no AreasSection)
import { getCopy } from "@/lib/local-copy"
import { renderTokens } from "@/lib/local-copy/render"
import type { StoreMode, LocalPageCtx } from "@/lib/local-copy/types"

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "")

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
    category?: string
  }

  // para variar por MODE (igual no AreasSection)
  mode: StoreMode

  // para seed forte/estável (igual no AreasSection)
  id?: string | number
  slug?: string
}

const DAYS_MAP: Record<string, string> = {
  seg: "Segunda",
  ter: "Terça",
  qua: "Quarta",
  qui: "Quinta",
  sex: "Sexta",
  sab: "Sábado",
  dom: "Domingo",
}

export function ContactSection({ store, mode, id, slug }: ContactSectionProps) {
  const fullAddress = `${store.address}, ${store.city} - ${store.state}${store.zipCode ? `, ${store.zipCode}` : ""
    }`

  const mapsUrl =
    store.latitude && store.longitude
      ? `https://www.google.com/maps?q=${store.latitude},${store.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

  const openingHours = store.openingHours as Record<string, string> | null
  const hasMap = !!(store.latitude && store.longitude)

  // ✅ ctx igual ao AreasSection
  const ctx: LocalPageCtx = {
    id: id ?? store.id,
    slug: slug ?? store.slug,
    mode,
    name: store.name || "",
    category: store.category || "Serviços",
    city: store.city,
    state: store.state,
  }

  return (
    <section id="contato" className="relative py-20 md:py-28 overflow-hidden bg-primary">
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section header — white on primary */}
          <div className="mb-14 animate-fade-in-up">
            <span className="text-sm font-bold uppercase tracking-widest text-white/90">
              {renderTokens(getCopy(ctx, "contact.kicker"))}
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              {renderTokens(getCopy(ctx, "contact.heading"))}
            </h2>

            <p className="mt-4 text-lg text-white/90">
              {renderTokens(getCopy(ctx, "contact.intro"))}
            </p>
          </div>

          {/* Main card — white on primary bg */}
          <div className="animate-fade-in-up animation-delay-200 overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
            {/* Map area */}
            {hasMap && (
              <div className="relative">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""
                    }&q=${store.latitude},${store.longitude}&zoom=15`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Localização da ${store.name} em ${store.city}`}
                  className="w-full"
                />

                {/* Floating badge on map */}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg transition-all hover:shadow-xl hover:scale-105 dark:bg-slate-900 dark:text-white"
                >
                  <IconExternalLink className="h-4 w-4 text-primary" />
                  {renderTokens(getCopy(ctx, "contact.mapCta"))}
                </a>
              </div>
            )}

            {/* Contact info grid */}
            <div className="p-8 md:p-10">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <IconMapPin className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {renderTokens(getCopy(ctx, "contact.addressTitle"))}
                    </h3>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {fullAddress}
                    </p>

                    {!hasMap && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:underline"
                      >
                        <IconExternalLink className="h-3.5 w-3.5" />
                        {renderTokens(getCopy(ctx, "contact.noMapCta"))}
                      </a>
                    )}
                  </div>
                </div>

                {/* Phone */}
                {store.phone && store.phone.trim() !== "" && (
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <IconPhone className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {renderTokens(getCopy(ctx, "contact.phoneTitle"))}
                      </h3>

                      <div className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                        <PhoneContactLink
                          store={store}
                          formattedPhone={formatPhone(store.phone)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Opening hours — compact inline */}
                {openingHours && Object.keys(openingHours).length > 0 && (
                  <div className="flex gap-4 md:col-span-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <IconClock className="h-6 w-6" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {renderTokens(getCopy(ctx, "contact.hoursTitle"))}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(openingHours).map(([day, hours]) => (
                          <span
                            key={day}
                            className={
                              hours === "Fechado"
                                ? "rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                                : "rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                            }
                          >
                            {DAYS_MAP[day] || day}: {hours}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
