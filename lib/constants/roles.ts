export enum Role {
  ADMIN = "ADMIN",
  USER = "USER"
}

export const USER_ROLES = {
  ADMIN: Role.ADMIN,
  USER: Role.USER,
} satisfies Record<string, Role>;

export const PUBLIC_ROLES = [USER_ROLES.USER] as const;

export const ADMIN_ROLES = [USER_ROLES.ADMIN] as const;

export type PublicRole = typeof PUBLIC_ROLES[number];
export type AdminRole = typeof ADMIN_ROLES[number];

// Helper function to convert Prisma role string to Role enum
export const fromPrismaRole = (role: string): Role => {
  switch (role) {
    case "ADMIN":
      return Role.ADMIN;
    case "USER":
      return Role.USER;
    default:
      throw new Error(`Invalid role: ${role}`);
  }
};

// Helper function to convert Role enum to Prisma role string
export const toPrismaRole = (role: Role): string => {
  return role;
};

export const isAdmin = (role: Role): boolean => role === Role.ADMIN;
export const isUser = (role: Role): boolean => role === Role.USER;
export const canSell = (role: Role): boolean => role === Role.USER || role === Role.ADMIN;
export const canBuy = (role: Role): boolean => role === Role.USER || role === Role.ADMIN;
