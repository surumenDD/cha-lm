import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "マイブック",
  description: "三分割エディタ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen">
        <header className="fixed top-0 inset-x-0 h-14 px-4 bg-white/90 backdrop-blur border-b border-gray-200 z-50 flex items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">✷</span>
              <span className="sr-only">ホーム</span>
            </Link>
          </div>
          <div className="absolute inset-x-0 text-center pointer-events-none">
            <span className="font-medium">マイブック</span>
          </div>
          <div className="ml-auto">?</div>
        </header>
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
