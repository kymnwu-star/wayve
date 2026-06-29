import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';
import { dummyTours } from '@/data/dummyTours';

// Helper for formatting DB prices
function formatPrice(price: number | string | null | undefined): string {
  if (price == null) return '0';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const revalidate = 0; // 동적 렌더링 (DB 갱신시 바로 반영되도록 설정)

export default async function ToursPage() {
  let krwRate = 1350;
  try {
    const rateRes = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 3600 } });
    if (rateRes.ok) {
      const rData = await rateRes.json();
      krwRate = rData.rates.KRW;
    }
  } catch (e) {}

  const categories = ['투어&액티비티', '티켓', 'stay', 'Shop'];

  // DB에서 데이터 가져오기 (에러가 나도 더미 데이터는 보이게 처리)
  let dbToursData: any[] = [];
  try {
    const { data } = await supabase.from('tours').select('*').order('created_at', { ascending: false });
    if (data) dbToursData = data;
  } catch (error) {
    console.error("Supabase Error:", error);
  }

  // DB 데이터를 더미 데이터와 동일한 형태로 변환
  const dbTours = dbToursData.map((t: any) => {
    const validCat = categories.includes(t.category) ? t.category : '투어&액티비티';
    return {
      id: t.id.toString(),
      category: validCat,
      icon: validCat === '투어&액티비티' ? '🎯' : validCat === '티켓' ? '🎫' : validCat === 'stay' ? '🏨' : '🛍️',
    title: t.title || 'Untitled Tour',
    description: t.description || '상세 설명이 없습니다.',
    price: formatPrice(t.price),
      duration: t.duration || '2시간',
      imageUrl: t.image_url || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800'
    };
  });

  // 새 데이터가 위로 오도록 병합
  const allTours = [...dbTours, ...dummyTours];

  return (
    <main className={styles.main}>
      <h1 className={`${styles.pageTitle} text-accent neon-glow`}>Exclusive Tours</h1>
      <p className={styles.pageSubtitle}>누구나 가는 곳이 아닌, 부산의 진짜 얼굴을 만나는 프라이빗 에디토리얼 투어</p>

      {categories.map((cat) => {
        const categoryTours = allTours.filter(tour => tour.category === cat);
        const icon = cat === '투어&액티비티' ? '🎯' : cat === '티켓' ? '🎫' : cat === 'stay' ? '🏨' : '🛍️';

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
                      <span 
                        className={`${styles.price} tooltip-container`} 
                        data-tooltip={`약 $${((typeof tour.price === 'string' ? parseInt(tour.price.replace(/,/g, ''), 10) : tour.price) / krwRate).toFixed(2)}`}
                      >
                        ₩ {typeof tour.price === 'number' ? tour.price.toLocaleString() : tour.price}
                      </span>
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
