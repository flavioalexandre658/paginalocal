import {
  Inter,
  Poppins,
  Open_Sans,
  Roboto,
  Montserrat,
  Nunito,
  Raleway,
  DM_Sans,
  Plus_Jakarta_Sans,
  Work_Sans,
  Outfit,
  Playfair_Display,
  Lora,
  Merriweather,
  Crimson_Text,
  Bebas_Neue,
  Oswald,
} from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-site', display: 'swap' })
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700', '900'], variable: '--font-site', display: 'swap' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const raleway = Raleway({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const workSans = Work_Sans({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const lora = Lora({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-site', display: 'swap' })
const crimsonText = Crimson_Text({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-site', display: 'swap' })
const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: ['400'], variable: '--font-site', display: 'swap' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-site', display: 'swap' })

export function getSiteFont(fontFamily?: string | null): { variable: string; className: string } {
  const slug = fontFamily || 'inter'

  switch (slug) {
    case 'poppins': return poppins
    case 'open-sans': return openSans
    case 'roboto': return roboto
    case 'montserrat': return montserrat
    case 'nunito': return nunito
    case 'raleway': return raleway
    case 'dm-sans': return dmSans
    case 'plus-jakarta-sans': return plusJakartaSans
    case 'work-sans': return workSans
    case 'outfit': return outfit
    case 'playfair-display': return playfairDisplay
    case 'lora': return lora
    case 'merriweather': return merriweather
    case 'crimson-text': return crimsonText
    case 'bebas-neue': return bebasNeue
    case 'oswald': return oswald
    default: return inter
  }
}
