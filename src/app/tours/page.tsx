import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

// 9개의 더미 데이터 하드코딩
const dummyTours = [
  // Marine Cruise
  {
    id: 'dummy-1',
    category: 'Marine Cruise',
    icon: '🚢',
    title: '광안리 선셋 프라이빗 요트 세션',
    description: '붉게 물드는 광안리 바다 한가운데서 로컬 인디 아티스트의 어쿠스틱 라이브를 들으며 와인을 즐기는 소수 정예 투어입니다.',
    price: '85,000',
    duration: '2.5시간',
    imageUrl: 'https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=800',
  },
  {
    id: 'dummy-2',
    category: 'Marine Cruise',
    icon: '🚢',
    title: '해운대 문라이트 샴페인 크루즈',
    description: '달빛 아래 해운대 마린시티의 압도적인 스카이라인을 배경으로 최고급 샴페인과 함께하는 럭셔리 네트워킹 경험.',
    price: '120,000',
    duration: '3시간',
    imageUrl: 'https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=800',
  },
  {
    id: 'dummy-3',
    category: 'Marine Cruise',
    icon: '🚢',
    title: '송정 서핑 & 모닝 딥 (Morning Dip)',
    description: '고요한 아침의 송정 바다에서 즐기는 프라이빗 서핑 레슨과 신선한 바다 스위밍, 그리고 로컬 셰프의 브런치 코스.',
    price: '150,000',
    duration: '4시간',
    imageUrl: 'https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=800',
  },
  {
    id: 'dummy-10',
    category: 'Marine Cruise',
    icon: '🚢',
    title: '태종대 히든 코스트 탐험',
    description: '일반 관광객은 접근할 수 없는 태종대 절벽 아래 숨겨진 해안 동굴을 소형 보트로 탐험하는 어드벤처 투어.',
    price: '95,000',
    duration: '2.5시간',
    imageUrl: 'https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=800',
  },

  // Boutique Coffee
  {
    id: 'dummy-4',
    category: 'Boutique Coffee',
    icon: '☕',
    title: '전포동 뒷골목 스페셜티 마스터클래스',
    description: '간판 없는 비밀스러운 로스터리 공간에서 부산 최고의 바리스타가 내려주는 3가지 독점 블렌딩을 시음하는 시간.',
    price: '45,000',
    duration: '2시간',
    imageUrl: 'https://images.unsplash.com/photo-1603525281488-8422731cde7e?q=80&w=800',
  },
  {
    id: 'dummy-5',
    category: 'Boutique Coffee',
    icon: '☕',
    title: '영도 폐공장 드립 앤 바이브',
    description: '낡은 조선소 부품 공장을 개조한 카페에서 거친 공장 지대의 매력과 극도로 섬세한 핸드드립 커피의 대비를 즐깁니다.',
    price: '38,000',
    duration: '1.5시간',
    imageUrl: 'https://images.unsplash.com/photo-1603525281488-8422731cde7e?q=80&w=800',
  },
  {
    id: 'dummy-6',
    category: 'Boutique Coffee',
    icon: '☕',
    title: '온천장 앤틱 찻집 티 페어링',
    description: '세월이 멈춘 듯한 온천장의 오래된 다관에서, 로컬 디저트 장인이 직접 구운 다과와 함께하는 심야 티 페어링 투어.',
    price: '55,000',
    duration: '2.5시간',
    imageUrl: 'https://images.unsplash.com/photo-1603525281488-8422731cde7e?q=80&w=800',
  },
  {
    id: 'dummy-11',
    category: 'Boutique Coffee',
    icon: '☕',
    title: '해리단길 프라이빗 티 오마카세',
    description: '부산 로컬 식재료를 베이스로 우려낸 프리미엄 차와 이에 페어링되는 디저트를 즐기는 하이엔드 티 오마카세.',
    price: '70,000',
    duration: '2시간',
    imageUrl: 'https://images.unsplash.com/photo-1603525281488-8422731cde7e?q=80&w=800',
  },

  // Night Exploration
  {
    id: 'dummy-7',
    category: 'Night Exploration',
    icon: '🌙',
    title: '초량 이바구길 심야 필름 스냅 투어',
    description: '인적 끊긴 산복도로의 좁은 계단길을 오르며, 가이드가 렌탈해주는 필름 카메라로 부산의 가장 아날로그적인 밤을 담습니다.',
    price: '65,000',
    duration: '3시간',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800',
  },
  {
    id: 'dummy-8',
    category: 'Night Exploration',
    icon: '🌙',
    title: '영도 대평동 깡깡이 마을 나이트 워크',
    description: '낮의 소음이 사라진 영도 수리조선소 골목. 거대한 선박의 그림자와 노란 가로등 불빛 아래 숨겨진 거친 이야기들을 듣습니다.',
    price: '40,000',
    duration: '2시간',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800',
  },
  {
    id: 'dummy-9',
    category: 'Night Exploration',
    icon: '🌙',
    title: '황령산 시크릿 포인트 시티뷰 미드나잇',
    description: '사람들이 몰리는 흔한 전망대가 아닌, 가이드만 아는 황령산의 비밀스러운 숲길을 지나 만나는 가장 압도적인 부산의 야경.',
    price: '50,000',
    duration: '2.5시간',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800',
  },
  {
    id: 'dummy-12',
    category: 'Night Exploration',
    icon: '🌙',
    title: '광안대교 언더브릿지 야간 요트',
    description: '화려한 광안대교 아래를 직접 통과하며, 오직 배 위에서만 볼 수 있는 은밀하고 압도적인 빛의 향연을 감상합니다.',
    price: '75,000',
    duration: '2시간',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800',
  }
];

// Helper for formatting DB prices
function formatPrice(price: number | string | null | undefined): string {
  if (price == null) return '0';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const revalidate = 0; // 동적 렌더링 (DB 갱신시 바로 반영되도록 설정)

export default async function ToursPage() {
  const categories = ['Marine Cruise', 'Boutique Coffee', 'Night Exploration'];

  // DB에서 데이터 가져오기 (에러가 나도 더미 데이터는 보이게 처리)
  let dbToursData: any[] = [];
  try {
    const { data } = await supabase.from('tours').select('*').order('created_at', { ascending: false });
    if (data) dbToursData = data;
  } catch (error) {
    console.error("Supabase Error:", error);
  }

  // DB 데이터를 더미 데이터와 동일한 형태로 변환
  const dbTours = dbToursData.map((t: any) => ({
    id: t.id.toString(),
    category: t.category || 'Night Exploration',
    icon: t.category === 'Marine Cruise' ? '🚢' : t.category === 'Boutique Coffee' ? '☕' : '🌙',
    title: t.title || 'Untitled Tour',
    description: t.description || '상세 설명이 없습니다.',
    price: formatPrice(t.price),
    duration: t.duration || '2시간',
    imageUrl: t.image_url || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800'
  }));

  // 새 데이터가 위로 오도록 병합
  const allTours = [...dbTours, ...dummyTours];

  return (
    <main className={styles.main}>
      <h1 className={`${styles.pageTitle} text-accent neon-glow`}>Exclusive Tours</h1>
      <p className={styles.pageSubtitle}>누구나 가는 곳이 아닌, 부산의 진짜 얼굴을 만나는 프라이빗 에디토리얼 투어</p>

      {categories.map((cat) => {
        const categoryTours = allTours.filter(tour => tour.category === cat);
        const icon = cat === 'Marine Cruise' ? '🚢' : cat === 'Boutique Coffee' ? '☕' : '🌙';

        return (
          <section key={cat} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <span className={styles.categoryIcon}>{icon}</span>
              <h2 className={styles.categoryTitle}>{cat}</h2>
            </div>
            
            <div className={styles.grid}>
              {categoryTours.slice(0, 3).map((tour) => (
                <Link href={`/tours/detail/${tour.id}`} key={tour.id} className={styles.card} style={{textDecoration: 'none', color: 'inherit'}}>
                  <div className={styles.imageWrapper}>
                    <img 
                      src={tour.imageUrl} 
                      alt={tour.title}
                      className={styles.image}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{tour.title}</h3>
                    <p className={styles.cardDesc}>{tour.description}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.duration}>⏱ {tour.duration}</span>
                      <span className={styles.price}>₩ {tour.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* 4번째 카드는 빈 테두리와 more 텍스트만 있는 링크 */}
              <Link href={`/tours/${encodeURIComponent(cat.toLowerCase().replace(' ', '-'))}`} className={styles.moreCard}>
                <span className={styles.moreText}>more</span>
              </Link>
            </div>
          </section>
        );
      })}
    </main>
  );
}
