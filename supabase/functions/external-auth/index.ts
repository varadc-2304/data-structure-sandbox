import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// JWT secret for decryption - in production this should be from environment
const JWT_SECRET = Deno.env.get('JWT_SECRET') || 'your-secret-key'

async function decryptJWT(token: string): Promise<any> {
  try {
    // Remove 'ey' prefix if present and decode JWT
    const cleanToken = token.startsWith('ey') ? token.substring(2) : token
    
    // For demonstration, we'll use a simple base64 decode
    // In production, use proper JWT library with verification
    const parts = cleanToken.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }
    
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch (error) {
    console.error('JWT decryption failed:', error)
    throw new Error('Failed to decrypt token')
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

    const { encrypted_token } = await req.json()

    console.log('Received encrypted token:', encrypted_token)

    if (!encrypted_token) {
      return new Response(
        JSON.stringify({ error: 'encrypted_token is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Decrypting token...')

    // Decrypt the JWT token
    let userData
    try {
      userData = await decryptJWT(encrypted_token)
      console.log('Decrypted user data:', userData)
    } catch (error) {
      console.log('Token decryption failed:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid or corrupted token' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate required user data fields
    if (!userData.email || !userData.id) {
      return new Response(
        JSON.stringify({ error: 'Invalid user data in token' }),
        { 
          status: 400, 
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