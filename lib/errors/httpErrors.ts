import { NextResponse } from "next/server";
import { ApiError, fail } from "@/lib/errors/errorHandler";

function makeResponse(error: ApiError): NextResponse {
  return NextResponse.json({ error: error.message }, { status: error.status });
}

export const badRequestError = (msg = "Bad Request") =>
  makeResponse(fail(400, msg));

export const unauthorizedError = (msg = "Unauthorized") =>
  makeResponse(fail(401, msg));

export const forbiddenError = (msg = "Forbidden") =>
  makeResponse(fail(403, msg));

export const notFoundError = (msg = "Not Found") =>
  makeResponse(fail(404, msg));

export const conflictError = (msg = "Conflict") =>
  makeResponse(fail(409, msg));

export const tooManyRequestsError = (msg = "Too Many Requests") =>
  makeResponse(fail(429, msg));

export const internalError = (msg = "Internal Server Error") =>
  makeResponse(fail(500, msg));
