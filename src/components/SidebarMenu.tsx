'use client';

import { useState } from 'react';
import Link from 'next/link';
import { logout } from '@/app/logout/actions';
import styles from './SidebarMenu.module.css';

interface SidebarMenuProps {
  role: string | null;
  email: string | null;
}

export default function SidebarMenu({ role, email }: SidebarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isPartner = role === 'Partner';
  const displayEmail = email ? email.split('@')[0] : '';

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <>
      <button className={styles.hamburger} onClick={() => setIsOpen(true)}>
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar Panel */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
          ✕
        </button>

        <div className={styles.content}>
          {!isPartner ? (
            // Tourist (고객) Menu
            <>
              <div className={styles.profileArea}>
                <div className={styles.profilePic}>👤</div>
                <div className={styles.profileName}>{displayEmail} 님</div>
              </div>
              <ul className={styles.menuList}>
                <li><Link href="#" onClick={() => setIsOpen(false)}>나의 결제 수단</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>나의 로그</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>예약내역</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>문의</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>설정</Link></li>
              </ul>
            </>
          ) : (
            // Partner (기업) Menu
            <>
              <div className={styles.profileArea}>
                <div className={styles.profilePic}>🏢</div>
                <div className={styles.profileName}>{displayEmail} 파트너</div>
              </div>
              <ul className={styles.menuList}>
                <li><Link href="/admin/tours/new" onClick={() => setIsOpen(false)}>상품등록</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>정산</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>문의</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>설정</Link></li>
              </ul>
            </>
          )}

          <button onClick={handleLogout} className={styles.logoutBtn}>
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
}
