import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const TOKEN_PACKAGES = {
  'price_starter':  500,
  'price_pro':      2000,
  'price_unlimited': 99999
}

export async function POST(req) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (e) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const email = session.customer_email || session.metadata?.email
    const priceId = session.metadata?.price_id
    const tokensToAdd = TOKEN_PACKAGES[priceId] || 500

    if (email) {
      const { data: user } = await supabase
        .from('users')
        .select('api_tokens')
        .eq('email', email.toLowerCase())
        .single()

      if (user) {
        await supabase
          .from('users')
          .update({ api_tokens: user.api_tokens + tokensToAdd })
          .eq('email', email.toLowerCase())
      }
    }
  }

  return Response.json({ received: true })
}
