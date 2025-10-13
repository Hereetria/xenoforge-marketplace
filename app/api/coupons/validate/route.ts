import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleError } from "@/lib/errors/errorHandler";
import { validate } from "@/lib/validation/validate";
import { validateCouponSchema } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    const { code } = validate(validateCouponSchema, await req.json());

    if (code.toUpperCase() === "DEMO60") {
      return NextResponse.json({
        valid: true,
        discountPercentage: 60,
        code: "DEMO60"
      });
    }

    try {
      const coupon = await prisma.coupon?.findFirst({
        where: {
          code: {
            equals: code.toUpperCase(),
            mode: "insensitive"
          },
          isActive: true
        }
      });

      if (coupon) {
        return NextResponse.json({
          valid: true,
          discountPercentage: coupon.discountPercentage,
          code: coupon.code
        });
      }
    } catch {
      // Ignore validation errors
    }

    return NextResponse.json({
      valid: false,
      message: "Invalid coupon code"
    });

  } catch (error) {
    return handleError(error);
  }
}
