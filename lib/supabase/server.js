import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient as createSsrClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

/**
 * Membuat koneksi Supabase sesi admin menggunakan @supabase/ssr dan cookie,
 * memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY.
 * Digunakan untuk login, keluar, ganti password, dan aksi admin lainnya.
 */
export async function createSessionClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY wajib dikonfigurasi di environment variable."
    );
  }

  const cookieStore = await cookies();

  return createSsrClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Abaikan jika dipanggil dari konteks yang tidak mengizinkan modifikasi cookie
        }
      },
    },
  });
}

export {
  createServerClient as createClient,
  createSessionClient as createAuthClient,
};
export default createServerClient;
