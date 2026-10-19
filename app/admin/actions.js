"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

export async function login(prevState, formData) {
  // Mendukung pemanggilan melalui useActionState(login, null) maupun form action langsung
  const form = formData instanceof FormData ? formData : prevState;
  const email = form?.get("email")?.toString().trim();
  const password = form?.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let loginError = null;

  try {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      loginError = "Email atau password salah. Periksa kembali data yang kamu masukkan.";
    }
  } catch (err) {
    loginError = `Terjadi kesalahan saat memproses login: ${err?.message || "Tidak dapat terhubung ke server."}`;
  }

  if (loginError) {
    return { error: loginError };
  }

  redirect("/admin");
}

export async function keluar() {
  try {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  } catch (err) {
    // Abaikan error saat sign out agar pengguna tetap dialihkan ke login
  }

  redirect("/admin/login");
}

export { keluar as logout };
