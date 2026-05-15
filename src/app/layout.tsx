import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Copilot",
  description: "AI-powered job application automation SaaS for software engineers."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return content;
  }

  return (
    <ClerkProvider>
      {content}
    </ClerkProvider>
  );
}
