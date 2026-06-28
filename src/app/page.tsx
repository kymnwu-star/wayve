import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import styles from './page.module.css';
import LocationMarquee from '@/components/LocationMarquee';

export default async function Home() {
  const cookieStore = await cookies();
  const waveRole = cookieStore.get('wave_role')?.value;

  return (
    <main className={styles.main}>
      {waveRole === 'Partner' && (
        <Link href="/admin/tours/new" className={styles.floatingBtn}>
          ➕ 투어상품 등록
        </Link>
      )}
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image 
            src="https://jasonteale.com/blog/wp-content/uploads/2021/02/D79A3022_AuroraHDR2019-edit-1200x600.jpg"
            alt="Midnight Raw Hero"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className={styles.overlay} />
        </div>
        <div className={styles.heroContent}>
          <h2 className="text-accent neon-glow">Hero: Midnight Raw</h2>
          <div className={styles.titleWrapper}>
            <h1>심야 영도 골목의 날것 그대로</h1>
            <div className={styles.soundWave}>
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
          <p>
            메인 최상단은 '오늘의 심야 영도 대평동 출사 투어'처럼 낯설고 매혹적인 부산의 시각 이미지를 전면에 과감하게 배치합니다.
          </p>
          <p>
            규격화된 대량 생산 관광 정보는 뒤로 밀어내고, 영도의 오래된 철공소 골목길과 바다 내음 짙은 밤 풍경을 예술적인 구도로 전면에 앞세웁니다.
          </p>
        </div>
      </section>

      {/* Latest Magazine Feed */}
      <section className={styles.magazineFeed}>
        <h2 className={styles.sectionTitle}>Latest in Magazine</h2>
        <Link href="/magazine" className={styles.magazineCard}>
          <div className={styles.magazineImage}>
            <Image 
              src="https://ak-d.tripcdn.com/sl/app/d1/20210204/a933f7c4627b4b10b0b8efebdf9168f1_1000.jpg"
              alt="영도 대평동"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.magazineContent}>
            <div className={styles.magazineMeta}>
              <span>WAYVE Editorial Team</span>
              <span>2026. 06. 24</span>
            </div>
            <h3 className={styles.magazineTitle}>영도 대평동: 멈춰진 시간 속을 걷다</h3>
            <p className={styles.magazineDesc}>
              영도다리를 건너면 닿는 대평동은 수십 년 전의 흔적이 고스란히 남아있는 특별한 공간입니다. '깡깡이 예술마을'로도 불리는 이곳은 예전 수리조선소에서 배 표면의 녹을 벗겨내는 망치질 소리에서 유래했습니다. 좁은 골목길을 따라 걷다 보면, 거대한 선박과 녹슨 닻들이 일상과 어우러진 비현실적인 풍경을 마주하게 됩니다.
            </p>
            <span className={styles.readMore}>Read the Full Story →</span>
          </div>
        </Link>
      </section>

      {/* Mood Filter / Premium Categorization */}
      <section className={styles.categorization}>
        <h2 className={styles.sectionTitle}>Premium Categorization</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>🚢</div>
            <h3>Marine Cruise</h3>
            <p>광안리 바다 한가운데서 프라이빗 아티스트의 세션을 감상하는 한정판 사운드 크루징 경험.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>☕</div>
            <h3>Boutique Coffee</h3>
            <p>전포동, 영도 크래프트 브루어리의 바리스타들과 깊이 호흡하는 독점 드립 테이스팅 마스터클래스.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>🌙</div>
            <h3>Night Exploration</h3>
            <p>산복도로의 어둠 아래 수놓인 항구의 조명선을 가이드의 사적인 스토리 텔링과 수집하는 밤 산책.</p>
          </div>
        </div>
      </section>

      {/* 무한 스크롤 장소 갤러리 */}
      <LocationMarquee />
    </main>
  );
}
