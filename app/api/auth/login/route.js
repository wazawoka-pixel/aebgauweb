import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return Response.json({ error: 'Email and password required' }, { status: 400 })

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, api_tokens, plan')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !user) return Response.json({ error: 'Invalid email or password' }, { status: 401 })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return Response.json({ error: 'Invalid email or password' }, { status: 401 })

    return Response.json({
      success: true,
      user: { id: user.id, email: user.email, api_tokens: user.api_tokens, plan: user.plan }
    })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
