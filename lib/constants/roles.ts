import { Role } from "@prisma/client";

export const USER_ROLES = {
  ADMIN: "ADMIN" as const,
  USER: "USER" as const,
} satisfies Record<string, Role>;

export const PUBLIC_ROLES = [USER_ROLES.USER] as const;

export const ADMIN_ROLES = [USER_ROLES.ADMIN] as const;

export type PublicRole = typeof PUBLIC_ROLES[number];
export type AdminRole = typeof ADMIN_ROLES[number];

export const isAdmin = (role: Role): boolean => role === USER_ROLES.ADMIN;
export const isUser = (role: Role): boolean => role === USER_ROLES.USER;
export const canSell = (role: Role): boolean => role === USER_ROLES.USER || role === USER_ROLES.ADMIN;
export const canBuy = (role: Role): boolean => role === USER_ROLES.USER || role === USER_ROLES.ADMIN;
