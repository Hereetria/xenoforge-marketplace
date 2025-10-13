import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

type TimeUnit = "s" | "m" | "h" | "d";

interface RateLimitWindow {
  amount: number;
  unit: TimeUnit;
}

export async function checkRateLimit(
  key: string,
  req: NextRequest,
  limit: number = 100,
  window: RateLimitWindow = { amount: 1, unit: "m" }
) {
  try {
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${window.amount} ${window.unit}`),
      analytics: true,
    });

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const { success, limit: rateLimit, remaining, reset } = await ratelimit.limit(`${key}:${ip}`);

    if (!success) {
      return NextResponse.json(
        { 
          error: "Too Many Requests",
          retryAfter: Math.ceil((reset - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      );
    }

    return null;
  } catch (error) {
    // If Redis fails, allow the request (fail open)
    console.error('Rate limit Redis error:', error);
    return null;
  }
}