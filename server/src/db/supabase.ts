import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables or fallback defaults
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

let client: SupabaseClient | null = null;
let isConfigured = false;

if (supabaseUrl && supabaseKey) {
  try {
    client = createClient(supabaseUrl, supabaseKey);
    isConfigured = true;
    console.log('[PriceWise Supabase] Connected to Supabase remote database.');
  } catch (err) {
    console.warn('[PriceWise Supabase] Could not initialize Supabase client:', err);
  }
} else {
  console.log('[PriceWise Database] Operating in robust Local Store & Memory Cache mode (zero setup needed, plug in Supabase keys in Settings anytime).');
}

export const supabase = client;
export const isSupabaseConfigured = () => isConfigured;
