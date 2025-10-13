import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt, { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { validate } from "@/lib/validation/validate";
import { handleError } from "@/lib/errors/errorHandler";
import { badRequestError } from "@/lib/errors/httpErrors";
import { Role, fromPrismaRole } from "@/lib/constants/roles";

const registerSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(req: NextRequest) {
  try {
    const body = validate(registerSchema, await req.json())
    
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      throw badRequestError("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: {
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        passwordHash,
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: fromPrismaRole(user.role),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
