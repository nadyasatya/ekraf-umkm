# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Dibuat helper koneksi Supabase server di `lib/supabase/server.js` dan re-export di `lib/supabase/index.js` menggunakan `@supabase/supabase-js` dengan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY`.
- Halaman `app/page.jsx` diubah menjadi Server Component async yang mengambil seluruh produk dari tabel `produk` diurutkan berdasarkan `id`.
- Komponen `KartuProduk` digunakan untuk menampilkan masing-masing produk tanpa mengubah tampilannya.
- Ditambahkan penanganan kondisi error dengan alert informatif dan kondisi tabel kosong dengan teks "Belum ada produk".
- Komponen `CatatanBelumAktif` dihapus dari halaman katalog.

**Perbaikan:**
- Menambahkan konfigurasi route segment `export const dynamic = "force-dynamic"` agar katalog selalu mengambil data terbaru dari database setiap kali halaman di-refresh.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- Halaman `app/produk/[id]/page.jsx` diubah untuk membaca parameter dinamis `const { id } = await params`.
- Mengambil satu data produk dari tabel `produk` di Supabase berdasarkan `id` menggunakan helper server Supabase.
- Memanggil fungsi `notFound()` dari `next/navigation` jika data produk tidak ditemukan atau jika ID tidak valid.
- Komponen `CatatanBelumAktif` dihapus dari halaman detail produk, sementara tombol WhatsApp dipertahankan.

**Perbaikan:**
- Menempatkan pemanggilan `notFound()` di luar blok `try-catch` agar error navigasi internal Next.js (`NEXT_NOT_FOUND`) tidak tertangkap sebagai exception biasa.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- Komponen `components/TombolWhatsApp.jsx` diubah dari elemen `<button>` menjadi tautan `<a>` dengan tautan ke `https://wa.me/<nomor>?text=<pesan>`.
- Nomor telepon diambil dari `lib/toko.js` dan pesan otomatis menyertakan nama produk beserta harga dalam format rupiah (`formatRupiah`).
- Teks pesan di-encode menggunakan `encodeURIComponent`.
- Tautan membuka di tab baru dengan atribut `target="_blank"` dan `rel="noopener noreferrer"`.
- Gaya visual tombol tetap identik dengan tombol aslinya.

**Perbaikan:**
- Menambahkan sanitasi pada pembacaan nomor WhatsApp dengan membersihkan karakter non-digit (`replace(/\D/g, "")`) agar tautan WhatsApp tetap valid jika ada spasi atau simbol.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Menambahkan helper `createSessionClient` di `lib/supabase/server.js` menggunakan `@supabase/ssr` dan `cookies()` dari `next/headers` untuk mengelola sesi admin berbasis cookie.
- Membuat Server Action di `app/admin/actions.js`: fungsi `login` untuk autentikasi Supabase Auth (`signInWithPassword`) dan fungsi `keluar` untuk mengakhiri sesi (`signOut`).
- Menghubungkan formulir di `app/admin/login/page.jsx` menggunakan `useActionState` dan menampilkan alert pesan error jika login gagal.
- Mengaktifkan tombol "Keluar" di `components/NavAdmin.jsx` dengan membungkusnya dalam form action `keluar`.
- Komponen `CatatanBelumAktif` dihapus dari halaman login.

**Perbaikan:**
- Memastikan `redirect("/admin")` dipanggil di luar blok `try-catch` agar error redirect Next.js tidak tertangkap sebagai error login.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Menambahkan Server Action `gantiPassword` di `app/admin/actions.js`.
- Melakukan validasi di sisi server: memastikan kolom tidak kosong, panjang password baru minimal 8 karakter, konfirmasi password cocok, dan memastikan sesi login admin valid via `supabase.auth.getUser()`.
- Memperbarui password menggunakan `supabase.auth.updateUser({ password })`.
- Menghubungkan form di `app/admin/password/page.jsx` menggunakan `useActionState`, serta menampilkan pesan error atau sukses dengan token warna desain yang sesuai.
- Komponen `CatatanBelumAktif` dihapus dari halaman ganti password.

**Perbaikan:**
- Menghilangkan export alias di `app/admin/actions.js` yang sempat menimbulkan konflik module export pada analisis statis Turbopack di Next.js 16.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Dibuat file `proxy.js` di root proyek yang bertindak sebagai routing proxy / middleware untuk Next.js 16.
- Memeriksa sesi pengguna via Supabase Auth (`supabase.auth.getUser()`) menggunakan `@supabase/ssr`.
- Semua rute di bawah `/admin` (kecuali `/admin/login`) diproteksi: jika belum login, pengguna dialihkan otomatis ke `/admin/login`.
- Jika admin yang sudah login mencoba mengakses `/admin/login`, otomatis dialihkan ke `/admin`.
- Setiap Server Action yang mengubah data (seperti `gantiPassword`) memastikan sesi admin diverifikasi di server sebelum dieksekusi.
- Komponen `CatatanBelumAktif` dihapus dari `app/admin/page.jsx`.

**Perbaikan:**
- Menggunakan nama export `proxy` dan export default pada `proxy.js` sesuai konvensi template middleware Next.js 16 agar terdeteksi secara otomatis saat proses build.

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

