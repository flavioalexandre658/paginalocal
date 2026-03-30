export type FontCategory = 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'decorative'
export type FontSource = 'local' | 'google'

export interface FontOption {
  slug: string
  name: string
  family: string
  category: FontCategory
  source: FontSource
  weights: string[]
  suitableFor: 'heading' | 'body' | 'both'
}

export const AVAILABLE_FONTS: FontOption[] = [
  // ---------------------------------------------------------------------------
  // Google Fonts
  // ---------------------------------------------------------------------------
  { slug: 'inter', name: 'Inter', family: "'Inter'", category: 'sans-serif', source: 'google', weights: ['400', '500', '600', '700', '800'], suitableFor: 'both' },
  { slug: 'poppins', name: 'Poppins', family: "'Poppins'", category: 'sans-serif', source: 'google', weights: ['400', '500', '600', '700', '800'], suitableFor: 'both' },
  { slug: 'open-sans', name: 'Open Sans', family: "'Open Sans'", category: 'sans-serif', source: 'google', weights: ['400', '500', '600', '700', '800'], suitableFor: 'both' },
  { slug: 'roboto-google', name: 'Roboto', family: "'Roboto'", category: 'sans-serif', source: 'google', weights: ['400', '500', '700', '900'], suitableFor: 'both' },
  { slug: 'montserrat', name: 'Montserrat', family: "'Montserrat'", category: 'sans-serif', source: 'google', weights: ['400', '500', '600', '700', '800'], suitableFor: 'both' },
  { slug: 'nunito', name: 'Nunito', family: "'Nunito'", category: 'sans-serif', source: 'google', weights: ['400', '500', '600', '700', '800'], suitableFor: 'both' },
  { slug: 'raleway', name: 'Raleway', family: "'Raleway'", category: 'sans-serif', source: 'google', weights: ['400', '500', '600', '700', '800'], suitableFor: 'both' },
  { slug: 'dm-sans', name: 'DM Sans', family: "'DM Sans'", category: 'sans-serif', source: 'google', weights: ['400', '500', '600', '700'], suitableFor: 'both' },
  { slug: 'plus-jakarta-sans', name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans'", category: 'sans-serif', source: 'google', weights: ['400', '500', '600', '700', '800'], suitableFor: 'both' },
  { slug: 'work-sans', name: 'Work Sans', family: "'Work Sans'", category: 'sans-serif', source: 'google', weights: ['400', '500', '600', '700', '800'], suitableFor: 'both' },
  { slug: 'outfit', name: 'Outfit', family: "'Outfit'", category: 'sans-serif', source: 'google', weights: ['400', '500', '600', '700', '800'], suitableFor: 'both' },
  { slug: 'playfair-display', name: 'Playfair Display', family: "'Playfair Display'", category: 'serif', source: 'google', weights: ['400', '500', '600', '700', '800'], suitableFor: 'both' },
  { slug: 'lora', name: 'Lora', family: "'Lora'", category: 'serif', source: 'google', weights: ['400', '500', '600', '700'], suitableFor: 'both' },
  { slug: 'merriweather', name: 'Merriweather', family: "'Merriweather'", category: 'serif', source: 'google', weights: ['400', '700'], suitableFor: 'both' },
  { slug: 'crimson-text', name: 'Crimson Text', family: "'Crimson Text'", category: 'serif', source: 'google', weights: ['400', '600', '700'], suitableFor: 'both' },
  { slug: 'bebas-neue', name: 'Bebas Neue', family: "'Bebas Neue'", category: 'display', source: 'google', weights: ['400'], suitableFor: 'heading' },
  { slug: 'oswald', name: 'Oswald', family: "'Oswald'", category: 'display', source: 'google', weights: ['400', '500', '600', '700'], suitableFor: 'both' },
  { slug: 'source-sans', name: 'Source Sans 3', family: "'Source Sans 3'", category: 'sans-serif', source: 'google', weights: ['300', '400', '600'], suitableFor: 'both' },
  { slug: 'dm-serif-display', name: 'DM Serif Display', family: "'DM Serif Display'", category: 'serif', source: 'google', weights: ['400'], suitableFor: 'heading' },
  { slug: 'space-grotesk', name: 'Space Grotesk', family: "'Space Grotesk'", category: 'sans-serif', source: 'google', weights: ['300', '400', '500', '600', '700'], suitableFor: 'both' },

  // ---------------------------------------------------------------------------
  // Local Fonts — Sans-serif
  // ---------------------------------------------------------------------------
  { slug: 'aldrich', name: 'Aldrich', family: "'Aldrich'", category: 'sans-serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'aristotelica', name: 'Aristotelica', family: "'Aristotelica'", category: 'sans-serif', source: 'local', weights: ['400', '600', '900'], suitableFor: 'both' },
  { slug: 'articulat', name: 'Articulat', family: "'Articulat'", category: 'sans-serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'caviar-dreams', name: 'Caviar Dreams', family: "'CaviarDreams'", category: 'sans-serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'dolce-vita', name: 'Dolce Vita', family: "'DolceVita'", category: 'sans-serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'futuro', name: 'Futuro', family: "'Futuro'", category: 'sans-serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'general-sans', name: 'General Sans', family: "'GeneralSans'", category: 'sans-serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'glacial-indifference', name: 'Glacial Indifference', family: "'Glacial Indifference'", category: 'sans-serif', source: 'local', weights: ['400', '800'], suitableFor: 'both' },
  { slug: 'lucida-sans', name: 'Lucida Sans Unicode', family: "'Lucida Sans Unicode'", category: 'sans-serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'molengo', name: 'Molengo', family: "'Molengo'", category: 'sans-serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'narrow-sans', name: 'Narrow Sans', family: "'NarrowSans'", category: 'sans-serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'open-sans-local', name: 'Open Sans', family: "'OpenSans'", category: 'sans-serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'rimouski', name: 'Rimouski', family: "'Rimouski'", category: 'sans-serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'roboto', name: 'Roboto', family: "'Roboto'", category: 'sans-serif', source: 'local', weights: ['400', '700'], suitableFor: 'both' },
  { slug: 'tahoma', name: 'Tahoma', family: "'Tahoma'", category: 'sans-serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'unica', name: 'Unica', family: "'Unica'", category: 'sans-serif', source: 'local', weights: ['400'], suitableFor: 'both' },

  // ---------------------------------------------------------------------------
  // Local Fonts — Serif
  // ---------------------------------------------------------------------------
  { slug: 'fabada', name: 'Fabada', family: "'Fabada'", category: 'serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'fenwick', name: 'Fenwick', family: "'fenwick'", category: 'serif', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'gentium', name: 'Gentium', family: "'Gentium'", category: 'serif', source: 'local', weights: ['400'], suitableFor: 'both' },

  // ---------------------------------------------------------------------------
  // Local Fonts — Display
  // ---------------------------------------------------------------------------
  { slug: 'above', name: 'Above', family: "'ABOVE'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'adumu', name: 'Adumu', family: "'Adumu'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'a-lancet', name: 'aLancet', family: "'aLancet'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'audiowide', name: 'Audiowide', family: "'Audiowide'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'autolink', name: 'Autolink', family: "'Autolink'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'baloo', name: 'Baloo', family: "'Baloo'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'barbatri', name: 'Barbatri', family: "'BARBATRI'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'bardeo', name: 'Bardeo', family: "'bardeo'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'benguiat-bold', name: 'Benguiat Bold', family: "'BenguiatStd-Bold'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'best-racer', name: 'Best Racer', family: "'Best Racer'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'bison-bold', name: 'Bison Bold', family: "'Bison Bold'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'blazed', name: 'Blazed', family: "'Blazed'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'block', name: 'Block', family: "'Block'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'bubble', name: 'Bubble', family: "'bubble'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'bungee', name: 'Bungee', family: "'Bungee'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'burger-frog', name: 'Burger Frog', family: "'BurgerFrog'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'buycat', name: 'Buycat', family: "'Buycat'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'caprasimo', name: 'Caprasimo', family: "'Caprasimo-Regular'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'chewy', name: 'Chewy', family: "'Chewy'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'coco-biker', name: 'Coco Biker', family: "'CocoBiker'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'concert', name: 'Concert', family: "'Concert'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'crocodile-feet', name: 'Crocodile Feet', family: "'Crocodile Feet DEMO'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'cutter', name: 'Cutter', family: "'cutter'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'eight-one', name: 'Eight One', family: "'EightOne'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'elriott', name: 'Elriott', family: "'ELRIOTT2'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'fredoka', name: 'Fredoka', family: "'Fredoka'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'both' },
  { slug: 'futura', name: 'Futura', family: "'Futura'", category: 'display', source: 'local', weights: ['800'], suitableFor: 'heading' },
  { slug: 'futura-bold', name: 'Futura Bold', family: "'Futura Bold'", category: 'display', source: 'local', weights: ['800'], suitableFor: 'heading' },
  { slug: 'ganton', name: 'Ganton', family: "'Ganton'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'geometry', name: 'Geometry', family: "'Geometry'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'golden-avocado', name: 'Golden Avocado', family: "'Golden Avocado'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'good', name: 'Good', family: "'GOOD'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'gretoon', name: 'Gretoon', family: "'Gretoon'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'hasteristico', name: 'Hasteristico', family: "'Hasteristico'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'henny-penny', name: 'Henny Penny', family: "'HennyPenny-Regular'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'iarnold', name: 'iArnold', family: "'iArnold'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'impos10', name: 'Impos10', family: "'IMPOS10'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'io-font', name: 'IO', family: "'_IO'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'island', name: 'Island', family: "'Island'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'josefin-sans-bold', name: 'Josefin Sans Bold', family: "'JosefinSans-Bold'", category: 'sans-serif', source: 'local', weights: ['700'], suitableFor: 'heading' },
  { slug: 'kirvy', name: 'Kirvy', family: "'Kirvy'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'lethal', name: 'Lethal', family: "'lethal'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'lobster', name: 'Lobster', family: "'Lobster'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'magettas', name: 'Magettas', family: "'Magettas'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'mental', name: 'Mental', family: "'Mental'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'milkshake', name: 'Milkshake', family: "'Milkshake'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'mocca', name: 'Mocca', family: "'Mocca'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'modithorson', name: 'Modithorson', family: "'modithorson'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'monkey', name: 'Monkey', family: "'monkey'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'october', name: 'October', family: "'October'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'optic', name: 'OpTic', family: "'OpTic'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'orbitron', name: 'Orbitron', family: "'Orbitron'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'ornette', name: 'Ornette', family: "'Ornette'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'outerlord', name: 'Outerlord', family: "'Outerlord'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'paduka', name: 'Paduka', family: "'Paduka'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'peace', name: 'Peace', family: "'Peace'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'plexus', name: 'Plexus', family: "'Plexus'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'pompe', name: 'Pompe', family: "'Pompe'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'portico', name: 'Portico', family: "'Portico'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'pricedown', name: 'Pricedown', family: "'pricedown'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'quadranta', name: 'Quadranta', family: "'Quadranta'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'raceway', name: 'Raceway', family: "'Raceway'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'rammetto-one', name: 'Rammetto One', family: "'RammettoOne-Regular'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'redhawk', name: 'Redhawk', family: "'Redhawk'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'republica', name: 'Republica', family: "'Republica'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'righteous', name: 'Righteous', family: "'Righteous'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'shade', name: 'Shade', family: "'Shade'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'space-font', name: 'Space', family: "'space'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'spice', name: 'Spice', family: "'Spice'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'spicy-rice', name: 'Spicy Rice', family: "'SpicyRice'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'star-next', name: 'Star Next', family: "'StarNext'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'stentiga', name: 'Stentiga', family: "'stentiga'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'swat', name: 'SWAT', family: "'SWAT'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'titan-one', name: 'Titan One', family: "'TitanOne'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'tt-phobos-inline', name: 'TT Phobos Inline', family: "'TT Phobos Inline'", category: 'display', source: 'local', weights: ['600'], suitableFor: 'heading' },
  { slug: 'vanilla', name: 'Vanilla', family: "'Vanilla'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'vonique', name: 'Vonique', family: "'Vonique'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'walibi', name: 'Walibi', family: "'Walibi'", category: 'display', source: 'local', weights: ['400'], suitableFor: 'heading' },

  // ---------------------------------------------------------------------------
  // Local Fonts — Handwriting
  // ---------------------------------------------------------------------------
  { slug: 'borel', name: 'Borel', family: "'Borel-Regular'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'buka-bird', name: 'Buka Bird', family: "'Buka Bird'", category: 'handwriting', source: 'local', weights: ['600'], suitableFor: 'heading' },
  { slug: 'calligraffitti', name: 'Calligraffitti', family: "'Calligraffitti'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'caveat', name: 'Caveat', family: "'Caveat-SemiBold'", category: 'handwriting', source: 'local', weights: ['600'], suitableFor: 'heading' },
  { slug: 'chasing', name: 'Chasing', family: "'Chasing'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'childo', name: 'Childo', family: "'Childo'", category: 'handwriting', source: 'local', weights: ['500'], suitableFor: 'heading' },
  { slug: 'cookie', name: 'Cookie', family: "'Cookie'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'dancing-script', name: 'Dancing Script', family: "'Dancing Script Regular'", category: 'handwriting', source: 'local', weights: ['400', '700'], suitableFor: 'heading' },
  { slug: 'florida', name: 'Florida', family: "'Florida'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'gloria-hallelujah', name: 'Gloria Hallelujah', family: "'Gloria Hallelujah'", category: 'handwriting', source: 'local', weights: ['800'], suitableFor: 'heading' },
  { slug: 'guld-script', name: 'Guld Script', family: "'Guld Script'", category: 'handwriting', source: 'local', weights: ['800'], suitableFor: 'heading' },
  { slug: 'handlee', name: 'Handlee', family: "'Handlee'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'homemade', name: 'Homemade', family: "'Homemade'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'intro-script', name: 'Intro Script', family: "'Intro Script B Base'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'kg-all', name: 'KG All', family: "'KGAll'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'magnolia-script', name: 'Magnolia Script', family: "'Magnolia Script'", category: 'handwriting', source: 'local', weights: ['600'], suitableFor: 'heading' },
  { slug: 'mishaland', name: 'Mishaland', family: "'Mishaland'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'miss', name: 'Miss', family: "'Miss'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'pacifico', name: 'Pacifico', family: "'Pacifico'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'playball', name: 'Playball', family: "'Playball'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'playwrite-nz', name: 'Playwrite NZ', family: "'PlaywriteNZ'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'quesha', name: 'Quesha', family: "'Quesha'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'quick-jelly', name: 'Quick Jelly', family: "'Quick Jelly'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'rock-salt', name: 'Rock Salt', family: "'RockSalt'", category: 'handwriting', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'sacramento', name: 'Sacramento', family: "'Sacramento'", category: 'handwriting', source: 'local', weights: ['500'], suitableFor: 'heading' },
  { slug: 'scriptina', name: 'Scriptina', family: "'Scriptina'", category: 'handwriting', source: 'local', weights: ['800'], suitableFor: 'heading' },

  // ---------------------------------------------------------------------------
  // Local Fonts — Decorative
  // ---------------------------------------------------------------------------
  { slug: 'barakat', name: 'Barakat', family: "'Barakat'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'barbie', name: 'Barbie', family: "'Barbie'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'blocks123', name: 'Blocks 123', family: "'Blocks123'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'childos-arabic', name: 'Childos Arabic', family: "'Childos Arabic'", category: 'decorative', source: 'local', weights: ['500'], suitableFor: 'heading' },
  { slug: 'de-pixel-breit', name: 'DePixel Breit', family: "'DePixelBreit'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'fonth', name: 'Fonth', family: "'FONTH'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'fontshui', name: 'Fontshui', family: "'FONTSHUI'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'ghost', name: 'Ghost', family: "'ghost'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'japanese', name: 'Japanese', family: "'Japanese'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'mexican', name: 'Mexican', family: "'mexican'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'multicolore', name: 'Multicolore', family: "'Multicolore'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'naruto', name: 'Naruto', family: "'Naruto'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'pink', name: 'Pink', family: "'Pink'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'shanghai', name: 'Shanghai', family: "'shanghai'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'snackid', name: 'Snackid', family: "'SNACKID'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'snow', name: 'Snow', family: "'SNOW'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'sparkly', name: 'Sparkly', family: "'Sparkly'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'turtles', name: 'Turtles', family: "'Turtles'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
  { slug: 'wood', name: 'Wood', family: "'wood'", category: 'decorative', source: 'local', weights: ['400'], suitableFor: 'heading' },
]

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const DEFAULT_FONT_SLUG = 'inter'

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

export function getFontBySlug(slug: string | null | undefined): FontOption | undefined {
  if (!slug) return AVAILABLE_FONTS.find(f => f.slug === 'inter')
  return AVAILABLE_FONTS.find(f => f.slug === slug)
}

export function getGoogleFontUrl(fontName: string, weights: string[]): string {
  const family = fontName.replace(/\s+/g, '+')
  const wghts = weights.join(';')
  return `https://fonts.googleapis.com/css2?family=${family}:wght@${wghts}&display=swap`
}

export function getHeadingFonts(): FontOption[] {
  return AVAILABLE_FONTS.filter(f => f.suitableFor === 'heading' || f.suitableFor === 'both')
}

export function getBodyFonts(): FontOption[] {
  return AVAILABLE_FONTS.filter(f => f.suitableFor === 'body' || f.suitableFor === 'both')
}

export function getFontsByCategory(category: FontCategory): FontOption[] {
  return AVAILABLE_FONTS.filter(f => f.category === category)
}

export function isLocalFont(slug: string): boolean {
  const font = AVAILABLE_FONTS.find(f => f.slug === slug)
  return font?.source === 'local'
}
