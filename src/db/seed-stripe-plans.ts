import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import Stripe from 'stripe'
import { plan } from './schema/plans.schema'
import { eq } from 'drizzle-orm'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in .env')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PLANS_CONFIG = {
  ESSENTIAL: {
    name: 'Essencial',
    type: 'ESSENTIAL' as const,
    description: 'Ideal para pequenos negócios que estão começando',
    monthlyPriceInCents: 5990,
    yearlyPriceInCents: 59700,
    isHighlighted: true,
    sortOrder: 1,
    features: {
      maxStores: 1,
      maxPhotosPerStore: 6,
      aiRewritesPerMonth: 2,
      customDomain: false,
      gmbSync: true,
      gmbAutoUpdate: false,
      unifiedDashboard: false,
    },
  },
  PRO: {
    name: 'Pro',
    type: 'PRO' as const,
    description: 'Para negócios que querem crescer com recursos avançados',
    monthlyPriceInCents: 9990,
    yearlyPriceInCents: 89700,
    isHighlighted: false,
    sortOrder: 2,
    features: {
      maxStores: 1,
      maxPhotosPerStore: 20,
      aiRewritesPerMonth: null,
      customDomain: true,
      gmbSync: true,
      gmbAutoUpdate: true,
      unifiedDashboard: false,
    },
  },
  AGENCY: {
    name: 'Agência',
    type: 'AGENCY' as const,
    description: 'Para agências e profissionais que gerenciam múltiplos negócios',
    monthlyPriceInCents: 39790,
    yearlyPriceInCents: 397000,
    isHighlighted: false,
    sortOrder: 3,
    features: {
      maxStores: 10,
      maxPhotosPerStore: 50,
      aiRewritesPerMonth: null,
      customDomain: true,
      gmbSync: true,
      gmbAutoUpdate: true,
      unifiedDashboard: true,
    },
  },
}

async function createStripeProduct(planKey: keyof typeof PLANS_CONFIG) {
  const planConfig = PLANS_CONFIG[planKey]

  console.log(`\n📦 Creating Stripe product for: ${planConfig.name}`)

  const product = await stripe.products.create({
    name: `Página Local - ${planConfig.name}`,
    description: planConfig.description,
    metadata: {
      planType: planConfig.type,
      planKey: planKey,
    },
  })

  console.log(`   ✓ Product created: ${product.id}`)

  const monthlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: planConfig.monthlyPriceInCents,
    currency: 'brl',
    recurring: {
      interval: 'month',
    },
    metadata: {
      planType: planConfig.type,
      interval: 'monthly',
    },
  })

  console.log(`   ✓ Monthly price created: ${monthlyPrice.id} (R$ ${(planConfig.monthlyPriceInCents / 100).toFixed(2)}/mês)`)

  const yearlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: planConfig.yearlyPriceInCents,
    currency: 'brl',
    recurring: {
      interval: 'year',
    },
    metadata: {
      planType: planConfig.type,
      interval: 'yearly',
    },
  })

  console.log(`   ✓ Yearly price created: ${yearlyPrice.id} (R$ ${(planConfig.yearlyPriceInCents / 100).toFixed(2)}/ano)`)

  return {
    productId: product.id,
    monthlyPriceId: monthlyPrice.id,
    yearlyPriceId: yearlyPrice.id,
  }
}

async function seedPlans() {
  console.log('🚀 Starting Stripe plans seed...\n')
  console.log('='.repeat(50))

  for (const planKey of Object.keys(PLANS_CONFIG) as Array<keyof typeof PLANS_CONFIG>) {
    const planConfig = PLANS_CONFIG[planKey]

    const existingPlan = await db
      .select()
      .from(plan)
      .where(eq(plan.type, planConfig.type))
      .limit(1)

    if (existingPlan.length > 0) {
      console.log(`⏭️  Plan ${planConfig.name} already exists, skipping...`)
      continue
    }

    const stripeData = await createStripeProduct(planKey)

    await db.insert(plan).values({
      name: planConfig.name,
      type: planConfig.type,
      description: planConfig.description,
      monthlyPriceInCents: planConfig.monthlyPriceInCents,
      yearlyPriceInCents: planConfig.yearlyPriceInCents,
      stripeProductId: stripeData.productId,
      stripeMonthlyPriceId: stripeData.monthlyPriceId,
      stripeYearlyPriceId: stripeData.yearlyPriceId,
      features: planConfig.features,
      isHighlighted: planConfig.isHighlighted,
      isActive: true,
      sortOrder: planConfig.sortOrder,
    })

    console.log(`   ✓ Plan saved to database`)
  }

  console.log('\n' + '='.repeat(50))
  console.log('✅ All plans created successfully!\n')

  const allPlans = await db.select().from(plan)
  console.log('📋 Plans in database:')
  allPlans.forEach(p => {
    console.log(`   - ${p.name} (${p.type}): R$ ${(p.monthlyPriceInCents / 100).toFixed(2)}/mês | R$ ${(p.yearlyPriceInCents / 100).toFixed(2)}/ano`)
  })
}

seedPlans()
  .then(() => {
    console.log('\n🎉 Seed completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  })
