import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interview Drills - Practice Your Technical Skills",
  description: "Practice technical interview questions with our interactive drill platform. Sign in with Google and start improving your skills today.",
  keywords: ["interview", "technical", "practice", "drills", "coding", "questions"],
  authors: [{ name: "Interview Drills Team" }],
  openGraph: {
    title: "Interview Drills",
    description: "Practice technical interview questions with our interactive drill platform",
    url: "https://localhost:3000",
    siteName: "Interview Drills",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview Drills",
    description: "Practice technical interview questions with our interactive drill platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
