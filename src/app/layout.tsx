import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import { cookies } from "next/headers";
import { logout } from "./logout/actions";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-heading', weight: ['400', '700', '900'] });

export const metadata: Metadata = {
  title: "BUSAN WAYVE | Premium Local Tour",
  description: "부산 독점 로컬 투어 플랫폼: 흔한 양산형 패키지를 벗어난 프리미엄 에디토리얼 경험",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = cookieStore.get('wave_session');
  const isLoggedIn = !!session?.value;

  return (
    <html lang="ko" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <header className="main-header">
          <Link href="/" className="logo text-accent" style={{ textDecoration: 'none' }}>BUSAN WAYVE</Link>
          <nav>
            <Link href="/travelogue">Travelogue</Link>
            <Link href="/tours">Tours</Link>
            <Link href="#">Magazine</Link>
            <Link href="/stays">Stays</Link>
            {isLoggedIn ? (
              <form action={logout} style={{ display: 'inline' }}>
                <button type="submit" className="btn-login" style={{ cursor: 'pointer', background: 'transparent' }}>Logout</button>
              </form>
            ) : (
              <Link href="/login" className="btn-login">Login</Link>
            )}
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
