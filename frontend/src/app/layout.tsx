import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "MiniBlog — Full-stack Next.js Blog",
  description:
    "Сучасний міні-блог на Next.js, TypeScript, Tailwind CSS та Express",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body
        className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col`}
      >
        <AppProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} MiniBlog. Built with Next.js,
            TypeScript & Express.
          </footer>
        </AppProviders>
      </body>
    </html>
  );
}
