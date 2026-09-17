import "server-only";

import { createClient } from "@supabase/supabase-js";

function requiredPublicEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

/**
 * Public queries deliberately use a stateless anonymous client. This prevents
 * an admin browser session cookie from changing the RLS role used by public
 * pages.
 */
export function createPublicClient() {
  return createClient(
    requiredPublicEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    }
  );
}
