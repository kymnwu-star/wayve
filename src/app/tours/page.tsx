import Image from 'next/image';
import styles from './page.module.css';

// 9개의 더미 데이터 하드코딩
const dummyTours = [
  // Marine Cruise
  {
    id: 1,
    category: 'Marine Cruise',
    icon: '🚢',
    title: '광안리 선셋 프라이빗 요트 세션',
    description: '붉게 물드는 광안리 바다 한가운데서 로컬 인디 아티스트의 어쿠스틱 라이브를 들으며 와인을 즐기는 소수 정예 투어입니다.',
    price: '85,000',
    duration: '2.5시간',
    imageUrl: 'https://jasonteale.com/blog/wp-content/uploads/2021/02/D79A3022_AuroraHDR2019-edit-1200x600.jpg',
  },
  {
    id: 2,
    category: 'Marine Cruise',
    icon: '🚢',
    title: '해운대 문라이트 샴페인 크루즈',
    description: '달빛 아래 해운대 마린시티의 압도적인 스카이라인을 배경으로 최고급 샴페인과 함께하는 럭셔리 네트워킹 경험.',
    price: '120,000',
    duration: '3시간',
    imageUrl: 'https://jasonteale.com/blog/wp-content/uploads/2021/02/D79A3022_AuroraHDR2019-edit-1200x600.jpg', // 임시로 같은 이미지 사용 (실제 서비스시 교체)
  },
  {
    id: 3,
    category: 'Marine Cruise',
    icon: '🚢',
    title: '송정 서핑 & 모닝 딥 (Morning Dip)',
    description: '고요한 아침의 송정 바다에서 즐기는 프라이빗 서핑 레슨과 신선한 바다 스위밍, 그리고 로컬 셰프의 브런치 코스.',
    price: '150,000',
    duration: '4시간',
    imageUrl: 'https://jasonteale.com/blog/wp-content/uploads/2021/02/D79A3022_AuroraHDR2019-edit-1200x600.jpg',
  },

  // Boutique Coffee
  {
    id: 4,
    category: 'Boutique Coffee',
    icon: '☕',
    title: '전포동 뒷골목 스페셜티 마스터클래스',
    description: '간판 없는 비밀스러운 로스터리 공간에서 부산 최고의 바리스타가 내려주는 3가지 독점 블렌딩을 시음하는 시간.',
    price: '45,000',
    duration: '2시간',
    imageUrl: 'https://www.lemon8-app.com/jins_taste/7339793132049007106?region=kr', // User provided link in original scope
  },
  {
    id: 5,
    category: 'Boutique Coffee',
    icon: '☕',
    title: '영도 폐공장 드립 앤 바이브',
    description: '낡은 조선소 부품 공장을 개조한 카페에서 거친 공장 지대의 매력과 극도로 섬세한 핸드드립 커피의 대비를 즐깁니다.',
    price: '38,000',
    duration: '1.5시간',
    imageUrl: 'https://www.lemon8-app.com/jins_taste/7339793132049007106?region=kr',
  },
  {
    id: 6,
    category: 'Boutique Coffee',
    icon: '☕',
    title: '온천장 앤틱 찻집 티 페어링',
    description: '세월이 멈춘 듯한 온천장의 오래된 다관에서, 로컬 디저트 장인이 직접 구운 다과와 함께하는 심야 티 페어링 투어.',
    price: '55,000',
    duration: '2.5시간',
    imageUrl: 'https://www.lemon8-app.com/jins_taste/7339793132049007106?region=kr',
  },

  // Night Exploration
  {
    id: 7,
    category: 'Night Exploration',
    icon: '🌙',
    title: '초량 이바구길 심야 필름 스냅 투어',
    description: '인적 끊긴 산복도로의 좁은 계단길을 오르며, 가이드가 렌탈해주는 필름 카메라로 부산의 가장 아날로그적인 밤을 담습니다.',
    price: '65,000',
    duration: '3시간',
    imageUrl: 'https://ak-d.tripcdn.com/sl/app/d1/20210204/a933f7c4627b4b10b0b8efebdf9168f1_1000.jpg',
  },
  {
    id: 8,
    category: 'Night Exploration',
    icon: '🌙',
    title: '영도 대평동 깡깡이 마을 나이트 워크',
    description: '낮의 소음이 사라진 영도 수리조선소 골목. 거대한 선박의 그림자와 노란 가로등 불빛 아래 숨겨진 거친 이야기들을 듣습니다.',
    price: '40,000',
    duration: '2시간',
    imageUrl: 'https://ak-d.tripcdn.com/sl/app/d1/20210204/a933f7c4627b4b10b0b8efebdf9168f1_1000.jpg',
  },
  {
    id: 9,
    category: 'Night Exploration',
    icon: '🌙',
    title: '황령산 시크릿 포인트 시티뷰 미드나잇',
    description: '사람들이 몰리는 흔한 전망대가 아닌, 가이드만 아는 황령산의 비밀스러운 숲길을 지나 만나는 가장 압도적인 부산의 야경.',
    price: '50,000',
    duration: '2.5시간',
    imageUrl: 'https://ak-d.tripcdn.com/sl/app/d1/20210204/a933f7c4627b4b10b0b8efebdf9168f1_1000.jpg',
  }
];

export default function ToursPage() {
  const categories = ['Marine Cruise', 'Boutique Coffee', 'Night Exploration'];

  return (
    <main className={styles.main}>
      <h1 className={`${styles.pageTitle} text-accent neon-glow`}>Exclusive Tours</h1>
      <p className={styles.pageSubtitle}>누구나 가는 곳이 아닌, 부산의 진짜 얼굴을 만나는 프라이빗 에디토리얼 투어</p>

      {categories.map((cat) => {
        const categoryTours = dummyTours.filter(tour => tour.category === cat);
        const icon = categoryTours[0]?.icon;

        return (
          <section key={cat} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <span className={styles.categoryIcon}>{icon}</span>
              <h2 className={styles.categoryTitle}>{cat}</h2>
            </div>
            
            <div className={styles.grid}>
              {categoryTours.map((tour) => (
                <div key={tour.id} className={styles.card}>
                  {/* next/image 대신 img 태그 사용 (외부 이미지 호스트 제한 회피 위해 임시) */}
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
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
