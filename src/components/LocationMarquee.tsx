import React from 'react';
import styles from './LocationMarquee.module.css';

const locations = [
  { name: '영도 (Yeongdo)', imageUrl: '/images/daepyeong_night.jpg' },
  { name: '감천문화마을 (Gamcheon)', imageUrl: '/images/gamcheon_village.jpg' },
  { name: '이바구길 (Ibagu-gil)', imageUrl: '/images/ibagu_gil.jpg' },
  { name: '청사포 (Cheongsapo)', imageUrl: '/images/cheongsapo.jpg' },
  { name: '용궁사 (Yonggungsa)', imageUrl: '/images/yonggungsa.jpg' },
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
