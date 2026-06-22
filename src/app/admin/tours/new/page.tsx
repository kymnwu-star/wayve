import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import TourForm from './TourForm';

export default async function NewTourPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  // 1. 서버 측 로그인 세션 확인
  const cookieStore = await cookies();
  const session = cookieStore.get('wave_session');

  if (!session?.value) {
    redirect('/login?message=' + encodeURIComponent('관리자 전용 페이지입니다. 로그인해주세요.'));
  }

  const resolvedSearchParams = await searchParams;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className="text-accent neon-glow" style={{ marginBottom: '1rem' }}>Register New Tour</h1>
        <p className={styles.subtitle}>BUSAN WAYVE의 프리미엄 독점 투어를 등록합니다.</p>
        
        <TourForm />
        
        {resolvedSearchParams?.message && (
          <p style={{ 
            color: resolvedSearchParams.message.includes('성공') ? 'var(--accent)' : '#ff6b6b', 
            marginTop: '1.5rem', 
            textAlign: 'center', 
            fontSize: '0.9rem',
            padding: '1rem',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '8px'
          }}>
            {resolvedSearchParams.message}
          </p>
        )}
      </div>
    </main>
  );
}
