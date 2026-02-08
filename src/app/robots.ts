import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/painel/', '/admin/', '/api/', '/onboarding/', '/entrar/', '/cadastro/', '/recuperar-senha/', '/redefinir-senha/'],
    },
    sitemap: 'https://paginalocal.com.br/sitemap.xml',
  }
}
