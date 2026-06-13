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
    
    const hash = await bcrypt.hash(password, 10)
    const { data, error } = await supabase
      .from('users')
      .insert({ email: email.toLowerCase(), password_hash: hash })
      .select('id, email, api_tokens, plan')
      .single()

    if (error) {
      if (error.code === '23505') return Response.json({ error: 'Email already exists' }, { status: 400 })
      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json({ success: true, user: data })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
