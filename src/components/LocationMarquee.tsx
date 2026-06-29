import React from 'react';
import styles from './LocationMarquee.module.css';

const locations = [
  { name: '영도 (Yeongdo)', imageUrl: '/images/daepyeong_night.jpg' },
  { name: '감천문화마을 (Gamcheon)', imageUrl: 'https://images.unsplash.com/photo-1589828117730-22cba2d5e2e8?q=80&w=800' },
  { name: '이바구길 (Ibagu-gil)', imageUrl: 'https://images.unsplash.com/photo-1605336496468-b7c126f59792?q=80&w=800' },
  { name: '청사포 (Cheongsapo)', imageUrl: 'https://images.unsplash.com/photo-1596422846543-74c6d61d15db?q=80&w=800' },
  { name: '용궁사 (Yonggungsa)', imageUrl: 'https://images.unsplash.com/photo-1574780517918-a6d5162a7587?q=80&w=800' },
];

export default function LocationMarquee() {
  return (
    <section className={styles.marqueeSection}>
      <h2 className={styles.title}>Destinations</h2>
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {/* 첫 번째 그룹 */}
          {locations.map((loc, idx) => (
            <div key={`loc1-${idx}`} className={styles.locationCard}>
              <div className={styles.imageWrapper}>
                <img src={loc.imageUrl} alt={loc.name} className={styles.image} loading="lazy" />
                <div className={styles.overlay}>
                  <h3 className={styles.locationName}>{loc.name}</h3>
                </div>
              </div>
            </div>
          ))}
          {/* 무한 스크롤을 위한 두 번째 그룹 (복제) */}
          {locations.map((loc, idx) => (
            <div key={`loc2-${idx}`} className={styles.locationCard}>
              <div className={styles.imageWrapper}>
                <img src={loc.imageUrl} alt={loc.name} className={styles.image} loading="lazy" />
                <div className={styles.overlay}>
                  <h3 className={styles.locationName}>{loc.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
