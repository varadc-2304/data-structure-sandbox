
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const { user_id } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Auto-login request for user_id:', user_id)

    // Validate user exists in auth table
    const { data: userData, error: userError } = await supabase
      .from('auth')
      .select('id, email')
      .eq('id', user_id)
      .single()

    if (userError || !userData) {
      console.log('User validation failed:', userError)
      return new Response(
        JSON.stringify({ error: 'Invalid user_id' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('User found:', userData.email)

    // Generate a unique token
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now

    // Store token in auto_login_tokens table
    const { error: tokenError } = await supabase
      .from('auto_login_tokens')
      .insert({
        user_id: user_id,
        token: token,
        expires_at: expiresAt.toISOString(),
        used: false
      })

    if (tokenError) {
      console.log('Token creation failed:', tokenError)
      return new Response(
        JSON.stringify({ error: 'Failed to create login token' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Auto-login token created successfully')

    // Return the auto-login URL
    const loginUrl = `${req.headers.get('origin') || 'https://your-app-domain.com'}/auto-login?token=${token}`

    return new Response(
      JSON.stringify({ 
        success: true,
        login_url: loginUrl,
        token: token,
        expires_at: expiresAt.toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Auto-login error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
