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
            src="https://images.unsplash.com/photo-1526367355811-06161c28c8de?q=80&w=1920&auto=format&fit=crop"
            alt="Songjeong Surfing Background"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className={styles.overlay} />
        </div>
        <div className={styles.heroContent}>
          <h2 className="text-accent neon-glow">Busan Midnight Raw</h2>
          <div className={styles.titleWrapper}>
            <h1>심야 영도 골목의 날것 그대로</h1>
            <div className={styles.soundWave}>
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
          <p>
            화려한 네온사인 뒤에 숨겨진 진짜 부산을 만나는 시간. 짙은 바다 내음이 배어있는 영도의 오래된 철공소 골목, 밤이 되면 시작되는 낯설고도 매혹적인 풍경 속으로 당신을 초대합니다. 뻔한 여행지는 뒤로하고, 오직 이곳에서만 느낄 수 있는 부산의 진짜 날것(Raw)을 경험해 보세요.
          </p>
          
          {/* Smaller Categorization under Hero Text */}
          <div className={styles.heroGrid}>
            <div className={styles.heroCard}>
              <div className={styles.heroIconWrapper}>🎯</div>
              <h3>투어&액티비티</h3>
              <p>전문 가이드와 함께하는 투어와 다이나믹한 액티비티 경험.</p>
            </div>
            <div className={styles.heroCard}>
              <div className={styles.heroIconWrapper}>🎫</div>
              <h3>티켓</h3>
              <p>부산의 핫플레이스와 전시, 어트랙션을 스마트하게 즐기는 방법.</p>
            </div>
            <div className={styles.heroCard}>
              <div className={styles.heroIconWrapper}>🏨</div>
              <h3>stay</h3>
              <p>프리미엄 호텔부터 감성 넘치는 로컬 숙소까지 완벽한 휴식.</p>
            </div>
            <div className={styles.heroCard}>
              <div className={styles.heroIconWrapper}>🛍️</div>
              <h3>Shop</h3>
              <p>부산 로컬 크리에이터의 감각이 담긴 특별한 굿즈와 특산품.</p>
            </div>
          </div>
        </div>
        <div className={styles.heroRightContent}>
          <div className={styles.magazineLabel}>Latest in Magazine</div>
          <Link href="/magazine" className={styles.magazineCard}>
            <div className={styles.magazineImage}>
              <Image 
                src="/images/daepyeong_night.jpg"
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
                영도다리를 건너면 닿는 대평동은 수십 년 전의 흔적이 고스란히 남아있는 특별한 공간입니다. '깡깡이 예술마을'로도 불리는 이곳은 예전 수리조선소에서 배 표면의 녹을 벗겨내는 망치질 소리에서 유래했습니다.
              </p>
              <span className={styles.readMore}>Read the Full Story →</span>
            </div>
          </Link>
        </div>
      </section>



      {/* 무한 스크롤 장소 갤러리 */}
      <LocationMarquee />
    </main>
  );
}
