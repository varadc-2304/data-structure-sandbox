
// This edge function creates a demo user for testing purposes
// It should only be used in development

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const handler = async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Check if the demo user already exists
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', 'demo@example.com')
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Demo user already exists' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a new demo user
    const { data: user, error } = await supabase.auth.admin.createUser({
      email: 'demo@example.com',
      password: 'password123',
      email_confirm: true
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ message: 'Demo user created successfully', user }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

Deno.serve(handler);
