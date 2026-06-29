'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { signupTourist } from '@/app/login/actions';
import styles from '@/app/login/page.module.css';

export default function TouristSignupPage() {
  const [isPending, startTransition] = useTransition();

  const handleSignup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.form;
    if (form && form.checkValidity()) {
      startTransition(() => {
        signupTourist(new FormData(form));
      });
    } else {
      form?.reportValidity();
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className="text-accent neon-glow">Tourist Sign Up</h1>
        <p className={styles.subtitle}>웨이브의 프리미엄 투어를 경험할 관광객으로 가입합니다.</p>
        
        <div className={styles.formContainer}>
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required placeholder="loveler@example.com" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="nickname">Nickname</label>
              <input id="nickname" name="nickname" type="text" required placeholder="예: 로컬탐험가" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required placeholder="••••••••" />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" required className={styles.select}>
                <option value="">성별을 선택해주세요</option>
                <option value="Male">남성 (Male)</option>
                <option value="Female">여성 (Female)</option>
                <option value="Other">기타 / 선택 안 함</option>
              </select>
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="country">Country</label>
              <input id="country" name="country" type="text" required placeholder="예: 대한민국, USA" />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="travelType">Preferred Travel Type</label>
              <select id="travelType" name="travelType" className={styles.select}>
                <option value="">선택 안 함</option>
                <option value="Marine Cruise">Marine Cruise (요트/바다)</option>
                <option value="Boutique Coffee">Boutique Coffee (카페/미식)</option>
                <option value="Night Exploration">Night Exploration (심야/산책)</option>
              </select>
            </div>
            
            <div className={styles.actions}>
              <button onClick={handleSignup} disabled={isPending} className={styles.btnSignup}>
                {isPending ? 'Processing...' : 'Join as Tourist'}
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
