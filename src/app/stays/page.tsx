'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { createReservation } from './actions';
import styles from './page.module.css';

const accommodations = [
  {
    id: 1,
    name: '파노라마 오션 펜트하우스',
    location: '해운대 마린시티',
    description: '눈앞에 펼쳐지는 180도 광안대교 뷰. 최고급 구스 침구와 고급 어메니티, 프라이빗 인피니티 풀이 준비된 펜트하우스입니다.',
    price: '₩850,000 / night',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200'
  },
  {
    id: 2,
    name: '시크릿 뱀부 독채 풀빌라',
    location: '기장군 힐튼 인근',
    description: '도심 속 완벽한 단절. 대나무 숲으로 둘러싸인 이국적인 독채에서 노천탕과 바베큐를 프라이빗하게 즐길 수 있습니다.',
    price: '₩620,000 / night',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200'
  },
  {
    id: 3,
    name: '헤리티지 한옥 스테이',
    location: '동래구 온천장',
    description: '100년 된 고택을 현대적으로 리모델링했습니다. 방 안으로 직접 공급되는 천연 온천수와 함께 진정한 쉼을 경험하세요.',
    price: '₩450,000 / night',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200'
  }
];

export default function AccommodationPage() {
  const [selectedAcc, setSelectedAcc] = useState<{ id: number, name: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleReserveClick = (acc: { id: number, name: string }) => {
    setSelectedAcc(acc);
  };

  const closeModal = () => {
    setSelectedAcc(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // 강제로 숙소 이름 추가
    formData.append('accommodationName', selectedAcc?.name || 'Unknown');

    startTransition(async () => {
      const res = await createReservation(formData);
      if (res.success) {
        alert(`${selectedAcc?.name} 예약 문의가 구글 시트로 성공적으로 접수되었습니다! 빠른 시일 내에 연락드리겠습니다.`);
        closeModal();
      } else {
        alert(res.error || '예약 중 오류가 발생했습니다.');
      }
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <h1 className={`${styles.title} text-accent neon-glow`}>Stays</h1>
          <p className={styles.subtitle}>웨이브가 엄선한 부산의 가장 은밀하고 완벽한 휴식처</p>
        </div>

        <div className={styles.listContainer}>
          {accommodations.map((acc) => (
            <article key={acc.id} className={styles.accommodationCard}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={acc.imageUrl} 
                  alt={acc.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 1000px"
                  priority={acc.id === 1}
                />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.infoArea}>
                  <h2 className={styles.name}>{acc.name}</h2>
                  <span className={styles.location}>📍 {acc.location}</span>
                  <p className={styles.description}>{acc.description}</p>
                </div>
                <div className={styles.actionArea}>
                  <span className={styles.price}>{acc.price}</span>
                  <button 
                    className={styles.reserveBtn}
                    onClick={() => handleReserveClick(acc)}
                  >
                    예약하기
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedAcc && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div>
                <h2>숙박 예약 접수</h2>
                <p style={{ color: 'var(--accent)', marginTop: '0.5rem', fontWeight: 600 }}>{selectedAcc.name}</p>
              </div>
              <button className={styles.closeBtn} onClick={closeModal}>×</button>
            </div>
            <form className={styles.modalForm} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="guestName">예약자 성함</label>
                <input id="guestName" name="guestName" type="text" className={styles.modalInput} required placeholder="예: 홍길동" />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="phone">연락처</label>
                <input id="phone" name="phone" type="tel" className={styles.modalInput} required placeholder="예: 010-1234-5678" />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="dates">희망 숙박 일자</label>
                <input id="dates" name="dates" type="text" className={styles.modalInput} required placeholder="예: 8월 15일 ~ 8월 17일" />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="specialRequests">요청 사항 (선택)</label>
                <textarea id="specialRequests" name="specialRequests" className={styles.modalTextarea} placeholder="얼리 체크인, 기념일 등 특별한 요청사항을 적어주세요." />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isPending}>
                {isPending ? '예약 접수 중...' : '예약 접수하기'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
