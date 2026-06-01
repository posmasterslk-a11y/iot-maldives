import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const supabase = await serverSupabaseServiceRole(event)

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (error) {
    throw createError({ statusCode: error.status || 500, statusMessage: error.message })
  }

  return { success: true, user: data.user }
})
