import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CherryBlossom from "@/components/ui/CherryBlossom";
import { NotebookProvider } from "@/context/NotebookContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "HuyenKorean — Học Tiếng Hàn Đơn Giản",
  description:
    "Nền tảng học tiếng Hàn toàn diện: từ vựng, ngữ pháp, phân tích câu và luyện tập theo cấp độ TOPIK.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${manrope.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-surface text-on-surface font-body antialiased">
        <ToastProvider>
          <AuthProvider>
            <NotebookProvider>
              <CherryBlossom />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </NotebookProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
