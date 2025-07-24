import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Validation schemas
const externalAuthSchema = {
  encrypted_token: (value: any) => typeof value === 'string' && value.length > 0 && value.length < 2048
}

const userDataSchema = {
  id: (value: any) => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value),
  email: (value: any) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 255,
  exp: (value: any) => typeof value === 'number' && value > 0,
  iat: (value: any) => typeof value === 'number' && value > 0
}

async function verifyJWTSignature(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return false
    }

    const [header, payload, signature] = parts
    const data = `${header}.${payload}`
    
    // Create HMAC-SHA256 signature
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
    const expectedSignatureBase64 = btoa(String.fromCharCode(...new Uint8Array(expectedSignature)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
    
    return signature === expectedSignatureBase64
  } catch (error) {
    console.error('JWT signature verification failed:', error)
    return false
  }
}

async function verifyAndDecodeJWT(token: string): Promise<any> {
  try {
    // Remove 'ey' prefix if present
    const cleanToken = token.startsWith('ey') ? token.substring(2) : token
    
    // Validate JWT format
    const parts = cleanToken.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }
    
    // Get JWT secret from environment (REQUIRED - no fallback)
    const jwtSecret = Deno.env.get('JWT_SECRET')
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required')
    }
    
    // Verify signature
    const isSignatureValid = await verifyJWTSignature(cleanToken, jwtSecret)
    if (!isSignatureValid) {
      throw new Error('Invalid JWT signature')
    }
    
    // Decode payload
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const userData = JSON.parse(decoded)
    
    // Validate token expiration
    const now = Math.floor(Date.now() / 1000)
    if (userData.exp && userData.exp < now) {
      throw new Error('Token has expired')
    }
    
    // Validate required fields
    if (!userDataSchema.id(userData.id) || !userDataSchema.email(userData.email)) {
      throw new Error('Invalid user data in token')
    }
    
    return userData
  } catch (error) {
    console.error('JWT verification failed:', error)
    throw error
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const requestBody = await req.json()
    
    // Validate request body
    if (!requestBody || typeof requestBody !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { encrypted_token } = requestBody

    console.log('Received external auth request')

    // Validate encrypted_token
    if (!externalAuthSchema.encrypted_token(encrypted_token)) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing encrypted_token' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Verifying and decoding JWT token...')

    // Verify and decode the JWT token
    let userData
    try {
      userData = await verifyAndDecodeJWT(encrypted_token)
      console.log('Token verified successfully for user:', userData.email)
    } catch (error) {
      console.log('Token verification failed:', error.message)
      return new Response(
        JSON.stringify({ 
          error: 'Authentication failed', 
          details: error.message 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Checking if user exists in auth table...')

    // Check if user exists in auth table
    const { data: existingUser, error: checkError } = await supabase
      .from('auth')
      .select('id, email, name, prn')
      .eq('email', userData.email)
      .single()

    let finalUserData
    let isNewUser = false

    if (checkError && checkError.code === 'PGRST116') {
      // User doesn't exist, create new user
      console.log('User not found, creating new user...')
      isNewUser = true

      const newUserData = {
        id: userData.id,
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        prn: userData.prn || null,
        department: userData.department || null,
        course: userData.course || null,
        grad_year: userData.grad_year || null,
        role: userData.role || 'student',
        password: 'EXTERNAL_AUTH', // Placeholder for external auth users
        created_at: new Date().toISOString(),
      }

      const { data: createdUser, error: createError } = await supabase
        .from('auth')
        .insert(newUserData)
        .select('id, email, name, prn')
        .single()

      if (createError) {
        console.log('User creation failed:', createError)
        return new Response(
          JSON.stringify({ error: 'Failed to create user account' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      finalUserData = createdUser
      console.log('New user created:', finalUserData)
    } else if (existingUser) {
      // User exists, verify and update if needed
      console.log('Existing user found:', existingUser)
      finalUserData = existingUser
    } else {
      // Some other error occurred
      console.log('Error checking user:', checkError)
      return new Response(
        JSON.stringify({ error: 'Database error occurred' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Authentication successful for user:', finalUserData.email)

    return new Response(
      JSON.stringify({ 
        success: true,
        user_data: finalUserData,
        is_new_user: isNewUser,
        message: isNewUser ? 'User account created and logged in' : 'User logged in successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('External auth error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})