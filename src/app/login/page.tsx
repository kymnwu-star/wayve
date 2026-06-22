import styles from './page.module.css';
import LoginForm from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className="text-accent neon-glow">Join the Wayve</h1>
        <p className={styles.subtitle}>프리미엄 로컬 투어, 부산 웨이브에 오신 것을 환영합니다.</p>
        
        <LoginForm />
        
        {resolvedSearchParams?.message && (
          <p style={{ color: 'var(--accent)', marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
            {resolvedSearchParams.message}
          </p>
        )}
      </div>
    </main>
  );
}
