import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <p className={styles.copyright}>© 2024-2026 BUSAN WAYVE. All Rights Reserved.</p>
          <div className={styles.socialLinks}>
            {/* 임시 블로그/유튜브 링크 (클릭 시 작동 안함) */}
            <a href="#" className={styles.socialIcon} aria-label="Blog">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
              </svg>
            </a>
            {/* 인스타그램 실제 링크 연동 */}
            <a href="https://instagram.com/wayve_busan" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
              </svg>
            </a>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <span>상호명: (주)부산웨이브</span>
          <span>주소: 부산광역시 영도구 대평로 123, 웨이브빌딩 1층</span>
          <span>사업자등록번호: 123-45-67890</span>
          <span>통신판매업신고: 2026-부산영도-0123</span>
          <span>대표자명: 홍길동</span>
          <span>전자우편: support@wayve.com</span>
          <span>고객센터 전화: 051-123-4567</span>
          <span>호스팅서비스 제공자: Vercel</span>
        </div>
        
        <div className={styles.bottomSection}>
          <Link href="#" className={styles.link}>사업자정보확인</Link>
          <span className={styles.divider}>|</span>
          <Link href="#" className={styles.link}>이용약관</Link>
          <span className={styles.divider}>|</span>
          <Link href="#" className={styles.link}>개인정보처리방침</Link>
        </div>
      </div>
    </footer>
  );
}
