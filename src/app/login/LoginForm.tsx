'use client';

import { useTransition, useState } from 'react';
import styles from './page.module.css';
import { login, signup } from './actions';

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

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

  const handleSignup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.form;
    if (form && form.checkValidity()) {
      startTransition(() => {
        signup(new FormData(form));
      });
    } else {
      form?.reportValidity();
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.tabContainer}>
        <button 
          type="button"
          className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`}
          onClick={() => setMode('login')}
        >Log in</button>
        <button 
          type="button"
          className={`${styles.tab} ${mode === 'signup' ? styles.activeTab : ''}`}
          onClick={() => setMode('signup')}
        >Sign up</button>
      </div>

      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="loveler@example.com" />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required placeholder="••••••••" />
        </div>

        {mode === 'signup' && (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" required className={styles.select}>
                <option value="">성별을 선택해주세요</option>
                <option value="Male">남성 (Male)</option>
                <option value="Female">여성 (Female)</option>
                <option value="Other">기타 / 선택 안 함 (Other)</option>
              </select>
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="country">Country</label>
              <input id="country" name="country" type="text" required placeholder="예: 대한민국, USA" />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="travelType">Preferred Travel Type (선택)</label>
              <select id="travelType" name="travelType" className={styles.select}>
                <option value="">선택 안 함</option>
                <option value="Marine Cruise">Marine Cruise (요트/바다)</option>
                <option value="Boutique Coffee">Boutique Coffee (카페/미식)</option>
                <option value="Night Exploration">Night Exploration (심야/산책)</option>
              </select>
            </div>
          </>
        )}
        
        <div className={styles.actions}>
          {mode === 'login' ? (
            <button onClick={handleLogin} disabled={isPending} className={styles.btnLogin}>
              {isPending ? 'Processing...' : 'Log in'}
            </button>
          ) : (
            <button onClick={handleSignup} disabled={isPending} className={styles.btnSignup}>
              {isPending ? 'Processing...' : 'Join the Wave'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
