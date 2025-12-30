import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getClientEnv } from '@/lib/env';

let client: SupabaseClient | null = null;

export function createClient() {
  if (client) {
    return client;
  }

  const env = getClientEnv();
  
  client = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  return client;
}
