import NextAuth from "next-auth";
import { authConfig } from "@/backend/auth/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/learn/:path*",
    "/cart",
    "/cart/:path*",
    "/admin/:path*",
    "/certificates/:path*",
    "/account",
    "/account/:path*",
  ],
};
