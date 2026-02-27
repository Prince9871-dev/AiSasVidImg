import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isPublicApiRoute = createRouteMatcher([
  "/api/videos",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If not logged in → protect everything except public routes
  if (!userId && !isPublicRoute(req) && !isPublicApiRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // If logged in → prevent access to auth pages
  if (
    userId &&
    (req.nextUrl.pathname.startsWith("/sign-in") ||
     req.nextUrl.pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};