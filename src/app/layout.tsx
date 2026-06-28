import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import { cookies } from "next/headers";
import SidebarMenu from "@/components/SidebarMenu";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
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
  const role = cookieStore.get('wave_role');
  const isLoggedIn = !!session?.value;

  return (
    <html lang="ko" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <header className="main-header">
          <Link href="/" className="logo text-accent" style={{ textDecoration: 'none' }}>BUSAN WAYVE</Link>
          <nav>
            <Link href="#" className="search-btn" aria-label="Search">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </Link>
            <Link href="/travelogue" style={{ fontWeight: 'bold' }}>Log</Link>
            <Link href="/tours" style={{ fontWeight: 'bold' }}>Tours</Link>
            <Link href="/magazine" style={{ fontWeight: 'bold' }}>Magazine</Link>
            <Link href="/shop" style={{ fontWeight: 'bold' }}>Shop</Link>
            {isLoggedIn ? (
              <SidebarMenu role={role?.value || null} email={session?.value || null} />
            ) : (
              <Link href="/login" className="btn-login">Login</Link>
            )}
          </nav>
        </header>
        {children}
        <Footer />
        <AIAssistant />
      </body>
    </html>
  );
}
