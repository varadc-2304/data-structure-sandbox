
// Import the configured supabase client from the integrations folder
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export the supabase client for use in the application
export const supabase = supabaseClient;
