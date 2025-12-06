import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value || null;

  // no token → redirect to login
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const role = payload.role;
    const exp = payload.exp * 1000; // convert to ms

    // Token expired → delete cookie → redirect
    if (Date.now() > exp) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.set("token", "", { maxAge: 0 });
      return res;
    }

    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/admin") && role !== "ADMIN")
      return NextResponse.redirect(new URL("/login", req.url));

    if (pathname.startsWith("/agent") && role !== "SUPPORT_AGENT")
      return NextResponse.redirect(new URL("/login", req.url));

    if (pathname.startsWith("/user") && role !== "USER")
      return NextResponse.redirect(new URL("/login", req.url));

    return NextResponse.next();
  } catch {
    // token broken → redirect
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("token", "", { maxAge: 0 });
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*", "/user/:path*"],
};
