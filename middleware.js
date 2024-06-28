import { NextResponse } from "next/server";

const parseCookies = (cookieHeader) => {
  if (!cookieHeader) return {};

  return Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, ...rest] = cookie.split("=");
      return [name, rest.join("=")];
    })
  );
};

const getCookies = (req) => {
  const cookieHeader = req.headers.get("cookie");
  return parseCookies(cookieHeader);
};

const redirectTo = (destination, req) => {
  return NextResponse.redirect(new URL(destination, req.url));
};

const handleRedirects = (req) => {
  const cookies = getCookies(req);
  const token = cookies["token"];
  const { pathname } = req.nextUrl;

  // If no token, redirect to login if trying to access dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    return redirectTo("/auth/login", req);
  }

  // If token exists and user is trying to access login, redirect to dashboard
  if (token && pathname === "/auth/login") {
    return redirectTo("/dashboard", req);
  }

  return NextResponse.next();
};

export default function middleware(req) {
  return handleRedirects(req);
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login"],
};
