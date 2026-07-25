import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/entries"];
const authRoutes = ["/login", "/register"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAuthPage = authRoutes.some((r) => pathname.startsWith(r));

  if (!isProtected && !isAuthPage) {
    return NextResponse.next();
  }

  const res = await fetch(new URL("/api/auth/get-session", request.url), {
    headers: { cookie: request.headers.get("cookie") || "" },
  });
  const session = await res.json();

  if (isProtected && !session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && session?.user) {
    return NextResponse.redirect(new URL("/entries/list", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/entries/:path*", "/login", "/register"],
};
