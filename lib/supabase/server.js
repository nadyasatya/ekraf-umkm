import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Membuat koneksi Supabase untuk server menggunakan SUPABASE_URL dan SUPABASE_SECRET_KEY.
 * Digunakan di sisi server (Server Component/Server Action) untuk membaca data katalog
 * tanpa memerlukan sesi login pengunjung.
 */
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY wajib dikonfigurasi di environment variable."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export { createServerClient as createClient };
export default createServerClient;
