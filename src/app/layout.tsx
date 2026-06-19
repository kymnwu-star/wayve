import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-heading', weight: ['400', '700', '900'] });

export const metadata: Metadata = {
  title: "BUSAN WAVE | Premium Local Tour",
  description: "부산 독점 로컬 투어 플랫폼: 흔한 양산형 패키지를 벗어난 프리미엄 에디토리얼 경험",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <header className="main-header">
          <Link href="/" className="logo text-accent" style={{ textDecoration: 'none' }}>BUSAN WAVE</Link>
          <nav>
            <Link href="/tours">Tours</Link>
            <Link href="#">Magazine</Link>
            <Link href="/login" className="btn-login">Login</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
