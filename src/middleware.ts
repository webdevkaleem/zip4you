import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "./env";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(120, "1 m"),
});

export default clerkMiddleware(async (_, req) => {
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for") ??
    "127.0.0.1";

  const { success } = await ratelimit.limit(ip);

  // If ratelimit is hit, redirect to /blocked
  if (!success) {
    return NextResponse.redirect(new URL("/blocked", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
