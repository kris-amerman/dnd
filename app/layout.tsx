import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/ui/globals.css";

import { AuthButton } from "@/app/ui/auth/auth-button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: 'Aberran %s',
    default: 'Aberran Home',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthButton />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
