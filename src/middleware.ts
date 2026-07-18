import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// NextResponse.redirect(...) creates a brand new response object. If
// supabase.auth.getUser() below just refreshed the session (rotating the
// access/refresh token cookies onto `supabaseResponse`), a plain
// NextResponse.redirect() would silently drop those refreshed cookies —
// the browser keeps the old, now-invalidated refresh token, and the next
// request from that user genuinely fails auth even though they never
// logged out. Every redirect below must carry the refreshed cookies too.
function redirectWithSession(url: URL, supabaseResponse: NextResponse) {
  const response = NextResponse.redirect(url);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  return response;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Ambil sesi pengguna yang valid dari Supabase Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ============================================================
  // RUTE YANG DILINDUNGI — wajib login
  // Menggunakan nama rute Bahasa Indonesia sesuai struktur aplikasi
  // ============================================================
  const polaPerlindungan = [
    "/akun",
    "/wishlist",
    "/pesanan",
    "/keranjang",
    "/checkout",
    "/mitra",
    "/daftar-mitra",
    "/edukasi/kuis",
    "/pesan",
  ];

  const adalahRuteTerlindungi = polaPerlindungan.some((pola) =>
    request.nextUrl.pathname.startsWith(pola)
  );

  // Pesan alasan redirect agar pengguna tahu mengapa diarahkan ke halaman login
  const getAlasanAuth = (pathname: string) => {
    if (pathname.startsWith("/keranjang")) return "keranjang";
    if (pathname.startsWith("/wishlist")) return "wishlist";
    if (pathname.startsWith("/checkout")) return "checkout";
    if (pathname.startsWith("/pesanan")) return "pesanan";
    if (pathname.startsWith("/daftar-mitra")) return "jualan";
    if (pathname.startsWith("/mitra")) return "mitra";
    if (pathname.startsWith("/edukasi/kuis")) return "kuis";
    if (pathname.startsWith("/pesan")) return "pesan";
    return "umum";
  };

  // ============================================================
  // RUTE KHUSUS PENJUAL
  // ============================================================
  const polaPenjual = ["/mitra"];
  const adalahRutePenjual = polaPenjual.some((pola) =>
    request.nextUrl.pathname.startsWith(pola)
  );

  // ============================================================
  // RUTE KHUSUS ADMIN
  // ============================================================
  const polaAdmin = ["/admin"];
  const adalahRuteAdmin = polaAdmin.some((pola) =>
    request.nextUrl.pathname.startsWith(pola)
  );

  // ============================================================
  // GUARD: Pengguna belum login → arahkan ke halaman masuk
  // ============================================================
  if (!user && adalahRuteTerlindungi) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/masuk";
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    redirectUrl.searchParams.set("alasan", getAlasanAuth(request.nextUrl.pathname));
    return redirectWithSession(redirectUrl, supabaseResponse);
  }

  // ============================================================
  // Peran (role) pengguna disimpan di tabel `profiles`, BUKAN di
  // `app_metadata` milik Supabase Auth — tidak ada satu pun tempat di
  // codebase ini yang menulis ke app_metadata. Ambil sekali di sini,
  // hanya kalau memang perlu (rute admin/penjual), dan pakai itu untuk
  // guard di bawah supaya konsisten dengan cara getAuthUser() bekerja.
  let dbRole: string | null = null;
  const getDbRole = async () => {
    if (dbRole !== null || !user) return dbRole;
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();
    dbRole = data?.role ?? "user";
    return dbRole;
  };

  // ============================================================
  // GUARD: Rute admin — cek role dari tabel profiles
  // ============================================================
  if (user && adalahRuteAdmin) {
    const roleAdmin = (await getDbRole()) === "admin";
    if (!roleAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return redirectWithSession(redirectUrl, supabaseResponse);
    }
  }

  // ============================================================
  // GUARD: Rute penjual — cek role dari tabel profiles
  // ============================================================
  if (user && adalahRutePenjual) {
    const role = await getDbRole();
    const rolePenjual = role === "seller" || role === "admin";
    if (!rolePenjual) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/daftar-mitra";
      return redirectWithSession(redirectUrl, supabaseResponse);
    }
  }

  // ============================================================
  // Redirect pengguna yang sudah login dari halaman masuk/daftar
  // ============================================================
  if (
    user &&
    (request.nextUrl.pathname === "/masuk" ||
      request.nextUrl.pathname === "/daftar")
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return redirectWithSession(redirectUrl, supabaseResponse);
  }

  // Set security headers
  supabaseResponse.headers.set("X-Frame-Options", "DENY");
  supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");
  supabaseResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  supabaseResponse.headers.set("X-XSS-Protection", "1; mode=block");

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
