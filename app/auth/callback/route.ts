import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const authFlow = searchParams.get('auth_flow')

  // This app enforces email OTP verification from the UI.
  // If a user clicks a magic link, send them back to the app and ask for OTP instead.
  if (authFlow !== 'otp') {
    return NextResponse.redirect(`${origin}/?authError=otp_required`)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
