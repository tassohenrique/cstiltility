import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS. Only import from Server Actions/Route
// Handlers that have already verified the caller is an admin.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
