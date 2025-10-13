import { Role } from "@/lib/constants/roles"
import { forbiddenError, unauthorizedError } from "@/lib/errors/httpErrors"

export function requireRole(userRole: Role | undefined, allowed: Role[]) {
  if (!userRole) {
    throw unauthorizedError()
  }
  if (!allowed.includes(userRole)) {
    throw forbiddenError()
  }
}
