import { cookies } from 'next/headers';
import styles from './page.module.css';

export default async function MagazinePage() {
  const cookieStore = await cookies();
  const waveRole = cookieStore.get('wave_role')?.value;
  const isAdmin = waveRole === 'Admin';

  const magazineContent = {
    id: 1,
    title: '영도 대평동: 멈춰진 시간 속을 걷다',
    editor: 'WAYVE Editorial Team',
    date: '2026. 06. 24',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800',
    content: `
      영도다리를 건너면 닿는 대평동은 수십 년 전의 흔적이 고스란히 남아있는 특별한 공간입니다. 
      '깡깡이 예술마을'로도 불리는 이곳은 예전 수리조선소에서 배 표면의 녹을 벗겨내는 망치질 소리에서 유래했습니다.
      
      좁은 골목길을 따라 걷다 보면, 거대한 선박과 녹슨 닻들이 일상과 어우러진 비현실적인 풍경을 마주하게 됩니다.
      우리는 이 낡고 거친 풍경 속에서 진짜 부산의 날것 그대로의 매력을 발견합니다.
      
      웨이브가 큐레이션한 이번 투어 코스는 화려한 해운대나 광안리에서 느낄 수 없는, 깊고 묵직한 영도의 바다 냄새를 따라갑니다.
      아무도 주목하지 않았던 골목의 이야기와 오래된 노포에서 끓여내는 따뜻한 국밥 한 그릇까지, 
      영도의 밤과 낮을 온전히 즐길 수 있는 완벽한 가이드를 소개합니다.
    `
  };

  return (
    <main className={styles.main}>
      <h1 className={`${styles.pageTitle} text-accent neon-glow`}>WAYVE Magazine</h1>
      <p className={styles.pageSubtitle}>로컬 에디터의 시선으로 담아낸 부산의 심층 큐레이션</p>

      {isAdmin && (
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <button className={styles.adminBtn}>
            ➕ 관리자 전용: 매거진 아티클 작성
          </button>
        </div>
      )}

      <article className={styles.article}>
        <div className={styles.imageWrapper}>
          <img 
            src={magazineContent.imageUrl} 
            alt={magazineContent.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        
        <div className={styles.articleContent}>
          <div className={styles.meta}>
            <span className={styles.editor}>{magazineContent.editor}</span>
            <span className={styles.date}>{magazineContent.date}</span>
          </div>
          <h2 className={styles.articleTitle}>{magazineContent.title}</h2>
          
          <div className={styles.bodyText}>
            {magazineContent.content.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
