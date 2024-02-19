/**
 * @file NextAuth configuration
 * @version 0.0.1
 */

import NextAuth from "next-auth";
import type { NextAuthConfig, User } from "next-auth";
import PatreonProvider from "next-auth/providers/patreon"

// CONSTANTS
const REDIRECT_URI = "http://localhost:3000/api/auth/callback/patreon"; // must be registered with Patreon

declare module "next-auth" {
  interface Session {
    user: {
      picture?: string;
    } & Omit<User, "id">;
  }
}

export const authConfig = {
  debug: true,
  providers: [
    PatreonProvider({
      clientId: process.env.PATREON_CLIENT_ID,
      clientSecret: process.env.PATREON_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: REDIRECT_URI,
        },
      },
    })
  ],
  callbacks: {
    authorized(params) {
      return !!params.auth?.user;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);