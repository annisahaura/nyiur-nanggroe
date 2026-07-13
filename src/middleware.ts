import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
    return NextResponse.redirect(redirectUrl);
  }

  // ============================================================
  // GUARD: Rute admin — cek role dari app_metadata (disimpan oleh Supabase Auth)
  // ============================================================
  if (user && adalahRuteAdmin) {
    const roleAdmin = user.app_metadata?.role === "admin";
    if (!roleAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // ============================================================
  // GUARD: Rute penjual — cek role dari app_metadata
  // ============================================================
  if (user && adalahRutePenjual) {
    const rolePenjual =
      user.app_metadata?.role === "seller" ||
      user.app_metadata?.role === "admin";
    if (!rolePenjual) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/daftar-mitra";
      return NextResponse.redirect(redirectUrl);
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
    return NextResponse.redirect(redirectUrl);
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
