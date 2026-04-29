function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.startsWith('55') ? cleaned : `55${cleaned}`
}

interface Review {
  authorName: string
  rating: number
  content: string
  createdAt?: Date
}

interface LocalBusinessData {
  name: string
  slug: string
  customDomain?: string
  description?: string
  category?: string
  phone: string
  address: string
  city: string
  state: string
  zipCode?: string
  latitude?: string
  longitude?: string
  openingHours?: Record<string, string>
  imageUrl?: string
  rating?: string
  reviewCount?: number
  reviews?: Review[]
  priceRange?: string
  neighborhoods?: string[]
  email?: string
  sameAs?: string[]
  founders?: string[]
  knowsAbout?: string[]
}

const DAY_OF_WEEK_URLS: Record<string, string> = {
  seg: 'https://schema.org/Monday',
  ter: 'https://schema.org/Tuesday',
  qua: 'https://schema.org/Wednesday',
  qui: 'https://schema.org/Thursday',
  sex: 'https://schema.org/Friday',
  sab: 'https://schema.org/Saturday',
  dom: 'https://schema.org/Sunday',
  monday: 'https://schema.org/Monday',
  tuesday: 'https://schema.org/Tuesday',
  wednesday: 'https://schema.org/Wednesday',
  thursday: 'https://schema.org/Thursday',
  friday: 'https://schema.org/Friday',
  saturday: 'https://schema.org/Saturday',
  sunday: 'https://schema.org/Sunday',
}

/**
 * Mapeia categoria do PGL para o tipo mais específico de schema.org.
 * Cai em "LocalBusiness" se não houver match.
 */
function mapCategoryToSchema(category: string): string {
  const c = category.toLowerCase()
  const map: Record<string, string> = {
    barbearia: 'BarberShop',
    salao: 'BeautySalon',
    'salão': 'BeautySalon',
    estetica: 'BeautySalon',
    spa: 'DaySpa',
    restaurante: 'Restaurant',
    pizzaria: 'Restaurant',
    lanchonete: 'FastFoodRestaurant',
    cafeteria: 'CafeOrCoffeeShop',
    padaria: 'Bakery',
    confeitaria: 'Bakery',
    hamburgueria: 'Restaurant',
    bar: 'BarOrPub',
    'pet-shop': 'PetStore',
    'pet shop': 'PetStore',
    veterinaria: 'VeterinaryCare',
    'veterinária': 'VeterinaryCare',
    clinica: 'MedicalClinic',
    'clínica': 'MedicalClinic',
    dentista: 'Dentist',
    odontologia: 'Dentist',
    consultorio: 'MedicalClinic',
    farmacia: 'Pharmacy',
    'farmácia': 'Pharmacy',
    academia: 'ExerciseGym',
    yoga: 'ExerciseGym',
    fisioterapia: 'Physician',
    psicologia: 'Physician',
    advocacia: 'Attorney',
    advogado: 'Attorney',
    contabilidade: 'AccountingService',
    consultoria: 'ProfessionalService',
    arquitetura: 'ProfessionalService',
    engenharia: 'ProfessionalService',
    imobiliaria: 'RealEstateAgent',
    'imobiliária': 'RealEstateAgent',
    corretor: 'RealEstateAgent',
    construtora: 'GeneralContractor',
    reforma: 'HomeAndConstructionBusiness',
    pintura: 'HomeAndConstructionBusiness',
    encanamento: 'Plumber',
    eletricista: 'Electrician',
    'lava-jato': 'AutoWash',
    'lava jato': 'AutoWash',
    'lava-car': 'AutoWash',
    estacionamento: 'AutomotiveBusiness',
    oficina: 'AutoRepair',
    mecanica: 'AutoRepair',
    'mecânica': 'AutoRepair',
    borracharia: 'AutoRepair',
    autocenter: 'AutomotiveBusiness',
    'auto-center': 'AutomotiveBusiness',
    revendedora: 'AutoDealer',
    floricultura: 'Florist',
    fotografo: 'ProfessionalService',
    'fotógrafo': 'ProfessionalService',
    fotografia: 'ProfessionalService',
    hotel: 'Hotel',
    pousada: 'LodgingBusiness',
    escola: 'EducationalOrganization',
    educacao: 'EducationalOrganization',
    'educação': 'EducationalOrganization',
    supermercado: 'GroceryStore',
    loja: 'Store',
  }

  for (const [key, type] of Object.entries(map)) {
    if (c.includes(key)) return type
  }
  return 'LocalBusiness'
}

function parseHours(hoursString: string): { opens: string; closes: string } | null {
  const match = hoursString.match(/(\d{1,2}):?(\d{2})?\s*[-–]\s*(\d{1,2}):?(\d{2})?/)
  if (!match) return null

  const opensHour = match[1].padStart(2, '0')
  const opensMin = match[2] || '00'
  const closesHour = match[3].padStart(2, '0')
  const closesMin = match[4] || '00'

  return {
    opens: `${opensHour}:${opensMin}`,
    closes: `${closesHour}:${closesMin}`,
  }
}

export function generateLocalBusinessJsonLd(data: LocalBusinessData) {
  const url = data.customDomain
    ? `https://${data.customDomain}`
    : `https://${data.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'decolou.com'}`

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}/#business`,
    name: data.name,
    url,
    telephone: data.phone ? `+${normalizePhoneNumber(data.phone)}` : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address,
      addressLocality: data.city,
      addressRegion: data.state,
      postalCode: data.zipCode,
      addressCountry: 'BR',
    },
    areaServed: data.neighborhoods && data.neighborhoods.length > 0
      ? [
          { '@type': 'City', name: data.city },
          ...data.neighborhoods.map(n => ({ '@type': 'Place', name: `${n}, ${data.city}` })),
        ]
      : { '@type': 'City', name: data.city },
  }

  if (data.description) {
    schema.description = data.description
  }

  if (data.priceRange) {
    schema.priceRange = data.priceRange
  } else {
    schema.priceRange = '$$'
  }

  if (data.latitude && data.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
    }
  }

  if (data.openingHours && Object.keys(data.openingHours).length > 0) {
    const specs: Record<string, unknown>[] = []

    for (const [day, hours] of Object.entries(data.openingHours)) {
      const dayUrl = DAY_OF_WEEK_URLS[day.toLowerCase()]
      if (!dayUrl) continue

      const parsed = parseHours(hours)
      if (!parsed) continue

      specs.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayUrl,
        opens: parsed.opens,
        closes: parsed.closes,
      })
    }

    if (specs.length > 0) {
      schema.openingHoursSpecification = specs
    }
  }

  if (data.imageUrl && !data.imageUrl.includes('maps.googleapis.com')) {
    schema.image = {
      '@type': 'ImageObject',
      url: data.imageUrl,
      width: 1200,
      height: 630,
    }
  }

  if (data.email) {
    schema.email = data.email
  }

  if (data.sameAs && data.sameAs.length > 0) {
    schema.sameAs = data.sameAs
  }

  if (data.knowsAbout && data.knowsAbout.length > 0) {
    schema.knowsAbout = data.knowsAbout
  }

  if (data.category) {
    schema['@type'] = 'LocalBusiness'
    schema.additionalType = `https://schema.org/${mapCategoryToSchema(data.category)}`
  }

  if (data.rating && data.reviewCount && data.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: parseFloat(data.rating),
      bestRating: 5,
      worstRating: 1,
      reviewCount: data.reviewCount,
    }
  }

  if (data.reviews && data.reviews.length > 0) {
    schema.review = data.reviews.slice(0, 5).map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.authorName,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.content,
      ...(review.createdAt && { datePublished: new Date(review.createdAt).toISOString().split('T')[0] }),
    }))
  }

  return schema
}

export function generateBreadcrumbJsonLd(data: {
  name: string
  city: string
  category: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: data.category,
        item: `https://decolou.com/${data.category.toLowerCase().replace(/\s+/g, '-')}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${data.category} em ${data.city}`,
        item: `https://decolou.com/${data.category.toLowerCase().replace(/\s+/g, '-')}/${data.city.toLowerCase().replace(/\s+/g, '-')}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.name,
        item: data.url,
      },
    ],
  }
}
