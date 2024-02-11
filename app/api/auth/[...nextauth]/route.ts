import NextAuth from "next-auth";
import PatreonProvider from "next-auth/providers/patreon";
import { authConfig } from "@/auth.config";

export const authOptions = {
  ...authConfig,
  providers: [
    PatreonProvider({
      clientId: process.env.PATREON_CLIENT_ID,
      clientSecret: process.env.PATREON_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: "http://localhost:3000/content/atlas",
        },
      },
    })
  ],
}

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 