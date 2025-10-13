import { badRequestError } from "@/lib/errors/httpErrors"

export function requireFields<T extends Record<string, unknown>>(fields: T) {
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "")
      throw badRequestError(`Missing required field: ${key}`)
  }
}