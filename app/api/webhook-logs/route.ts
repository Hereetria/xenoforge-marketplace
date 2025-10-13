import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleError } from "@/lib/errors/errorHandler";
import { Role } from "@prisma/client";
import { logError, logInfo } from "@/lib/logger";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    requireRole(user.role, [Role.ADMIN]);

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 50;
    const provider = searchParams.get("provider") || undefined;

    const logs = await prisma.webhookLog.findMany({
      where: provider ? { provider } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    logInfo("Webhook logs retrieved:", logs.length);

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    const e = error as Error;
    logError("Webhook log retrieval failed:", e.message);
    return handleError(error);
  }
}
