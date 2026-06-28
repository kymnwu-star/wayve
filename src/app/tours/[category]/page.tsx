import React from 'react';
import Link from 'next/link';
import styles from '../page.module.css';

// URL 파라미터를 실제 카테고리 이름으로 변환하는 유틸리티
function getCategoryName(slug: string) {
  const decoded = decodeURIComponent(slug);
  if (decoded === '투어&액티비티' || decoded.includes('투어')) return '투어&액티비티';
  if (decoded === '티켓') return '티켓';
  if (decoded === 'stay') return 'stay';
  return decoded;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;
  const categoryName = getCategoryName(categorySlug);

  // 카테고리별 아이콘
  let icon = '🎯';
  if (categoryName === '티켓') icon = '🎫';
  if (categoryName === 'stay') icon = '🏨';

  // 12개의 더미 데이터 생성
  const tours = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `${categoryName} 프리미엄 ${i + 1}`,
    description: `${categoryName}만의 특별한 경험. 진짜 부산의 얼굴을 만나보세요.`,
    price: `${(50 + (i % 5) * 10).toLocaleString()},000`,
    duration: categoryName === 'stay' ? '1박' : '자유',
    imageUrl: categoryName === '투어&액티비티' 
      ? 'https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=800'
      : categoryName === '티켓'
      ? 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?q=80&w=800'
      : 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800'
  }));

  return (
    <main className={styles.main}>
      <Link href="/tours" className="text-accent" style={{ display: 'inline-block', marginBottom: '2rem', textDecoration: 'underline' }}>
        ← Back to All Tours
      </Link>
      
      <div className={styles.categoryHeader}>
        <span className={styles.categoryIcon}>{icon}</span>
        <h1 className={styles.categoryTitle}>{categoryName}</h1>
      </div>
      <p className={styles.pageSubtitle} style={{ textAlign: 'left', marginBottom: '3rem' }}>
        {categoryName} 카테고리의 전체 투어 리스트입니다.
      </p>

      <div className={styles.grid}>
        {tours.map((tour) => (
          <div key={tour.id} className={styles.card}>
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
    </main>
  );
}
