'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { signupBusiness } from '@/app/login/actions';
import styles from '@/app/login/page.module.css';

export default function BusinessSignupPage() {
  const [isPending, startTransition] = useTransition();

  const handleSignup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.form;
    if (form && form.checkValidity()) {
      startTransition(() => {
        signupBusiness(new FormData(form));
      });
    } else {
      form?.reportValidity();
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className="text-accent neon-glow">Business Sign Up</h1>
        <p className={styles.subtitle}>웨이브와 함께할 파트너(기업)로 가입합니다.</p>
        
        <div className={styles.formContainer}>
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required placeholder="business@example.com" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required placeholder="••••••••" />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="companyName">회사명 (Company Name)</label>
              <input id="companyName" name="companyName" type="text" required placeholder="웨이브 투어 주식회사" />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="businessNumber">사업자 등록 번호 (Business Number)</label>
              <input id="businessNumber" name="businessNumber" type="text" required placeholder="123-45-67890" />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="representativeName">대표자명 (Representative Name)</label>
              <input id="representativeName" name="representativeName" type="text" required placeholder="홍길동" />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="businessAddress">사업장 소재지 (Business Address)</label>
              <input id="businessAddress" name="businessAddress" type="text" required placeholder="부산광역시 해운대구..." />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="industry">분야 (Industry)</label>
              <select id="industry" name="industry" required className={styles.select}>
                <option value="">분야를 선택해주세요</option>
                <option value="Accommodation">숙박 (Accommodation)</option>
                <option value="Transportation">교통/이동 (Transportation)</option>
                <option value="Food & Beverage">식음료 (F&B)</option>
                <option value="Activity & Tour">액티비티/투어 (Activity)</option>
                <option value="Other">기타 (Other)</option>
              </select>
            </div>

            <div className={styles.inputGroup} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', lineHeight: '1.4' }}>
                <input type="checkbox" id="liabilityAgreed" name="liabilityAgreed" required style={{ marginTop: '0.2rem' }} />
                <span>
                  [필수] 본 플랫폼(Wayve)은 단순 중개인으로서 역할을 수행하며, 서비스를 제공하는 과정에서 발생하는 모든 고객 분쟁 및 법적 책임은 귀사(기업)에 있음에 동의합니다.
                </span>
              </label>
            </div>
            
            <div className={styles.actions}>
              <button onClick={handleSignup} disabled={isPending} className={styles.btnSignup}>
                {isPending ? 'Processing...' : 'Join as Business'}
              </button>
            </div>
          </form>

          <div className={styles.signupLinks}>
            <Link href="/login" className={styles.linkButton}>뒤로 가기</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
