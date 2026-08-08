import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const isProtected =
        path.startsWith("/learn") ||
        path.startsWith("/cart") ||
        path.startsWith("/admin") ||
        path.startsWith("/certificates") ||
        path.startsWith("/account");

      if (isProtected && !isLoggedIn) {
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user.role === "ADMIN" ? "ADMIN" : "USER") as
          | "USER"
          | "ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role === "ADMIN" ? "ADMIN" : "USER") as
          | "USER"
          | "ADMIN";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
