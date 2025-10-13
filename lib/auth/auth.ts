import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs"
import { Role, fromPrismaRole } from "@/lib/constants/roles";
import { getEnvVar } from "@/lib/getEnvVar";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password)
          throw new Error("Missing credentials")

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) throw new Error("Invalid credentials")

        const isValid = await compare(credentials.password, user.passwordHash)
        if (!isValid) throw new Error("Invalid credentials")

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: fromPrismaRole(user.role),
          stripeCustomerId: user.stripeCustomerId,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.stripeCustomerId = user.stripeCustomerId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.stripeCustomerId = token.stripeCustomerId as string | null
      }
      return session
    },
    async signIn() {
      return true
    },
  },

  secret: getEnvVar("NEXTAUTH_SECRET"),
};
