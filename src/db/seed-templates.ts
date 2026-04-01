import 'dotenv/config'
import { db } from '@/db'
import { siteTemplate } from '@/db/schema'

async function seedTemplates() {
  console.log('🌱 Seeding templates...')

  try {
    await db.insert(siteTemplate).values({
      id: 'aurora',
      name: 'Aurora',
      description: 'Design premium para empresas de tecnologia e SaaS. Cantos arredondados, fundo creme quente, glassmorphism, botoes pill e tipografia sofisticada.',
      thumbnailUrl: null,
      previewUrl: '/preview-grovia',
      bestFor: [
        'saas', 'tech', 'startup', 'fintech', 'consultoria', 'agencia',
        'b2b', 'software', 'plataforma', 'app', 'tecnologia', 'digital',
        'marketing-digital', 'automacao', 'inteligencia-artificial', 'ia',
        'desenvolvimento', 'sistemas', 'ti', 'informatica',
      ],
      forceStyle: 'elegant',
      forceRadius: 'lg',
      recommendedHeadingFont: 'inter',
      recommendedBodyFont: 'inter',
      defaultSections: [
        { blockType: 'header', variant: 1, name: 'Header Pill', description: 'Nav flutuante pill-shaped' },
        { blockType: 'hero', variant: 1, name: 'Hero Dashboard', description: 'Split com imagem/mockup' },
        { blockType: 'services', variant: 1, name: 'Process Steps', description: 'Steps numerados com imagem' },
        { blockType: 'services', variant: 2, name: 'Feature Tabs', description: 'Tabs com preview de feature' },
        { blockType: 'stats', variant: 1, name: 'Integration Grid', description: 'Grid de integracoes com steps numerados' },
        { blockType: 'pricing', variant: 1, name: 'Glassmorphism', description: 'Cards com glassmorphism escuro' },
        { blockType: 'testimonials', variant: 1, name: 'Case Studies', description: 'Cases + depoimentos' },
        { blockType: 'faq', variant: 1, name: 'Split Clean', description: 'FAQ split com sticky title' },
        { blockType: 'footer', variant: 1, name: 'Newsletter Grid', description: 'Footer com newsletter e 4 colunas' },
      ],
      availableVariants: {
        header: [1],
        hero: [1],
        services: [1, 2],
        stats: [1],
        pricing: [1],
        testimonials: [1],
        faq: [1],
        footer: [1],
        about: [1],
        contact: [1],
        cta: [1],
        'whatsapp-float': [1],
      },
      sortOrder: 1,
      isActive: true,
    }).onConflictDoUpdate({
      target: siteTemplate.id,
      set: {
        name: 'Aurora',
        description: 'Design premium para empresas de tecnologia e SaaS. Cantos arredondados, fundo creme quente, glassmorphism, botoes pill e tipografia sofisticada.',
        bestFor: [
          'saas', 'tech', 'startup', 'fintech', 'consultoria', 'agencia',
          'b2b', 'software', 'plataforma', 'app', 'tecnologia', 'digital',
          'marketing-digital', 'automacao', 'inteligencia-artificial', 'ia',
          'desenvolvimento', 'sistemas', 'ti', 'informatica',
        ],
        defaultSections: [
          { blockType: 'header', variant: 1, name: 'Header Pill', description: 'Nav flutuante pill-shaped' },
          { blockType: 'hero', variant: 1, name: 'Hero Dashboard', description: 'Split com imagem/mockup' },
          { blockType: 'services', variant: 1, name: 'Process Steps', description: 'Steps numerados com imagem' },
          { blockType: 'services', variant: 2, name: 'Feature Tabs', description: 'Tabs com preview de feature' },
          { blockType: 'stats', variant: 1, name: 'Integration Grid', description: 'Grid de integracoes com steps numerados' },
          { blockType: 'pricing', variant: 1, name: 'Glassmorphism', description: 'Cards com glassmorphism escuro' },
          { blockType: 'testimonials', variant: 1, name: 'Case Studies', description: 'Cases + depoimentos' },
          { blockType: 'faq', variant: 1, name: 'Split Clean', description: 'FAQ split com sticky title' },
          { blockType: 'footer', variant: 1, name: 'Newsletter Grid', description: 'Footer com newsletter e 4 colunas' },
        ],
        updatedAt: new Date(),
      },
    })

    console.log('✅ Template "Aurora" criado/atualizado com sucesso!')

    // ── Torque ──
    await db.insert(siteTemplate).values({
      id: 'plumbflow',
      name: 'Torque',
      description: 'Design profissional e robusto para servicos e manutencao. Dark navy com accent laranja, tipografia Satoshi bold, botoes pill com efeito glossy, timeline animada e formularios de lead.',
      thumbnailUrl: null,
      previewUrl: '/preview-plumbflow',
      bestFor: [
        'encanamento', 'encanador', 'plumbing',
        'eletricista', 'electrician',
        'manutencao', 'maintenance',
        'climatizacao', 'hvac', 'ar-condicionado',
        'pintura', 'painting', 'pintor',
        'reformas', 'construction', 'pedreiro',
        'desentupidora', 'limpeza',
        'servicos-domesticos', 'home-services',
        'serralheria', 'vidracaria',
        'dedetizacao', 'pest-control',
        'jardinagem', 'landscaping',
        'mudancas', 'moving',
        'seguranca', 'alarmes',
        'energia-solar', 'solar',
        'mecanica', 'auto-repair', 'mecanico',
        'chaveiro', 'locksmith',
      ],
      forceStyle: 'bold',
      forceRadius: 'full',
      recommendedHeadingFont: 'satoshi',
      recommendedBodyFont: 'satoshi',
      defaultSections: [
        { blockType: 'header', variant: 1, name: 'Header + Top Bar', description: 'Nav escuro com barra de contato, logo, links e CTA pill orange' },
        { blockType: 'hero', variant: 1, name: 'Hero Full Image', description: 'Hero com bg image, glassmorphism badge e barra de reconhecimento' },
        { blockType: 'contact', variant: 1, name: 'Quick Form', description: 'Formulario rapido inline com nome + telefone' },
        { blockType: 'about', variant: 1, name: 'About Tabs', description: 'Secao about com tabs interativas e checklist' },
        { blockType: 'stats', variant: 1, name: 'Counter Animated', description: 'Contadores animados com scroll trigger' },
        { blockType: 'services', variant: 1, name: 'Services Tabs', description: 'Servicos com lista clicavel e card com imagem' },
        { blockType: 'services', variant: 2, name: 'Process Timeline', description: 'Timeline alternada com scroll progress' },
        { blockType: 'services', variant: 3, name: 'Why Choose Us', description: 'Features com icones e imagem lateral' },
        { blockType: 'testimonials', variant: 1, name: 'Testimonials Dark', description: 'Cards brancos sobre fundo navy escuro' },
        { blockType: 'gallery', variant: 1, name: 'Bento Grid', description: 'Grid bento com card tall + 4 menores' },
        { blockType: 'cta', variant: 1, name: 'CTA + Form', description: 'Banner escuro com formulario de contato overlapping' },
        { blockType: 'footer', variant: 1, name: 'Footer Dark 4-col', description: 'Footer escuro com 4 colunas e social icons' },
      ],
      availableVariants: {
        header: [1],
        hero: [1],
        contact: [1],
        about: [1],
        stats: [1],
        services: [1, 2, 3],
        testimonials: [1],
        gallery: [1],
        cta: [1],
        footer: [1],
      },
      sortOrder: 2,
      isActive: true,
    }).onConflictDoUpdate({
      target: siteTemplate.id,
      set: {
        name: 'Torque',
        description: 'Design profissional e robusto para servicos e manutencao. Dark navy com accent laranja, tipografia Satoshi bold, botoes pill com efeito glossy, timeline animada e formularios de lead.',
        bestFor: [
          'encanamento', 'encanador', 'plumbing',
          'eletricista', 'electrician',
          'manutencao', 'maintenance',
          'climatizacao', 'hvac', 'ar-condicionado',
          'pintura', 'painting', 'pintor',
          'reformas', 'construction', 'pedreiro',
          'desentupidora', 'limpeza',
          'servicos-domesticos', 'home-services',
          'serralheria', 'vidracaria',
          'dedetizacao', 'pest-control',
          'jardinagem', 'landscaping',
          'mudancas', 'moving',
          'seguranca', 'alarmes',
          'energia-solar', 'solar',
          'mecanica', 'auto-repair', 'mecanico',
          'chaveiro', 'locksmith',
        ],
        defaultSections: [
          { blockType: 'header', variant: 1, name: 'Header + Top Bar', description: 'Nav escuro com barra de contato, logo, links e CTA pill orange' },
          { blockType: 'hero', variant: 1, name: 'Hero Full Image', description: 'Hero com bg image, glassmorphism badge e barra de reconhecimento' },
          { blockType: 'contact', variant: 1, name: 'Quick Form', description: 'Formulario rapido inline com nome + telefone' },
          { blockType: 'about', variant: 1, name: 'About Tabs', description: 'Secao about com tabs interativas e checklist' },
          { blockType: 'stats', variant: 1, name: 'Counter Animated', description: 'Contadores animados com scroll trigger' },
          { blockType: 'services', variant: 1, name: 'Services Tabs', description: 'Servicos com lista clicavel e card com imagem' },
          { blockType: 'services', variant: 2, name: 'Process Timeline', description: 'Timeline alternada com scroll progress' },
          { blockType: 'services', variant: 3, name: 'Why Choose Us', description: 'Features com icones e imagem lateral' },
          { blockType: 'testimonials', variant: 1, name: 'Testimonials Dark', description: 'Cards brancos sobre fundo navy escuro' },
          { blockType: 'gallery', variant: 1, name: 'Bento Grid', description: 'Grid bento com card tall + 4 menores' },
          { blockType: 'cta', variant: 1, name: 'CTA + Form', description: 'Banner escuro com formulario de contato overlapping' },
          { blockType: 'footer', variant: 1, name: 'Footer Dark 4-col', description: 'Footer escuro com 4 colunas e social icons' },
        ],
        availableVariants: {
          header: [1],
          hero: [1],
          contact: [1],
          about: [1],
          stats: [1],
          services: [1, 2, 3],
          testimonials: [1],
          gallery: [1],
          cta: [1],
          footer: [1],
        },
        updatedAt: new Date(),
      },
    })

    console.log('✅ Template "Torque" criado/atualizado com sucesso!')

    // ── Roofora (Apex) ──
    await db.insert(siteTemplate).values({
      id: 'roofora',
      name: 'Apex',
      description: 'Design dark premium com accent lime green. Tipografia Urbanist, cards escuros, botoes pill accent vibrante. Ideal para construcao, telhados, solar e reformas.',
      thumbnailUrl: null,
      previewUrl: '/preview-roofora',
      bestFor: [
        'telhado', 'telhados', 'roofing',
        'solar', 'energia-solar', 'painel-solar',
        'construcao', 'construtora', 'construction',
        'impermeabilizacao', 'waterproofing',
        'reforma', 'reformas', 'remodeling',
        'arquitetura', 'architecture',
        'engenharia', 'engineering',
        'terraplanagem', 'excavation',
        'estrutura-metalica', 'steel',
        'gesso', 'drywall',
        'pisos', 'flooring',
        'fachada', 'facade',
        'piscina', 'pool',
      ],
      forceStyle: 'bold',
      forceRadius: 'full',
      recommendedHeadingFont: 'urbanist',
      recommendedBodyFont: 'urbanist',
      defaultSections: [
        { blockType: 'header', variant: 1, name: 'Header Dark', description: 'Nav escuro com logo, links e CTA accent lime' },
        { blockType: 'hero', variant: 1, name: 'Hero Bold', description: 'Hero com titulo grande, 2 CTAs, feature badges abaixo' },
        { blockType: 'about', variant: 1, name: 'About Split', description: 'Imagem + texto + feature list com icones' },
        { blockType: 'services', variant: 1, name: 'Services Grid', description: 'Grid de cards de servicos com icones' },
        { blockType: 'stats', variant: 1, name: 'Stats Counter', description: 'Contadores animados de metricas' },
        { blockType: 'gallery', variant: 1, name: 'Projects Grid', description: 'Portfolio grid com imagens e labels' },
        { blockType: 'services', variant: 2, name: 'How It Works', description: '3 passos numerados com CTA' },
        { blockType: 'testimonials', variant: 1, name: 'Reviews Dark', description: 'Depoimentos sobre fundo escuro' },
        { blockType: 'faq', variant: 1, name: 'FAQ Accordion', description: 'Perguntas e respostas com accordion' },
        { blockType: 'cta', variant: 1, name: 'Newsletter CTA', description: 'CTA com newsletter subscribe' },
        { blockType: 'footer', variant: 1, name: 'Footer Dark', description: 'Footer escuro com 4 colunas e social' },
      ],
      availableVariants: {
        header: [1],
        hero: [1],
        about: [1],
        services: [1, 2],
        stats: [1],
        gallery: [1],
        testimonials: [1],
        faq: [1],
        cta: [1],
        footer: [1],
      },
      sortOrder: 3,
      isActive: true,
    }).onConflictDoUpdate({
      target: siteTemplate.id,
      set: {
        name: 'Apex',
        description: 'Design dark premium com accent lime green. Tipografia Urbanist, cards escuros, botoes pill accent vibrante. Ideal para construcao, telhados, solar e reformas.',
        bestFor: [
          'telhado', 'telhados', 'roofing',
          'solar', 'energia-solar', 'painel-solar',
          'construcao', 'construtora', 'construction',
          'impermeabilizacao', 'waterproofing',
          'reforma', 'reformas', 'remodeling',
          'arquitetura', 'architecture',
          'engenharia', 'engineering',
          'terraplanagem', 'excavation',
          'estrutura-metalica', 'steel',
          'gesso', 'drywall',
          'pisos', 'flooring',
          'fachada', 'facade',
          'piscina', 'pool',
        ],
        defaultSections: [
          { blockType: 'header', variant: 1, name: 'Header Dark', description: 'Nav escuro com logo, links e CTA accent lime' },
          { blockType: 'hero', variant: 1, name: 'Hero Bold', description: 'Hero com titulo grande, 2 CTAs, feature badges abaixo' },
          { blockType: 'about', variant: 1, name: 'About Split', description: 'Imagem + texto + feature list com icones' },
          { blockType: 'services', variant: 1, name: 'Services Grid', description: 'Grid de cards de servicos com icones' },
          { blockType: 'stats', variant: 1, name: 'Stats Counter', description: 'Contadores animados de metricas' },
          { blockType: 'gallery', variant: 1, name: 'Projects Grid', description: 'Portfolio grid com imagens e labels' },
          { blockType: 'services', variant: 2, name: 'How It Works', description: '3 passos numerados com CTA' },
          { blockType: 'testimonials', variant: 1, name: 'Reviews Dark', description: 'Depoimentos sobre fundo escuro' },
          { blockType: 'faq', variant: 1, name: 'FAQ Accordion', description: 'Perguntas e respostas com accordion' },
          { blockType: 'cta', variant: 1, name: 'Newsletter CTA', description: 'CTA com newsletter subscribe' },
          { blockType: 'footer', variant: 1, name: 'Footer Dark', description: 'Footer escuro com 4 colunas e social' },
        ],
        availableVariants: {
          header: [1],
          hero: [1],
          about: [1],
          services: [1, 2],
          stats: [1],
          gallery: [1],
          testimonials: [1],
          faq: [1],
          cta: [1],
          footer: [1],
        },
        updatedAt: new Date(),
      },
    })

    console.log('✅ Template "Apex (Roofora)" criado/atualizado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao criar template:', error)
    throw error
  }
}

seedTemplates()
  .then(() => {
    console.log('🎉 Seed de templates concluido!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Erro fatal no seed:', error)
    process.exit(1)
  })
