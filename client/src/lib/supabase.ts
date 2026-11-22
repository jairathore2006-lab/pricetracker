import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Local storage key for persistent user configuration
const SUPABASE_URL_KEY = 'pricewise_supabase_url';
const SUPABASE_ANON_KEY = 'pricewise_supabase_anon_key';

export function getStoredSupabaseConfig() {
  const url = localStorage.getItem(SUPABASE_URL_KEY) || import.meta.env.VITE_SUPABASE_URL || '';
  const anonKey = localStorage.getItem(SUPABASE_ANON_KEY) || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return { url, anonKey };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  localStorage.setItem(SUPABASE_URL_KEY, url);
  localStorage.setItem(SUPABASE_ANON_KEY, anonKey);
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getStoredSupabaseConfig();
  if (url && anonKey) {
    if (!supabaseInstance) {
      try {
        supabaseInstance = createClient(url, anonKey);
      } catch (e) {
        console.warn('Failed to init Supabase client', e);
        return null;
      }
    }
    return supabaseInstance;
  }
  return null;
}
