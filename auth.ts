import NextAuth from "next-auth";
import type { NextAuthConfig, User } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

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
    GitHubProvider({
      clientId: process.env.TEST_GITHUB_ID,
      clientSecret: process.env.TEST_GITHUB_SECRET
    })
  ],
  callbacks: {
    authorized(params) {
      return !!params.auth?.user;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);