import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    if (!email) return Response.json({ error: 'Email required' }, { status: 400 })

    const { data, error } = await supabase
      .from('users')
      .select('api_tokens, plan')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !data) return Response.json({ error: 'User not found' }, { status: 404 })
    return Response.json({ api_tokens: data.api_tokens, plan: data.plan })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
