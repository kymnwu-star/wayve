'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { login } from './actions';

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.form;
    if (form && form.checkValidity()) {
      startTransition(() => {
        login(new FormData(form));
      });
    } else {
      form?.reportValidity();
    }
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="loveler@example.com" />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required placeholder="••••••••" />
        </div>
        
        <div className={styles.actions}>
          <button onClick={handleLogin} disabled={isPending} className={styles.btnLogin}>
            {isPending ? 'Processing...' : 'Log in'}
          </button>
        </div>
      </form>

      <div className={styles.signupLinks}>
        <p>아직 회원이 아니신가요?</p>
        <div className={styles.signupButtons}>
          <Link href="/signup/tourist" className={styles.linkButton}>관광객 가입</Link>
          <Link href="/signup/business" className={styles.linkButton}>기업 가입</Link>
        </div>
      </div>
    </div>
  );
}
