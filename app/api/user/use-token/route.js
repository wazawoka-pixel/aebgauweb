import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(req) {
  try {
    const { email } = await req.json()
    if (!email) return Response.json({ error: 'Email required' }, { status: 400 })

    // Get current balance
    const { data: user, error } = await supabase
      .from('users')
      .select('api_tokens, plan')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !user) return Response.json({ error: 'User not found' }, { status: 404 })
    if (user.api_tokens <= 0) return Response.json({ error: 'No tokens left', out_of_tokens: true }, { status: 402 })

    // Deduct 1 token
    const { data: updated, error: updateError } = await supabase
      .from('users')
      .update({ api_tokens: user.api_tokens - 1 })
      .eq('email', email.toLowerCase())
      .select('api_tokens')
      .single()

    if (updateError) return Response.json({ error: updateError.message }, { status: 500 })
    return Response.json({ success: true, api_tokens: updated.api_tokens })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
