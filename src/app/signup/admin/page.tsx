'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { signupAdmin } from '@/app/login/actions';
import styles from '@/app/login/page.module.css';

export default function AdminSignupPage() {
  const [isPending, startTransition] = useTransition();

  const handleSignup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.form;
    if (form && form.checkValidity()) {
      startTransition(() => {
        signupAdmin(new FormData(form));
      });
    } else {
      form?.reportValidity();
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className="text-accent neon-glow">Admin Sign Up</h1>
        <p className={styles.subtitle}>웨이브 시스템 관리자 계정 생성 페이지입니다.</p>
        
        <div className={styles.formContainer}>
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Admin Email</label>
              <input id="email" name="email" type="email" required placeholder="admin@wayve.com" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required placeholder="••••••••" />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="adminCode">관리자 비밀 코드 (Admin Secret Code)</label>
              <input id="adminCode" name="adminCode" type="password" required placeholder="비밀 코드를 입력하세요" />
            </div>
            
            <div className={styles.actions}>
              <button onClick={handleSignup} disabled={isPending} className={styles.btnSignup}>
                {isPending ? 'Processing...' : 'Create Admin Account'}
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
