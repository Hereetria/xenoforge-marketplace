import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

const protectedPaths = [
  "/checkout",
  "/my-learning",
  "/my-teaching",
  "/cart",
  "/payment-history",
  "/premium-checkout",
  "/cancel",
  "/success",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/')) {
    let limit = 100;
    let window = { amount: 1, unit: "m" as const };
    
    if (pathname.startsWith('/api/auth/')) {
      limit = 20;
    } else if (pathname.startsWith('/api/payments/') || pathname.startsWith('/api/subscriptions/')) {
      limit = 30;
    } else if (pathname.startsWith('/api/courses/create')) {
      limit = 10;
    } else if (pathname.startsWith('/api/webhooks/')) {
      limit = 200;
    }

    const rateLimitResponse = await checkRateLimit(
      `api:${pathname}`,
      req,
      limit,
      window
    );
    
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  const isProtected = protectedPaths.some((p) =>
    pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isProtected) return NextResponse.next();

  const sessionToken = req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};


