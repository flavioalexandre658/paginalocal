import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import { db } from '@/db'
import * as schema from '@/db/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    'http://localhost:3000',
    'https://paginalocal.com.br',
    'https://www.paginalocal.com.br',
    'https://paginalocal.com',
    'https://www.paginalocal.com',
    process.env.NEXT_PUBLIC_APP_URL || '',
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    admin({
      defaultRole: 'user',
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    cookiePrefix: 'pgl',
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubdomainCookies: {
      enabled: process.env.NODE_ENV === 'production',
      domain: process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br',
    },
  },
})
