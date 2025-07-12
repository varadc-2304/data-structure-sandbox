
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verify } from "https://deno.land/x/djwt@v3.0.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const jwtSecret = Deno.env.get('JWT_SECRET') || 'your-jwt-secret'
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { token, user_id } = await req.json()

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'JWT token is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify JWT token
    let payload
    try {
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(jwtSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"]
      )
      payload = await verify(token, cryptoKey)
    } catch (error) {
      console.log('JWT verification failed:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid JWT token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate user exists in auth table if user_id is provided
    if (user_id) {
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

      // Generate iframe token
      const iframeToken = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

      // Store iframe token in auto_login_tokens table for validation
      const { error: tokenError } = await supabase
        .from('auto_login_tokens')
        .insert({
          user_id: user_id,
          token: iframeToken,
          expires_at: expiresAt.toISOString(),
          used: false
        })

      if (tokenError) {
        console.log('Token creation failed:', tokenError)
        return new Response(
          JSON.stringify({ error: 'Failed to create iframe token' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          iframe_token: iframeToken,
          expires_at: expiresAt.toISOString(),
          iframe_url: `${req.headers.get('origin') || 'https://your-app-domain.com'}/iframe?token=${iframeToken}`
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // If no user_id provided, just validate the JWT
    return new Response(
      JSON.stringify({ 
        success: true,
        payload: payload,
        message: 'JWT token is valid'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Iframe auth error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
