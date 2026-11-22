import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://vdxspyumkvwawmqwfkzr.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_phag39UwA63y44O1703IkA_Ky6ebjwV';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export async function supabaseFetch(endpoint: string, token?: string, body?: any) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return response;
}
