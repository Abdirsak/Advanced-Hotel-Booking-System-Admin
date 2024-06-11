import { NextResponse } from "next/server";

const cookieName = "rs-account";

export async function middleware(request) {
  const cookie = request.cookies.get(cookieName);
  const account = cookie ? cookie.value : null;
  const path = request.nextUrl.pathname;

  console.log(path, account);

  // If user is not authenticated and trying to access a non-auth page, redirect to login
  // if (!account && !path.startsWith("/auth")) {
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }

  // // If user is authenticated and trying to access an auth page, redirect to home
  // if (account && path.startsWith("/auth")) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // // Proceed to the next middleware or route handler
  // return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
