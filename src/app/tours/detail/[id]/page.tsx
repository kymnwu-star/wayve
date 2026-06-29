import Image from 'next/image';
import { notFound } from 'next/navigation';
import { dummyTours } from '@/data/dummyTours';
import { supabase } from '@/utils/supabase';
import styles from './page.module.css';
import BiddingSection from '@/components/BiddingSection';
import KakaoMap from '@/components/KakaoMap';

// Helper for formatting DB prices
function formatPrice(price: number | string | null | undefined): string {
  if (price == null) return '0';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let tour: any = null;

  // 1. Check if dummy
  if (id.startsWith('dummy-')) {
    tour = dummyTours.find(t => t.id === id);
    if (tour) {
      const priceNum = parseInt(tour.price.replace(/,/g, ''), 10);
      tour = {
        ...tour,
        priceNum: priceNum,
        timePrices: {
          '10:00': priceNum,
          '14:00': priceNum,
          '18:00': priceNum,
          '20:00': priceNum,
        }
      };
    }
  } else {
    // 2. Fetch from Supabase
    try {
      const { data } = await supabase.from('tours').select('*').eq('id', parseInt(id, 10)).single();
      if (data) {
        let timePrices = {
          '10:00': data.price,
          '14:00': data.price,
          '18:00': data.price,
          '20:00': data.price,
        };
        let cleanDescription = data.description || '상세 설명이 없습니다.';
        
        if (cleanDescription.includes('<!--TIME_PRICES:')) {
          const match = cleanDescription.match(/<!--TIME_PRICES:(.*)-->/);
          if (match) {
            try {
              timePrices = JSON.parse(match[1]);
              cleanDescription = cleanDescription.replace(/<!--TIME_PRICES:.*-->/, '').trim();
            } catch(e) {}
          }
        }

        tour = {
          id: data.id.toString(),
          category: data.category || 'Night Exploration',
          icon: data.category === 'Marine Cruise' ? '🚢' : data.category === 'Boutique Coffee' ? '☕' : '🌙',
          title: data.title || 'Untitled Tour',
          description: cleanDescription,
          price: formatPrice(data.price),
          priceNum: data.price,
          timePrices: timePrices,
          duration: data.duration || '2시간',
          imageUrl: data.image_url || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800'
        };
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!tour) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <div className={styles.category}>{tour.icon} {tour.category}</div>
      <h1 className={styles.title}>{tour.title}</h1>
      
      <div className={styles.layout}>
        <div className={styles.imageSection}>
          <Image 
            src={tour.imageUrl}
            alt={tour.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        
        <div className={styles.infoSection}>
          <div className={styles.price}>₩ {formatPrice(tour.timePrices['10:00'])} ~ {formatPrice(tour.timePrices['20:00'])} <span style={{fontSize: '1rem', color: '#888', fontWeight: 'normal'}}>시간별 차등 정가</span></div>
          <p className={styles.description}>{tour.description}</p>
          
          <div className={styles.meta}>
            <div className={styles.metaItem}>⏱ <span>소요 시간: {tour.duration}</span></div>
          </div>

          {/* 투어 위치 지도 (기본값: 부산 해운대 좌표) */}
          <KakaoMap />

          <div className={styles.biddingContainer}>
            <BiddingSection tourId={tour.id} timePrices={tour.timePrices} />
          </div>
        </div>
      </div>
    </main>
  );
}
